"use client";

import { useState } from "react";
import { useBrands } from "@/lib/hooks";
import { resolveImageUrl } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ChevronRight, Crown, Star, Package } from "lucide-react";

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
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
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
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </Link>
      ))}
    </div>
  );
}
