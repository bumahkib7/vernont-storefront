import { Package, Truck, RefreshCw, Shield } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Shipping & Returns | Vernont",
  description: "Information about Vernont shipping options, delivery times, and return policy.",
};

export default function ShippingPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Shipping & Returns
          </h1>
          <p className="font-serif text-muted-foreground">
            Everything you need to know about delivery and our return policy.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-4">
            <Truck className="h-8 w-8 mx-auto mb-3 text-gold" />
            <p className="font-display text-sm tracking-wide">Free Shipping</p>
            <p className="font-serif text-xs text-muted-foreground">Orders over €150</p>
          </div>
          <div className="text-center p-4">
            <Package className="h-8 w-8 mx-auto mb-3 text-gold" />
            <p className="font-display text-sm tracking-wide">Gift Wrapping</p>
            <p className="font-serif text-xs text-muted-foreground">Complimentary</p>
          </div>
          <div className="text-center p-4">
            <RefreshCw className="h-8 w-8 mx-auto mb-3 text-gold" />
            <p className="font-display text-sm tracking-wide">Easy Returns</p>
            <p className="font-serif text-xs text-muted-foreground">30 days</p>
          </div>
          <div className="text-center p-4">
            <Shield className="h-8 w-8 mx-auto mb-3 text-gold" />
            <p className="font-display text-sm tracking-wide">Secure Packaging</p>
            <p className="font-serif text-xs text-muted-foreground">Protected delivery</p>
          </div>
        </div>

        {/* Shipping Information */}
        <section className="mb-16">
          <h2 className="font-display text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Shipping Information
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-display text-lg tracking-wide mb-3">Delivery Options</h3>
              <div className="overflow-x-auto">
                <table className="w-full font-serif text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-display font-normal">Shipping Method</th>
                      <th className="text-left py-3 font-display font-normal">Delivery Time</th>
                      <th className="text-left py-3 font-display font-normal">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="py-3">Standard (Germany)</td>
                      <td className="py-3">2-3 business days</td>
                      <td className="py-3">€4.95 (Free over €150)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Express (Germany)</td>
                      <td className="py-3">1-2 business days</td>
                      <td className="py-3">€9.95</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Standard (EU)</td>
                      <td className="py-3">3-5 business days</td>
                      <td className="py-3">€7.95 (Free over €150)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">Express (EU)</td>
                      <td className="py-3">2-3 business days</td>
                      <td className="py-3">€14.95</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3">International</td>
                      <td className="py-3">7-14 business days</td>
                      <td className="py-3">From €19.95</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3">Order Processing</h3>
              <p className="font-serif text-muted-foreground leading-relaxed">
                Orders placed before 2:00 PM CET on business days are typically processed
                and shipped the same day. Orders placed after this time or on weekends
                will be processed the next business day.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3">Tracking Your Order</h3>
              <p className="font-serif text-muted-foreground leading-relaxed">
                Once your order has been shipped, you will receive an email with tracking
                information. You can also track your order by logging into your account
                or contacting our customer service team.
              </p>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="mb-16">
          <h2 className="font-display text-2xl tracking-wide mb-6 pb-2 border-b border-border">
            Returns Policy
          </h2>

          <div className="space-y-6 font-serif text-muted-foreground leading-relaxed">
            <p>
              We want you to be completely satisfied with your purchase. If for any reason
              you are not happy with your order, we offer a hassle-free return policy.
            </p>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3 text-foreground">Return Eligibility</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be returned within 30 days of delivery</li>
                <li>Products must be unopened and in their original packaging</li>
                <li>Items must be in their original condition</li>
                <li>Personalized or engraved items cannot be returned</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3 text-foreground">How to Return</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our customer service team to request a return authorization</li>
                <li>Receive your prepaid shipping label via email</li>
                <li>Pack the item securely in its original packaging</li>
                <li>Drop off the package at your nearest shipping location</li>
                <li>Receive your refund within 5-7 business days of us receiving the return</li>
              </ol>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3 text-foreground">Refunds</h3>
              <p>
                Refunds will be issued to your original payment method. Please allow 5-7
                business days for the refund to appear on your statement after we process
                your return. Shipping costs are non-refundable unless the return is due
                to our error.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wide mb-3 text-foreground">Exchanges</h3>
              <p>
                If you would like to exchange an item for a different product, please
                return the original item and place a new order for the desired product.
                This ensures the fastest processing time.
              </p>
            </div>
          </div>
        </section>

        {/* Damaged Items */}
        <section className="p-8 bg-secondary">
          <h2 className="font-display text-xl tracking-wide mb-4">
            Damaged or Incorrect Items?
          </h2>
          <p className="font-serif text-muted-foreground mb-4">
            If your order arrives damaged or you receive the wrong item, please contact
            us immediately. We will arrange for a replacement or full refund at no
            additional cost to you.
          </p>
          <a href="/contact" className="font-display text-sm text-gold hover:underline">
            Contact Customer Service →
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
