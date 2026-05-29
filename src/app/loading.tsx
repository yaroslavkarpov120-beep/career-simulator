export default function Loading() {
  return (
    <div
      className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center"
      style={{ minHeight: "40vh" }}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-brand-400 border-t-transparent"
        aria-hidden
      />
      <p className="mt-4 text-sm text-[#8b9cb3]">Загрузка Career Simulator…</p>
    </div>
  );
}
