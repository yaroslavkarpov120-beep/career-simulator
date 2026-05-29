"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import { getRegion } from "@/lib/regions";
import { printSimulationReport } from "@/lib/report-pdf";
import { getLocalSimulations } from "@/lib/storage";
import { submitWaitlist } from "@/lib/waitlist";

const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export default function PremiumPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const saved = typeof window !== "undefined" ? getLocalSimulations()[0] : null;

  async function submitWaitlistForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await submitWaitlist("premium", { email });
    setSent(true);
    setLoading(false);
  }

  function downloadTxt() {
    if (!saved) {
      alert(t("premium.needSimulate"));
      return;
    }
    const region = getRegion(saved.input.regionId);
    const cityKey =
      region?.cityLabelKey.replace("city.", "") ?? saved.input.regionId;
    const lines = [
      "Career Simulator",
      saved.result.disclaimer,
      "",
      `Region: ${cityKey}`,
      `Age: ${saved.input.age}`,
      "",
      ...saved.result.professions.map(
        (prof, i) =>
          `${i + 1}. ${prof.title}\n   ${prof.salary_min}-${prof.salary_max} ${prof.currency}\n   AI-risk: ${prof.ai_risk_percent}%\n   ${prof.match_reason}\n`
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-simulator-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    if (!saved) {
      alert(t("premium.needSimulate"));
      return;
    }
    const region = getRegion(saved.input.regionId);
    const cityKey =
      region?.cityLabelKey.replace("city.", "") ?? saved.input.regionId;
    printSimulationReport(saved, {
      title: "Career Simulator",
      disclaimer: saved.result.disclaimer,
      region: cityKey,
      age: String(saved.input.age),
      aiRisk: t("profession.aiRisk"),
    });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-bold">{t("premium.title")}</h1>
      <p className="mt-4 text-[var(--muted)]">{t("premium.desc")}</p>

      <div className="mt-10 glass rounded-2xl p-6">
        <p className="text-3xl font-bold">
          {t("premium.price")}
          <span className="text-base font-normal text-[var(--muted)]">
            {t("premium.perMonth")}
          </span>
        </p>
        <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
          <li>{t("premium.feat1")}</li>
          <li>{t("premium.feat2")}</li>
          <li>{t("premium.feat3")}</li>
          <li>{t("premium.feat4")}</li>
        </ul>
        <p className="mt-6 text-sm text-brand-300">{t("premium.comingSoon")}</p>

        {sent ? (
          <p className="mt-6 rounded-xl bg-emerald-500/20 p-4 text-center text-sm text-emerald-300">
            {t("premium.waitlistSuccess")}
          </p>
        ) : (
          <form onSubmit={submitWaitlistForm} className="mt-6 space-y-3">
            <input
              required
              type="email"
              placeholder={t("premium.waitlistEmail")}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-brand-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {t("premium.waitlistSubmit")}
            </Button>
          </form>
        )}

        <div className="mt-4 space-y-3">
          <Button onClick={downloadPdf} variant="secondary" className="w-full">
            {t("premium.downloadPdf")}
          </Button>
          <Button onClick={downloadTxt} variant="ghost" className="w-full">
            {t("premium.download")}
          </Button>
          {stripeLink ? (
            <Button href={stripeLink} className="w-full">
              {t("premium.payOneTime")}
            </Button>
          ) : null}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        {t("premium.stripeNote")}
      </p>
    </div>
  );
}
