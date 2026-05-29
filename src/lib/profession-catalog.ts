import { z } from "zod";
import { dayEventSchema, roadmapItemSchema } from "./schemas";

export const professionCategorySchema = z.enum([
  "it",
  "medicine",
  "creative",
  "engineering",
  "business",
  "education",
  "law",
  "trades",
  "hospitality",
  "media",
  "science",
  "public",
  "sports",
]);

export type ProfessionCategory = z.infer<typeof professionCategorySchema>;

export const professionTagsSchema = z.object({
  interests: z.array(z.string()).default([]),
  skills: z.array(z.string()).optional().default([]),
  avoidPenalties: z.record(z.string(), z.number()).optional().default({}),
  stages: z.array(z.string()).optional().default([]),
  lifestyle: z.array(z.string()).optional().default([]),
});

export const professionSeedSchema = z.object({
  id: z.string().min(1),
  title: z.object({ ru: z.string(), en: z.string() }),
  category: professionCategorySchema,
  tags: professionTagsSchema,
  salaryBase: z.object({ min: z.number(), max: z.number() }),
  ai_risk_percent: z.number().min(0).max(100),
  featured: z.boolean().optional(),
});

export type ProfessionSeed = z.infer<typeof professionSeedSchema>;

export const professionLocaleContentSchema = z.object({
  summary: z.string(),
  timing: z.string(),
  ai_risk_explanation: z.string(),
  day_timeline: z.array(dayEventSchema).min(5),
  roadmap: z.array(roadmapItemSchema).min(5),
});

export type ProfessionLocaleContent = z.infer<typeof professionLocaleContentSchema>;

export const professionCatalogEntrySchema = z.object({
  id: z.string(),
  title: z.object({ ru: z.string(), en: z.string() }),
  category: professionCategorySchema,
  tags: professionTagsSchema,
  salaryBase: z.object({ min: z.number(), max: z.number() }),
  ai_risk_percent: z.number(),
  featured: z.boolean().optional(),
  locales: z
    .object({
      ru: professionLocaleContentSchema,
      en: professionLocaleContentSchema,
    })
    .passthrough(),
});

export type ProfessionCatalogEntry = z.infer<typeof professionCatalogEntrySchema>;

export const professionCatalogSchema = z.object({
  version: z.number(),
  generated_at: z.string(),
  count: z.number(),
  professions: z.array(professionCatalogEntrySchema),
});

export type ProfessionCatalog = z.infer<typeof professionCatalogSchema>;

export const professionIndexEntrySchema = z.object({
  id: z.string(),
  title: z.object({ ru: z.string(), en: z.string() }),
  category: professionCategorySchema,
  ai_risk_percent: z.number(),
  salaryBase: z.object({ min: z.number(), max: z.number() }),
  featured: z.boolean().optional(),
});

export const professionIndexSchema = z.object({
  version: z.number(),
  count: z.number(),
  professions: z.array(professionIndexEntrySchema),
});

export type ProfessionIndexEntry = z.infer<typeof professionIndexEntrySchema>;

export const FEATURED_PROFESSION_IDS = [
  "data-analyst",
  "ux-designer",
  "product-manager",
  "game-developer",
  "marketing-manager",
  "nurse",
  "software-engineer",
  "content-creator",
  "teacher",
  "psychologist",
] as const;
