import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/eyewear", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/new", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/gifts", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-him", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/for-her", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/unisex", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/brands", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/careers", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/craftsmanship", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/press", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/size-guide", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/stores", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/sustainability", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/try-on", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/shipping", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/returns", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
];

async function fetchAllProducts(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  const allProducts: Array<{ handle: string; updatedAt: string }> = [];
  const pageSize = 500;
  let page = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetch(
        `${BACKEND_URL}/storefront/products?size=${pageSize}&page=${page}`,
        { next: { revalidate: 3600 } },
      );
      if (!response.ok) break;
      const data = await response.json();
      const items = data.items || [];
      for (const product of items) {
        allProducts.push({
          handle: product.handle || product.id,
          updatedAt: product.updated_at || new Date().toISOString(),
        });
      }
      const total = data.total || 0;
      page++;
      hasMore = allProducts.length < total && items.length === pageSize;
    }
    return allProducts;
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return allProducts;
  }
}

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

async function fetchCategories(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/product-categories`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (
      data.product_categories?.map((category: any) => ({
        handle: category.handle || category.id,
        updatedAt: category.updated_at || new Date().toISOString(),
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
    return [];
  }
}

async function fetchBrands(): Promise<
  Array<{ handle: string; updatedAt: string }>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/brands?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (
      data.brands?.map((brand: any) => ({
        handle: brand.slug || brand.id,
        updatedAt: new Date().toISOString(),
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch brands for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const [products, collections, categories, brands] = await Promise.all([
    fetchAllProducts(),
    fetchCollections(),
    fetchCategories(),
    fetchBrands(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  for (const product of products) {
    entries.push({
      url: `${BASE_URL}/product/${product.handle}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const collection of collections) {
    entries.push({
      url: `${BASE_URL}/collections/${collection.handle}`,
      lastModified: collection.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${BASE_URL}/categories/${category.handle}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

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
