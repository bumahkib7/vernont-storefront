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
    <section className="py-16 lg:py-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.cta.href}
              className="group relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-neutral-100"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10">
                <h3 className="text-2xl lg:text-3xl text-white font-light tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 max-w-xs">
                  {card.description}
                </p>
                <span className="inline-flex items-center text-white text-sm font-medium uppercase tracking-wider border-b border-white/50 pb-0.5 w-fit group-hover:border-white transition-colors">
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
