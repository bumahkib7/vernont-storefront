"use client";

import { formatPrice } from "@/context/CartContext";

interface OrderItem {
  title: string;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
  thumbnail?: string | null;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  giftWrap: number;
  discount: number;
  total: number;
  currency: string;
  email: string;
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
    phone?: string;
  };
}

interface PrintableReceiptProps {
  order: OrderData;
}

export function PrintableReceipt({ order }: PrintableReceiptProps) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hidden print:block print:bg-white print:text-black print:p-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-receipt,
          .print-receipt * {
            visibility: visible;
          }
          .print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        }
      `}</style>

      <div className="print-receipt max-w-xl mx-auto font-sans">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-black">
          <h1
            className="text-3xl font-normal tracking-[0.3em] mb-2"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            VERNONT
          </h1>
          <p className="text-sm text-gray-600">Designer & Niche Fragrances</p>
        </div>

        {/* Receipt Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Order Receipt</h2>
          <p className="text-sm text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Info */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p className="font-medium">Order Number</p>
            <p className="text-gray-600">{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Date</p>
            <p className="text-gray-600">{currentDate}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-300">
            Items Ordered
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium">Item</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3">
                    <p className="font-medium">{item.title}</p>
                    {item.variant_title && (
                      <p className="text-gray-500 text-xs">{item.variant_title}</p>
                    )}
                  </td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">
                    {formatPrice(item.unit_price * item.quantity, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 border-t-2 border-black pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm mb-2">
              <span>Discount</span>
              <span>-{formatPrice(order.discount, order.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>
              {order.deliveryPrice === 0
                ? "Free"
                : formatPrice(order.deliveryPrice, order.currency)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 pt-2 border-t border-gray-300">
            <span>Total</span>
            <span>{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>

        {/* Shipping & Contact */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          {order.shipping && (
            <div>
              <h3 className="font-semibold uppercase tracking-wide mb-2">
                Shipping Address
              </h3>
              <div className="text-gray-600 space-y-0.5">
                <p>
                  {order.shipping.first_name} {order.shipping.last_name}
                </p>
                <p>{order.shipping.address_1}</p>
                {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.postal_code}
                </p>
                {order.shipping.phone && <p>{order.shipping.phone}</p>}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold uppercase tracking-wide mb-2">
              Contact
            </h3>
            <p className="text-gray-600">{order.email}</p>
            <h3 className="font-semibold uppercase tracking-wide mb-2 mt-4">
              Payment
            </h3>
            <p className="text-gray-600">Paid via Stripe</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-300">
          <p className="mb-2">
            Questions? Contact us at support@vernont.com
          </p>
          <p>
            Vernont | www.vernont.com | 100% Authentic Fragrances
          </p>
        </div>
      </div>
    </div>
  );
}
