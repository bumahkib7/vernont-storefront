import type { Metadata } from "next";
import { brandsApi } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { brand } = await brandsApi.getBySlug(params.slug);

    const title = `${brand.name} Sunglasses & Eyewear | Vernont`;
    const description = brand.description
      ? `${brand.description} Shop authentic ${brand.name} eyewear at Vernont. Free UK delivery, 30-day returns.`
      : `Shop authentic ${brand.name} sunglasses and eyewear at Vernont. Discover our curated collection with free UK delivery and 30-day returns.`;

    const canonicalUrl = `${SITE_URL}/brands/${params.slug}`;

    return {
      title,
      description,
      keywords: [
        brand.name,
        `${brand.name} sunglasses`,
        `${brand.name} eyewear`,
        "designer sunglasses",
        "luxury eyewear",
        "authentic designer glasses",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Vernont",
        type: "website",
        images: brand.logo_url
          ? [
              {
                url: brand.logo_url,
                alt: `${brand.name} logo`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: brand.logo_url ? [brand.logo_url] : undefined,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    // Fallback metadata if brand fetch fails
    return {
      title: "Brand Not Found | Vernont",
      description: "The brand you're looking for is not available.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
