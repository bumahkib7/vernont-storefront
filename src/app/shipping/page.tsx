"use client";

import { Package, Truck, ArrowsClockwise, Shield } from "@phosphor-icons/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const headingFont = { fontFamily: "'Crimson Pro', 'Georgia', serif" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const highlights = [
  { icon: Truck, label: "UK Delivery", sub: "Fast & reliable" },
  { icon: Package, label: "Gift Wrapping", sub: "Complimentary" },
  { icon: ArrowsClockwise, label: "Easy Returns", sub: "30 days" },
  { icon: Shield, label: "Secure Packaging", sub: "Protected delivery" },
];

export default function ShippingPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-5xl tracking-wide mb-4"
            style={{ ...headingFont, color: "#1A1A1A" }}
          >
            Shipping &amp; Returns
          </h1>
          <p style={{ color: "#666" }}>
            Everything you need to know about delivery and our return policy.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              className="text-center p-4"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <item.icon
                className="h-8 w-8 mx-auto mb-3"
                style={{ color: "#999" }}
              />
              <p
                className="text-sm tracking-wide"
                style={{ color: "#1A1A1A" }}
              >
                {item.label}
              </p>
              <p className="text-xs" style={{ color: "#666" }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Shipping Information */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-2xl tracking-wide mb-6 pb-2"
            style={{
              ...headingFont,
              color: "#1A1A1A",
              borderBottom: "1px solid #E5E5E5",
            }}
          >
            Shipping Information
          </h2>

          <div className="space-y-8">
            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Delivery Options
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                      <th
                        className="text-left py-3 font-normal"
                        style={{ color: "#1A1A1A" }}
                      >
                        Shipping Method
                      </th>
                      <th
                        className="text-left py-3 font-normal"
                        style={{ color: "#1A1A1A" }}
                      >
                        Delivery Time
                      </th>
                      <th
                        className="text-left py-3 font-normal"
                        style={{ color: "#1A1A1A" }}
                      >
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#666" }}>
                    {[
                      ["Standard (Germany)", "2-3 business days", "€4.95 (Free over €150)"],
                      ["Express (Germany)", "1-2 business days", "€9.95"],
                      ["Standard (EU)", "3-5 business days", "€7.95 (Free over €150)"],
                      ["Express (EU)", "2-3 business days", "€14.95"],
                      ["International", "7-14 business days", "From €19.95"],
                    ].map(([method, time, cost]) => (
                      <tr
                        key={method}
                        style={{ borderBottom: "1px solid #E5E5E5" }}
                      >
                        <td className="py-3">{method}</td>
                        <td className="py-3">{time}</td>
                        <td className="py-3">{cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Order Processing
              </h3>
              <p className="leading-relaxed" style={{ color: "#666" }}>
                Orders placed before 2:00 PM CET on business days are typically processed
                and shipped the same day. Orders placed after this time or on weekends
                will be processed the next business day.
              </p>
            </div>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Tracking Your Order
              </h3>
              <p className="leading-relaxed" style={{ color: "#666" }}>
                Once your order has been shipped, you will receive an email with tracking
                information. You can also track your order by logging into your account
                or contacting our customer service team.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Returns Policy */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2
            className="text-2xl tracking-wide mb-6 pb-2"
            style={{
              ...headingFont,
              color: "#1A1A1A",
              borderBottom: "1px solid #E5E5E5",
            }}
          >
            Returns Policy
          </h2>

          <div className="space-y-6 leading-relaxed" style={{ color: "#666" }}>
            <p>
              We want you to be completely satisfied with your purchase. If for any reason
              you are not happy with your order, we offer a hassle-free return policy.
            </p>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Return Eligibility
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be returned within 30 days of delivery</li>
                <li>Items must be unworn and in their original packaging with tags attached</li>
                <li>Items must be in their original condition with no scratches</li>
                <li>Custom prescription lenses cannot be returned</li>
              </ul>
            </div>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                How to Return
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our customer service team to request a return authorization</li>
                <li>Receive your prepaid shipping label via email</li>
                <li>Pack the item securely in its original packaging</li>
                <li>Drop off the package at your nearest shipping location</li>
                <li>Receive your refund within 5-7 business days of us receiving the return</li>
              </ol>
            </div>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Refunds
              </h3>
              <p>
                Refunds will be issued to your original payment method. Please allow 5-7
                business days for the refund to appear on your statement after we process
                your return. Shipping costs are non-refundable unless the return is due
                to our error.
              </p>
            </div>

            <div>
              <h3
                className="text-lg tracking-wide mb-3"
                style={{ ...headingFont, color: "#1A1A1A" }}
              >
                Exchanges
              </h3>
              <p>
                If you would like to exchange an item for a different product, please
                return the original item and place a new order for the desired product.
                This ensures the fastest processing time.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Damaged Items */}
        <motion.section
          className="p-8"
          style={{ backgroundColor: "#F5F5F5" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2
            className="text-xl tracking-wide mb-4"
            style={{ ...headingFont, color: "#1A1A1A" }}
          >
            Damaged or Incorrect Items?
          </h2>
          <p className="mb-4" style={{ color: "#666" }}>
            If your order arrives damaged or you receive the wrong item, please contact
            us immediately. We will arrange for a replacement or full refund at no
            additional cost to you.
          </p>
          <a
            href="/contact"
            className="text-sm hover:underline"
            style={{ color: "#999" }}
          >
            Contact Customer Service &rarr;
          </a>
        </motion.section>
      </div>
    </PageLayout>
  );
}
