"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function AiRiskHint({ inline }: { inline?: boolean }) {
  const { t } = useLocale();
  return (
    <span
      className={
        inline
          ? "inline-flex items-center gap-1.5 text-xs text-[var(--muted)]"
          : "mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--muted)]"
      }
    >
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-300"
        title={t("aiRisk.tooltip")}
        aria-label={t("aiRisk.tooltip")}
      >
        ?
      </span>
      <span>{t("aiRisk.summary")}</span>
      <Link
        href="/about#methodology"
        className="shrink-0 text-brand-400 hover:underline"
      >
        {t("aiRisk.learnMore")}
      </Link>
    </span>
  );
}
