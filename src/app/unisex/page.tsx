import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByGender } from "@/data/products";

export const metadata = {
  title: "Unisex Fragrances | Vernont",
  description: "Discover our collection of genderless fragrances that transcend boundaries.",
};

export default function UnisexPage() {
  const unisexProducts = getProductsByGender("unisex");

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1920&q=80"
            alt="Unisex Fragrances"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Beyond Boundaries
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Unisex
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Fragrances that defy convention, designed for anyone who appreciates
            exceptional craftsmanship
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={unisexProducts}
            title="Genderless Fragrances"
            subtitle={`${unisexProducts.length} Perfumes`}
          />
        </div>
      </section>
    </PageLayout>
  );
}
