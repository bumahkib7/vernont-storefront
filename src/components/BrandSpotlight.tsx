"use client";

import Image from "next/image";
import Link from "next/link";

export interface SpotlightCard {
  image: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
}

interface BrandSpotlightProps {
  cards: SpotlightCard[];
}

export function BrandSpotlight({ cards }: BrandSpotlightProps) {
  if (cards.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.cta.href}
              className="group block"
            >
              {/* Image — full width, no overlay text */}
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Text below image — SGH style */}
              <div className="pt-4 pb-2">
                <h3
                  className="text-xl lg:text-2xl text-[#1A1A1A] mb-1"
                  style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-[#666] mb-3 max-w-sm">
                  {card.description}
                </p>
                <span className="text-[12px] font-medium uppercase tracking-[0.08em] underline underline-offset-4 text-[#1A1A1A] group-hover:opacity-60 transition-opacity">
                  {card.cta.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
