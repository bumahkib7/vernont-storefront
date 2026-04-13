"use client";

import { useState } from "react";
import { EnvelopeSimple, Phone, MapPin, Clock } from "@/components/icons";
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
      <div className="max-w-[1500px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="tracking-wider uppercase text-sm mb-3" style={{ color: "#999" }}>
            Get in Touch
          </p>
          <h1
            className="text-4xl md:text-5xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
          >
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: "#666" }}>
            We would love to hear from you. Whether you have a question about our
            eyewear, need assistance with an order, or simply want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2
              className="text-2xl tracking-wide mb-8"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "#999" }} />
                <div>
                  <h3 className="text-lg mb-1" style={{ color: "#1A1A1A" }}>Visit Us</h3>
                  <p style={{ color: "#666" }}>
                    Vernont Flagship Store<br />
                    Parfümstraße 42<br />
                    80331 Munich, Germany
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "#999" }} />
                <div>
                  <h3 className="text-lg mb-1" style={{ color: "#1A1A1A" }}>Call Us</h3>
                  <p style={{ color: "#666" }}>
                    +49 (0) 89 123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <EnvelopeSimple className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "#999" }} />
                <div>
                  <h3 className="text-lg mb-1" style={{ color: "#1A1A1A" }}>Email Us</h3>
                  <p style={{ color: "#666" }}>
                    contact@vernont.com<br />
                    support@vernont.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: "#999" }} />
                <div>
                  <h3 className="text-lg mb-1" style={{ color: "#1A1A1A" }}>Opening Hours</h3>
                  <p style={{ color: "#666" }}>
                    Monday - Friday: 10:00 - 19:00<br />
                    Saturday: 10:00 - 18:00<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6" style={{ backgroundColor: "#F5F5F5" }}>
              <h3 className="text-lg mb-2" style={{ color: "#1A1A1A" }}>Customer Service</h3>
              <p className="text-sm" style={{ color: "#666" }}>
                For order inquiries, returns, or product questions, our customer
                service team is available Monday through Friday, 9:00 - 18:00 CET.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2
              className="text-2xl tracking-wide mb-8"
              style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
            >
              PaperPlaneRight a Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center" style={{ backgroundColor: "#F5F5F5" }}>
                <h3
                  className="text-xl mb-4"
                  style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
                >
                  Thank You!
                </h3>
                <p style={{ color: "#666" }}>
                  Your message has been sent. We will get back to you within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2" style={{ color: "#1A1A1A" }}>Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent focus:outline-none"
                    style={{ border: "1px solid #E5E5E5", color: "#1A1A1A" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#999"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-2" style={{ color: "#1A1A1A" }}>Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent focus:outline-none"
                    style={{ border: "1px solid #E5E5E5", color: "#1A1A1A" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#999"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm mb-2" style={{ color: "#1A1A1A" }}>Subject *</label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent focus:outline-none"
                    style={{ border: "1px solid #E5E5E5", color: "#1A1A1A" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#999"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
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
                  <label htmlFor="message" className="block text-sm mb-2" style={{ color: "#1A1A1A" }}>Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
                    style={{ border: "1px solid #E5E5E5", color: "#1A1A1A" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#999"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#E5E5E5"}
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full tracking-wider uppercase text-sm py-3"
                  style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF", border: "none" }}
                >
                  PaperPlaneRight Message
                </Button>

                <p className="text-xs text-center" style={{ color: "#666" }}>
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
