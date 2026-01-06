"use client";

import { useMemo } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/lib/hooks";
import { transformProducts, getNewArrivals } from "@/lib/transforms";

// Loading skeleton
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
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

export default function NewArrivalsPage() {
  // Fetch products from API
  const { data: productsData, isLoading, error } = useProducts({ limit: 50 });

  // Transform and filter new arrivals
  const newProducts = useMemo(() => {
    if (!productsData?.items) return [];
    const allProducts = transformProducts(productsData.items);
    const arrivals = getNewArrivals(allProducts);
    // If no products tagged as "new", show all products
    return arrivals.length > 0 ? arrivals : allProducts.slice(0, 12);
  }, [productsData]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=1920&q=80"
            alt="New Arrivals"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Just Arrived
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            New Arrivals
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Be the first to experience our latest creations, each one a testament
            to our unwavering commitment to excellence
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <>
              <div className="text-center mb-12">
                <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                  Loading...
                </p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide">
                  Latest Creations
                </h2>
              </div>
              <ProductsSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-12">
              <p className="font-serif text-muted-foreground">
                Unable to load products. Please try again later.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={newProducts}
              title="Latest Creations"
              subtitle={`${newProducts.length} New Fragrances`}
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
}
