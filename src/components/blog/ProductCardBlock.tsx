"use client";

import { useState, useEffect } from "react";
import { productsApi } from "@/lib/api";
import { transformProduct } from "@/lib/transforms";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import type { DisplayProduct } from "@/lib/transforms";

interface ProductCardBlockProps {
  productId: string;
}

export function ProductCardBlock({ productId }: ProductCardBlockProps) {
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    productsApi
      .getById(productId)
      .then((data) => {
        if (!cancelled && data.product) {
          setProduct(transformProduct(data.product));
        }
      })
      .catch(() => {
        // Product not found or API error — silently hide the block
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="my-8 max-w-[300px] mx-auto">
        <div className="aspect-[3/2] bg-[#FAFAFA] animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-[#FAFAFA] animate-pulse w-2/3 mx-auto" />
          <div className="h-3 bg-[#FAFAFA] animate-pulse w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="my-8 max-w-[300px] mx-auto">
      <EnhancedProductCard product={product} />
    </div>
  );
}
