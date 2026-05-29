"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import { submitWaitlist } from "@/lib/waitlist";

export default function B2bPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await submitWaitlist("b2b", { email, school });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-bold">{t("b2b.title")}</h1>
      <p className="mt-4 text-[var(--muted)]">{t("b2b.desc")}</p>

      {sent ? (
        <p className="mt-10 rounded-xl bg-emerald-500/20 p-6 text-center text-emerald-300">
          {t("b2b.success")}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-10 space-y-4">
          <input
            required
            type="email"
            placeholder={t("b2b.email")}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-brand-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            placeholder={t("b2b.school")}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-brand-500 focus:outline-none"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {t("b2b.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
