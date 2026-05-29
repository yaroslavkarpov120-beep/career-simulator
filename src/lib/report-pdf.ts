import type { SavedSimulation } from "./schemas";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Opens browser print dialog — user saves as PDF. No server deps. */
export function printSimulationReport(
  saved: SavedSimulation,
  labels: {
    title: string;
    disclaimer: string;
    region: string;
    age: string;
    aiRisk: string;
  }
): void {
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(labels.title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; color: #111; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .muted { color: #555; font-size: 0.85rem; }
    .prof { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #ddd; }
    .prof h2 { font-size: 1.1rem; margin: 0 0 0.5rem; }
    .risk { font-weight: bold; }
    @media print { body { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(labels.title)}</h1>
  <p class="muted">${escapeHtml(labels.disclaimer)}</p>
  <p class="muted">${escapeHtml(labels.region)} · ${escapeHtml(labels.age)}</p>
  ${saved.result.professions
    .map(
      (p, i) => `
  <div class="prof">
    <h2>${i + 1}. ${escapeHtml(p.title)}</h2>
    <p>${escapeHtml(String(p.salary_min))}–${escapeHtml(String(p.salary_max))} ${escapeHtml(p.currency)}</p>
    <p class="risk">${escapeHtml(labels.aiRisk)}: ${p.ai_risk_percent}%</p>
    <p>${escapeHtml(p.match_reason)}</p>
    <p class="muted">${escapeHtml(p.ai_risk_explanation)}</p>
  </div>`
    )
    .join("")}
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;

  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    alert("Allow pop-ups to download PDF");
    return;
  }
  w.document.write(html);
  w.document.close();
}
