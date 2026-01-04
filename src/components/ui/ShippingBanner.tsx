"use client";

import { Truck, Globe, RotateCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { StaggeredChildren, StaggeredChild } from "./AnimatedSection";

const features = [
  {
    icon: Truck,
    title: "Free UK Delivery",
    description: "On orders over £75",
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "EU & Worldwide delivery",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "100% secure payment",
  },
];

export function ShippingBanner() {
  return (
    <section className="border-y border-border py-8">
      <div className="container mx-auto px-4">
        <StaggeredChildren className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.1}>
          {features.map((feature) => (
            <StaggeredChild key={feature.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center cursor-default"
              >
                <div className="w-12 h-12 mb-3 border border-gold/30 rounded-full flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-display text-sm tracking-wide mb-1">{feature.title}</h3>
                <p className="font-serif text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            </StaggeredChild>
          ))}
        </StaggeredChildren>
      </div>
    </section>
  );
}
