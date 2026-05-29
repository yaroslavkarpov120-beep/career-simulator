"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Profession } from "@/lib/schemas";
import { trackEvent } from "./Analytics";
import { Button } from "./ui/Button";
import { useLocale } from "./LocaleProvider";

export function ShareCard({ profession }: { profession: Profession }) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { t } = useLocale();

  async function downloadPng() {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `ai-risk-${profession.id}.png`;
      link.href = dataUrl;
      link.click();
      trackEvent("share_download", { id: profession.id });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-display text-lg font-bold">{t("profession.shareTitle")}</h3>
      <div
        ref={ref}
        className="mx-auto max-w-sm rounded-2xl bg-gradient-to-br from-brand-900 to-[#0a0f14] p-6 text-white shadow-xl"
      >
        <p className="text-xs uppercase tracking-widest text-brand-300">Career Simulator</p>
        <p className="mt-4 font-display text-2xl font-bold">{profession.title}</p>
        <p className="mt-6 text-5xl font-black text-accent-500">
          {profession.ai_risk_percent}%
        </p>
        <p className="mt-1 text-sm text-white/70">{t("profession.aiRisk")}</p>
        <p className="mt-4 text-xs text-white/50">careersim.app</p>
      </div>
      <div className="mt-4 text-center">
        <Button onClick={downloadPng} disabled={downloading} variant="secondary">
          {downloading ? "…" : t("profession.downloadPng")}
        </Button>
      </div>
    </div>
  );
}
