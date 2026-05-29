import { EDUCATION_STAGES, type EducationStage } from "./wizard-options";

/** Education stages allowed for a given age (wizard step 2). */
export function getEducationStagesForAge(age: number): EducationStage[] {
  if (age <= 13) return ["school_7", "school_8"];
  if (age === 14) return ["school_8", "school_9"];
  if (age === 15) return ["school_9", "school_10"];
  if (age === 16) return ["school_10", "school_11"];
  if (age === 17) return ["school_11", "school_graduate"];
  if (age <= 22) return ["school_graduate", "student", "employed"];
  return ["student", "career_change", "employed"];
}

export function pickDefaultEducationStage(age: number): EducationStage {
  const options = getEducationStagesForAge(age);
  return options[0] ?? "school_11";
}

export function coerceEducationStage(
  age: number,
  stage: string
): EducationStage {
  const options = getEducationStagesForAge(age);
  if (options.includes(stage as EducationStage)) {
    return stage as EducationStage;
  }
  return pickDefaultEducationStage(age);
}

/** Map legacy coarse stages to granular defaults. */
export function migrateEducationStage(
  stage: string,
  age: number
): EducationStage {
  const legacyMap: Record<string, EducationStage> = {
    school_9: age <= 14 ? "school_8" : "school_9",
    school_11: age <= 16 ? "school_10" : "school_11",
  };
  if (stage in legacyMap) return legacyMap[stage];
  if ((EDUCATION_STAGES as readonly string[]).includes(stage)) {
    return coerceEducationStage(age, stage);
  }
  return pickDefaultEducationStage(age);
}
