import Link from "next/link";
import { ENGLISH_COURSE } from "@/data/english-course";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Курс английского языка",
  description: "Полный курс английского от A1 до C1 с грамматикой, лексикой и упражнениями",
};

export default function EnglishCoursePage() {
  const totalLessons = ENGLISH_COURSE.reduce((acc, l) => acc + l.lessons.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <section className="py-16 text-center md:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          English Course
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          Английский язык
          <br />
          <span className="text-gradient">от A1 до C1</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
          Структурированный курс с объяснением грамматики на русском, словарным запасом
          и интерактивными упражнениями с мгновенной обратной связью.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
          <span className="flex items-center gap-2">
            <span className="text-brand-400">✦</span> {ENGLISH_COURSE.length} уровней
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-400">✦</span> {totalLessons} уроков
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-400">✦</span> Грамматика + словарь + тесты
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brand-400">✦</span> Прогресс сохраняется
          </span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-5">
        {ENGLISH_COURSE.map((level) => (
          <Link
            key={level.id}
            href={`/english/${level.id}`}
            className="group glass rounded-2xl p-6 transition-all hover:scale-[1.03] hover:border-white/20 hover:bg-white/10"
          >
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black"
              style={{ backgroundColor: level.color + "22", color: level.color }}
            >
              {level.name}
            </div>
            <h2 className="font-display font-bold text-white">{level.label}</h2>
            <p className="mt-1 text-xs text-[var(--muted)] line-clamp-3">{level.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-[var(--muted)]">{level.lessons.length} уроков</span>
              <span
                className="font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: level.color }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: "📖",
            title: "Грамматика с нуля",
            desc: "Каждый урок начинается с чёткого объяснения на русском языке с примерами и структурой.",
          },
          {
            icon: "📝",
            title: "Словарный запас",
            desc: "Тематическая лексика с транскрипцией, переводом и примерами предложений.",
          },
          {
            icon: "✅",
            title: "Упражнения с ответами",
            desc: "Интерактивные тесты с мгновенной обратной связью и объяснением каждого ответа.",
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6">
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="font-display font-bold text-brand-300">{f.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 glass rounded-2xl p-8">
        <h2 className="font-display text-xl font-bold">Структура курса</h2>
        <div className="mt-6 space-y-3">
          {ENGLISH_COURSE.map((level) => (
            <div key={level.id} className="flex items-start gap-4">
              <span
                className="mt-0.5 shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-black"
                style={{ backgroundColor: level.color + "22", color: level.color }}
              >
                {level.name}
              </span>
              <div>
                <span className="font-medium text-white">{level.label}</span>
                <span className="ml-2 text-sm text-[var(--muted)]">— {level.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
