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
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(153, 153, 153, 0.1)" }}
          >
            <Camera className="h-10 w-10" style={{ color: "#999" }} />
          </div>

          <h1
            className="text-4xl md:text-5xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
          >
            Virtual Try-On
          </h1>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "rgba(153, 153, 153, 0.1)", color: "#999" }}
          >
            Coming Soon
          </div>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: "#666" }}>
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
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: "#F5F5F5", border: "1px solid #E5E5E5" }}
            >
              <h3
                className="text-lg tracking-wide mb-2"
                style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Email Capture */}
        <div
          className="rounded-xl p-8 md:p-12 text-center"
          style={{ backgroundColor: "#F5F5F5", border: "1px solid #E5E5E5" }}
        >
          <h2
            className="text-2xl tracking-wide mb-3"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
          >
            Be the First to Know
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: "#666" }}>
            Sign up to get notified when Virtual Try-On launches. Early access members get exclusive features.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2" style={{ color: "#16a34a" }}>
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
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  border: "1px solid #E5E5E5",
                  backgroundColor: "#FFFFFF",
                  color: "#1A1A1A",
                }}
                required
              />
              <button
                type="submit"
                className="px-6 py-3 font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
              >
                <EnvelopeSimple className="h-4 w-4" />
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Browse CTA */}
        <div className="text-center mt-12">
          <p className="mb-4" style={{ color: "#666" }}>
            In the meantime, use our face shape guide to find your perfect frames.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/eyewear"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: "#1A1A1A" }}
            >
              Face Shape Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/eyewear"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: "#1A1A1A" }}
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
