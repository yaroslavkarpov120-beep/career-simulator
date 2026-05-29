"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProfessionCard } from "@/components/ProfessionCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import {
  CATALOG_COUNT,
  DEMO_FEATURED_PROFESSIONS,
  DEMO_INPUT,
  DEMO_RESULT,
} from "@/lib/demo-data";

export default function DemoPage() {
  const { t } = useLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(
      "career-simulator-latest",
      JSON.stringify(DEMO_RESULT)
    );
    sessionStorage.setItem(
      "career-simulator-latest-input",
      JSON.stringify(DEMO_INPUT)
    );
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-brand-400">{t("demo.tag")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{t("demo.title")}</h1>
      <p className="mt-2 text-[var(--muted)]">
        {t("demo.subtitle")}{" "}
        <Link href="/simulate" className="text-brand-400 hover:underline">
          {t("demo.ownSim")}
        </Link>
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_FEATURED_PROFESSIONS.map((p) => (
          <ProfessionCard
            key={p.id}
            profession={p}
            wizardInput={DEMO_INPUT}
            selected={selectedId === p.id}
            onSelect={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      {selectedId && (
        <div className="mt-10 text-center">
          <Button href={`/profession/${selectedId}`}>
            {t("profession.openDay")}
          </Button>
        </div>
      )}

      <p className="mt-8 text-center">
        <Link
          href="/professions"
          className="text-sm text-brand-400 hover:underline"
        >
          {t("home.allProfessions").replace("{count}", String(CATALOG_COUNT))}
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        {DEMO_RESULT.disclaimer}
      </p>
    </div>
  );
}
