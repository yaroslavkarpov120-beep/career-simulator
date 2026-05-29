import type { CountryCode } from "./regions";

export const TOTAL_WIZARD_STEPS = 20;

export type WizardAnswers = {
  age: number;
  educationStage: string;
  primaryInterest: string;
  secondaryInterest: string;
  interestsText: string;
  avoidPrimary: string;
  avoidSecondary: string;
  topSkill: string;
  countryCode: CountryCode;
  regionId: string;
  salaryBand: string;
  workFormat: string;
  priority: string;
  stressLevel: string;
  schedulePreference: string;
  careerHorizon: string;
  orgType: string;
  teamPreference: string;
  learningPath: string;
  motivationFocus: string;
};

export const PRIMARY_INTEREST_KEYS = [
  "tech",
  "creative",
  "people",
  "medicine",
  "business",
  "sport_media",
  "science",
  "other",
] as const;

export const SECONDARY_BY_PRIMARY: Record<string, string[]> = {
  tech: ["code", "games", "math", "engineering"],
  creative: ["design", "creativity", "music"],
  people: ["people", "languages", "marketing"],
  medicine: ["medicine", "science"],
  business: ["business", "marketing", "analytics"],
  sport_media: ["sports", "marketing", "music"],
  science: ["science", "math", "analytics"],
  other: ["code", "design", "people", "business"],
};

export const AVOID_STEP_KEYS = [
  "routine",
  "sales",
  "blood",
  "code",
  "office",
  "night_shifts",
  "public_speaking",
] as const;

export const SKILL_STEP_KEYS = [
  "english",
  "excel",
  "drawing",
  "python",
  "communication",
  "driving",
] as const;

export const SALARY_BAND_KEYS = ["band1", "band2", "band3", "band4", "band5"] as const;

export const WORK_FORMAT_KEYS = ["remote", "hybrid", "office"] as const;

export const PRIORITY_KEYS = [
  "stability",
  "creativity",
  "money",
  "impact",
] as const;

export const STRESS_KEYS = ["low", "medium", "high"] as const;

export const SCHEDULE_KEYS = ["fixed", "flexible", "project"] as const;

export const CAREER_HORIZON_KEYS = [
  "one_two_years",
  "three_five_years",
  "five_plus",
  "exploring",
] as const;

export const ORG_TYPE_KEYS = [
  "startup",
  "corporate",
  "public_sector",
  "freelance",
] as const;

export const TEAM_PREFERENCE_KEYS = [
  "solo",
  "small_team",
  "large_org",
  "mixed",
] as const;

export const LEARNING_PATH_KEYS = [
  "university",
  "courses",
  "self_taught",
  "mentorship",
] as const;

export const MOTIVATION_FOCUS_KEYS = [
  "expertise",
  "impact",
  "income",
  "balance",
  "prestige",
] as const;

export type StepType = "slider" | "single" | "text" | "select";

