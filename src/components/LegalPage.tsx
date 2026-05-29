"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function LegalPage({ section }: { section: "privacy" | "terms" | "about" }) {
  const { t } = useLocale();
  const title = t(`legal.${section}.title`);
  const body = t(`legal.${section}.body`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-400 hover:underline">
        {t("common.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{title}</h1>
      <div className="prose prose-invert mt-8 max-w-none space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        {body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {section === "about" && (
        <section id="methodology" className="mt-12 scroll-mt-24 border-t border-white/10 pt-8">
          <h2 className="font-display text-xl font-bold">{t("aiRisk.methodologyTitle")}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
            {t("aiRisk.methodologyBody")
              .split("\n\n")
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </section>
      )}
      <p className="mt-10 text-xs text-[var(--muted)]">
        {t("legal.contact")}:{" "}
        <a href="mailto:hello@careersimulator.app" className="text-brand-400">
          hello@careersimulator.app
        </a>
      </p>
    </div>
  );
}
