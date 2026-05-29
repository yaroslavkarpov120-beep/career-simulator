import type { SimulationResult, WizardInput } from "./schemas";
import { simulateOnClient } from "./simulate-client";

export async function runSimulation(
  input: WizardInput
): Promise<SimulationResult> {
  const normalized: WizardInput = {
    ...input,
    salaryMax: Math.max(input.salaryMax, input.salaryMin),
  };

  try {
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });

    const data = await res.json();

    if (res.ok && data.professions?.length === 5) {
      return data as SimulationResult;
    }

    console.warn("API simulate failed, using client fallback:", data.error ?? res.status);
  } catch (err) {
    console.warn("API simulate unreachable, using client fallback:", err);
  }

  return simulateOnClient(normalized);
}
