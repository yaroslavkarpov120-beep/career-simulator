"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProfessionCard } from "@/components/ProfessionCard";
import { AiRiskHint } from "@/components/AiRiskHint";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import { CATALOG_COUNT, DEMO_RESULT } from "@/lib/demo-data";
import { loadLatestWizardInput } from "@/lib/load-latest-input";
import type { SimulationResult, WizardInput } from "@/lib/schemas";
import { getLocalSimulations } from "@/lib/storage";

export default function ResultsPage() {
  const { t } = useLocale();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [wizardInput, setWizardInput] = useState<WizardInput | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const input = loadLatestWizardInput();
    setWizardInput(input);
    try {
      const raw = sessionStorage.getItem("career-simulator-latest");
      if (raw) {
        setResult(JSON.parse(raw) as SimulationResult);
        return;
      }
    } catch {
      /* ignore */
    }
    const saved = getLocalSimulations()[0];
    if (saved) {
      setResult(saved.result);
      if (!input) setWizardInput(saved.input);
      return;
    }
    setResult(DEMO_RESULT);
  }, []);

  if (!result) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-[var(--muted)]">{t("results.noResults")}</p>
        <div className="mt-6">
          <Button href="/simulate">{t("results.start")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{t("results.title")}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{t("results.subtitle")}</p>
      <p className="mt-1 text-xs text-brand-400/90">{t("results.intro")}</p>
      <AiRiskHint />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.professions.map((p) => (
          <ProfessionCard
            key={p.id}
            profession={p}
            wizardInput={wizardInput}
            selected={selectedId === p.id}
            onSelect={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      {selectedId && (
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={`/profession/${selectedId}`}>
            {t("profession.openDay")}
          </Button>
          <Button href="/premium" variant="secondary">
            {t("results.pdfPremium")}
          </Button>
        </div>
      )}

      <section className="mt-16 border-t border-white/10 pt-12 text-center">
        <h2 className="font-display text-xl font-bold">
          {t("results.catalogTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("results.catalogSubtitle").replace("{count}", String(CATALOG_COUNT))}
        </p>
        <div className="mt-6">
          <Button href="/professions" variant="secondary">
            {t("results.catalogCta")}
          </Button>
        </div>
      </section>

      <p className="mt-12 text-center text-xs text-[var(--muted)]">
        {result.disclaimer}
      </p>
      <p className="mt-4 text-center">
        <Link href="/simulate" className="text-sm text-brand-400 hover:underline">
          {t("results.retry")}
        </Link>
      </p>
    </div>
  );
}
