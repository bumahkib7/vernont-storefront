import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

// Static pages that don't change often
const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/fragrances", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/new", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/gifts", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-him", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-her", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/unisex", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/brands", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/shipping", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/returns", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
];

// Fetch all products for sitemap
async function fetchProducts(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (
      data.products?.map((product: any) => ({
        handle: product.handle || product.id,
        updatedAt: product.updated_at || new Date().toISOString(),
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return [];
  }
}

// Fetch all collections/categories for sitemap
async function fetchCollections(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/collections?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (
      data.collections?.map((collection: any) => ({
        handle: collection.handle || collection.id,
        updatedAt: collection.updated_at || new Date().toISOString(),
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch collections for sitemap:", error);
    return [];
  }
}

// Fetch all brands for sitemap
async function fetchBrands(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/categories?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    // Filter for brand categories only
    const brands =
      data.categories?.filter(
        (cat: any) =>
          cat.parent_category_id === null ||
          cat.handle?.startsWith("brand-") ||
          cat.metadata?.type === "brand"
      ) || [];
    return brands.map((brand: any) => ({
      handle: brand.handle || brand.id,
      updatedAt: brand.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch brands for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Fetch dynamic content in parallel
  const [products, collections, brands] = await Promise.all([
    fetchProducts(),
    fetchCollections(),
    fetchBrands(),
  ]);

  // Build sitemap entries
  const entries: MetadataRoute.Sitemap = [];

  // Add static pages
  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Add product pages
  for (const product of products) {
    entries.push({
      url: `${BASE_URL}/product/${product.handle}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Add collection pages
  for (const collection of collections) {
    entries.push({
      url: `${BASE_URL}/collections/${collection.handle}`,
      lastModified: collection.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Add brand pages
  for (const brand of brands) {
    entries.push({
      url: `${BASE_URL}/brands/${brand.handle}`,
      lastModified: brand.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
