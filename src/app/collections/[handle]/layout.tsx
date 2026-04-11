import type { Metadata } from "next";
import { collectionsApi } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  try {
    const { collection } = await collectionsApi.getByHandle(params.handle);

    const title = `${collection.title} Collection | Designer Eyewear | Vernont`;
    const description =
      collection.description ||
      `Explore the ${collection.title} collection at Vernont. Curated designer eyewear with free UK delivery and 30-day returns.`;

    const canonicalUrl = `${SITE_URL}/collections/${params.handle}`;

    return {
      title,
      description,
      keywords: [
        collection.title,
        `${collection.title} collection`,
        "designer sunglasses",
        "luxury eyewear",
        "curated eyewear collection",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Vernont",
        type: "website",
        images: collection.thumbnail
          ? [
              {
                url: collection.thumbnail,
                alt: `${collection.title} collection`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: collection.thumbnail ? [collection.thumbnail] : undefined,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    // Fallback metadata if collection fetch fails
    const formattedHandle = params.handle
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${formattedHandle} Collection | Vernont`,
      description: `Explore the ${formattedHandle} collection at Vernont.`,
      alternates: {
        canonical: `${SITE_URL}/collections/${params.handle}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
