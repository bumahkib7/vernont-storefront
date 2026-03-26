"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { BrandSpotlight, type SpotlightCard } from "@/components/BrandSpotlight";
import { BrandsGrid } from "@/components/BrandsGrid";
import { useProducts, useBrands } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&q=80",
    headline: "Most-Loved Styles",
    subtext: "The shades at the top of our wish-lists.",
    ctas: [
      { label: "For Her", href: "/eyewear?category=women", variant: "primary" },
      { label: "For Him", href: "/eyewear?category=men", variant: "secondary" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&q=80",
    headline: "New Season, New Frames",
    subtext: "Discover the latest arrivals from the world's best designers.",
    ctas: [
      { label: "Shop New Arrivals", href: "/eyewear?sort=newest", variant: "primary" },
      { label: "Explore Brands", href: "/brands", variant: "secondary" },
    ],
  },
  {
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1920&q=80",
    headline: "Pre-Owned Luxury",
    subtext: "Authenticated designer eyewear at exceptional value.",
    ctas: [
      { label: "Shop Pre-Owned", href: "/pre-owned", variant: "primary" },
    ],
  },
];

const SPOTLIGHT_CARDS: SpotlightCard[] = [
  {
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1200&q=80",
    title: "Costa: See what\u2019s out there",
    description: "Built for elevated coastal adventures on and off the water. Discover the exclusive colorway.",
    cta: { label: "Shop Now", href: "/brands/costa" },
  },
  {
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&q=80",
    title: "Michael Kors Spring/Summer 2026",
    description: "New eyewear offers a modern point of view on style.",
    cta: { label: "Shop Now", href: "/brands/michael-kors" },
  },
];

export default function Home() {
  const { data: productsData, isLoading } = useProducts({ limit: 12 });
  const { data: brandsData } = useBrands();

  const displayProducts = productsData?.items ? transformProducts(productsData.items) : [];
  const bestSellers = displayProducts.slice(0, 12);

  const brandsList = brandsData?.brands?.map((b: { name: string; handle?: string; id: string }) => ({
    name: b.name,
    slug: b.handle || b.id,
  })) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* 1. Hero Carousel */}
        <HeroCarousel slides={HERO_SLIDES} />

        {/* 2. Bestselling Products — SGH-style flat grid */}
        <ProductCarousel
          title="Bestselling shades"
          subtitle="Shop a selection of bestselling shades."
          viewAllHref="/eyewear?sort=bestselling"
          products={bestSellers}
          isLoading={isLoading}
        />

        {/* 3. Shop by Brands — SGH-style bordered grid */}
        <BrandsGrid brands={brandsList} />

        {/* 4. Brand Spotlight — SGH-style 2-col with text below */}
        <BrandSpotlight cards={SPOTLIGHT_CARDS} />
      </main>

      <Footer />
    </div>
  );
}
