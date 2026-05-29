"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0f14",
          color: "#e8eef4",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, color: "#fb7185" }}>Ошибка приложения</h1>
          <p style={{ marginTop: 16, fontSize: 14, color: "#8b9cb3" }}>
            {error.message || "Не удалось загрузить страницу"}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: "#0d9488",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
