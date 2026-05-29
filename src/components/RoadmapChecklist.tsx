"use client";

import { useEffect, useState } from "react";
import type { Profession } from "@/lib/schemas";
import { getChecklist, toggleChecklistItem } from "@/lib/storage";
import { useLocale } from "./LocaleProvider";

export function RoadmapChecklist({
  professionId,
  items,
}: {
  professionId: string;
  items: Profession["roadmap"];
}) {
  const { tr } = useLocale();
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setChecked(getChecklist(professionId));
  }, [professionId]);

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        {tr("profession.progress", { done: doneCount, total: items.length })}
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className={`glass rounded-xl p-4 ${checked[i] ? "opacity-60" : ""}`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={(e) => {
                  toggleChecklistItem(professionId, i, e.target.checked);
                  setChecked((prev) => ({ ...prev, [i]: e.target.checked }));
                }}
                className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent accent-brand-500"
              />
              <div>
                <span className="font-semibold">{item.skill}</span>
                <span className="ml-2 text-xs text-brand-400">~{item.months} mo</span>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.first_step}</p>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
