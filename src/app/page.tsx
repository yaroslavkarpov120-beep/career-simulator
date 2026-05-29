"use client";

import { Button } from "@/components/ui/Button";
import { ProfessionCard } from "@/components/ProfessionCard";
import { useLocale } from "@/components/LocaleProvider";
import { CATALOG_COUNT, DEMO_FEATURED_PROFESSIONS, DEMO_INPUT } from "@/lib/demo-data";
import Link from "next/link";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <section className="py-16 text-center md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          {t("home.tagline")}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          {t("home.title")}
          <br />
          <span className="text-gradient">{t("home.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">
          {t("home.subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/simulate">{t("home.ctaSimulate")}</Button>
          <Button href="/demo" variant="secondary">
            {t("home.ctaDemo")}
          </Button>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">{t("home.freeNote")}</p>
      </section>

      <section className="border-t border-white/10 py-16">
        <h2 className="text-center font-display text-2xl font-bold">
          {t("home.demoTitle")}
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          {t("home.demoSubtitle")}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_FEATURED_PROFESSIONS.map((p) => (
            <ProfessionCard
              key={p.id}
              profession={p}
              wizardInput={DEMO_INPUT}
            />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/demo">{t("home.ctaDemo")} →</Button>
          <Link
            href="/professions"
            className="inline-flex items-center rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/10"
          >
            {t("home.allProfessions").replace("{count}", String(CATALOG_COUNT))}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 py-16 md:grid-cols-3">
        {[
          { title: t("home.featureAiRisk"), desc: t("home.featureAiRiskDesc") },
          { title: t("home.featureDay"), desc: t("home.featureDayDesc") },
          { title: t("home.featureRoadmap"), desc: t("home.featureRoadmapDesc") },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-brand-300">{f.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl p-8 text-center">
        <h2 className="font-display text-xl font-bold">{t("home.b2bTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("home.b2bDesc")}</p>
        <div className="mt-4">
          <Button href="/b2b" variant="secondary">
            {t("home.b2bCta")}
          </Button>
        </div>
      </section>
    </div>
  );
}
