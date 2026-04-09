"use client";

import { Truck, ArrowCounterClockwise, ShieldCheck, Lock } from "@phosphor-icons/react";

const SERVICES = [
  { icon: Truck, title: "Free Delivery", description: "On orders over £75" },
  { icon: ArrowCounterClockwise, title: "Free Returns", description: "Within 30 days" },
  { icon: ShieldCheck, title: "100% Authentic", description: "Verified genuine" },
  { icon: Lock, title: "Secure Checkout", description: "SSL encrypted" },
];

export function ServicesGrid() {
  return (
    <section className="py-10 lg:py-12 border-y border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div key={service.title} className="flex flex-col items-center text-center">
              <service.icon className="h-5 w-5 text-[#1A1A1A] mb-2" strokeWidth={1.5} />
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#1A1A1A] mb-0.5">
                {service.title}
              </p>
              <p className="text-[11px] text-[#999]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
