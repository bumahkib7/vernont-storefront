import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Craftsmanship | Vernont",
  description: "Discover the artistry and expertise behind every Vernont fragrance.",
};

export default function CraftsmanshipPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
            alt="Vernont Craftsmanship"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            The Art
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Craftsmanship
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Where tradition meets innovation in the pursuit of olfactory excellence
          </p>
        </div>
      </section>

      {/* Master Perfumers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Our Artisans
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                Master Perfumers
              </h2>
              <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                <p>
                  Behind every Vernont fragrance is a team of master perfumers, each bringing
                  decades of experience and an unparalleled nose for exceptional scents. Our
                  perfumers are artists who have dedicated their lives to understanding the
                  complex language of fragrance.
                </p>
                <p>
                  Trained in the finest perfumery schools of Grasse and Paris, they combine
                  classical techniques with innovative approaches to create fragrances that
                  are both timeless and contemporary.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
                alt="Master perfumer at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              The Journey
            </p>
            <h2 className="font-display text-3xl tracking-wide">From Concept to Creation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border border-gold rounded-full flex items-center justify-center">
                <span className="font-display text-gold text-xl">01</span>
              </div>
              <h3 className="font-display text-lg tracking-wide mb-3">Inspiration</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Every fragrance begins with a story, an emotion, or a memory that our perfumers wish to capture.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border border-gold rounded-full flex items-center justify-center">
                <span className="font-display text-gold text-xl">02</span>
              </div>
              <h3 className="font-display text-lg tracking-wide mb-3">Selection</h3>
              <p className="font-serif text-muted-foreground text-sm">
                We source the finest raw materials from around the world, each chosen for its exceptional quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border border-gold rounded-full flex items-center justify-center">
                <span className="font-display text-gold text-xl">03</span>
              </div>
              <h3 className="font-display text-lg tracking-wide mb-3">Composition</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Through countless iterations, our perfumers craft the perfect balance of notes and accords.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border border-gold rounded-full flex items-center justify-center">
                <span className="font-display text-gold text-xl">04</span>
              </div>
              <h3 className="font-display text-lg tracking-wide mb-3">Maturation</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Each fragrance rests for weeks to allow the ingredients to marry and develop their full character.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
                alt="Precious ingredients"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Exceptional Materials
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-6">
                The Finest Ingredients
              </h2>
              <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                <p>
                  We travel the world to source the most precious and rare ingredients:
                  Bulgarian rose from the Valley of Roses, Indian sandalwood from Mysore,
                  Italian bergamot from Calabria, and Tahitian vanilla from the islands
                  of French Polynesia.
                </p>
                <p>
                  Each ingredient is carefully evaluated and selected by our team of experts,
                  ensuring that only the finest materials make it into our fragrances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-display text-3xl tracking-wide mb-6">
            Our Promise of Quality
          </h2>
          <p className="font-serif text-primary-foreground/80 leading-relaxed">
            Every Vernont fragrance undergoes rigorous quality testing to ensure it meets
            our exacting standards. From stability testing to olfactory evaluation by our
            panel of experts, we leave nothing to chance in our pursuit of perfection.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
