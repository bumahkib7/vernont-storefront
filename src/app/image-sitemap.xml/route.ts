import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Revalidate the image sitemap every hour. Product images change far less
// frequently than stock/price so a long TTL keeps this endpoint cheap.
export const revalidate = 3600;

interface StorefrontProduct {
  handle: string;
  title: string;
  thumbnail?: string | null;
  imageUrls?: string[] | null;
  images?: string[] | null;
}

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/0.9"></urlset>`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlEntry(product: StorefrontProduct): string | null {
  if (!product?.handle) return null;
  const loc = `${BASE_URL}/product/${product.handle}`;

  // Accept either `imageUrls` (spec) or `images` (existing ProductSeoData
  // shape) so the route stays resilient to backend shape drift.
  const rawImages: (string | null | undefined)[] = [
    product.thumbnail,
    ...(product.imageUrls ?? []),
    ...(product.images ?? []),
  ];
  const images = Array.from(
    new Set(rawImages.filter((img): img is string => typeof img === "string" && img.length > 0)),
  );

  if (images.length === 0) {
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
  }

  const title = product.title ?? "";
  const imageXml = images
    .map(
      (img) =>
        `    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n      <image:title>${escapeXml(title)}</image:title>\n    </image:image>`,
    )
    .join("\n");

  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${imageXml}\n  </url>`;
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/storefront/products?size=500`, {
      next: { revalidate: 3600, tags: ["products"] },
    });

    if (!res.ok) {
      return new NextResponse(EMPTY_SITEMAP, {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      });
    }

    const data = (await res.json()) as { items?: StorefrontProduct[] };
    const items: StorefrontProduct[] = Array.isArray(data?.items) ? data.items : [];

    const urlEntries = items
      .map(buildUrlEntry)
      .filter((entry): entry is string => entry !== null);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/0.9">
${urlEntries.join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("image-sitemap error", err);
    return new NextResponse(EMPTY_SITEMAP, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  }
}
