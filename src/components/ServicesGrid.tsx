"use client";

import { Truck, RotateCcw, ShieldCheck, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SERVICES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on orders over £75.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns on all orders.",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Every piece verified and guaranteed genuine.",
  },
  {
    icon: Lock,
    title: "Secure Payment",
    description: "SSL encrypted checkout. Visa, MC, PayPal, Klarna.",
  },
];

export function ServicesGrid() {
  return (
    <section className="py-16 lg:py-20 border-y border-[var(--border)]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {SERVICES.map((service, i) => (
            <div key={service.title} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center mb-4">
                <service.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium uppercase tracking-wider mb-1.5">
                {service.title}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-[200px]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
