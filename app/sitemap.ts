import type { MetadataRoute } from "next";
import { CATEGORY_ORDER } from "@/lib/game/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cant-maintain.saschb2b.com";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), priority: 0.9 },
    ...CATEGORY_ORDER.map((category) => ({
      url: `${baseUrl}/learn/${category}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
    { url: `${baseUrl}/play`, lastModified: new Date(), priority: 0.7 },
  ];
}
