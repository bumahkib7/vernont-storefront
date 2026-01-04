import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCollection } from "@/data/products";

export const metadata = {
  title: "Signature Collection | Vernont",
  description: "Discover our most iconic fragrances that define the Vernont legacy.",
};

export default function SignatureCollectionPage() {
  const signatureProducts = getProductsByCollection("signature");

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=80"
            alt="Signature Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            The Collection
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Signature
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Our most iconic fragrances that define the Vernont legacy.
            Each one a masterpiece of perfumery art.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-2xl tracking-wide mb-6">The Essence of Vernont</h2>
          <p className="font-serif text-muted-foreground leading-relaxed">
            The Signature Collection represents the very heart of Vernont. These are the
            fragrances that established our reputation for excellence—each one a perfect
            balance of artistry and emotion. From the mysterious depths of Velvet Oud to
            the romantic allure of Midnight Rose, these scents are designed to become
            part of your identity.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={signatureProducts}
            title="Signature Fragrances"
            subtitle={`${signatureProducts.length} Iconic Scents`}
          />
        </div>
      </section>
    </PageLayout>
  );
}
