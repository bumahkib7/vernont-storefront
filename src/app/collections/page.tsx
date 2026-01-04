import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Collections | Vernont",
  description: "Explore our curated fragrance collections - from timeless classics to modern masterpieces.",
};

const collections = [
  {
    name: "Signature Collection",
    description: "Our most iconic fragrances that define the Vernont legacy",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
    href: "/collections/signature",
  },
  {
    name: "Heritage Collection",
    description: "Timeless scents inspired by centuries of perfumery tradition",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    href: "/collections/heritage",
  },
  {
    name: "Floral Collection",
    description: "Exquisite bouquets captured in every bottle",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    href: "/collections/floral",
  },
  {
    name: "Fresh Collection",
    description: "Invigorating scents for everyday elegance",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    href: "/collections/fresh",
  },
  {
    name: "Gourmand Collection",
    description: "Indulgent fragrances with delicious accords",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
    href: "/collections/gourmand",
  },
  {
    name: "Limited Edition",
    description: "Exclusive releases available for a limited time",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80",
    href: "/collections/limited",
  },
];

export default function CollectionsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
            alt="Vernont Collections"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Discover
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Our Collections
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Each collection tells a unique story, crafted with passion and the finest ingredients
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-4">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-xs tracking-widest uppercase text-white border border-white px-6 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl tracking-wide mb-2 group-hover:text-gold transition-colors">
                  {collection.name}
                </h3>
                <p className="font-serif text-muted-foreground">
                  {collection.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
