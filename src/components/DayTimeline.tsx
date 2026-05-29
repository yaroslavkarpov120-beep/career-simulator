import type { Profession } from "@/lib/schemas";

export function DayTimeline({ events }: { events: Profession["day_timeline"] }) {
  return (
    <ol className="relative border-l border-brand-600/40 pl-6">
      {events.map((event, i) => (
        <li key={i} className="mb-6 last:mb-0">
          <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-[#0a0f14]" />
          <time className="text-xs font-bold text-brand-400">{event.time}</time>
          <p className="mt-1 text-sm text-[var(--foreground)]">{event.activity}</p>
        </li>
      ))}
    </ol>
  );
}
