"use client";

import { ProductCard } from "./ProductCard";

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {subtitle && (
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl md:text-4xl tracking-wide">
              {title}
            </h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
