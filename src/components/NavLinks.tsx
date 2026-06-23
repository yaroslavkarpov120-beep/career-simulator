"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function NavLinks() {
  const { t } = useLocale();
  return (
    <nav className="flex flex-1 items-center justify-center gap-3 text-sm text-[var(--muted)] sm:gap-4">
      <Link href="/demo" className="hover:text-white">
        {t("nav.demo")}
      </Link>
      <Link href="/simulate" className="hover:text-white">
        {t("nav.simulate")}
      </Link>
      <Link href="/professions" className="hover:text-white">
        {t("nav.catalog")}
      </Link>
      <Link
        href="/premium"
        className="rounded-full bg-brand-600 px-3 py-1 text-white hover:bg-brand-500"
      >
        {t("nav.premium")}
      </Link>
    </nav>
  );
}
