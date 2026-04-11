import type { Metadata } from "next";
import { categoriesApi } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

// Static category metadata for common categories
const CATEGORY_META: Record<
  string,
  { titleSuffix: string; descriptionTemplate: string }
> = {
  sunglasses: {
    titleSuffix: "Designer Sunglasses",
    descriptionTemplate:
      "Shop designer sunglasses from the world's most coveted brands. UV protection, free UK delivery, 30-day returns.",
  },
  aviator: {
    titleSuffix: "Aviator Sunglasses",
    descriptionTemplate:
      "Timeless teardrop aviator sunglasses. Classic style with modern UV protection. Free UK delivery.",
  },
  "cat-eye": {
    titleSuffix: "Cat-Eye Sunglasses",
    descriptionTemplate:
      "Vintage-inspired cat-eye sunglasses with upswept frames. Dramatic flair and feminine sophistication.",
  },
  round: {
    titleSuffix: "Round Sunglasses & Eyewear",
    descriptionTemplate:
      "Circular round frame sunglasses with intellectual charm. Retro style for every face shape.",
  },
  wayfarer: {
    titleSuffix: "Wayfarer Sunglasses",
    descriptionTemplate:
      "Iconic wayfarer sunglasses with trapezoidal frames. Casual elegance and timeless style.",
  },
  square: {
    titleSuffix: "Square Frame Sunglasses",
    descriptionTemplate:
      "Angular square frame sunglasses conveying confidence and modern sensibility. Designer eyewear.",
  },
  rectangular: {
    titleSuffix: "Rectangular Sunglasses",
    descriptionTemplate:
      "Clean, proportioned rectangular frames with understated elegance. Professional and versatile.",
  },
  oversized: {
    titleSuffix: "Oversized Sunglasses",
    descriptionTemplate:
      "Generously proportioned oversized sunglasses that command attention. Maximum coverage and style.",
  },
  optical: {
    titleSuffix: "Optical Eyeglasses",
    descriptionTemplate:
      "Prescription-ready optical frames combining clarity with designer style. Quality eyewear.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  try {
    const { product_category } = await categoriesApi.getByHandle(params.handle);

    const meta = CATEGORY_META[params.handle.toLowerCase()];
    const categoryName = product_category.name;

    const title = meta
      ? `${meta.titleSuffix} | Vernont`
      : `${categoryName} | Designer Eyewear | Vernont`;

    const description =
      product_category.description ||
      meta?.descriptionTemplate ||
      `Shop ${categoryName.toLowerCase()} from top designer brands. Curated collection with free UK delivery and 30-day returns.`;

    const canonicalUrl = `${SITE_URL}/category/${params.handle}`;

    return {
      title,
      description,
      keywords: [
        categoryName,
        `${categoryName} sunglasses`,
        `designer ${categoryName}`,
        "luxury eyewear",
        "UV protection",
        "designer sunglasses UK",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Vernont",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    // Fallback metadata if category fetch fails
    const formattedHandle = params.handle
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${formattedHandle} | Vernont`,
      description: `Shop ${formattedHandle.toLowerCase()} eyewear at Vernont.`,
      alternates: {
        canonical: `${SITE_URL}/category/${params.handle}`,
      },
    };
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
