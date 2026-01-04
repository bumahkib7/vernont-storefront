"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Lady Victoria H.",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    product: "Velvet Oud",
    text: "Absolutely divine. The Velvet Oud has become my signature scent. Every time I wear it, I receive compliments. It's luxurious, long-lasting, and truly unique.",
  },
  {
    id: 2,
    name: "James M.",
    location: "Edinburgh, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    product: "Midnight Ember",
    text: "I've tried countless high-end fragrances, but Vernont stands apart. The craftsmanship is evident in every note. This is what luxury should feel like.",
  },
  {
    id: 3,
    name: "Sophie L.",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    product: "Midnight Rose",
    text: "The Midnight Rose is poetry in a bottle. Romantic yet sophisticated. I ordered from France and the packaging was exquisite. Worth every penny.",
  },
  {
    id: 4,
    name: "Alexander K.",
    location: "Munich, Germany",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    product: "Nordic Woods",
    text: "Shipped to Germany in just 3 days. The Nordic Woods is the perfect winter fragrance - warm, inviting, and incredibly refined. A masterpiece.",
  },
  {
    id: 5,
    name: "Emma W.",
    location: "Manchester, UK",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    product: "Golden Saffron",
    text: "The attention to detail is remarkable. From the beautiful bottle to the complex fragrance that evolves throughout the day. Vernont has won a customer for life.",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-wide">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Quote icon */}
          <Quote className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 text-gold/20" />

          {/* Carousel */}
          <div className="relative h-[320px] md:h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center text-center px-4 md:px-16"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Text */}
                <p className="font-serif text-lg md:text-xl leading-relaxed text-primary-foreground/90 mb-8">
                  "{testimonials[current].text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold">
                    <Image
                      src={testimonials[current].avatar}
                      alt={testimonials[current].name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-display tracking-wide">
                      {testimonials[current].name}
                    </p>
                    <p className="font-serif text-sm text-primary-foreground/60">
                      {testimonials[current].location} • {testimonials[current].product}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 border border-primary-foreground/20 hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-gold w-6" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 border border-primary-foreground/20 hover:border-gold hover:text-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
