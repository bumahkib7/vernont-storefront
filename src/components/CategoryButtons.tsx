"use client";

import Link from "next/link";
import { useCategories } from "@/lib/hooks";

interface CategoryButtonsProps {
  title?: string;
  className?: string;
}

export function CategoryButtons({ title = "Shop by Category", className = "" }: CategoryButtonsProps) {
  const { data: categoriesData, isLoading } = useCategories();

  const categories = categoriesData?.product_categories ?? [];

  // Filter to only show active top-level categories (no parent)
  const topLevelCategories = categories.filter(
    (c) => c.is_active !== false && !c.parent_category_id
  );

  if (isLoading) {
    return (
      <section className={`py-16 bg-secondary ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl tracking-wide">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse text-center p-6 border border-border"
              >
                <div className="h-5 w-20 bg-muted mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (topLevelCategories.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-secondary ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl tracking-wide">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.handle}`}
              className="text-center p-6 border border-border hover:border-gold transition-colors"
            >
              <h3 className="font-display text-lg tracking-wide">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
