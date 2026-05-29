"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { useLocale } from "./LocaleProvider";
import { buildWizardInput } from "@/lib/build-wizard-input";
import { runSimulation } from "@/lib/run-simulation";
import {
  COUNTRIES,
  getDefaultRegion,
  getRegion,
  getRegionsByCountry,
  formatMoney,
  type CountryCode,
} from "@/lib/regions";
import { trackEvent } from "@/components/Analytics";
import {
  canRunSimulationFree,
  isPremiumUser,
  markSimulationRun,
  resetDailyLimit,
  saveLocalSimulation,
} from "@/lib/storage";
import {
  coerceEducationStage,
  getEducationStagesForAge,
} from "@/lib/education-by-age";
import {
  getDefaultAnswers,
  getSecondaryOptions,
  TOTAL_WIZARD_STEPS,
  WIZARD_STEPS,
  type WizardAnswers,
  type WizardStepConfig,
} from "@/lib/wizard-steps";

function getOptionLabel(
  dict: ReturnType<typeof useLocale>["dict"],
  step: WizardStepConfig,
  key: string
): string {
  if (key === "none") return dict.wizard.optionNone;
  switch (step.optionDict) {
    case "educationStage":
      return dict.educationStage[key as keyof typeof dict.educationStage] ?? key;
    case "primaryInterest":
      return dict.primaryInterest[key as keyof typeof dict.primaryInterest] ?? key;
    case "interests":
      return dict.interests[key as keyof typeof dict.interests] ?? key;
    case "avoid":
      return dict.avoid[key as keyof typeof dict.avoid] ?? key;
    case "skills":
      return key === "none"
        ? dict.wizard.optionNone
        : (dict.skills[key as keyof typeof dict.skills] ?? key);
    case "country":
      return dict.country[key as keyof typeof dict.country] ?? key;
    case "salaryBand":
      return dict.salaryBand[key as keyof typeof dict.salaryBand] ?? key;
    case "workFormat":
      return dict.workFormat[key as keyof typeof dict.workFormat] ?? key;
    case "priority":
      return dict.priority[key as keyof typeof dict.priority] ?? key;
    case "stress":
      return dict.stress[key as keyof typeof dict.stress] ?? key;
    case "schedule":
      return dict.schedule[key as keyof typeof dict.schedule] ?? key;
    case "careerHorizon":
      return dict.careerHorizon[key as keyof typeof dict.careerHorizon] ?? key;
    case "orgType":
      return dict.orgType[key as keyof typeof dict.orgType] ?? key;
    case "teamPreference":
      return dict.teamPreference[key as keyof typeof dict.teamPreference] ?? key;
    case "learningPath":
      return dict.learningPath[key as keyof typeof dict.learningPath] ?? key;
    case "motivationFocus":
      return dict.motivationFocus[key as keyof typeof dict.motivationFocus] ?? key;
    default:
      return key;
  }
}

