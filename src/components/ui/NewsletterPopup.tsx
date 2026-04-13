"use client";

import { useState, useEffect } from "react";
import { X, Sparkle, Gift, EnvelopeSimple } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { marketingApi } from "@/lib/api";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has already seen or submitted
    const hasSeenPopup = localStorage.getItem("vernont-newsletter-seen");
    if (hasSeenPopup) return;

    // Show after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("vernont-newsletter-seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError("");
    try {
      await marketingApi.publicSubscribe({ email });
      setIsSubmitted(true);
      localStorage.setItem("vernont-newsletter-seen", "subscribed");
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[100]"
          >
            <div className="relative mx-4 bg-background overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Decorative top bar */}
              <div className="h-1 bg-gradient-to-r from-gold via-champagne to-gold" />

              <div className="p-8 md:p-12">
                {!isSubmitted ? (
                  <>
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-16 h-16 mx-auto mb-6 border-2 border-gold rounded-full flex items-center justify-center"
                    >
                      <Gift className="h-7 w-7 text-gold" />
                    </motion.div>

                    <h2 className="font-display text-2xl md:text-3xl text-center tracking-wide mb-3">
                      Welcome to Vernont
                    </h2>

                    <p className="font-serif text-muted-foreground text-center mb-6">
                      Subscribe to receive <span className="text-gold font-semibold">10% off</span> your first order,
                      exclusive access to new collections, and curated eyewear stories.
                    </p>

                    {/* Benefits */}
                    <div className="flex justify-center gap-6 mb-8">
                      <div className="flex items-center gap-2 text-sm font-serif text-muted-foreground">
                        <Sparkle className="h-4 w-4 text-gold" />
                        <span>Early Access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-serif text-muted-foreground">
                        <Gift className="h-4 w-4 text-gold" />
                        <span>Exclusive Offers</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          disabled={isSubmitting}
                          className="w-full pl-12 pr-4 py-4 bg-secondary border border-border font-serif text-sm focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
                        />
                      </div>
                      {error && <p className="text-red-600 text-xs text-center">{error}</p>}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-luxury bg-gold text-primary hover:bg-gold/90 py-6"
                      >
                        {isSubmitting ? "Subscribing..." : "Subscribe & Get 10% Off"}
                      </Button>
                    </form>

                    <p className="font-serif text-xs text-muted-foreground text-center mt-6">
                      By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                      className="w-20 h-20 mx-auto mb-6 bg-gold rounded-full flex items-center justify-center"
                    >
                      <Sparkle className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="font-display text-2xl tracking-wide mb-3">
                      Welcome to the Family
                    </h3>
                    <p className="font-serif text-muted-foreground">
                      Check your inbox for your exclusive 10% discount code.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
