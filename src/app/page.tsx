"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { BrandSpotlight, type SpotlightCard } from "@/components/BrandSpotlight";
import { ServicesGrid } from "@/components/ServicesGrid";
import { useProducts, useCategories, useBrands } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { ArrowRight } from "lucide-react";
import { content } from "@/config/vertical";
import { AiProductFinder } from "@/components/ai/ai-product-finder";
import { getCollectionImage } from "@/lib/collection-images";

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&q=80",
    headline: "Most-Loved Styles",
    subtext: "The frames at the top of our wish-lists.",
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
    title: "Jacques Marie Mage",
    description: "Handcrafted artisan eyewear. Limited edition frames for the discerning collector.",
    cta: { label: "Shop Now", href: "/brands/jacques-marie-mage" },
  },
  {
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1200&q=80",
    title: "New Arrivals",
    description: "The latest additions to our curated collection of designer frames.",
    cta: { label: "Explore", href: "/eyewear?sort=newest" },
  },
];

const FRAME_SHAPES = content.shopBySection.items;

export default function Home() {
  const { data: productsData, isLoading } = useProducts({ limit: 16 });
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const topCategories = categoriesData?.product_categories
    ?.filter((c) => !c.parent_category_id && c.is_active !== false)
    ?.slice(0, 6) ?? [];

  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const displayProducts = productsData?.items ? transformProducts(productsData.items) : [];
  const bestSellers = displayProducts.slice(0, 10);
  const newArrivals = displayProducts.slice(4, 12);

  const toggleShape = (shape: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main>
        {/* 1. Hero Carousel */}
        <HeroCarousel slides={HERO_SLIDES} />

        {/* 2. Bestselling Product Carousel */}
        <ProductCarousel
          title="Best Sellers"
          subtitle="Shop a selection of our most-loved frames."
          viewAllHref="/eyewear?sort=bestselling"
          products={bestSellers}
          isLoading={isLoading}
        />

        {/* 3. Brand Spotlight */}
        <BrandSpotlight cards={SPOTLIGHT_CARDS} />

        {/* 4. Shop by Category */}
        {topCategories.length > 0 && (
          <section className="py-16 lg:py-24 px-6 lg:px-20">
            <div className="max-w-[1500px] mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-medium tracking-tight">Shop by Category</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {topCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.handle}`}
                    className="group relative aspect-[3/4] overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={getCollectionImage(category.handle, index, category.image)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 group-hover:from-black/50 transition-colors z-10" />
                    <div className="absolute inset-0 flex items-end p-4 z-20">
                      <div>
                        <span className="text-white font-medium block">{category.name}</span>
                        {category.product_count != null && category.product_count > 0 && (
                          <span className="text-white/60 text-xs">{category.product_count} items</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. AI Product Finder */}
        <section className="py-16 lg:py-24 px-6 lg:px-20 bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="max-w-[1500px] mx-auto">
            <AiProductFinder />
          </div>
        </section>

        {/* 6. Shop by Frame Shape */}
        <section className="py-16 lg:py-24 px-6 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium tracking-tight mb-3">
              {content.shopBySection.title}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              {content.shopBySection.description}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {FRAME_SHAPES.map((shape) => (
                <button
                  key={shape}
                  onClick={() => toggleShape(shape)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    selectedShapes.includes(shape)
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>

            {selectedShapes.length > 0 && (
              <div className="space-y-3">
                <Link
                  href={content.shopBySection.buildUrl(selectedShapes)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Show Results
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setSelectedShapes([])}
                  className="block mx-auto text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 7. New Arrivals Grid */}
        <section className="py-16 lg:py-24 px-6 lg:px-20 border-t border-[var(--border)]">
          <div className="max-w-[1500px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium tracking-tight">New Arrivals</h2>
                <p className="text-[var(--muted-foreground)] mt-1">Fresh additions to our collection</p>
              </div>
              <Link
                href="/eyewear?sort=newest"
                className="hidden sm:inline-flex items-center text-sm font-medium underline underline-offset-4 hover:no-underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Services Grid */}
        <ServicesGrid />

        {/* 9. Newsletter */}
        <section className="py-16 lg:py-24 px-6 lg:px-20 bg-[#0a0a0a] text-white">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium tracking-tight mb-3">
              {content.newsletterCta.headline}
            </h2>
            <p className="text-white/60 mb-8">
              {content.newsletterCta.description}
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-xs text-white/40 mt-4">
              Unsubscribe anytime. No spam.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
