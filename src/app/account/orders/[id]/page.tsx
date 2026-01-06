"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Loader2,
  ShoppingBag,
  Check,
  Clock,
  XCircle,
  RotateCcw,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ordersApi, returnsApi, type Order } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ReturnEligibility {
  eligible: boolean;
  reason?: string;
  eligible_until?: string;
  returnable_items?: Array<{
    order_line_item_id: string;
    title: string;
    quantity: number;
    returnable_quantity: number;
    unit_price: number;
  }>;
}

const returnReasons = [
  { value: "SIZE_TOO_SMALL", label: "Size too small" },
  { value: "SIZE_TOO_LARGE", label: "Size too large" },
  { value: "NOT_AS_DESCRIBED", label: "Not as described" },
  { value: "QUALITY_ISSUE", label: "Quality issue" },
  { value: "CHANGED_MIND", label: "Changed my mind" },
  { value: "WRONG_ITEM", label: "Wrong item received" },
  { value: "DAMAGED", label: "Item arrived damaged" },
  { value: "OTHER", label: "Other reason" },
];

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  completed: 3,
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Return modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnEligibility, setReturnEligibility] = useState<ReturnEligibility | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersApi.get(orderId);
        setOrder(response.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const checkReturnEligibility = async () => {
    setCheckingEligibility(true);
    setReturnError("");
    try {
      const response = await returnsApi.checkEligibility(orderId);
      setReturnEligibility(response);
      if (response.eligible) {
        setShowReturnModal(true);
      }
    } catch (err: any) {
      setReturnError(err.message || "Failed to check return eligibility");
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number, maxQuantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedItems };
      delete newSelected[itemId];
      setSelectedItems(newSelected);
    } else {
      setSelectedItems({
        ...selectedItems,
        [itemId]: Math.min(quantity, maxQuantity),
      });
    }
  };

  const submitReturn = async () => {
    if (!returnReason || Object.keys(selectedItems).length === 0) {
      setReturnError("Please select items and a reason for return");
      return;
    }

    setSubmittingReturn(true);
    setReturnError("");

    try {
      const items = Object.entries(selectedItems).map(([orderLineItemId, quantity]) => ({
        orderLineItemId,
        quantity,
      }));

      const response = await returnsApi.create({
        orderId,
        items,
        reason: returnReason,
        reasonNote: returnNote || undefined,
      });

      // Redirect to return details page
      router.push(`/account/returns/${response.return.id}`);
    } catch (err: any) {
      setReturnError(err.message || "Failed to submit return request");
      setSubmittingReturn(false);
    }
  };

  const calculateRefundTotal = () => {
    if (!returnEligibility?.returnable_items) return 0;
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = returnEligibility.returnable_items?.find(i => i.order_line_item_id === itemId);
      return total + (item ? item.unit_price * quantity : 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h2 className="font-display text-2xl tracking-wide mb-2">Order Not Found</h2>
        <p className="font-serif text-muted-foreground mb-6">
          {error || "We couldn't find this order"}
        </p>
        <Link href="/account/orders">
          <Button variant="outline" className="border-border hover:border-gold">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const currentStep = statusIndex[order.status] ?? 0;
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <Button variant="ghost" size="icon" className="hover:text-gold">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl md:text-3xl tracking-wide">
            Order #{order.display_id || order.id.slice(-8)}
          </h1>
          <p className="font-serif text-muted-foreground">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-6"
        >
          <h2 className="font-display text-lg tracking-wide mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                        isCompleted
                          ? "bg-gold text-primary"
                          : "bg-secondary text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`mt-2 font-serif text-xs sm:text-sm ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Cancelled Notice */}
      {isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-6"
        >
          <div className="flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="font-display text-lg tracking-wide text-red-500">
                Order {order.status === "refunded" ? "Refunded" : "Cancelled"}
              </h2>
              <p className="font-serif text-sm text-muted-foreground">
                This order has been {order.status}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card border border-border"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg tracking-wide">Order Items</h2>
          </div>
          <div className="divide-y divide-border">
            {order.items?.map((item) => (
              <div key={item.id} className="p-6 flex gap-4">
                <div className="h-20 w-20 bg-secondary flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm tracking-wide mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-serif text-xs text-muted-foreground mb-2">
                      {item.description}
                    </p>
                  )}
                  <p className="font-serif text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm tracking-wide">
                    ${((item.unit_price || 0) / 100).toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="font-serif text-xs text-muted-foreground">
                      ${(((item.unit_price || 0) * item.quantity) / 100).toFixed(2)} total
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-secondary/30">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-serif">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${((order.subtotal || 0) / 100).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between font-serif text-green-500">
                  <span>Discount</span>
                  <span>-${(order.discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif">
                <span className="text-muted-foreground">Shipping</span>
                <span>${((order.shipping || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif">
                <span className="text-muted-foreground">Tax</span>
                <span>${((order.tax || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-display tracking-wide">Total</span>
                <span className="font-display text-lg tracking-wide">
                  ${((order.total || 0) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg tracking-wide">Payment</h2>
            </div>
            <div className="font-serif text-sm space-y-2">
              <p className="text-muted-foreground">
                {order.payment_status === "captured" ? (
                  <span className="text-green-500">Paid</span>
                ) : order.payment_status === "refunded" ? (
                  <span className="text-orange-500">Refunded</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )}
              </p>
            </div>
          </motion.div>

          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg tracking-wide">Order Info</h2>
            </div>
            <div className="font-serif text-sm space-y-2 text-muted-foreground">
              <p>
                <span className="text-foreground">Email:</span> {order.email}
              </p>
              <p>
                <span className="text-foreground">Items:</span> {order.item_count}
              </p>
              <p>
                <span className="text-foreground">Currency:</span> {order.currency_code}
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {/* Return Request Button */}
            {!isCancelled && order.status !== "pending" && (
              <Button
                onClick={checkReturnEligibility}
                disabled={checkingEligibility}
                className="w-full bg-gold text-primary hover:bg-gold/90"
              >
                {checkingEligibility ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Request Return
                  </>
                )}
              </Button>
            )}

            {/* Not eligible message */}
            {returnEligibility && !returnEligibility.eligible && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-sm font-serif text-yellow-600">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {returnEligibility.reason || "This order is not eligible for returns"}
              </div>
            )}

            {returnError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-sm font-serif text-red-500">
                {returnError}
              </div>
            )}

            <Link href="/account/returns" className="block">
              <Button
                variant="outline"
                className="w-full border-border hover:border-gold"
              >
                View All Returns
              </Button>
            </Link>

            <Link href="/contact" className="block">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-gold"
              >
                Need Help?
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Return Request Modal */}
      <AnimatePresence>
        {showReturnModal && returnEligibility?.eligible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowReturnModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl tracking-wide">Request Return</h2>
                  <p className="font-serif text-sm text-muted-foreground">
                    Order #{order?.display_id || order?.id.slice(-8)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReturnModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Select Items */}
                <div>
                  <h3 className="font-display text-sm tracking-wide mb-4">Select Items to Return</h3>
                  <div className="space-y-3">
                    {returnEligibility.returnable_items?.map((item) => (
                      <div
                        key={item.order_line_item_id}
                        className={`p-4 border transition-colors ${
                          selectedItems[item.order_line_item_id]
                            ? "border-gold bg-gold/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-display text-sm tracking-wide">{item.title}</p>
                            <p className="font-serif text-xs text-muted-foreground">
                              ${(item.unit_price / 100).toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-xs text-muted-foreground">
                              Max: {item.returnable_quantity}
                            </span>
                            <select
                              value={selectedItems[item.order_line_item_id] || 0}
                              onChange={(e) =>
                                handleItemQuantityChange(
                                  item.order_line_item_id,
                                  parseInt(e.target.value),
                                  item.returnable_quantity
                                )
                              }
                              className="h-10 px-3 bg-background border border-border font-serif text-sm focus:border-gold focus:outline-none"
                            >
                              <option value={0}>0</option>
                              {Array.from({ length: item.returnable_quantity }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return Reason */}
                <div>
                  <h3 className="font-display text-sm tracking-wide mb-4">Reason for Return</h3>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full h-12 px-4 bg-background border border-border font-serif focus:border-gold focus:outline-none"
                  >
                    <option value="">Select a reason...</option>
                    {returnReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <h3 className="font-display text-sm tracking-wide mb-4">Additional Notes (Optional)</h3>
                  <textarea
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="Any additional details about your return..."
                    rows={3}
                    className="w-full p-4 bg-background border border-border font-serif text-sm focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                {/* Refund Summary */}
                {Object.keys(selectedItems).length > 0 && (
                  <div className="p-4 bg-secondary/30 border border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-sm text-muted-foreground">
                        Estimated Refund
                      </span>
                      <span className="font-display text-xl tracking-wide text-gold">
                        ${(calculateRefundTotal() / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {returnError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-sm font-serif text-red-500">
                    {returnError}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:border-gold"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gold text-primary hover:bg-gold/90"
                  onClick={submitReturn}
                  disabled={submittingReturn || Object.keys(selectedItems).length === 0 || !returnReason}
                >
                  {submittingReturn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Return Request"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
