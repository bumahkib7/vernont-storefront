"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useProducts, useCategories, useBrands } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { useCompare } from "@/context/CompareContext";
import {
  Star,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { content } from "@/config/vertical";
import { AiProductFinder } from "@/components/ai/ai-product-finder";

const FRAME_SHAPES = content.shopBySection.items;

export default function Home() {
  const { data: productsData, isLoading } = useProducts({ limit: 12 });
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();
  const { openDrawer } = useCompare();

  const totalProducts = productsData?.total ?? 0;
  const totalBrands = brandsData?.brands?.length ?? 0;

  // Build dynamic categories from API with first product as image
  const topCategories = categoriesData?.product_categories
    ?.filter((c) => !c.parent_category_id && c.is_active !== false)
    ?.slice(0, 6) ?? [];

  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const displayProducts = productsData?.items ? transformProducts(productsData.items) : [];
  const bestSellers = displayProducts.slice(0, 8);
  const newArrivals = displayProducts.slice(4, 12);

  const toggleShape = (shape: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  const scrollProducts = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main>
        {/* Hero Section - Clean, Editorial Style */}
        <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
          <div className="max-w-[1500px] mx-auto">
            <div className="grid lg:grid-cols-2 min-h-[85vh]">
              {/* Left: Content */}
              <div className="relative flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-24">
                {content.hero.backgroundImage && (
                  <>
                    <Image
                      src={content.hero.backgroundImage}
                      alt=""
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </>
                )}
                <div className="relative z-10">
                  <p className="text-sm tracking-[0.2em] text-white/60 uppercase mb-6">
                    {content.hero.subtitle}
                  </p>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.1]">
                    {content.hero.headline}
                    <span className="block font-medium">{content.hero.headlineAccent}</span>
                  </h1>
                  <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
                    {totalProducts > 0 && totalBrands > 0
                      ? `Discover ${totalProducts}+ designer frames from ${totalBrands}+ brands. Complimentary cleaning kit with every order.`
                      : content.hero.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-12">
                    <Link
                      href={content.hero.primaryCta.href}
                      className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black uppercase tracking-widest text-sm font-medium rounded-sm hover:bg-white/90 transition-colors"
                    >
                      {content.hero.primaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={content.hero.secondaryCta.href}
                      className="inline-flex items-center gap-2 px-10 py-4 border border-white/30 text-white uppercase tracking-widest text-sm font-medium rounded-sm hover:bg-white/10 transition-colors"
                    >
                      {content.hero.secondaryCta.label}
                    </Link>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/50">
                    {content.trustBadges.slice(0, 3).map((badge) => (
                      <span key={badge.label} className="flex items-center gap-2">
                        <badge.icon className="h-4 w-4" /> {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Image Grid */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
                  {displayProducts.slice(0, 4).map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.handle || product.id}`}
                      className={`relative overflow-hidden group ${
                        index === 0 ? 'row-span-2' : ''
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-medium truncate">{product.name}</p>
                        <p className="text-white/70 text-sm">£{Math.round(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Band */}
        <section className="py-4 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="max-w-[1500px] mx-auto px-6">
            <div className="flex justify-center lg:justify-between items-center gap-8 text-sm">
              {content.trustBand.map((item, i) => {
                const visibility = i === 0 ? "" : i === 1 ? "hidden sm:flex" : i === 2 ? "hidden md:flex" : "hidden lg:flex";
                return (
                  <div key={item.label} className={`${visibility} ${i === 0 ? "flex" : ""} items-center gap-2`}>
                    <item.icon className={`h-4 w-4 ${i === 0 ? "text-green-600" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-20 lg:py-28 px-6 lg:px-20">
          <div className="max-w-[1500px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium">Best Sellers</h2>
                <p className="text-[var(--muted-foreground)] mt-1">Our most loved frames</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollProducts('bestsellers-scroll', 'left')}
                  className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollProducts('bestsellers-scroll', 'right')}
                  className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <Link
                  href="/eyewear?sort=bestselling"
                  className="hidden sm:flex items-center gap-1 ml-4 text-sm font-medium hover:underline"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div
              id="bestsellers-scroll"
              className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x"
            >
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[260px] aspect-[3/4] bg-[var(--surface)] animate-pulse rounded-lg" />
                  ))
                : bestSellers.map((product, index) => (
                    <div key={product.id} className="flex-shrink-0 w-[260px] snap-start">
                      <EnhancedProductCard product={product} index={index} />
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* AI Product Finder */}
        <section className="py-20 lg:py-28 px-6 lg:px-20 bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="max-w-[1500px] mx-auto">
            <AiProductFinder />
          </div>
        </section>

        {/* Shop by Category */}
        {topCategories.length > 0 && (
          <section className="py-20 lg:py-28 px-6 lg:px-20">
            <div className="max-w-[1500px] mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-medium">Shop by Category</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {topCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.handle}`}
                    className="group relative aspect-[3/4] overflow-hidden bg-neutral-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 group-hover:from-black/50 transition-colors z-10" />
                    <div className="absolute inset-0 flex items-end p-4 z-20">
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Shop by Frame Shape */}
        <section className="py-20 lg:py-28 px-6 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium mb-3">{content.shopBySection.title}</h2>
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
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

        {/* New Arrivals */}
        <section className="py-20 lg:py-28 px-6 lg:px-20 border-t border-[var(--border)]">
          <div className="max-w-[1500px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium">New Arrivals</h2>
                <p className="text-[var(--muted-foreground)] mt-1">Fresh additions to our collection</p>
              </div>
              <Link
                href="/eyewear?sort=newest"
                className="flex items-center gap-1 text-sm font-medium hover:underline"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-20 lg:py-28 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-medium tracking-wide uppercase text-[var(--muted-foreground)] mb-2">What Our Customers Say</p>
            </div>

            {/* Testimonial */}
            <div className="bg-transparent border border-[var(--border)] p-8 lg:p-10 text-center relative">
              <div className="min-h-[120px] flex items-center justify-center">
                <div key={currentTestimonial}>
                  <p className="text-2xl lg:text-3xl font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                    "{TESTIMONIALS[currentTestimonial].text}"
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{TESTIMONIALS[currentTestimonial].author}</span>
                    <span className="text-[var(--muted-foreground)]"> — {TESTIMONIALS[currentTestimonial].location}</span>
                  </p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? "bg-[var(--foreground)]"
                        : "bg-[var(--border)]"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="/reviews" className="text-sm font-medium hover:underline">
                Read All Reviews
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 lg:py-28 px-6 lg:px-20 bg-[#0a0a0a] text-white">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-medium mb-3">
              {content.newsletterCta.headline}
            </h2>
            <p className="text-white/60 mb-8">
              {content.newsletterCta.description}
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 rounded-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors whitespace-nowrap rounded-sm"
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
