"use client";

import * as React from "react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import type { DisplayProduct } from "@/lib/transforms";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products: DisplayProduct[];
  isLoading?: boolean;
}

export function ProductCarousel({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  products,
  isLoading = false,
}: ProductCarouselProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-medium tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-[var(--muted-foreground)] mt-1">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:inline-flex items-center text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              {viewAllLabel}
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px]"
              >
                <div className="aspect-[3/4] bg-[var(--surface)] animate-pulse" />
                <div className="pt-4 space-y-2">
                  <div className="h-3 w-16 bg-[var(--surface)] animate-pulse" />
                  <div className="h-4 w-28 bg-[var(--surface)] animate-pulse" />
                  <div className="h-3 w-20 bg-[var(--surface)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 lg:-ml-4">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 lg:pl-4 basis-[45%] sm:basis-[30%] md:basis-[24%] lg:basis-[18%]"
                >
                  <EnhancedProductCard product={product} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 lg:-left-5 bg-white/90 backdrop-blur border-neutral-200 shadow-sm hover:bg-white" />
            <CarouselNext className="-right-4 lg:-right-5 bg-white/90 backdrop-blur border-neutral-200 shadow-sm hover:bg-white" />
          </Carousel>
        )}

        {viewAllHref && (
          <div className="mt-6 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center text-sm font-medium underline underline-offset-4"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
