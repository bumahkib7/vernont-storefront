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
              <div className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

                <div className="absolute inset-0 flex items-end">
                  <div className="max-w-[1500px] w-full mx-auto px-6 lg:px-20 pb-16 lg:pb-24">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight mb-3 max-w-xl">
                      {slide.headline}
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-md">
                      {slide.subtext}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {slide.ctas.map((cta) => (
                        <Link
                          key={cta.label}
                          href={cta.href}
                          className={cn(
                            "inline-flex items-center px-8 py-3 text-sm font-medium uppercase tracking-wider transition-colors",
                            cta.variant === "primary"
                              ? "bg-white text-black hover:bg-white/90"
                              : "border border-white/50 text-white hover:bg-white/10"
                          )}
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

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </section>
  );
}
