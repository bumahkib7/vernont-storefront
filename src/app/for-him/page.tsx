import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByGender } from "@/data/products";

export const metadata = {
  title: "Fragrances for Him | Vernont",
  description: "Discover our collection of masculine fragrances - from fresh aquatics to bold leather scents.",
};

export default function ForHimPage() {
  const menProducts = getProductsByGender("men");

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&q=80"
            alt="Fragrances for Him"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Bold Sophistication
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            For Him
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Refined fragrances for the modern gentleman, from invigorating fresh scents
            to distinguished woody compositions
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={menProducts}
            title="Masculine Fragrances"
            subtitle={`${menProducts.length} Perfumes`}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl tracking-wide">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Woody", "Fresh", "Spicy", "Leather"].map((category) => (
              <div
                key={category}
                className="text-center p-6 border border-border hover:border-gold transition-colors cursor-pointer"
              >
                <h3 className="font-display text-lg tracking-wide">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
