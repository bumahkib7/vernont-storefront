import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Our Story | Vernont",
  description: "Discover the heritage and craftsmanship behind Vernont luxury perfumes.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
            alt="Vernont Heritage"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Our Heritage
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            The Vernont Story
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            A legacy of excellence, crafted with passion since the beginning
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                The Beginning
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                A Passion for Perfection
              </h2>
              <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                <p>
                  Vernont was born from a deep appreciation for the art of perfumery and
                  a desire to create fragrances that transcend the ordinary. Our founder
                  believed that a truly exceptional fragrance has the power to evoke emotions,
                  capture memories, and define moments.
                </p>
                <p>
                  What began as a small atelier has grown into a house renowned for its
                  commitment to quality, innovation, and the finest ingredients sourced
                  from around the world.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
                alt="Vernont craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Our Philosophy
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Craftsmanship</h3>
              <p className="font-serif text-muted-foreground leading-relaxed">
                Every fragrance is meticulously crafted by our master perfumers,
                combining traditional techniques with innovative approaches to create
                scents of exceptional quality.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Quality</h3>
              <p className="font-serif text-muted-foreground leading-relaxed">
                We source only the finest ingredients from ethical suppliers around
                the world, ensuring each fragrance meets our exacting standards of
                excellence.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Sustainability</h3>
              <p className="font-serif text-muted-foreground leading-relaxed">
                We are committed to responsible practices, from sustainable sourcing
                to eco-friendly packaging, ensuring our luxury leaves a positive
                impact on the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
                alt="Perfume ingredients"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                The Process
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                The Art of Creation
              </h2>
              <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                <p>
                  Each Vernont fragrance begins with an inspiration—a memory, a place,
                  an emotion. Our master perfumers translate these inspirations into
                  olfactory masterpieces through a process that can take months or
                  even years to perfect.
                </p>
                <p>
                  We work with the finest raw materials: Bulgarian rose, Indian sandalwood,
                  Italian bergamot, and many more precious ingredients that form the
                  foundation of our exceptional creations.
                </p>
                <p>
                  The result is a collection of fragrances that tell stories, evoke
                  emotions, and create lasting impressions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Our Team
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
            The Artisans Behind Vernont
          </h2>
          <p className="font-serif text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Our team of passionate perfumers, craftspeople, and fragrance enthusiasts
            work together to bring you exceptional fragrances. United by a shared love
            for the art of perfumery, we are dedicated to creating scents that inspire
            and delight.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
