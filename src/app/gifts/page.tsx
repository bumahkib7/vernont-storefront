import Image from "next/image";
import Link from "next/link";
import { Gift, Package, Heart, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { getBestsellers } from "@/data/products";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Gift Sets & Ideas | Vernont",
  description: "Find the perfect fragrance gift for your loved ones. Gift sets, luxury packaging, and personalization available.",
};

const giftCategories = [
  {
    title: "Gift Sets",
    description: "Curated collections for the perfect present",
    icon: Package,
    href: "/gifts/sets",
  },
  {
    title: "For Her",
    description: "Feminine fragrances she will love",
    icon: Heart,
    href: "/for-her",
  },
  {
    title: "For Him",
    description: "Sophisticated scents for gentlemen",
    icon: Sparkles,
    href: "/for-him",
  },
  {
    title: "Luxury Minis",
    description: "Discovery sets and travel sizes",
    icon: Gift,
    href: "/gifts/minis",
  },
];

export default function GiftsPage() {
  const bestsellers = getBestsellers();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1920&q=80"
            alt="Gifts"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            The Art of Giving
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Gifts
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Give the gift of luxury. Every Vernont fragrance comes beautifully presented
            with complimentary gift wrapping.
          </p>
        </div>
      </section>

      {/* Gift Services */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Gift className="h-10 w-10 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-2">Complimentary Gift Wrap</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Every order arrives beautifully wrapped in our signature packaging
              </p>
            </div>
            <div className="p-6">
              <Package className="h-10 w-10 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-2">Personalized Message</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Add a handwritten note to make your gift extra special
              </p>
            </div>
            <div className="p-6">
              <Sparkles className="h-10 w-10 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-2">Gift Cards Available</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Let them choose their perfect scent with a Vernont gift card
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Shop By
            </p>
            <h2 className="font-display text-3xl tracking-wide">Gift Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group p-8 border border-border hover:border-gold transition-colors text-center"
              >
                <category.icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground group-hover:text-gold transition-colors" />
                <h3 className="font-display text-lg tracking-wide mb-2">{category.title}</h3>
                <p className="font-serif text-muted-foreground text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers as Gift Ideas */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={bestsellers}
            title="Popular Gift Choices"
            subtitle="Bestselling Fragrances"
          />
          <div className="text-center mt-12">
            <Link href="/fragrances">
              <Button variant="outline" className="btn-outline-luxury">
                View All Fragrances
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
