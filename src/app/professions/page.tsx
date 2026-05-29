"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/components/Analytics";
import Link from "next/link";
import { CatalogIndexCard } from "@/components/CatalogIndexCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import {
  filterCatalogIndex,
  getCatalogIndexEntries,
} from "@/lib/catalog-list";
import { CATALOG_COUNT, pickProfessions } from "@/lib/professions-cache";
import { loadLatestWizardInput } from "@/lib/load-latest-input";
import { getRegion } from "@/lib/regions";
import type { ProfessionCategory } from "@/lib/profession-catalog";

const PAGE_SIZE = 20;

const CATEGORY_KEYS: ProfessionCategory[] = [
  "it",
  "medicine",
  "creative",
  "engineering",
  "business",
  "education",
  "law",
  "trades",
  "hospitality",
  "media",
  "science",
  "public",
  "sports",
];

export default function ProfessionsCatalogPage() {
  const { t, locale } = useLocale();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProfessionCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [wizardInput, setWizardInput] = useState(
    () => (typeof window !== "undefined" ? loadLatestWizardInput() : null)
  );

  useEffect(() => {
    setWizardInput(loadLatestWizardInput());
    trackEvent("catalog_view");
  }, []);

  const currency =
    getRegion(wizardInput?.regionId ?? "ru-moscow")?.currency ?? "RUB";

  const matchIds = useMemo(() => {
    if (!wizardInput) return new Set<string>();
    return new Set(pickProfessions(wizardInput));
  }, [wizardInput]);

  const filtered = useMemo(
    () =>
      filterCatalogIndex(getCatalogIndexEntries(), {
        search,
        category,
        locale,
      }),
    [search, category, locale]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="text-sm text-brand-400 hover:underline">
        {t("common.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{t("catalog.title")}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {t("catalog.subtitle").replace("{count}", String(CATALOG_COUNT))}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="text-xs font-medium text-[var(--muted)]">
            {t("catalog.search")}
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("catalog.searchPlaceholder")}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-[var(--muted)]">
            {t("catalog.category")}
          </span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ProfessionCategory | "all");
              setPage(1);
            }}
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#121a24] px-3 py-2 text-sm sm:w-48"
          >
            <option value="all">{t("catalog.allCategories")}</option>
            {CATEGORY_KEYS.map((c) => (
              <option key={c} value={c}>
                {t(`catalog.categories.${c}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        {t("catalog.showing")
          .replace("{from}", String(filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0))
          .replace("{to}", String(Math.min(page * PAGE_SIZE, filtered.length)))
          .replace("{total}", String(filtered.length))}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((entry) => (
          <CatalogIndexCard
            key={entry.id}
            entry={entry}
            currency={currency}
            isMatch={matchIds.has(entry.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[var(--muted)]">{t("catalog.empty")}</p>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("catalog.prev")}
          </Button>
          <span className="text-sm text-[var(--muted)]">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {t("catalog.next")}
          </Button>
        </div>
      )}

      {matchIds.size > 0 && (
        <p className="mt-8 text-center text-xs text-brand-400/90">
          {t("catalog.matchHint")}
        </p>
      )}

      <div className="mt-10 text-center">
        <Button href="/simulate">{t("home.ctaSimulate")}</Button>
      </div>
    </div>
  );
}