export function WizardForm() {
  const router = useRouter();
  const { locale, t, tr, dict } = useLocale();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<WizardAnswers>(getDefaultAnswers);

  const stepConfig = WIZARD_STEPS[step - 1];
  const cityOptions = useMemo(
    () => getRegionsByCountry(answers.countryCode),
    [answers.countryCode]
  );
  const region = useMemo(() => getRegion(answers.regionId), [answers.regionId]);

  useEffect(() => {
    const def = getDefaultRegion(answers.countryCode);
    setAnswers((a) => ({
      ...a,
      regionId: def.id,
    }));
  }, [answers.countryCode]);

  useEffect(() => {
    const opts = getSecondaryOptions(answers.primaryInterest);
    if (!opts.includes(answers.secondaryInterest)) {
      setAnswers((a) => ({ ...a, secondaryInterest: opts[0] ?? "code" }));
    }
  }, [answers.primaryInterest, answers.secondaryInterest]);

  useEffect(() => {
    setAnswers((a) => ({
      ...a,
      educationStage: coerceEducationStage(a.age, a.educationStage),
    }));
  }, [answers.age]);

  useEffect(() => {
    setError(null);
  }, [step]);

  const rateLimitReached =
    !isPremiumUser() && !canRunSimulationFree();

  function setField<K extends keyof WizardAnswers>(field: K, value: WizardAnswers[K]) {
    setAnswers((a) => ({ ...a, [field]: value }));
    setError(null);
  }

  function validateStep(): boolean {
    setError(null);
    const cfg = WIZARD_STEPS[step - 1];
    if (!cfg.required) return true;

    const val = answers[cfg.field];
    if (cfg.type === "text") return true;
    if (typeof val === "string" && !val.trim()) {
      setError(t("wizard.errRequired"));
      return false;
    }
    if (cfg.field === "avoidSecondary" || cfg.field === "topSkill") return true;
    if (typeof val === "string" && val === "") {
      setError(t("wizard.errRequired"));
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(TOTAL_WIZARD_STEPS, s + 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function skipTextStep() {
    setStep((s) => Math.min(TOTAL_WIZARD_STEPS, s + 1));
  }

  async function submit() {
    if (!validateStep()) return;

    const input = buildWizardInput(answers, locale);
    setLoading(true);
    setError(null);

    try {
      const data = await runSimulation(input);
      if (!isPremiumUser() && canRunSimulationFree()) {
        markSimulationRun();
      }
      saveLocalSimulation(input, data);
      sessionStorage.setItem("career-simulator-latest", JSON.stringify(data));
      sessionStorage.setItem(
        "career-simulator-latest-input",
        JSON.stringify(input)
      );
      trackEvent("simulate_complete");
      router.push("/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const rowClass = (active: boolean) =>
    `block w-full rounded-xl px-4 py-3 text-left text-sm transition ${
      active ? "bg-brand-600 text-white" : "glass hover:bg-white/10"
    }`;

  function renderOptions(keys: readonly string[], field: keyof WizardAnswers) {
    const current = answers[field] as string;
    return (
      <div className="mt-6 space-y-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setField(field, key as WizardAnswers[typeof field])}
            className={rowClass(current === key)}
          >
            {getOptionLabel(dict, stepConfig, key)}
          </button>
        ))}
      </div>
    );
  }

  function renderStepBody() {
    if (!stepConfig) return null;

    switch (stepConfig.type) {
      case "slider":
        return (
          <>
            <label className="mt-6 block text-sm">{t("wizard.ageLabel")}</label>
            <input
              type="range"
              min={12}
              max={35}
              value={answers.age}
              onChange={(e) => setField("age", Number(e.target.value))}
              className="mt-2 w-full accent-brand-500"
            />
            <p className="text-brand-300">{answers.age}</p>
          </>
        );

      case "text":
        return (
          <>
            <textarea
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm placeholder:text-white/30 focus:border-brand-500 focus:outline-none"
              placeholder={t("wizard.q05Placeholder")}
              rows={4}
              value={answers.interestsText}
              onChange={(e) => setField("interestsText", e.target.value)}
            />
          </>
        );

      case "select":
        return (
          <>
            <select
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-brand-500 focus:outline-none"
              value={answers.regionId}
              onChange={(e) => setField("regionId", e.target.value)}
            >
              {cityOptions.map((r) => {
                const cityKey = r.cityLabelKey.replace(
                  "city.",
                  ""
                ) as keyof typeof dict.city;
                const label = dict.city[cityKey] ?? cityKey;
                return (
                  <option key={r.id} value={r.id} className="bg-[#121a24]">
                    {label}
                  </option>
                );
              })}
            </select>
          </>
        );

      case "single": {
        if (stepConfig.field === "educationStage") {
          return renderOptions(
            getEducationStagesForAge(answers.age),
            "educationStage"
          );
        }
        if (stepConfig.field === "primaryInterest") {
          return renderOptions(
            stepConfig.optionKeys ?? [],
            "primaryInterest"
          );
        }
        if (stepConfig.field === "secondaryInterest") {
          return renderOptions(
            getSecondaryOptions(answers.primaryInterest),
            "secondaryInterest"
          );
        }
        if (stepConfig.field === "avoidPrimary") {
          return renderOptions(
            stepConfig.optionKeys ?? [],
            "avoidPrimary"
          );
        }
        if (stepConfig.field === "avoidSecondary") {
          return renderOptions(
            stepConfig.optionKeys ?? [],
            "avoidSecondary"
          );
        }
        if (stepConfig.field === "topSkill") {
          return renderOptions(stepConfig.optionKeys ?? [], "topSkill");
        }
        if (stepConfig.field === "countryCode") {
          return (
            <div className="mt-6 grid grid-cols-2 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setField("countryCode", c.code)}
                  className={`rounded-xl px-3 py-2 text-left text-sm ${
                    answers.countryCode === c.code
                      ? "bg-brand-600 text-white"
                      : "glass"
                  }`}
                >
                  {c.flag} {t(c.labelKey)}
                </button>
              ))}
            </div>
          );
        }
        if (stepConfig.field === "salaryBand") {
          return (
            <>
              {renderOptions(stepConfig.optionKeys ?? [], "salaryBand")}
              {region && answers.salaryBand && (
                <p className="mt-4 text-sm text-brand-300">
                  {formatMoney(
                    buildWizardInput(answers, locale).salaryMin,
                    region.currency,
                    locale
                  )}{" "}
                  –{" "}
                  {formatMoney(
                    buildWizardInput(answers, locale).salaryMax,
                    region.currency,
                    locale
                  )}
                </p>
              )}
            </>
          );
        }
        if (stepConfig.field === "workFormat") {
          return renderOptions(stepConfig.optionKeys ?? [], "workFormat");
        }
        if (stepConfig.field === "priority") {
          return renderOptions(stepConfig.optionKeys ?? [], "priority");
        }
        if (stepConfig.field === "stressLevel") {
          return renderOptions(stepConfig.optionKeys ?? [], "stressLevel");
        }
        if (stepConfig.field === "schedulePreference") {
          return renderOptions(stepConfig.optionKeys ?? [], "schedulePreference");
        }
        if (stepConfig.optionKeys?.length) {
          return renderOptions(stepConfig.optionKeys, stepConfig.field);
        }
        return null;
      }

      default:
        return null;
    }
  }

  const isLast = step === TOTAL_WIZARD_STEPS;
  const isText = stepConfig?.type === "text";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-center text-sm font-medium text-brand-400">
        {t("wizard.introTitle")}
      </p>
      <div className="mb-2 mt-4 text-center text-xs text-[var(--muted)]">
        {tr("common.stepOf", { n: step, total: TOTAL_WIZARD_STEPS })}
      </div>
      <div className="mb-4 flex gap-1">
        {Array.from({ length: TOTAL_WIZARD_STEPS }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${s <= step ? "bg-brand-500" : "bg-white/10"}`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-500/20 p-3 text-sm text-rose-300">
          <p>{error}</p>
          {error === t("wizard.errRateLimit") ? (
            <button
              type="button"
              className="mt-2 text-xs underline"
              onClick={() => {
                resetDailyLimit();
                setError(null);
              }}
            >
              {t("wizard.resetLimit")}
            </button>
          ) : null}
        </div>
      )}

      <section>
        <h1 className="font-display text-2xl font-bold">
          {t(stepConfig.titleKey)}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t(stepConfig.subtitleKey)}
        </p>
        {renderStepBody()}
      </section>

      {isLast && rateLimitReached && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
          <p>{t("wizard.rateLimitHint")}</p>
          <button
            type="button"
            className="mt-2 underline"
            onClick={() => resetDailyLimit()}
          >
            {t("wizard.resetLimit")}
          </button>
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 mt-8 flex flex-wrap gap-3 border-t border-white/10 bg-[#0a0f14]/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        {step > 1 && (
          <Button variant="secondary" onClick={goBack} disabled={loading}>
            {t("common.back")}
          </Button>
        )}
        {isText && (
          <Button variant="ghost" onClick={skipTextStep} disabled={loading}>
            {t("wizard.skip")}
          </Button>
        )}
        {!isLast ? (
          <Button onClick={goNext} disabled={loading}>
            {t("common.next")}
          </Button>
        ) : (
          <Button onClick={submit} disabled={loading}>
            {loading ? t("common.loading") : t("wizard.submit")}
          </Button>
        )}
      </div>
    </div>
  );
}
