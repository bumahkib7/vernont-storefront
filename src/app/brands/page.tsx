"use client";

import { useState } from "react";
import { useBrands } from "@/lib/hooks";
import { resolveImageUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { SpinnerGap, CaretRight, Crown, Star, Package } from "@/components/icons";

const TIER_CONFIG: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  LUXURY: { label: "Luxury", icon: Crown, color: "text-amber-600" },
  PREMIUM: { label: "Premium", icon: Star, color: "text-indigo-600" },
  STANDARD: { label: "Standard", icon: Package, color: "text-neutral-500" },
};

export default function BrandsPage() {
  const { data, isLoading } = useBrands();
  const [viewMode, setViewMode] = useState<"tier" | "alpha">("tier");

  const brands = data?.brands ?? [];

  const groupedByTier = {
    LUXURY: brands.filter((b) => b.tier === "LUXURY"),
    PREMIUM: brands.filter((b) => b.tier === "PREMIUM"),
    STANDARD: brands.filter((b) => b.tier === "STANDARD"),
  };

  const groupedByAlpha = brands.reduce<Record<string, typeof brands>>((acc, brand) => {
    const letter = brand.name[0]?.toUpperCase() || "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(brand);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerGap className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Our Brands
          </h1>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            {brands.length > 0
              ? `Explore ${brands.length} curated brands across luxury, premium, and contemporary collections.`
              : "Discover our curated selection of brands."}
          </p>

          {/* View toggle */}
          <div className="mt-8 inline-flex border border-neutral-200 rounded-full overflow-hidden">
            <button
              onClick={() => setViewMode("tier")}
              className={`px-5 py-2 text-xs uppercase tracking-wider transition-colors ${
                viewMode === "tier"
                  ? "bg-black text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              By Tier
            </button>
            <button
              onClick={() => setViewMode("alpha")}
              className={`px-5 py-2 text-xs uppercase tracking-wider transition-colors ${
                viewMode === "alpha"
                  ? "bg-black text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              A-Z
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b border-neutral-200">
        <div className="prose max-w-none">
          <div className="mb-8">
            <p className="text-[15px] leading-relaxed text-neutral-700 mb-4">
              Welcome to Vernont's comprehensive collection of designer eyewear brands. From iconic luxury labels like Miu Miu and Gucci to innovative sports performance brands like Oakley and Maui Jim, our carefully curated selection represents the pinnacle of optical craftsmanship. Each brand in our collection has been chosen for its commitment to quality, design innovation, and heritage in the eyewear industry.
            </p>
            <p className="text-[15px] leading-relaxed text-neutral-700">
              Whether you're seeking timeless sophistication from heritage fashion houses, cutting-edge lens technology from sport specialists, or contemporary minimalist aesthetics from emerging designers, you'll find the perfect eyewear brand to match your personal style and lifestyle needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-600" />
                <h2 className="text-[18px] font-semibold text-neutral-900">Luxury Brands</h2>
              </div>
              <p className="text-[14px] text-neutral-700 mb-3">
                Our luxury collection features prestigious fashion houses renowned for exceptional craftsmanship and timeless elegance. These brands represent the highest tier of designer eyewear, combining heritage with contemporary design.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Featured:</strong> Miu Miu, Prada, Gucci, Saint Laurent, Cartier, and other iconic luxury labels known for their distinctive aesthetic and superior materials.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-indigo-600" />
                <h2 className="text-[18px] font-semibold text-neutral-900">Premium Brands</h2>
              </div>
              <p className="text-[14px] text-neutral-700 mb-3">
                Premium eyewear brands that balance exceptional quality with accessible luxury. These labels offer professional-grade optics, innovative lens technologies, and designs that seamlessly transition from casual to formal settings.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Featured:</strong> Ray-Ban, Maui Jim, Persol, Oliver Peoples, and specialized performance brands that deliver outstanding value and reliability.
              </p>
            </div>

            <div className="bg-neutral-100 border border-neutral-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-neutral-600" />
                <h2 className="text-[18px] font-semibold text-neutral-900">Contemporary Brands</h2>
              </div>
              <p className="text-[14px] text-neutral-700 mb-3">
                Modern eyewear brands that prioritize innovation, sustainability, and on-trend designs. Perfect for fashion-forward individuals seeking quality frames at competitive price points.
              </p>
              <p className="text-[13px] text-neutral-600">
                <strong>Featured:</strong> Emerging designers, direct-to-consumer brands, and contemporary labels pushing boundaries in sustainable eyewear production.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[20px] font-semibold text-neutral-900 mb-4">Why Shop Designer Brands at Vernont?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-3 text-[14px] text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>100% Authentic Guarantee</strong> - All brands sourced directly from authorized distributors with complete authenticity certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>Comprehensive Warranty</strong> - Full manufacturer warranties honored on all designer frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>Expert Curation</strong> - Each brand vetted by our optical specialists for quality, innovation, and customer satisfaction</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 text-[14px] text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>Detailed Brand Information</strong> - Explore heritage, design philosophy, and signature technologies for each label</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>Complete Collections</strong> - Access full seasonal ranges from sunglasses to optical frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500 mt-1">✓</span>
                    <span><strong>Personalized Recommendations</strong> - Our team helps match you with brands that suit your style and needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-lg">
            <h2 className="text-[18px] font-semibold text-neutral-900 mb-3">Popular Designer Eyewear Brands by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Best for Fashion</h3>
                <p className="text-neutral-600 text-[13px]">Miu Miu, Gucci, Prada, Celine, Dior</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Best for Sports</h3>
                <p className="text-neutral-600 text-[13px]">Oakley, Maui Jim, Costa Del Mar, Smith</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Best Classic Styles</h3>
                <p className="text-neutral-600 text-[13px]">Ray-Ban, Persol, Oliver Peoples, Warby Parker</p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Best Polarized Tech</h3>
                <p className="text-neutral-600 text-[13px]">Maui Jim, Costa, Oakley, Ray-Ban</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {viewMode === "tier" ? (
          <div className="space-y-16">
            {(["LUXURY", "PREMIUM", "STANDARD"] as const).map((tier) => {
              const tierBrands = groupedByTier[tier];
              if (tierBrands.length === 0) return null;
              const config = TIER_CONFIG[tier];
              const Icon = config.icon;
              return (
                <section key={tier}>
                  <div className="flex items-center gap-3 mb-8">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <h2 className="text-xl font-light tracking-wide">
                      {config.label}
                    </h2>
                    <span className="text-xs text-neutral-400">
                      {tierBrands.length} brand{tierBrands.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <BrandGrid brands={tierBrands} />
                </section>
              );
            })}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(groupedByAlpha)
              .sort()
              .map((letter) => (
                <section key={letter}>
                  <h2 className="text-2xl font-light mb-6 border-b border-neutral-100 pb-2">
                    {letter}
                  </h2>
                  <BrandGrid brands={groupedByAlpha[letter]} />
                </section>
              ))}
          </div>
        )}

        {brands.length === 0 && !isLoading && (
          <p className="text-center text-neutral-500 py-20">
            No brands available yet.
          </p>
        )}
      </div>
    </div>
  );
}

function BrandGrid({ brands }: { brands: Array<{ id: string; name: string; slug: string; description?: string | null; logo_url?: string | null; tier: string; product_count: number }> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/brands/${brand.slug}`}
          className="group border border-neutral-200 rounded-lg p-5 hover:border-black hover:shadow-sm transition-all"
        >
          <div className="aspect-[3/2] relative mb-3 flex items-center justify-center">
            {resolveImageUrl(brand.logo_url) ? (
              <Image
                src={resolveImageUrl(brand.logo_url)!}
                alt={brand.name}
                fill
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-light text-neutral-800 tracking-wide">
                {brand.name}
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium truncate">{brand.name}</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {brand.product_count} product{brand.product_count !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CaretRight className="w-4 h-4 text-neutral-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
