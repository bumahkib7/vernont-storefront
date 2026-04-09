"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CaretDown, ArrowRight, ArrowSquareOut, Crown, Star, Package } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useBrandBySlug, useProducts } from "@/lib/hooks";
import { resolveImageUrl } from "@/lib/api";
import { transformProducts } from "@/lib/transforms";

const TIER_BADGE: Record<string, { label: string; icon: typeof Crown; className: string }> = {
  LUXURY: { label: "Luxury", icon: Crown, className: "bg-amber-50 text-amber-700 border-amber-200" },
  PREMIUM: { label: "Premium", icon: Star, className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  STANDARD: { label: "Standard", icon: Package, className: "bg-neutral-50 text-neutral-600 border-neutral-200" },
};

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];
  const currentLabel = options.find((o) => o.value === value)?.label || "Featured";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm border border-neutral-200 px-4 py-2 hover:border-neutral-400 transition-colors"
      >
        <span>Sort: {currentLabel}</span>
        <CaretDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[200px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 transition-colors ${
                value === option.value ? "text-black font-medium" : "text-neutral-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrandDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("featured");

  const { data: brandData, isLoading: brandLoading, error: brandError } = useBrandBySlug(slug);
  const brand = brandData?.brand;

  const { data: productsData, isLoading: productsLoading } = useProducts(
    { brandId: brand?.id, limit: 50 },
    { enabled: !!brand?.id }
  );

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const products = transformProducts(productsData.items);
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return products;
    }
  }, [productsData, sortBy]);

  const isLoading = brandLoading || productsLoading;
  const tierConfig = brand ? TIER_BADGE[brand.tier] : null;

  if (brandError && !brandLoading) {
    return (
      <PageLayout>
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Brand Not Found
            </h1>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              The brand you&apos;re looking for doesn&apos;t exist or isn&apos;t available.
            </p>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Browse All Brands
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Brand Hero */}
      <section className="border-b border-neutral-200 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Brand Logo */}
            {resolveImageUrl(brand?.logo_url) && (
              <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0 border border-neutral-100 rounded-lg overflow-hidden bg-white p-4">
                <Image
                  src={resolveImageUrl(brand!.logo_url)!}
                  alt={brand!.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Brand Info */}
            <div className="text-center md:text-left flex-1">
              {brandLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-48 bg-neutral-100 rounded mb-4" />
                  <div className="h-4 w-96 bg-neutral-100 rounded" />
                </div>
              ) : brand ? (
                <>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                      {brand.name}
                    </h1>
                    {tierConfig && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-full ${tierConfig.className}`}>
                        <tierConfig.icon className="w-3 h-3" />
                        {tierConfig.label}
                      </span>
                    )}
                  </div>

                  {brand.description && (
                    <p className="text-neutral-500 max-w-2xl mt-3">
                      {brand.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 justify-center md:justify-start text-sm text-neutral-500">
                    <span>
                      {brand.product_count} product{brand.product_count !== 1 ? "s" : ""}
                    </span>
                    {brand.website_url && (
                      <a
                        href={brand.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-black transition-colors"
                      >
                        Official Website
                        <ArrowSquareOut className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-neutral-500">
            {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""}
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-100" />
                <div className="pt-4 space-y-2">
                  <div className="h-3 w-16 bg-neutral-100" />
                  <div className="h-4 w-32 bg-neutral-100" />
                  <div className="h-4 w-20 bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayProducts.map((product, index) => (
              <ListingProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-500 mb-4">No products available for this brand yet.</p>
            <Link
              href="/eyewear"
              className="inline-flex items-center gap-2 text-sm hover:text-neutral-600 transition-colors"
            >
              Browse All Eyewear
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
