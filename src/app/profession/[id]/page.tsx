"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DayTimeline } from "@/components/DayTimeline";
import { AiRiskHint } from "@/components/AiRiskHint";
import { RoadmapChecklist } from "@/components/RoadmapChecklist";
import { ShareCard } from "@/components/ShareCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import { DEMO_RESULT } from "@/lib/demo-data";
import { loadLatestWizardInput } from "@/lib/load-latest-input";
import {
  getProfessionSummary,
  getProfessionTiming,
} from "@/lib/profession-meta";
import { trackEvent } from "@/components/Analytics";
import { buildProfession, getProfessionEntry } from "@/lib/professions-loader";
import { isEnrichedProfession } from "@/lib/content-quality";
import type { Profession, SimulationResult, WizardInput } from "@/lib/schemas";
import { normalizeWizardInput } from "@/lib/schemas";
import { getLocalSimulations } from "@/lib/storage";

function findProfession(id: string, input: WizardInput | null): Profession | null {
  const raw =
    typeof window !== "undefined"
      ? sessionStorage.getItem("career-simulator-latest")
      : null;
  if (raw) {
    const result = JSON.parse(raw) as SimulationResult;
    const found = result.professions.find((p) => p.id === id);
    if (found) return found;
  }
  const demo = DEMO_RESULT.professions.find((p) => p.id === id);
  if (demo) return demo;
  const saved = getLocalSimulations()[0];
  if (saved) {
    const fromSaved = saved.result.professions.find((p) => p.id === id);
    if (fromSaved) return fromSaved;
  }
  const base: WizardInput =
    input ??
    normalizeWizardInput({
      locale: "ru",
      age: 17,
      educationStage: "school_11",
      interests: ["code"],
      countryCode: "RU",
      regionId: "ru-moscow",
      salaryMin: 80000,
      salaryMax: 150000,
      lifestyle: ["remote"],
    });
  return buildProfession(id, base);
}

export default function ProfessionPage() {
  const params = useParams();
  const id = params.id as string;
  const { t, dict, locale } = useLocale();
  const [profession, setProfession] = useState<Profession | null | undefined>(
    undefined
  );
  const [wizardInput, setWizardInput] = useState<WizardInput | null>(null);

  useEffect(() => {
    const input = loadLatestWizardInput();
    setWizardInput(input);
    const found = findProfession(id, input);
    setProfession(found);
    if (found) trackEvent("profession_open", { id });
  }, [id]);

  if (profession === undefined) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-[var(--muted)]">
        {t("common.loading")}
      </div>
    );
  }

  if (!profession) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[var(--muted)]">{t("profession.notFound")}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/professions">{t("profession.notFoundCta")}</Button>
          <Button href="/simulate" variant="secondary">
            {t("results.start")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/results" className="text-sm text-brand-400 hover:underline">
        {t("profession.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{profession.title}</h1>
      {(() => {
        const entry = getProfessionEntry(id);
        const enriched = isEnrichedProfession(entry);
        return (
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${
              enriched
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/10 text-[var(--muted)]"
            }`}
          >
            {enriched ? t("aiRisk.contentEnriched") : t("aiRisk.contentTemplate")}
          </span>
        );
      })()}
      <AiRiskHint />

      {(() => {
        const summary = getProfessionSummary(profession.id, locale);
        const timing =
          wizardInput &&
          getProfessionTiming(
            profession.id,
            wizardInput.age,
            wizardInput.educationStage,
            locale,
            dict
          );
        return (
          <>
            {summary && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-400">
                  {t("profession.aboutTitle")}
                </p>
                <p className="mt-1 text-[var(--muted)]">{summary}</p>
              </div>
            )}
            {timing && (
              <div className="mt-4 rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-sm font-medium text-brand-300">
                  {t("profession.whenTitle")}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{timing}</p>
              </div>
            )}
          </>
        );
      })()}

      <p className="mt-4 text-sm text-[var(--muted)]">{profession.match_reason}</p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">{t("profession.dayTitle")}</h2>
        <div className="mt-6">
          <DayTimeline events={profession.day_timeline} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">{t("profession.roadmapTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("profession.roadmapHint")}</p>
        <div className="mt-6">
          <RoadmapChecklist professionId={profession.id} items={profession.roadmap} />
        </div>
      </section>

      <ShareCard profession={profession} />

      <div className="mt-10 text-center">
        <Button href="/premium" variant="secondary">
          {t("profession.pdfPremium")}
        </Button>
      </div>
    </div>
  );
}
