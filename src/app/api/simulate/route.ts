import { NextRequest, NextResponse } from "next/server";
import { simulateCareers } from "@/lib/llm";
import {
  normalizeWizardInput,
  simulationResultSchema,
  wizardInputSchema,
} from "@/lib/schemas";
import { checkServerRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let input;
    try {
      input = wizardInputSchema.parse(body);
    } catch {
      input = normalizeWizardInput(body);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";
    const isPremium = req.headers.get("x-premium") === "true";

    if (!checkServerRateLimit(ip, isPremium)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const result = await simulateCareers(input);
    const payload = simulationResultSchema.parse({
      professions: result.professions,
      generated_at: result.generated_at,
      disclaimer: result.disclaimer,
    });

    return NextResponse.json(payload);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
