"use client";

import Link from "next/link";

interface BrandsGridProps {
  brands: { name: string; slug: string }[];
}

export function BrandsGrid({ brands }: BrandsGridProps) {
  if (brands.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="px-4 lg:px-6">
        <h2
          className="text-2xl lg:text-3xl mb-6"
          style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
        >
          Shop by brands
        </h2>

        <div className={`grid border-t border-l border-[#E5E5E5] ${
          brands.length <= 3
            ? "grid-cols-2 sm:grid-cols-" + Math.min(brands.length + 1, 4)
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        }`}>
          {brands.slice(0, 17).map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="flex items-center justify-center py-6 px-4 border-r border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
            >
              <span
                className="text-sm font-medium tracking-wide text-[#1A1A1A] text-center uppercase"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {brand.name}
              </span>
            </Link>
          ))}
          <Link
            href="/brands"
            className="flex items-center justify-center py-6 px-4 border-r border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
          >
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] underline underline-offset-4 text-[#1A1A1A]">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
