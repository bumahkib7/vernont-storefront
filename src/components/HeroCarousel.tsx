"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  image: string;
  headline: string;
  subtext: string;
  ctas: { label: string; href: string; variant: "primary" | "secondary" }[];
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  className?: string;
}

export function HeroCarousel({ slides, className }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (slides.length === 0) return null;

  return (
    <section className={cn("relative", className)}>
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="pl-0 relative">
              <div className="relative h-[60vh] sm:h-[65vh] lg:h-[75vh] min-h-[400px] max-h-[800px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
                {/* Subtle gradient at bottom-left for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Text — bottom LEFT, SGH style */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-12 lg:pb-16">
                    <h2
                      className="text-3xl sm:text-4xl lg:text-5xl text-white mb-2"
                      style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                    >
                      {slide.headline}
                    </h2>
                    <p className="text-sm text-white/80 mb-4 max-w-md">
                      {slide.subtext}
                    </p>
                    {/* CTA links — underlined, uppercase, SGH style */}
                    <div className="flex items-center gap-4">
                      {slide.ctas.map((cta) => (
                        <Link
                          key={cta.label}
                          href={cta.href}
                          className="text-sm text-white font-medium uppercase tracking-wider underline underline-offset-4 decoration-white/60 hover:decoration-white transition-colors"
                        >
                          {cta.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* No dot indicators — SGH doesn't show them */}
      </Carousel>
    </section>
  );
}
