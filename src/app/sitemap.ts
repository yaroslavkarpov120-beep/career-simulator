import type { MetadataRoute } from "next";
import { ALL_PROFESSION_IDS, getFeaturedIds } from "@/lib/professions-loader";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3456";

export default function sitemap(): MetadataRoute.Sitemap {
  const root = base.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/simulate",
    "/demo",
    "/professions",
    "/premium",
    "/b2b",
    "/privacy",
    "/terms",
    "/about",
  ];
  const featuredSet = new Set(getFeaturedIds());
  return [
    ...staticRoutes.map((path) => ({
      url: `${root}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...ALL_PROFESSION_IDS.map((id) => ({
      url: `${root}/profession/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: featuredSet.has(id) ? 0.65 : 0.5,
    })),
  ];
}
