import Image from "next/image";
import { MapPin, Briefcase } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Careers | Vernont",
  description: "Join the Vernont team. Explore career opportunities in the world of luxury fragrance.",
};

const openPositions = [
  {
    title: "Senior Perfumer",
    department: "Product Development",
    location: "Munich, Germany",
    type: "Full-time",
  },
  {
    title: "E-Commerce Manager",
    department: "Digital",
    location: "Munich, Germany",
    type: "Full-time",
  },
  {
    title: "Brand Ambassador",
    department: "Retail",
    location: "Paris, France",
    type: "Full-time",
  },
  {
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Munich, Germany",
    type: "Full-time",
  },
  {
    title: "Visual Merchandiser",
    department: "Retail",
    location: "London, UK",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=1920&q=80"
            alt="Join Vernont"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Join Our Team
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide mb-4">
            Careers at Vernont
          </h1>
          <p className="font-serif text-lg text-white/80 max-w-2xl mx-auto">
            Be part of a team that crafts exceptional experiences and defines luxury
          </p>
        </div>
      </section>

      {/* Why Vernont */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
              Why Work With Us
            </h2>
            <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
              At Vernont, we believe in nurturing talent, fostering creativity, and
              building a culture of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Growth & Development</h3>
              <p className="font-serif text-muted-foreground">
                We invest in our people through training programs, mentorship, and
                opportunities for advancement.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Creative Environment</h3>
              <p className="font-serif text-muted-foreground">
                Work alongside talented artisans and innovators in an environment
                that celebrates creativity.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl tracking-wide mb-4">Global Opportunities</h3>
              <p className="font-serif text-muted-foreground">
                With offices worldwide, there are opportunities to grow your career
                across different markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Opportunities
            </p>
            <h2 className="font-display text-3xl tracking-wide">Open Positions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="p-6 bg-background border border-border hover:border-gold transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg tracking-wide">{position.title}</h3>
                    <p className="font-serif text-muted-foreground text-sm">
                      {position.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-serif text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {position.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="font-serif text-muted-foreground mb-4">
              Don&apos;t see the right role? We&apos;re always looking for talented individuals.
            </p>
            <Button className="btn-outline-luxury">
              Send Your CV
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
