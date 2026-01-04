import Image from "next/image";
import { Leaf, Recycle, Heart, Globe } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Sustainability | Vernont",
  description: "Our commitment to sustainable and ethical practices in luxury perfumery.",
};

export default function SustainabilityPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80"
            alt="Sustainability"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Our Commitment
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Sustainability
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Luxury that respects our planet. Our commitment to sustainable practices.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Leaf className="h-12 w-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-3">Ethical Sourcing</h3>
              <p className="font-serif text-muted-foreground text-sm">
                We source ingredients from certified sustainable farms and ethical suppliers worldwide.
              </p>
            </div>
            <div className="text-center p-6">
              <Recycle className="h-12 w-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-3">Eco Packaging</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Our packaging is made from recycled and recyclable materials with minimal plastic.
              </p>
            </div>
            <div className="text-center p-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-3">Cruelty-Free</h3>
              <p className="font-serif text-muted-foreground text-sm">
                We never test on animals and are certified cruelty-free by Leaping Bunny.
              </p>
            </div>
            <div className="text-center p-6">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-3">Carbon Neutral</h3>
              <p className="font-serif text-muted-foreground text-sm">
                We offset our carbon footprint through verified environmental projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-wide mb-4">Our 2025 Goals</h2>
              <p className="font-serif text-muted-foreground">
                We&apos;ve set ambitious targets to reduce our environmental impact.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gold text-primary font-display text-xl">
                  100%
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">Sustainable Packaging</h3>
                  <p className="font-serif text-muted-foreground">
                    All packaging will be recycled, recyclable, or biodegradable by 2025.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gold text-primary font-display text-xl">
                  50%
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">Reduced Carbon Emissions</h3>
                  <p className="font-serif text-muted-foreground">
                    Cut our operational carbon emissions by half through efficiency improvements.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gold text-primary font-display text-xl">
                  0%
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">Zero Waste to Landfill</h3>
                  <p className="font-serif text-muted-foreground">
                    Eliminate all waste sent to landfill from our production facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
                alt="Sustainable ingredients"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
                Responsible Sourcing
              </p>
              <h2 className="font-display text-3xl tracking-wide mb-6">
                Our Ingredients
              </h2>
              <div className="space-y-4 font-serif text-muted-foreground leading-relaxed">
                <p>
                  Every ingredient we use is carefully selected not only for its quality
                  but also for its environmental and social impact. We work directly with
                  farmers and suppliers who share our values.
                </p>
                <p>
                  From sustainably harvested sandalwood to ethically sourced rose absolute,
                  we ensure that our luxury doesn&apos;t come at the cost of our planet or
                  the communities that produce these precious materials.
                </p>
                <p>
                  We are proud members of the UEBT (Union for Ethical BioTrade) and committed
                  to the principles of ethical sourcing in everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
