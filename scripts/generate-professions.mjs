#!/usr/bin/env node
/**
 * Optional LLM enrichment for professions.json (requires OPENAI_API_KEY).
 * Usage:
 *   node scripts/generate-professions.mjs
 *   node scripts/generate-professions.mjs --featured
 *   node scripts/generate-professions.mjs --ids=software-engineer,data-analyst
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "src", "data", "professions.json");
const INDEX_PATH = path.join(ROOT, "src", "data", "professions-index.json");
const BATCH = 8;
const FEATURED_LIMIT = 50;

const args = process.argv.slice(2);
const featuredOnly = args.includes("--featured");
const idsArg = args.find((a) => a.startsWith("--ids="));
const filterIds = idsArg
  ? new Set(idsArg.replace("--ids=", "").split(",").map((s) => s.trim()).filter(Boolean))
  : null;

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.log("OPENAI_API_KEY not set. Skipping LLM enrich.");
  console.log("Run with key: OPENAI_API_KEY=sk-... npm run generate:featured");
  process.exit(0);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
const featuredIds = index.professions.filter((p) => p.featured).map((p) => p.id);

function needsEnrichment(entry) {
  const ru = entry.locales?.ru;
  if (!ru) return true;
  return ru.day_timeline?.[0]?.activity?.includes("Проверка задач");
}

let pool = catalog.professions.filter(needsEnrichment);

if (filterIds) {
  pool = pool.filter((p) => filterIds.has(p.id));
} else if (featuredOnly) {
  pool = pool.filter((p) => featuredIds.includes(p.id)).slice(0, FEATURED_LIMIT);
}

const pending = pool;
if (pending.length === 0) {
  console.log("All matching professions already enriched.");
  process.exit(0);
}

console.log(`Enriching ${pending.length} professions via OpenAI…`);

async function enrichBatch(batch) {
  const ids = batch.map((p) => p.id).join(", ");
  const body = {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Return JSON { "professions": [ ... ] } with one object per id: ${ids}.
Each: id, locales.ru and locales.en with summary (2 sentences), timing (with {age} and {stageLabel}), ai_risk_explanation, day_timeline (6 items), roadmap (6 items).
Teen career simulator ages 15-22. Realistic tone.`,
      },
      {
        role: "user",
        content: JSON.stringify(
          batch.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            ai_risk_percent: p.ai_risk_percent,
          }))
        ),
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");
  return JSON.parse(content).professions;
}

for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  console.log(`Batch ${i / BATCH + 1}: ${batch.map((b) => b.id).join(", ")}`);
  const enriched = await enrichBatch(batch);
  for (const item of enriched) {
    const idx = catalog.professions.findIndex((p) => p.id === item.id);
    if (idx === -1) continue;
    catalog.professions[idx] = {
      ...catalog.professions[idx],
      locales: item.locales,
      enriched: true,
    };
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

console.log("Done.");
