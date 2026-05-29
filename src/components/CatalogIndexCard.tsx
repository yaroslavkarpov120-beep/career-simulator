"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/regions";
import { pickTitle } from "@/lib/catalog-list";
import type { ProfessionIndexEntry } from "@/lib/profession-catalog";
import { useLocale } from "./LocaleProvider";

function riskColor(pct: number) {
  if (pct < 30) return "text-emerald-400 bg-emerald-500/20";
  if (pct < 45) return "text-amber-400 bg-amber-500/20";
  return "text-rose-400 bg-rose-500/20";
}

export function CatalogIndexCard({
  entry,
  currency,
  isMatch,
}: {
  entry: ProfessionIndexEntry;
  currency: string;
  isMatch?: boolean;
}) {
  const { locale, t } = useLocale();
  const title = pickTitle(entry, locale);
  const salary = `${formatMoney(entry.salaryBase.min, currency, locale)} – ${formatMoney(entry.salaryBase.max, currency, locale)}${t("profession.perMonth")}`;

  return (
    <article
      className={`glass rounded-2xl p-5 transition hover:border-brand-500/30 ${
        isMatch ? "ring-1 ring-brand-500/40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${riskColor(entry.ai_risk_percent)}`}
        >
          {t("profession.aiRisk")} {entry.ai_risk_percent}%
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-brand-300">{salary}</p>
      <div className="mt-4">
        <Link
          href={`/profession/${entry.id}`}
          className="rounded-lg bg-brand-600/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-500"
        >
          {t("profession.openDay")}
        </Link>
      </div>
    </article>
  );
}
