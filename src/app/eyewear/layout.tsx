import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Designer Eyewear | Sunglasses & Optical Frames | Vernont",
  description: "Explore our curated collection of designer sunglasses and optical frames from Miu Miu, Maui Jim, Ray-Ban & more. Free UK delivery, 30-day returns, authentic designer eyewear.",
  keywords: ["designer eyewear", "luxury sunglasses", "optical frames", "designer glasses UK", "Miu Miu", "Maui Jim", "Ray-Ban", "polarized sunglasses"],
  openGraph: {
    title: "Shop Designer Eyewear | Sunglasses & Optical Frames | Vernont",
    description: "Explore our curated collection of designer sunglasses and optical frames from Miu Miu, Maui Jim, Ray-Ban & more. Free UK delivery, 30-day returns, authentic designer eyewear.",
  },
};

export default function EyewearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
