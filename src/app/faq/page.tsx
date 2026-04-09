"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Orders & Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days within Europe and 7-14 business days for international orders. Express shipping options are available at checkout for faster delivery.",
  },
  {
    category: "Orders & Shipping",
    question: "How much is shipping?",
    answer: "Shipping costs are calculated at checkout based on your location. We offer standard and express delivery options for UK and international orders.",
  },
  {
    category: "Orders & Shipping",
    question: "Can I track my order?",
    answer: "Absolutely. Once your order ships, you will receive an email with tracking information. You can also track your order by logging into your account.",
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Please check our shipping page for more details.",
  },
  {
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer: "We accept returns of unworn eyewear within 30 days of delivery. Items must be in their original packaging and condition, with all tags attached. Please contact our customer service to initiate a return.",
  },
  {
    category: "Returns & Refunds",
    question: "How do I return a product?",
    answer: "Contact our customer service team to request a return authorization. Once approved, you will receive instructions and a prepaid shipping label for your return.",
  },
  {
    category: "Returns & Refunds",
    question: "How long do refunds take?",
    answer: "Refunds are processed within 5-7 business days after we receive your return. The funds will be credited to your original payment method.",
  },
  {
    category: "Products",
    question: "How do I find the right frame size?",
    answer: "Frame measurements are printed on the inside of the temple arm (e.g. 52-18-140). The first number is the lens width, the second is the bridge width, and the third is the temple length, all in millimeters. Visit our Size Guide page for a detailed chart matching these measurements to face sizes from XS to XL.",
  },
  {
    category: "Products",
    question: "What is the difference between polarized and UV400 lenses?",
    answer: "UV400 lenses block 100% of UVA and UVB rays, protecting your eyes from sun damage. Polarized lenses do the same but also reduce glare from reflective surfaces like water, snow, and roads. All Vernont sunglasses include UV400 protection; polarized options are available on select styles.",
  },
  {
    category: "Products",
    question: "Which frame shape suits my face?",
    answer: "As a general guide: round faces pair well with angular or rectangular frames, square faces suit round or oval frames, oval faces can wear most shapes, and heart-shaped faces look great with bottom-heavy or cat-eye styles. Visit our eyewear collection to explore shapes that complement your features.",
  },
  {
    category: "Products",
    question: "Can I get prescription lenses fitted?",
    answer: "Yes! Most of our frames are prescription-ready. You can order frames only and have your optician fit prescription lenses, or contact us for our prescription lens fitting service. Single vision, bifocal, and progressive options are available.",
  },
  {
    category: "Products",
    question: "Do you offer a cleaning kit?",
    answer: "Yes! Every order includes a complimentary microfiber cleaning cloth. We also offer premium cleaning kits with lens spray, a hard case, and a microfiber pouch. Check our Accessories section for available options.",
  },
  {
    category: "Account & Payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and other Stripe-supported payment methods. All transactions are securely processed.",
  },
  {
    category: "Account & Payments",
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.",
  },
  {
    category: "Account & Payments",
    question: "Do I need an account to place an order?",
    answer: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and receive exclusive offers.",
  },
];

const categories = [...new Set(faqs.map(f => f.category))];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = selectedCategory
    ? faqs.filter(f => f.category === selectedCategory)
    : faqs;

  return (
    <PageLayout>
      <div className="max-w-[1500px] mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[var(--secondary)] tracking-wider uppercase text-sm mb-3">
            Help Center
          </p>
          <h1 className="text-4xl md:text-5xl tracking-wide mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our eyewear, orders, shipping, returns, and more.
          </p>
        </div>

        {/* Category Funnel */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm border transition-colors ${
              selectedCategory === null
                ? "border-[var(--secondary)] text-[var(--secondary)]"
                : "border-border text-muted-foreground hover:border-[var(--foreground)]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm border transition-colors ${
                selectedCategory === category
                  ? "border-[var(--secondary)] text-[var(--secondary)]"
                  : "border-border text-muted-foreground hover:border-[var(--foreground)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="text-base tracking-wide pr-4">
                  {faq.question}
                </span>
                <CaretDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center p-8 bg-secondary">
          <h2 className="text-2xl tracking-wide mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our customer service team is here to help. Contact us anytime.
          </p>
          <a
            href="/contact"
            className="btn-outline-luxury inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
