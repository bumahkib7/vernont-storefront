import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { getNewArrivals } from "@/data/products";

export const metadata = {
  title: "New Arrivals | Vernont",
  description: "Discover our latest fragrance creations - fresh additions to the Vernont collection.",
};

export default function NewArrivalsPage() {
  const newProducts = getNewArrivals();

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
          <ProductGrid
            products={newProducts}
            title="Latest Creations"
            subtitle={`${newProducts.length} New Fragrances`}
          />
        </div>
      </section>
    </PageLayout>
  );
}
