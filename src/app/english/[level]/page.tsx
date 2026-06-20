import Link from "next/link";
import { notFound } from "next/navigation";
import { ENGLISH_COURSE, getLevelById } from "@/data/english-course";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ENGLISH_COURSE.map((level) => ({ level: level.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level: levelId } = await params;
  const level = getLevelById(levelId);
  if (!level) return {};
  return {
    title: `${level.name} ${level.label} — Английский курс`,
    description: level.description,
  };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: levelId } = await params;
  const maybeLevel = getLevelById(levelId);
  if (!maybeLevel) notFound();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const level = maybeLevel!;
  const levelIndex = ENGLISH_COURSE.findIndex((l) => l.id === level.id);
  const prevLevel = levelIndex > 0 ? ENGLISH_COURSE[levelIndex - 1] : null;
  const nextLevel = levelIndex < ENGLISH_COURSE.length - 1 ? ENGLISH_COURSE[levelIndex + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <div className="py-10">
        <Link
          href="/english"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← Все уровни
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black"
          style={{ backgroundColor: level.color + "22", color: level.color }}
        >
          {level.name}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{level.label}</h1>
          <p className="mt-1 text-[var(--muted)]">{level.description}</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {level.lessons.map((lesson, idx) => (
          <Link
            key={lesson.id}
            href={`/english/${level.id}/${lesson.id}`}
            className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: level.color + "18" }}
            >
              {lesson.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--muted)]">Урок {idx + 1}</div>
              <h2 className="font-display font-bold text-white">{lesson.title}</h2>
              <p className="text-sm text-[var(--muted)]">{lesson.titleRu}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-[var(--muted)]">{lesson.duration} мин</div>
              <div className="text-xs text-[var(--muted)]">{lesson.exercises.length} заданий</div>
              <span
                className="mt-1 block text-sm font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: level.color }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        {prevLevel ? (
          <Link
            href={`/english/${prevLevel.id}`}
            className="glass rounded-xl px-4 py-2 text-sm hover:bg-white/10"
          >
            ← {prevLevel.name} {prevLevel.label}
          </Link>
        ) : (
          <div />
        )}
        {nextLevel && (
          <Link
            href={`/english/${nextLevel.id}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: nextLevel.color }}
          >
            {nextLevel.name} {nextLevel.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
