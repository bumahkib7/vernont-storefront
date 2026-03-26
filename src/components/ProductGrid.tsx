"use client";

import { ListingProductCard } from "./ListingProductCard";
import type { DisplayProduct } from "@/lib/transforms";

interface ProductGridProps {
  products: DisplayProduct[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2
              className="text-2xl lg:text-3xl"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-[#666] mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {products.map((product, index) => (
          <ListingProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
