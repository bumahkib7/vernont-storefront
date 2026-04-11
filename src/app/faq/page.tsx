"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaretDown } from "@/components/icons";

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
    answer: "We accept returns of unworn eyewear within 14 days of delivery. Items must be in their original packaging and condition, with all tags attached. You can initiate a return through your account or visit our returns page.",
  },
  {
    category: "Returns & Refunds",
    question: "How do I return a product?",
    answer: "Log into your account, go to your order history, and select the order you'd like to return. Click 'Request Return' and follow the instructions. If you checked out as a guest, visit our returns page and enter your email and order number.",
  },
  {
    category: "Returns & Refunds",
    question: "How long do refunds take?",
    answer: "Refunds are processed within 1-2 business days after we receive your return. The funds will be credited to your original payment method within 5-7 business days.",
  },
  {
    category: "Returns & Refunds",
    question: "Is return shipping free?",
    answer: "Yes! We offer free return shipping on all orders. When you request a return, we'll provide a prepaid shipping label via email.",
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
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main className="w-full">
        {/* Page Header */}
        <section className="w-full border-b border-[#E5E5E5] py-16 bg-[#FAFAFA]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-4">
              Help Center
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-[#666]">
              Find answers to common questions about our eyewear, orders, shipping, returns, and more.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="w-full py-12 border-b border-[#E5E5E5]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2.5 text-[12px] uppercase tracking-wider font-medium border transition-colors ${
                  selectedCategory === null
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#E5E5E5] text-[#666] hover:border-[#1A1A1A]"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 text-[12px] uppercase tracking-wider font-medium border transition-colors ${
                    selectedCategory === category
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#E5E5E5] text-[#666] hover:border-[#1A1A1A]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="w-full py-16">
          <div className="max-w-[900px] mx-auto px-4 lg:px-8">
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#E5E5E5]"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span className="text-[15px] font-medium pr-4">
                      {faq.question}
                    </span>
                    <CaretDown
                      className={`h-5 w-5 text-[#666] flex-shrink-0 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 border-t border-[#E5E5E5]">
                      <p className="text-[#666] leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="w-full py-16 bg-[#FAFAFA] border-t border-[#E5E5E5]">
          <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Still Have Questions?
            </h2>
            <p className="text-[#666] mb-8">
              Our customer service team is here to help. Contact us anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/return-policy"
                className="px-8 py-3.5 border border-[#E5E5E5] text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-white transition-colors"
              >
                View Return Policy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
