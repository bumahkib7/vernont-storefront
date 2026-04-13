import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const revalidate = 300; // 5 min — short so sitemap updates propagate quickly

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/eyewear", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/new", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/pre-owned", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/gifts", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-him", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-her", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/unisex", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/brands", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/craftsmanship", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/press", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/size-guide", priority: 0.6, changeFrequency: "monthly" as const },

  { url: "/collections", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/search", priority: 0.6, changeFrequency: "daily" as const },
  { url: "/return-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/sustainability", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/try-on", priority: 0.2, changeFrequency: "yearly" as const },
  { url: "/shipping", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/returns", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
];

interface SitemapEntry {
  path: string;
  lastModified: string | null;
  priority: number;
  changeFrequency: string;
}

interface SitemapData {
  products: SitemapEntry[];
  collections: SitemapEntry[];
  categories: SitemapEntry[];
  brands: SitemapEntry[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const response = await fetch(`${API_URL}/store/seo/sitemap`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("Failed to fetch sitemap data:", response.status);
      return entries;
    }

    const data: SitemapData = await response.json();

    const allEntries = [
      ...data.products,
      ...data.collections,
      ...data.categories,
      ...data.brands,
    ];

    for (const entry of allEntries) {
      entries.push({
        url: `${BASE_URL}${entry.path}`,
        lastModified: entry.lastModified || now,
        changeFrequency: entry.changeFrequency as any,
        priority: entry.priority,
      });
    }
  } catch (error) {
    console.error("Failed to fetch sitemap data from backend:", error);
  }

  return entries;
}
