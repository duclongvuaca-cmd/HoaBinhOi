import type { MetadataRoute } from "next";
import { getPois, getItineraries } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://hoabinhoi.vn";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly" as const, priority: 1, lastModified: now },
    { url: `${base}/an`, changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: `${base}/mua`, changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: `${base}/nghi`, changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: `${base}/choi`, changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: `${base}/diem-den`, changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: `${base}/su-kien`, changeFrequency: "weekly" as const, priority: 0.7, lastModified: now },
    { url: `${base}/ban-do`, changeFrequency: "monthly" as const, priority: 0.7, lastModified: now },
    { url: `${base}/hanh-trinh`, changeFrequency: "weekly" as const, priority: 0.9, lastModified: now }
  ];

  const pois = await getPois();
  const itins = await getItineraries();

  const poiUrls: MetadataRoute.Sitemap = pois.map((p) => ({
    url: `${base}/poi/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6
  }));

  const itinUrls: MetadataRoute.Sitemap = itins.map((it) => ({
    url: `${base}/hanh-trinh/${it.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [...staticPages, ...poiUrls, ...itinUrls];
}
