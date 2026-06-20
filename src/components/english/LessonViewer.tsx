"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Lesson, Level, Exercise } from "@/data/english-course";

const STORAGE_KEY = "english-progress";

function loadProgress(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveProgress(levelId: string, lessonId: string) {
  if (typeof window === "undefined") return;
  const progress = loadProgress();
  const levelProgress = progress[levelId] ?? [];
  if (!levelProgress.includes(lessonId)) {
    progress[levelId] = [...levelProgress, lessonId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

type Tab = "grammar" | "vocabulary" | "exercises";

interface Props {
  lesson: Lesson;
  level: Level;
  prevLessonId?: string;
  nextLessonId?: string;
}

export function LessonViewer({ lesson, level, prevLessonId, nextLessonId }: Props) {
  const [tab, setTab] = useState<Tab>("grammar");
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    setCompleted((progress[level.id] ?? []).includes(lesson.id));
  }, [level.id, lesson.id]);

  const exercise: Exercise | undefined = lesson.exercises[currentEx];
  const isCorrect = selected === exercise?.answer;

  const handleAnswer = useCallback((option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === exercise?.answer) {
      setScore((s: number) => s + 1);
    }
  }, [answered, exercise]);

  const handleNext = useCallback(() => {
    if (currentEx + 1 < lesson.exercises.length) {
      setCurrentEx((n: number) => n + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      saveProgress(level.id, lesson.id);
      setCompleted(true);
    }
  }, [currentEx, lesson.exercises.length, level.id, lesson.id]);

  const handleRestart = () => {
    setCurrentEx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const tabs: { id: Tab; label: string; available: boolean }[] = [
    { id: "grammar", label: "📖 Грамматика", available: !!lesson.grammar },
    { id: "vocabulary", label: "📝 Словарь", available: !!(lesson.vocabulary?.length) },
    { id: "exercises", label: "✅ Упражнения", available: true },
  ];

  const scorePercent = lesson.exercises.length > 0 ? Math.round((score / lesson.exercises.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <div className="py-10 flex items-center justify-between">
        <Link href={`/english/${level.id}`} className="text-sm text-[var(--muted)] hover:text-white">
          ← {level.name} {level.label}
        </Link>
        {completed && (
          <span className="text-sm font-medium" style={{ color: level.color }}>
            ✓ Пройден
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: level.color + "22" }}
        >
          {lesson.icon}
        </div>
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: level.color }}
          >
            {level.name} · {level.label}
          </div>
          <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-[var(--muted)]">{lesson.titleRu}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1">
        {tabs.filter((t) => t.available).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === "exercises") {
                setCurrentEx(0);
                setSelected(null);
                setAnswered(false);
                setScore(0);
                setFinished(false);
              }
            }}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-white/10 text-white"
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "grammar" && lesson.grammar && (
        <div className="mt-6 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold" style={{ color: level.color }}>
              {lesson.grammar.title}
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">{lesson.grammar.explanation}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Структура
            </h3>
            <div
              className="rounded-xl px-5 py-4 font-mono text-sm leading-relaxed"
              style={{ backgroundColor: level.color + "15", color: level.color }}
            >
              {lesson.grammar.structure}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Примеры
            </h3>
            <div className="space-y-3">
              {lesson.grammar.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="font-medium text-white">{ex.en}</div>
                  <div className="mt-0.5 text-sm text-[var(--muted)]">{ex.ru}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setTab("vocabulary")}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: level.color }}
          >
            Далее: Словарь →
          </button>
        </div>
      )}

      {tab === "vocabulary" && lesson.vocabulary && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.vocabulary.map((item, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display font-bold text-white">{item.word}</div>
                    {item.transcription && (
                      <div className="mt-0.5 text-xs text-[var(--muted)]">{item.transcription}</div>
                    )}
                  </div>
                  <div
                    className="shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: level.color + "22", color: level.color }}
                  >
                    {item.translation}
                  </div>
                </div>
                <div className="mt-2 text-sm italic text-[var(--muted)]">{item.example}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setTab("exercises");
              setCurrentEx(0);
              setSelected(null);
              setAnswered(false);
              setScore(0);
              setFinished(false);
            }}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: level.color }}
          >
            Далее: Упражнения →
          </button>
        </div>
      )}

      {tab === "exercises" && (
        <div className="mt-6">
          {finished ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-5xl">{scorePercent >= 80 ? "🎉" : scorePercent >= 60 ? "👍" : "📚"}</div>
              <h2 className="mt-4 font-display text-2xl font-bold">
                {scorePercent >= 80
                  ? "Отлично!"
                  : scorePercent >= 60
                  ? "Хорошая работа!"
                  : "Продолжай практиковаться!"}
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                Правильных ответов: {score} из {lesson.exercises.length}
              </p>
              <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${scorePercent}%`, backgroundColor: level.color }}
                />
              </div>
              <p className="mt-2 text-2xl font-black" style={{ color: level.color }}>
                {scorePercent}%
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="glass rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                >
                  Повторить урок
                </button>
                {nextLessonId ? (
                  <Link
                    href={`/english/${level.id}/${nextLessonId}`}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: level.color }}
                  >
                    Следующий урок →
                  </Link>
                ) : (
                  <Link
                    href={`/english/${level.id}`}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: level.color }}
                  >
                    Завершить уровень →
                  </Link>
                )}
              </div>
            </div>
          ) : exercise ? (
            <div>
              <div className="mb-6 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>
                  Вопрос {currentEx + 1} из {lesson.exercises.length}
                </span>
                <span style={{ color: level.color }}>
                  ✓ {score} правильно
                </span>
              </div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentEx) / lesson.exercises.length) * 100}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>

              <div className="mt-6 glass rounded-2xl p-6">
                <p className="font-medium text-white">{exercise.question}</p>

                {exercise.sentence && (
                  <div
                    className="mt-4 rounded-xl px-4 py-3 text-lg font-medium"
                    style={{ backgroundColor: level.color + "15" }}
                  >
                    {exercise.sentence.replace("___", "____")}
                  </div>
                )}

                <div className="mt-5 space-y-2">
                  {exercise.options.map((option) => {
                    let style = "border border-white/10 bg-white/5 hover:bg-white/10 text-white";
                    if (answered) {
                      if (option === exercise.answer) {
                        style = "border-2 text-white";
                      } else if (option === selected && option !== exercise.answer) {
                        style = "border border-red-500/50 bg-red-500/10 text-red-300";
                      } else {
                        style = "border border-white/5 bg-white/3 text-[var(--muted)]";
                      }
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={answered}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${style}`}
                        style={
                          answered && option === exercise.answer
                            ? { borderColor: level.color, backgroundColor: level.color + "22" }
                            : {}
                        }
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                      isCorrect
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    <span className="font-semibold">{isCorrect ? "✓ Верно! " : "✗ Неверно. "}</span>
                    {exercise.explanation}
                  </div>
                )}
              </div>

              {answered && (
                <button
                  onClick={handleNext}
                  className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: level.color }}
                >
                  {currentEx + 1 < lesson.exercises.length ? "Следующий вопрос →" : "Завершить урок →"}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        {prevLessonId ? (
          <Link
            href={`/english/${level.id}/${prevLessonId}`}
            className="glass rounded-xl px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Пред. урок
          </Link>
        ) : (
          <div />
        )}
        {nextLessonId && (
          <Link
            href={`/english/${level.id}/${nextLessonId}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: level.color }}
          >
            След. урок →
          </Link>
        )}
      </div>
    </div>
  );
}
