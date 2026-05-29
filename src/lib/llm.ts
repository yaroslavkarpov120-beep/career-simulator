import { simulationResultSchema, type Profession, type WizardInput } from "./schemas";
import { getRegion } from "./regions";
import {
  buildMatchReason,
  cacheKey,
  generateFromCache,
  getSimulationDisclaimer,
  pickProfessionHints,
} from "./professions-cache";

const LOCALE_LANG: Record<string, string> = {
  ru: "русском",
  en: "English",
  kk: "қазақша",
  uz: "o'zbekcha",
};

const memoryCache = new Map<string, Profession[]>();

export async function simulateCareers(input: WizardInput): Promise<{
  professions: Profession[];
  generated_at: string;
  disclaimer: string;
  source: "openai" | "cache" | "mock";
}> {
  const disclaimer = getSimulationDisclaimer(input.locale);
  const key = cacheKey(input);
  if (memoryCache.has(key)) {
    return {
      professions: memoryCache.get(key)!,
      generated_at: new Date().toISOString(),
      disclaimer,
      source: "cache",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const professions = await generateWithOpenAI(input, apiKey);
      memoryCache.set(key, professions);
      return {
        professions,
        generated_at: new Date().toISOString(),
        disclaimer,
        source: "openai",
      };
    } catch (e) {
      console.error("OpenAI failed, falling back to mock:", e);
    }
  }

  const professions = generateFromCache(input);
  memoryCache.set(key, professions);
  return {
    professions,
    generated_at: new Date().toISOString(),
    disclaimer,
    source: "mock",
  };
}

async function generateWithOpenAI(
  input: WizardInput,
  apiKey: string
): Promise<Profession[]> {
  const region = getRegion(input.regionId);
  const currency = region?.currency ?? "RUB";
  const lang = LOCALE_LANG[input.locale] ?? "русском";
  const templateHint = pickProfessionHints(input, 30).join(", ");

  const body = {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" as const },
    messages: [
      {
        role: "system" as const,
        content: `You are a career simulator for ages 15-22. Respond in ${lang}. Return JSON: { "professions": [ exactly 5 objects ] }.
Each profession: id (latin slug), title, match_reason (2 sentences), salary_min, salary_max, currency "${currency}", ai_risk_percent (0-100), ai_risk_explanation, day_timeline (6 {time, activity}), roadmap (6 {skill, months, first_step}).
Salaries realistic for region ${input.regionId}, country ${input.countryCode}. Consider age ${input.age}, stage ${input.educationStage}, avoid: ${input.avoid.join(", ")}. Templates: ${templateHint}.`,
      },
      {
        role: "user" as const,
        content: JSON.stringify(input),
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Empty OpenAI response");

  const parsed = JSON.parse(content) as { professions: Profession[] };
  const result = simulationResultSchema.parse({
    professions: parsed.professions.map((p, i) => ({
      ...p,
      id: p.id || `profession-${i}`,
      match_reason: p.match_reason || buildMatchReason(p.title, input),
    })),
    generated_at: new Date().toISOString(),
    disclaimer: getSimulationDisclaimer(input.locale),
  });

  return result.professions;
}
