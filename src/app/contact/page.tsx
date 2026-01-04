"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send to API
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Contact Us
          </h1>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
            We would love to hear from you. Whether you have a question about our
            fragrances, need assistance with an order, or simply want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="font-display text-2xl tracking-wide mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg mb-1">Visit Us</h3>
                  <p className="font-serif text-muted-foreground">
                    Vernont Flagship Store<br />
                    Parfümstraße 42<br />
                    80331 Munich, Germany
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg mb-1">Call Us</h3>
                  <p className="font-serif text-muted-foreground">
                    +49 (0) 89 123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg mb-1">Email Us</h3>
                  <p className="font-serif text-muted-foreground">
                    contact@vernont.com<br />
                    support@vernont.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-lg mb-1">Opening Hours</h3>
                  <p className="font-serif text-muted-foreground">
                    Monday - Friday: 10:00 - 19:00<br />
                    Saturday: 10:00 - 18:00<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-secondary">
              <h3 className="font-display text-lg mb-2">Customer Service</h3>
              <p className="font-serif text-muted-foreground text-sm">
                For order inquiries, returns, or product questions, our customer
                service team is available Monday through Friday, 9:00 - 18:00 CET.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl tracking-wide mb-8">
              Send a Message
            </h2>

            {submitted ? (
              <div className="p-8 bg-secondary text-center">
                <h3 className="font-display text-xl mb-4">Thank You!</h3>
                <p className="font-serif text-muted-foreground">
                  Your message has been sent. We will get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-serif text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-border font-serif focus:outline-none focus:border-gold"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-border font-serif focus:outline-none focus:border-gold"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm mb-2">Subject *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-border font-serif focus:outline-none focus:border-gold"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="feedback">Feedback</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-serif text-sm mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-border font-serif focus:outline-none focus:border-gold resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" className="btn-luxury bg-gold text-primary hover:bg-gold/90 w-full">
                  Send Message
                </Button>

                <p className="font-serif text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
