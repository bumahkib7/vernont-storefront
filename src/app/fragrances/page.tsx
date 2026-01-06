"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-secondary" />
          <div className="pt-5 text-center space-y-2">
            <div className="h-3 w-16 bg-secondary mx-auto" />
            <div className="h-5 w-32 bg-secondary mx-auto" />
            <div className="h-3 w-24 bg-secondary mx-auto" />
            <div className="h-5 w-20 bg-secondary mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FragrancesPage() {
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform products
  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    let products = transformProducts(productsData.items);

    // Sort products
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

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
            alt="All Fragrances"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            All Fragrances
          </h1>
          <p className="font-serif text-lg text-white/80">
            Discover your signature scent from our collection of {displayProducts.length} exquisite perfumes
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-serif text-muted-foreground">
              {isLoading ? "Loading..." : `Showing ${displayProducts.length} fragrances`}
            </p>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-serif bg-transparent border border-border px-4 py-2 focus:outline-none focus:border-gold"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <ProductsSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                No fragrances found.
              </p>
            </div>
          ) : (
            <ProductGrid products={displayProducts} />
          )}
        </div>
      </section>
    </PageLayout>
  );
}
