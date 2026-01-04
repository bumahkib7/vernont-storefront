"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    question: "Do you offer free shipping?",
    answer: "Yes! We offer complimentary shipping on all orders over €150. For orders under this amount, shipping costs are calculated at checkout based on your location.",
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
    answer: "We accept returns of unopened products within 30 days of delivery. Items must be in their original packaging and condition. Please contact our customer service to initiate a return.",
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
    question: "Are your perfumes authentic?",
    answer: "All Vernont fragrances are 100% authentic and created in our own perfumery. We guarantee the quality and authenticity of every product we sell.",
  },
  {
    category: "Products",
    question: "How should I store my perfume?",
    answer: "Store your fragrance in a cool, dry place away from direct sunlight and heat. Keep the bottle tightly closed when not in use. Proper storage helps maintain the fragrance quality.",
  },
  {
    category: "Products",
    question: "What is the difference between Eau de Parfum and Eau de Toilette?",
    answer: "Eau de Parfum (EDP) contains a higher concentration of fragrance oils (15-20%) and typically lasts longer. Eau de Toilette (EDT) has a lower concentration (5-15%) and is lighter, perfect for everyday wear.",
  },
  {
    category: "Products",
    question: "Do you offer samples?",
    answer: "Yes! We offer discovery sets and sample sizes so you can explore our fragrances before committing to a full bottle. Check our Gifts section for available options.",
  },
  {
    category: "Account & Payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are securely processed.",
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
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Help Center
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-serif text-muted-foreground">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 font-serif text-sm border transition-colors ${
              selectedCategory === null
                ? "border-gold text-gold"
                : "border-border text-muted-foreground hover:border-gold"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 font-serif text-sm border transition-colors ${
                selectedCategory === category
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground hover:border-gold"
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
                <span className="font-display text-base tracking-wide pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="font-serif text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center p-8 bg-secondary">
          <h2 className="font-display text-2xl tracking-wide mb-4">
            Still Have Questions?
          </h2>
          <p className="font-serif text-muted-foreground mb-6">
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
