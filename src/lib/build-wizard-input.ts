import type { CountryCode } from "./regions";
import { getRegion } from "./regions";
import type { WizardInput } from "./schemas";
import type { Locale } from "./i18n/types";
import type { WizardAnswers } from "./wizard-steps";

const PRIMARY_TO_BASE: Record<string, string> = {
  tech: "code",
  creative: "design",
  people: "people",
  medicine: "medicine",
  business: "business",
  sport_media: "sports",
  science: "science",
  other: "code",
};

function buildLifestyle(answers: WizardAnswers): string[] {
  const lifestyle: string[] = [];
  if (answers.workFormat === "remote") lifestyle.push("remote");
  if (answers.workFormat === "hybrid") {
    lifestyle.push("remote");
    lifestyle.push("stability");
  }
  if (answers.workFormat === "office") lifestyle.push("stability");
  if (answers.priority === "creativity") lifestyle.push("creativity");
  if (answers.priority === "stability") lifestyle.push("stability");
  if (answers.priority === "money") lifestyle.push("stability");
  if (answers.stressLevel === "low") lifestyle.push("low_stress");
  if (answers.schedulePreference === "flexible") lifestyle.push("travel");
  return [...new Set(lifestyle.length ? lifestyle : ["remote"])];
}

function buildAvoid(answers: WizardAnswers): string[] {
  const avoid: string[] = [];
  if (answers.avoidPrimary && answers.avoidPrimary !== "none") {
    avoid.push(answers.avoidPrimary);
  }
  if (
    answers.avoidSecondary &&
    answers.avoidSecondary !== "none" &&
    answers.avoidSecondary !== answers.avoidPrimary
  ) {
    avoid.push(answers.avoidSecondary);
  }
  return avoid;
}

function buildInterests(answers: WizardAnswers): string[] {
  const interests: string[] = [];
  const base = PRIMARY_TO_BASE[answers.primaryInterest];
  if (base) interests.push(base);
  if (
    answers.secondaryInterest &&
    answers.secondaryInterest !== "none" &&
    !interests.includes(answers.secondaryInterest)
  ) {
    interests.push(answers.secondaryInterest);
  }
  return interests.length ? interests : ["code"];
}

export function salaryBandToRange(
  band: string,
  regionId: string
): { min: number; max: number } {
  const region = getRegion(regionId);
  const range = region?.salaryRange ?? {
    min: 30000,
    max: 500000,
    step: 5000,
  };
  const span = range.max - range.min;
  const bands: Record<string, [number, number]> = {
    band1: [0, 0.2],
    band2: [0.2, 0.4],
    band3: [0.4, 0.6],
    band4: [0.6, 0.8],
    band5: [0.8, 1],
  };
  const [lo, hi] = bands[band] ?? bands.band3;
  return {
    min: Math.round(range.min + span * lo),
    max: Math.round(range.min + span * hi),
  };
}

export function buildWizardInput(
  answers: WizardAnswers,
  locale: Locale
): WizardInput {
  const { min: salaryMin, max: salaryMax } = salaryBandToRange(
    answers.salaryBand,
    answers.regionId
  );
  const skills =
    answers.topSkill && answers.topSkill !== "none" ? [answers.topSkill] : [];

  return {
    locale,
    age: answers.age,
    educationStage: answers.educationStage as WizardInput["educationStage"],
    interests: buildInterests(answers),
    interestsText: answers.interestsText.trim() || undefined,
    avoid: buildAvoid(answers),
    skills,
    countryCode: answers.countryCode,
    regionId: answers.regionId,
    salaryMin,
    salaryMax: Math.max(salaryMax, salaryMin),
    lifestyle: buildLifestyle(answers),
    careerHorizon: answers.careerHorizon,
    orgType: answers.orgType,
    teamPreference: answers.teamPreference,
    learningPath: answers.learningPath,
    motivationFocus: answers.motivationFocus,
  };
}
