import { z } from "zod";
import { migrateEducationStage } from "./education-by-age";
import { getRegion } from "./regions";

export const localeSchema = z.enum(["ru", "en", "kk", "uz"]);
export type Locale = z.infer<typeof localeSchema>;

export const educationStageSchema = z.enum([
  "school_7",
  "school_8",
  "school_9",
  "school_10",
  "school_11",
  "school_graduate",
  "student",
  "career_change",
  "employed",
]);

export type EducationStage = z.infer<typeof educationStageSchema>;

export const wizardInputSchema = z.object({
  locale: localeSchema.default("ru"),
  age: z.number().min(12).max(35),
  educationStage: educationStageSchema,
  interests: z.array(z.string()).min(1),
  interestsText: z.string().optional(),
  avoid: z.array(z.string()).default([]),
  skills: z.array(z.string()).optional().default([]),
  countryCode: z.string().min(1),
  regionId: z.string().min(1),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  lifestyle: z.array(z.string()).min(1),
  careerHorizon: z.string().optional(),
  orgType: z.string().optional(),
  teamPreference: z.string().optional(),
  learningPath: z.string().optional(),
  motivationFocus: z.string().optional(),
});

export type WizardInput = z.infer<typeof wizardInputSchema>;

/** Migrate legacy saved inputs (v1) */
export function normalizeWizardInput(raw: unknown): WizardInput {
  const o = raw as Record<string, unknown>;
  if (o && typeof o === "object" && "regionId" in o && "age" in o) {
    const parsed = wizardInputSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    const partial = o as Record<string, unknown> & {
      age?: number;
      educationStage?: string;
    };
    const age = typeof partial.age === "number" ? partial.age : 17;
    return wizardInputSchema.parse({
      ...partial,
      educationStage: migrateEducationStage(
        String(partial.educationStage ?? "school_11"),
        age
      ),
    });
  }
  const legacy = o as {
    interests?: string[];
    interestsText?: string;
    salaryMin?: number;
    salaryMax?: number;
    region?: string;
    lifestyle?: string[];
  };
  const lifestyle = (legacy.lifestyle ?? []).map((l) => {
    const map: Record<string, string> = {
      удалёнка: "remote",
      путешествия: "travel",
      стабильность: "stability",
      творчество: "creativity",
      мало_стресса: "low_stress",
    };
    return map[l] ?? l;
  });
  return wizardInputSchema.parse({
    locale: "ru",
    age: 17,
    educationStage: "school_11",
    interests: legacy.interests ?? ["code"],
    interestsText: legacy.interestsText,
    avoid: [],
    skills: [],
    countryCode: "RU",
    regionId: "ru-moscow",
    salaryMin: legacy.salaryMin ?? 80000,
    salaryMax: legacy.salaryMax ?? 150000,
    lifestyle: lifestyle.length ? lifestyle : ["remote"],
  });
}

export function getRegionLabelKey(input: WizardInput): string {
  return getRegion(input.regionId)?.cityLabelKey ?? "city.ru_moscow";
}

export const roadmapItemSchema = z.object({
  skill: z.string(),
  months: z.number(),
  first_step: z.string(),
});

export const dayEventSchema = z.object({
  time: z.string(),
  activity: z.string(),
});

export const professionSchema = z.object({
  id: z.string(),
  title: z.string(),
  match_reason: z.string(),
  salary_min: z.number(),
  salary_max: z.number(),
  currency: z.string(),
  ai_risk_percent: z.number().min(0).max(100),
  ai_risk_explanation: z.string(),
  day_timeline: z.array(dayEventSchema).min(5),
  roadmap: z.array(roadmapItemSchema).min(5),
});

export type Profession = z.infer<typeof professionSchema>;

export const simulationResultSchema = z.object({
  professions: z.array(professionSchema).length(5),
  generated_at: z.string(),
  disclaimer: z.string(),
});

export type SimulationResult = z.infer<typeof simulationResultSchema>;

export const savedSimulationSchema = z.object({
  id: z.string(),
  input: wizardInputSchema,
  result: simulationResultSchema,
  selectedProfessionId: z.string().optional(),
  createdAt: z.string(),
});

export type SavedSimulation = z.infer<typeof savedSimulationSchema>;
