"use client";

import { useLocale } from "./LocaleProvider";

export function DisclaimerBanner() {
  const { t } = useLocale();
  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200/90">
      {t("disclaimer.banner")}
    </div>
  );
}
