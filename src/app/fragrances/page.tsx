import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";

export const metadata = {
  title: "All Fragrances | Vernont",
  description: "Explore our complete collection of luxury perfumes and fragrances.",
};

export default function FragrancesPage() {
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
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            All Fragrances
          </h1>
          <p className="font-serif text-lg text-white/80">
            Discover your signature scent from our collection of {products.length} exquisite perfumes
          </p>
        </div>
      </section>

      {/* Filters (placeholder) */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-serif text-muted-foreground">
              Showing {products.length} fragrances
            </p>
            <div className="flex items-center gap-4">
              <select className="font-serif bg-transparent border border-border px-4 py-2 focus:outline-none focus:border-gold">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid products={products} />
        </div>
      </section>
    </PageLayout>
  );
}
