"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Loader2,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  X,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { ordersApi, returnsApi, type Order, type ReturnReason } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatPriceMajor } from "@/context/CartContext";

interface ReturnEligibility {
  eligible: boolean;
  deadline?: string | null;
  daysRemaining?: number | null;
  reason?: string | null;
  items: Array<{
    orderLineItemId: string;
    variantId?: string | null;
    title: string;
    thumbnail?: string | null;
    quantity: number;
    returnableQuantity: number;
    unitPrice: number;
    currencyCode: string;
  }>;
}

// Return reasons will be fetched from the API

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
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
  const [returnReasons, setReturnReasons] = useState<ReturnReason[]>([]);

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
      const [eligibilityResponse, reasonsResponse] = await Promise.all([
        returnsApi.checkEligibility(orderId),
        returnsApi.getReasons(),
      ]);
      setReturnEligibility(eligibilityResponse);
      setReturnReasons(reasonsResponse);
      if (eligibilityResponse.eligible) {
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

      router.push(`/account/returns/${response.return_request.id}`);
    } catch (err: any) {
      setReturnError(err.message || "Failed to submit return request");
      setSubmittingReturn(false);
    }
  };

  const calculateRefundTotal = () => {
    if (!returnEligibility?.items) return 0;
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = returnEligibility.items?.find(i => i.orderLineItemId === itemId);
      return total + (item ? item.unitPrice * quantity : 0);
    }, 0);
  };

  const currencyCode = order?.currency_code?.toUpperCase() || "GBP";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="w-16 h-16 rounded-full bg-[var(--destructive)]/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-[var(--destructive)]" />
        </div>
        <h2 className="font-semibold text-lg mb-2">Order Not Found</h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          {error || "We couldn't find this order"}
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = statusIndex[order.status] ?? 0;
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="h-10 w-10 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            Order #{order.display_id || order.id.slice(-8)}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6"
        >
          <h2 className="font-semibold mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--border)]">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-500"
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
                      className={`h-10 w-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                        isCompleted
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--background)] border-2 border-[var(--border)] text-[var(--muted-foreground)]"
                      } ${isCurrent ? "ring-4 ring-[var(--primary)]/20" : ""}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`mt-2 text-xs sm:text-sm text-center ${
                        isCompleted ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)]"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-[var(--destructive)]/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-[var(--destructive)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--destructive)]">
                Order {order.status === "refunded" ? "Refunded" : "Cancelled"}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                This order has been {order.status}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--border)]">
            <h2 className="font-semibold">Order Items</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {order.items?.map((item) => (
              <div key={item.id} className="p-5 flex gap-4">
                <div className="h-20 w-20 bg-[var(--background)] rounded-lg flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title || "Product"}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-[var(--muted-foreground)] mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">
                    {formatPriceMajor((item.unit_price || 0) / 100, currencyCode)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-[var(--muted-foreground)] tabular-nums">
                      {formatPriceMajor(((item.unit_price || 0) * item.quantity) / 100, currencyCode)} total
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-5 bg-[var(--background)]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="tabular-nums">{formatPriceMajor((order.subtotal || 0) / 100, currencyCode)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatPriceMajor(order.discount / 100, currencyCode)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Shipping</span>
                <span className="tabular-nums">{formatPriceMajor((order.shipping || 0) / 100, currencyCode)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Tax</span>
                <span className="tabular-nums">{formatPriceMajor((order.tax || 0) / 100, currencyCode)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg tabular-nums">
                  {formatPriceMajor((order.total || 0) / 100, currencyCode)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h2 className="font-semibold text-sm">Payment</h2>
            </div>
            <div className="p-4">
              <p className="text-sm">
                {order.payment_status === "captured" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Paid
                  </span>
                ) : order.payment_status === "refunded" ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600">
                    <RotateCcw className="h-3 w-3" />
                    Refunded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                )}
              </p>
            </div>
          </motion.div>

          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h2 className="font-semibold text-sm">Order Info</h2>
            </div>
            <div className="p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Email</span>
                <span className="truncate ml-2">{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Items</span>
                <span>{order.item_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Currency</span>
                <span>{currencyCode}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Return Request Button */}
            {!isCancelled && order.status !== "pending" && (
              <button
                onClick={checkReturnEligibility}
                disabled={checkingEligibility}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {checkingEligibility ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Request Return
                  </>
                )}
              </button>
            )}

            {/* Not eligible message */}
            {returnEligibility && !returnEligibility.eligible && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-600 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{returnEligibility.reason || "This order is not eligible for returns"}</span>
              </div>
            )}

            {returnError && (
              <div className="p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-sm text-[var(--destructive)] flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{returnError}</span>
              </div>
            )}

            <Link
              href="/account/returns"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
            >
              View All Returns
            </Link>

            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
            >
              Need Help?
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
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">Request Return</h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Order #{order?.display_id || order?.id.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="h-8 w-8 rounded-lg hover:bg-[var(--background)] flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-6">
                {/* Select Items */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Select Items to Return</h3>
                  <div className="space-y-3">
                    {returnEligibility.items?.map((item) => (
                      <div
                        key={item.orderLineItemId}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedItems[item.orderLineItemId]
                            ? "border-[var(--primary)] bg-[var(--primary)]/5"
                            : "border-[var(--border)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {formatPriceMajor(item.unitPrice / 100, currencyCode)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--muted-foreground)]">
                              Max: {item.returnableQuantity}
                            </span>
                            <select
                              value={selectedItems[item.orderLineItemId] || 0}
                              onChange={(e) =>
                                handleItemQuantityChange(
                                  item.orderLineItemId,
                                  parseInt(e.target.value),
                                  item.returnableQuantity
                                )
                              }
                              className="h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            >
                              <option value={0}>0</option>
                              {Array.from({ length: item.returnableQuantity }, (_, i) => i + 1).map((n) => (
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
                  <h3 className="text-sm font-medium mb-4">Reason for Return</h3>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full h-12 px-4 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                  <h3 className="text-sm font-medium mb-4">Additional Notes <span className="text-[var(--muted-foreground)] font-normal">(Optional)</span></h3>
                  <textarea
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="Any additional details about your return..."
                    rows={3}
                    className="w-full p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Refund Summary */}
                {Object.keys(selectedItems).length > 0 && (
                  <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted-foreground)]">
                        Estimated Refund
                      </span>
                      <span className="font-semibold text-lg text-[var(--primary)] tabular-nums">
                        {formatPriceMajor(calculateRefundTotal() / 100, currencyCode)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {returnError && (
                  <div className="p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-sm text-[var(--destructive)] flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{returnError}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-5 flex gap-4">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReturn}
                  disabled={submittingReturn || Object.keys(selectedItems).length === 0 || !returnReason}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReturn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Return Request"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
