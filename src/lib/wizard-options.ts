export const INTEREST_KEYS = [
  "code", "games", "math", "design", "people", "medicine", "marketing", "business",
  "creativity", "analytics", "sports", "music", "science", "law", "engineering", "languages",
] as const;

export const AVOID_KEYS = [
  "routine", "sales", "blood", "code", "office", "night_shifts", "public_speaking",
] as const;

export const SKILL_KEYS = [
  "english", "excel", "drawing", "python", "communication", "driving",
] as const;

export const LIFESTYLE_KEYS = [
  "remote", "travel", "stability", "creativity", "low_stress",
] as const;

export const EDUCATION_STAGES = [
  "school_7",
  "school_8",
  "school_9",
  "school_10",
  "school_11",
  "school_graduate",
  "student",
  "career_change",
  "employed",
] as const;

export type EducationStage = (typeof EDUCATION_STAGES)[number];
