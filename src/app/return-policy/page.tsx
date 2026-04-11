"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Clock,
  CreditCard,
  WarningCircle,
  ShieldCheck,
} from "@/components/icons";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main className="w-full">
        {/* Page Header */}
        <section className="w-full border-b border-[#E5E5E5] py-16 bg-[#FAFAFA]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#999] mb-4">
              Customer Service
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Return Policy
            </h1>
            <p className="text-[#666]">
              Last updated: April 11, 2026
            </p>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="w-full py-16">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-center mb-12">
              Return Policy Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-7 w-7 text-[#1A1A1A]" />
                </div>
                <h3 className="text-[13px] font-bold mb-2">14-Day Return Window</h3>
                <p className="text-[12px] text-[#666] leading-relaxed">
                  Returns accepted within 14 days of delivery
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <Package className="h-7 w-7 text-[#1A1A1A]" />
                </div>
                <h3 className="text-[13px] font-bold mb-2">Free Return Shipping</h3>
                <p className="text-[12px] text-[#666] leading-relaxed">
                  We cover return shipping costs on all orders
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-7 w-7 text-[#1A1A1A]" />
                </div>
                <h3 className="text-[13px] font-bold mb-2">Full Refund</h3>
                <p className="text-[12px] text-[#666] leading-relaxed">
                  Refund to original payment method within 5-7 business days
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-7 w-7 text-[#1A1A1A]" />
                </div>
                <h3 className="text-[13px] font-bold mb-2">Auto-Approved</h3>
                <p className="text-[12px] text-[#666] leading-relaxed">
                  Returns within the window are automatically approved
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Policy */}
        <section className="w-full py-16 bg-[#FAFAFA] border-y border-[#E5E5E5]">
          <div className="max-w-[900px] mx-auto px-4 lg:px-8">
            <div className="space-y-12">
              {/* Return Window */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Return Window</h2>
                <p className="text-[#666] mb-4 leading-relaxed">
                  We accept returns within <strong>14 days</strong> of the order delivery date. The 14-day period begins on the day your order is marked as delivered. Returns requested after this period may not be accepted.
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-blue-900">
                    <strong>Tip:</strong> Track your return deadline in your account dashboard. We'll send you a reminder email when your return window is about to expire.
                  </p>
                </div>
              </div>

              {/* Eligible Items */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Eligible Items</h2>
                <p className="text-[#666] mb-4 leading-relaxed">
                  To be eligible for a return, items must meet the following conditions:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items must be unused and in the same condition as received</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items must be in their original packaging with all tags attached</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items must include all original accessories (cases, cleaning cloths, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items must not show any signs of wear or alteration</span>
                  </li>
                </ul>
              </div>

              {/* Non-Returnable Items */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Non-Returnable Items</h2>
                <p className="text-[#666] mb-4 leading-relaxed">
                  For health and safety reasons, certain items cannot be returned:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <WarningCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Prescription eyewear or sunglasses with custom lenses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <WarningCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items marked as "Final Sale" or purchased during special promotions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <WarningCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Items that have been worn, used, or show signs of alteration</span>
                  </li>
                </ul>
              </div>

              {/* How to Return */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">How to Return an Item</h2>
                <p className="text-[#666] mb-6 leading-relaxed">
                  Returning your purchase is simple and hassle-free:
                </p>
                <ol className="space-y-6">
                  {[
                    {
                      title: "Log in to your account",
                      desc: "Visit your order history and select the order you'd like to return.",
                      link: "/account/orders"
                    },
                    {
                      title: "Request a return",
                      desc: "Click \"Request Return,\" select the items you wish to return, and choose a return reason."
                    },
                    {
                      title: "Print your return label",
                      desc: "You'll receive an email with a prepaid return shipping label. Print the label and attach it to the outside of your package."
                    },
                    {
                      title: "Ship your return",
                      desc: "Package your items securely in the original packaging and drop off at any authorized shipping location."
                    },
                    {
                      title: "Track your return",
                      desc: "Monitor your return status in your account dashboard. We'll email you updates at each step.",
                      link: "/account/returns"
                    }
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="h-8 w-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <strong className="block mb-1">{step.title}</strong>
                        <p className="text-[#666] text-[14px]">
                          {step.link ? (
                            <>
                              {step.desc.split("order history")[0]}
                              <Link href={step.link} className="underline hover:no-underline">
                                {step.link === "/account/orders" ? "order history" : "account dashboard"}
                              </Link>
                              {step.desc.split("order history")[1] || step.desc.split("account dashboard")[1]}
                            </>
                          ) : (
                            step.desc
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Additional Sections... */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Return Shipping</h2>
                <p className="text-[#666] leading-relaxed">
                  Vernont offers <strong>free return shipping</strong> on all orders. When you initiate a return through your account, we'll provide a prepaid return label via email. Simply print the label, attach it to your package, and drop it off at any authorized shipping location.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Refund Process</h2>
                <p className="text-[#666] mb-4 leading-relaxed">
                  Once we receive your returned item(s), our team will inspect them to ensure they meet our return criteria. If approved:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">We'll process your refund within <strong>1-2 business days</strong> of receiving the return</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Refunds will be issued to your original payment method</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[#666]">Please allow <strong>5-7 business days</strong> for the refund to appear in your account</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Contact Us</h2>
                <p className="text-[#666] mb-6 leading-relaxed">
                  If you have any questions about our return policy or need assistance with a return, our customer service team is here to help:
                </p>
                <div className="bg-white border border-[#E5E5E5] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#999] mb-2">Email</p>
                      <a href="mailto:support@vernont.com" className="text-[14px] hover:underline font-medium">
                        support@vernont.com
                      </a>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#999] mb-2">Response Time</p>
                      <p className="text-[14px] font-medium">Within 24 hours</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#999] mb-2">Manage Returns</p>
                      <Link href="/account/returns" className="text-[14px] hover:underline font-medium">
                        View Your Returns
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16">
          <div className="max-w-[800px] mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Ready to Shop?</h2>
            <p className="text-[#666] mb-8">
              Shop with confidence knowing you have 14 days to return any item, hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/eyewear"
                className="px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-black transition-colors"
              >
                Browse Eyewear
              </Link>
              <Link
                href="/returns"
                className="px-8 py-3.5 border border-[#E5E5E5] text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#FAFAFA] transition-colors"
              >
                Return An Order
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
