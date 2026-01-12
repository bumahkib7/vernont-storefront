"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { useCollectionByHandle, useCollectionProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { getCollectionHeroImage } from "@/lib/collection-images";

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
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
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[200px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
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

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
  );
}

export default function CollectionPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [sortBy, setSortBy] = useState("featured");

  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError
  } = useCollectionByHandle(handle);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError
  } = useCollectionProducts(handle, { limit: 50 });

  const collection = collectionData?.collection;

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    let products = transformProducts(productsData.items);

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

  const isLoading = isCollectionLoading || isProductsLoading;
  const error = collectionError || productsError;

  const formattedHandle = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (error && !isLoading) {
    return (
      <PageLayout>
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Collection Not Found
            </h1>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              The "{formattedHandle}" collection doesn't exist or isn't available.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fragrances"
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                View All Fragrances
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] max-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={getCollectionHeroImage(handle)}
            alt={collection?.title || "Collection"}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-xl text-white">
            <p className="text-sm uppercase tracking-wide text-white/70 mb-2">
              Collection
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              {isCollectionLoading ? (
                <span className="inline-block w-48 h-12 bg-white/20 animate-pulse" />
              ) : (
                collection?.title || formattedHandle
              )}
            </h1>
            {collection?.description && (
              <p className="text-lg text-white/80 max-w-lg">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
            <p className="text-sm text-neutral-500">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-neutral-100 animate-pulse" />
              ) : (
                `${displayProducts.length} ${displayProducts.length === 1 ? "fragrance" : "fragrances"}`
              )}
            </p>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Products Grid */}
          {isProductsLoading ? (
            <ProductsSkeleton />
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-light tracking-tight mb-3">Coming Soon</h3>
              <p className="text-neutral-500 mb-6">
                This collection is being curated. Check back soon.
              </p>
              <Link
                href="/fragrances"
                className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Browse All Fragrances
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <EnhancedProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
            Discover More
          </h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Explore our other collections, each curated with passion and expertise.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-200 text-sm font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
          >
            View All Collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
