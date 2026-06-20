import { notFound } from "next/navigation";
import { ENGLISH_COURSE, getLevelById, getLessonById } from "@/data/english-course";
import { LessonViewer } from "@/components/english/LessonViewer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ENGLISH_COURSE.flatMap((level) =>
    level.lessons.map((lesson) => ({ level: level.id, lesson: lesson.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; lesson: string }>;
}): Promise<Metadata> {
  const { level: levelId, lesson: lessonId } = await params;
  const lesson = getLessonById(levelId, lessonId);
  const level = getLevelById(levelId);
  if (!lesson || !level) return {};
  return {
    title: `${lesson.title} — ${level.name} ${level.label}`,
    description: `${lesson.titleRu}: грамматика, словарь и упражнения`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ level: string; lesson: string }>;
}) {
  const { level: levelId, lesson: lessonId } = await params;
  const maybeLevel = getLevelById(levelId);
  const maybeLesson = getLessonById(levelId, lessonId);

  if (!maybeLevel || !maybeLesson) notFound();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const level = maybeLevel!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lesson = maybeLesson!;

  const lessonIndex = level.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? level.lessons[lessonIndex - 1] : undefined;
  const nextLesson = lessonIndex < level.lessons.length - 1 ? level.lessons[lessonIndex + 1] : undefined;

  return (
    <LessonViewer
      lesson={lesson}
      level={level}
      prevLessonId={prevLesson?.id}
      nextLessonId={nextLesson?.id}
    />
  );
}
