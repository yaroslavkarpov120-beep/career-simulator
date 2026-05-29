#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const dayEventSchema = z.object({ time: z.string(), activity: z.string() });
const roadmapItemSchema = z.object({
  skill: z.string(),
  months: z.number(),
  first_step: z.string(),
});
const professionLocaleContentSchema = z.object({
  summary: z.string(),
  timing: z.string(),
  ai_risk_explanation: z.string(),
  day_timeline: z.array(dayEventSchema).min(5),
  roadmap: z.array(roadmapItemSchema).min(5),
});
const professionCatalogEntrySchema = z.object({
  id: z.string(),
  title: z.object({ ru: z.string(), en: z.string() }),
  category: z.string(),
  tags: z.object({
    interests: z.array(z.string()),
  }),
  salaryBase: z.object({ min: z.number(), max: z.number() }),
  ai_risk_percent: z.number(),
  locales: z.object({
    ru: professionLocaleContentSchema,
    en: professionLocaleContentSchema,
  }),
});
const professionCatalogSchema = z.object({
  version: z.number(),
  count: z.number(),
  professions: z.array(professionCatalogEntrySchema),
});

const catalogPath = path.join(ROOT, "src", "data", "professions.json");
const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const catalog = professionCatalogSchema.parse(raw);

if (catalog.count < 1000) {
  console.error(`Expected at least 1000 professions, got ${catalog.count}`);
  process.exit(1);
}

const ids = new Set();
for (const p of catalog.professions) {
  if (ids.has(p.id)) {
    console.error(`Duplicate id: ${p.id}`);
    process.exit(1);
  }
  ids.add(p.id);
}

console.log(`OK: ${catalog.professions.length} professions validated`);
