import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

export const metadata: Metadata = {
  title: "Shop Designer Eyewear | Sunglasses & Optical Frames | Vernont",
  description: "Explore our curated collection of designer sunglasses and optical frames from Miu Miu, Maui Jim, Ray-Ban & more. Free UK delivery, 30-day returns, authentic designer eyewear.",
  keywords: [
    "designer eyewear",
    "luxury sunglasses",
    "optical frames",
    "designer glasses UK",
    "Miu Miu",
    "Maui Jim",
    "Ray-Ban",
    "polarized sunglasses",
    "authentic designer eyewear",
    "prescription glasses",
  ],
  openGraph: {
    title: "Shop Designer Eyewear | Sunglasses & Optical Frames | Vernont",
    description: "Explore our curated collection of designer sunglasses and optical frames from Miu Miu, Maui Jim, Ray-Ban & more. Free UK delivery, 30-day returns, authentic designer eyewear.",
    url: `${SITE_URL}/eyewear`,
    siteName: "Vernont",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Designer Eyewear | Sunglasses & Optical Frames | Vernont",
    description: "Explore our curated collection of designer sunglasses and optical frames from Miu Miu, Maui Jim, Ray-Ban & more. Free UK delivery, 30-day returns, authentic designer eyewear.",
  },
  alternates: {
    canonical: `${SITE_URL}/eyewear`,
  },
};

export default function EyewearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
