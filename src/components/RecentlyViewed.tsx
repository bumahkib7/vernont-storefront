"use client";

import { useMemo } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { ListingProductCard } from "@/components/ListingProductCard";

interface RecentlyViewedProps {
  /** Exclude a product ID (e.g. the one currently being viewed) */
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { recentIds } = useRecentlyViewed();

  // Only fetch when we have IDs to show
  const hasIds = recentIds.length > 0;
  const { data: productsData } = useProducts(
    { limit: 50 },
    { enabled: hasIds }
  );

  const recentProducts = useMemo(() => {
    if (!productsData?.items || recentIds.length === 0) return [];
    const all = transformProducts(productsData.items);
    const byId = new Map(all.map((p) => [p.id, p]));
    // Preserve recency order, exclude current product
    return recentIds
      .filter((id) => id !== excludeId && byId.has(id))
      .map((id) => byId.get(id)!)
      .slice(0, 8);
  }, [productsData, recentIds, excludeId]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 border-t border-[#E5E5E5]">
      <h3 className="text-center text-[13px] font-bold tracking-[0.1em] uppercase mb-10">
        Recently Viewed
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#E5E5E5]">
        {recentProducts.map((product, i) => (
          <div key={product.id} className="flex-shrink-0 w-[220px] sm:w-[250px]">
            <ListingProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