export type WizardStepConfig = {
  id: number;
  type: StepType;
  field: keyof WizardAnswers;
  titleKey: string;
  subtitleKey: string;
  required: boolean;
  optionKeys?: readonly string[];
  optionDict?:
    | "educationStage"
    | "primaryInterest"
    | "interests"
    | "avoid"
    | "skills"
    | "country"
    | "workFormat"
    | "priority"
    | "stress"
    | "schedule"
    | "salaryBand"
    | "careerHorizon"
    | "orgType"
    | "teamPreference"
    | "learningPath"
    | "motivationFocus"
    | "none";
  dependsOn?: { field: keyof WizardAnswers; value?: string };
};

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 1,
    type: "slider",
    field: "age",
    titleKey: "wizard.q01Title",
    subtitleKey: "wizard.q01Subtitle",
    required: true,
  },
  {
    id: 2,
    type: "single",
    field: "educationStage",
    titleKey: "wizard.q02Title",
    subtitleKey: "wizard.q02Subtitle",
    required: true,
    optionDict: "educationStage",
  },
  {
    id: 3,
    type: "single",
    field: "primaryInterest",
    titleKey: "wizard.q03Title",
    subtitleKey: "wizard.q03Subtitle",
    required: true,
    optionKeys: PRIMARY_INTEREST_KEYS,
    optionDict: "primaryInterest",
  },
  {
    id: 4,
    type: "single",
    field: "secondaryInterest",
    titleKey: "wizard.q04Title",
    subtitleKey: "wizard.q04Subtitle",
    required: true,
    optionDict: "interests",
  },
  {
    id: 5,
    type: "text",
    field: "interestsText",
    titleKey: "wizard.q05Title",
    subtitleKey: "wizard.q05Subtitle",
    required: false,
  },
  {
    id: 6,
    type: "single",
    field: "avoidPrimary",
    titleKey: "wizard.q06Title",
    subtitleKey: "wizard.q06Subtitle",
    required: true,
    optionKeys: AVOID_STEP_KEYS,
    optionDict: "avoid",
  },
  {
    id: 7,
    type: "single",
    field: "avoidSecondary",
    titleKey: "wizard.q07Title",
    subtitleKey: "wizard.q07Subtitle",
    required: true,
    optionKeys: [...AVOID_STEP_KEYS, "none"],
    optionDict: "avoid",
  },
  {
    id: 8,
    type: "single",
    field: "topSkill",
    titleKey: "wizard.q08Title",
    subtitleKey: "wizard.q08Subtitle",
    required: true,
    optionKeys: [...SKILL_STEP_KEYS, "none"],
    optionDict: "skills",
  },
  {
    id: 9,
    type: "single",
    field: "countryCode",
    titleKey: "wizard.q09Title",
    subtitleKey: "wizard.q09Subtitle",
    required: true,
    optionDict: "country",
  },
  {
    id: 10,
    type: "select",
    field: "regionId",
    titleKey: "wizard.q10Title",
    subtitleKey: "wizard.q10Subtitle",
    required: true,
  },
  {
    id: 11,
    type: "single",
    field: "salaryBand",
    titleKey: "wizard.q11Title",
    subtitleKey: "wizard.q11Subtitle",
    required: true,
    optionKeys: SALARY_BAND_KEYS,
    optionDict: "salaryBand",
  },
  {
    id: 12,
    type: "single",
    field: "workFormat",
    titleKey: "wizard.q12Title",
    subtitleKey: "wizard.q12Subtitle",
    required: true,
    optionKeys: WORK_FORMAT_KEYS,
    optionDict: "workFormat",
  },
  {
    id: 13,
    type: "single",
    field: "priority",
    titleKey: "wizard.q13Title",
    subtitleKey: "wizard.q13Subtitle",
    required: true,
    optionKeys: PRIORITY_KEYS,
    optionDict: "priority",
  },
  {
    id: 14,
    type: "single",
    field: "stressLevel",
    titleKey: "wizard.q14Title",
    subtitleKey: "wizard.q14Subtitle",
    required: true,
    optionKeys: STRESS_KEYS,
    optionDict: "stress",
  },
  {
    id: 15,
    type: "single",
    field: "schedulePreference",
    titleKey: "wizard.q15Title",
    subtitleKey: "wizard.q15Subtitle",
    required: true,
    optionKeys: SCHEDULE_KEYS,
    optionDict: "schedule",
  },
  {
    id: 16,
    type: "single",
    field: "careerHorizon",
    titleKey: "wizard.q16Title",
    subtitleKey: "wizard.q16Subtitle",
    required: true,
    optionKeys: CAREER_HORIZON_KEYS,
    optionDict: "careerHorizon",
  },
  {
    id: 17,
    type: "single",
    field: "orgType",
    titleKey: "wizard.q17Title",
    subtitleKey: "wizard.q17Subtitle",
    required: true,
    optionKeys: ORG_TYPE_KEYS,
    optionDict: "orgType",
  },
  {
    id: 18,
    type: "single",
    field: "teamPreference",
    titleKey: "wizard.q18Title",
    subtitleKey: "wizard.q18Subtitle",
    required: true,
    optionKeys: TEAM_PREFERENCE_KEYS,
    optionDict: "teamPreference",
  },
  {
    id: 19,
    type: "single",
    field: "learningPath",
    titleKey: "wizard.q19Title",
    subtitleKey: "wizard.q19Subtitle",
    required: true,
    optionKeys: LEARNING_PATH_KEYS,
    optionDict: "learningPath",
  },
  {
    id: 20,
    type: "single",
    field: "motivationFocus",
    titleKey: "wizard.q20Title",
    subtitleKey: "wizard.q20Subtitle",
    required: true,
    optionKeys: MOTIVATION_FOCUS_KEYS,
    optionDict: "motivationFocus",
  },
];

export function getDefaultAnswers(): WizardAnswers {
  return {
    age: 17,
    educationStage: "school_11",
    primaryInterest: "tech",
    secondaryInterest: "code",
    interestsText: "",
    avoidPrimary: "routine",
    avoidSecondary: "none",
    topSkill: "none",
    countryCode: "RU",
    regionId: "ru-moscow",
    salaryBand: "band3",
    workFormat: "remote",
    priority: "creativity",
    stressLevel: "medium",
    schedulePreference: "flexible",
    careerHorizon: "three_five_years",
    orgType: "corporate",
    teamPreference: "small_team",
    learningPath: "courses",
    motivationFocus: "expertise",
  };
}

export function getSecondaryOptions(primary: string): string[] {
  return SECONDARY_BY_PRIMARY[primary] ?? SECONDARY_BY_PRIMARY.other;
}
