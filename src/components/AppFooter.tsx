"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function AppFooter() {
  const { t } = useLocale();
  return (
    <footer className="mt-16 border-t border-white/10 px-4 py-8 text-center text-sm text-[var(--muted)]">
      <p>{t("disclaimer.footer")}</p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/privacy" className="text-brand-400 hover:underline">
          {t("legal.footer.privacy")}
        </Link>
        <Link href="/terms" className="text-brand-400 hover:underline">
          {t("legal.footer.terms")}
        </Link>
        <Link href="/about" className="text-brand-400 hover:underline">
          {t("legal.footer.about")}
        </Link>
        <Link href="/b2b" className="text-brand-400 hover:underline">
          B2B
        </Link>
      </nav>
      <p className="mt-4 text-xs">
        <a
          href="mailto:hello@careersimulator.app"
          className="text-brand-400 hover:underline"
        >
          hello@careersimulator.app
        </a>
      </p>
    </footer>
  );
}
