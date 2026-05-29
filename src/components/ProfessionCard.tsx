"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/regions";
import {
  getProfessionSummary,
  getProfessionTiming,
} from "@/lib/profession-meta";
import type { Profession, WizardInput } from "@/lib/schemas";
import { useLocale } from "./LocaleProvider";
import { AiRiskHint } from "./AiRiskHint";

function riskColor(pct: number) {
  if (pct < 30) return "text-emerald-400 bg-emerald-500/20";
  if (pct < 45) return "text-amber-400 bg-amber-500/20";
  return "text-rose-400 bg-rose-500/20";
}

export function ProfessionCard({
  profession,
  selected,
  onSelect,
  wizardInput,
}: {
  profession: Profession;
  selected?: boolean;
  onSelect?: () => void;
  wizardInput?: WizardInput | null;
}) {
  const { locale, t, dict } = useLocale();
  const salary = `${formatMoney(profession.salary_min, profession.currency, locale)} – ${formatMoney(profession.salary_max, profession.currency, locale)}${t("profession.perMonth")}`;

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
    <article
      className={`glass rounded-2xl p-5 transition ${
        selected ? "ring-2 ring-brand-400" : "hover:border-brand-500/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold">{profession.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${riskColor(profession.ai_risk_percent)}`}
          title={t("aiRisk.tooltip")}
        >
          {t("profession.aiRisk")} {profession.ai_risk_percent}%
        </span>
      </div>
      <AiRiskHint inline />

      {summary && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-400">
            {t("profession.aboutTitle")}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{summary}</p>
        </div>
      )}

      {timing && (
        <div className="mt-3 rounded-lg border border-brand-500/20 bg-brand-500/5 p-3">
          <p className="text-xs font-medium text-brand-300">
            {t("profession.whenTitle")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#e8eef4]">{timing}</p>
        </div>
      )}

      <p className="mt-3 text-sm text-[var(--muted)]">{profession.match_reason}</p>
      <p className="mt-3 text-sm font-medium text-brand-300">{salary}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">{profession.ai_risk_explanation}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
          >
            {selected ? t("profession.selected") : t("profession.select")}
          </button>
        )}
        <Link
          href={`/profession/${profession.id}`}
          className="rounded-lg bg-brand-600/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-500"
        >
          {t("profession.openDay")}
        </Link>
      </div>
    </article>
  );
}
