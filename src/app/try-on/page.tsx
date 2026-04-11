"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ArrowRight, Check, EnvelopeSimple } from "@/components/icons";
import { PageLayout } from "@/components/layout/PageLayout";

export default function TryOnPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-[1500px] mx-auto px-4 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <Camera className="h-10 w-10 text-[var(--primary)]" />
          </div>

          <h1 className="text-4xl md:text-5xl tracking-wide mb-4">
            Virtual Try-On
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium mb-6">
            Coming Soon
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Try on any frame from our collection using your phone or webcam.
            See how different styles look on your face before you buy — powered by augmented reality.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Real-Time AR",
              description: "See frames on your face in real-time using your device camera. Move your head naturally — the frames follow.",
            },
            {
              title: "True-to-Size",
              description: "Our AR technology uses facial measurements to show frames at their actual proportions on your face.",
            },
            {
              title: "FloppyDisk & Compare",
              description: "Capture screenshots of your favourite looks and compare different styles side by side.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center"
            >
              <h3 className="text-lg tracking-wide mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Email Capture */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl tracking-wide mb-3">
            Be the First to Know
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sign up to get notified when Virtual Try-On launches. Early access members get exclusive features.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[var(--success)]">
              <Check className="h-5 w-5" />
              <span className="font-medium">You are on the list! We will notify you at launch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <EnvelopeSimple className="h-4 w-4" />
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Browse CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            In the meantime, use our face shape guide to find your perfect frames.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/eyewear"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Face Shape Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/eyewear"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Browse Eyewear
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
