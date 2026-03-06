"use client";

import { motion } from "framer-motion";
import { StaggeredChildren, StaggeredChild } from "./AnimatedSection";
import { content } from "@/config/vertical";

const features = content.shippingFeatures;

export function ShippingBanner() {
  return (
    <section className="relative py-12 bg-secondary/50 overflow-hidden">
      {/* Art Deco decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 20px,
          rgba(212, 175, 55, 1) 20px,
          rgba(212, 175, 55, 1) 21px
        )`
      }} />

      <div className="container mx-auto px-4 relative">
        <StaggeredChildren className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4" staggerDelay={0.1}>
          {features.map((feature, index) => (
            <StaggeredChild key={feature.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center cursor-default group relative"
              >
                {/* Art Deco Icon Container */}
                <div className="relative mb-5">
                  {/* Outer frame */}
                  <div className="w-16 h-16 border border-gold/30 rotate-45 flex items-center justify-center group-hover:border-gold transition-colors duration-300">
                    {/* Inner icon */}
                    <div className="-rotate-45">
                      <feature.icon className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  {/* Corner accents */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-gold/50" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-gold/50" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-l border-b border-gold/50" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-gold/50" />
                </div>

                <h3 className="font-display text-xs tracking-[0.2em] uppercase mb-2 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="font-serif text-xs text-muted-foreground italic">
                  {feature.description}
                </p>

                {/* Separator between items (except last) */}
                {index < features.length - 1 && (
                  <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
                )}
              </motion.div>
            </StaggeredChild>
          ))}
        </StaggeredChildren>
      </div>
    </section>
  );
}
