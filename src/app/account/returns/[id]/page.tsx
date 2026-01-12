"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Package,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { returnsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatPriceMajor } from "@/context/CartContext";

interface ReturnItem {
  id: string;
  orderLineItemId: string;
  variantId?: string | null;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Return {
  id: string;
  orderId: string;
  orderDisplayId?: number | null;
  status: string;
  reason: string;
  reasonNote?: string | null;
  refundAmount: number;
  currencyCode: string;
  items: ReturnItem[];
  requestedAt: string;
  approvedAt?: string | null;
  receivedAt?: string | null;
  refundedAt?: string | null;
  returnDeadline: string;
  daysRemaining: number;
  canCancel: boolean;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; label: string }> = {
  requested: { icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10", label: "Requested" },
  approved: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-500/10", label: "Approved" },
  received: { icon: Package, color: "text-indigo-600", bg: "bg-indigo-500/10", label: "Received" },
  refunded: { icon: CreditCard, color: "text-green-600", bg: "bg-green-500/10", label: "Refunded" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-500/10", label: "Rejected" },
  canceled: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-500/10", label: "Canceled" },
};

const reasonLabels: Record<string, string> = {
  SIZE_TOO_SMALL: "Size too small",
  SIZE_TOO_LARGE: "Size too large",
  NOT_AS_DESCRIBED: "Not as described",
  QUALITY_ISSUE: "Quality issue",
  CHANGED_MIND: "Changed mind",
  WRONG_ITEM: "Wrong item received",
  DAMAGED: "Item damaged",
  OTHER: "Other reason",
};

const timelineSteps = [
  { key: "requested", label: "Return Requested", icon: Clock },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "received", label: "Items Received", icon: Package },
  { key: "refunded", label: "Refund Processed", icon: CreditCard },
];

export default function ReturnDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const returnId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [returnData, setReturnData] = useState<Return | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchReturn = async () => {
      try {
        const response = await returnsApi.get(returnId);
        setReturnData(response.return_request);
      } catch (err: any) {
        setError(err.message || "Failed to load return");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReturn();
  }, [returnId, authLoading, isAuthenticated]);

  const handleCancel = async () => {
    if (!returnData || returnData.status !== "requested") return;

    setIsCanceling(true);
    try {
      await returnsApi.cancel(returnId);
      router.push("/account/returns");
    } catch (err: any) {
      setError(err.message || "Failed to cancel return");
      setIsCanceling(false);
    }
  };

  const getTimelineStatus = (stepKey: string): "completed" | "current" | "pending" => {
    if (!returnData) return "pending";

    const statusOrder = ["requested", "approved", "received", "refunded"];
    const currentIndex = statusOrder.indexOf(returnData.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (returnData.status === "rejected" || returnData.status === "canceled") {
      return stepKey === "requested" ? "completed" : "pending";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const currencyCode = returnData?.currencyCode?.toUpperCase() || "GBP";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error || !returnData) {
    return (
      <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="w-16 h-16 rounded-full bg-[var(--destructive)]/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-[var(--destructive)]" />
        </div>
        <h2 className="font-semibold text-lg mb-2">Return Not Found</h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          {error || "We couldn't find this return request"}
        </p>
        <Link
          href="/account/returns"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Returns
        </Link>
      </div>
    );
  }

  const status = statusConfig[returnData.status] || statusConfig.requested;
  const StatusIcon = status.icon;
  const isRejected = returnData.status === "rejected";
  const isCanceled = returnData.status === "canceled";
  const canCancel = returnData.status === "requested";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/account/returns"
          className="h-10 w-10 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Return Request</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            For Order #{returnData.orderDisplayId || returnData.orderId.slice(-8)}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${status.bg} ${status.color}`}>
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </span>
      </div>

      {/* Rejected/Canceled Notice */}
      {(isRejected || isCanceled) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-lg border ${isRejected ? "bg-red-500/10 border-red-500/20" : "bg-gray-500/10 border-gray-500/20"}`}
        >
          <div className="flex items-start gap-4">
            <div className={`h-10 w-10 rounded-lg ${isRejected ? "bg-red-500/10" : "bg-gray-500/10"} flex items-center justify-center flex-shrink-0`}>
              <AlertCircle className={`h-5 w-5 ${isRejected ? "text-red-500" : "text-gray-500"}`} />
            </div>
            <div>
              <h2 className={`font-semibold ${isRejected ? "text-red-600" : "text-gray-600"}`}>
                Return {isRejected ? "Rejected" : "Canceled"}
              </h2>
              {isCanceled && (
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  This return request was canceled
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      {!isRejected && !isCanceled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6"
        >
          <h2 className="font-semibold mb-6">Return Progress</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--border)]" />

            {/* Steps */}
            <div className="relative flex justify-between">
              {timelineSteps.map((step) => {
                const stepStatus = getTimelineStatus(step.key);
                const isCompleted = stepStatus === "completed";
                const isCurrent = stepStatus === "current";

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                        isCompleted || isCurrent
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--background)] border-2 border-[var(--border)] text-[var(--muted-foreground)]"
                      } ${isCurrent ? "ring-4 ring-[var(--primary)]/20" : ""}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`mt-2 text-xs sm:text-sm text-center ${
                        isCompleted || isCurrent ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)]"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--border)]">
            <h2 className="font-semibold">Items Being Returned</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {returnData.items?.map((item) => (
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
                      <Package className="h-8 w-8 text-[var(--muted-foreground)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">
                    {item.title || "Product"}
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
                  <p className="text-xs text-[var(--muted-foreground)]">Refund</p>
                  <p className="font-semibold tabular-nums">
                    {formatPriceMajor(item.total / 100, currencyCode)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Refund Summary */}
          <div className="p-5 bg-[var(--background)]">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Refund</span>
              <span className="font-semibold text-lg text-[var(--primary)] tabular-nums">
                {formatPriceMajor(returnData.refundAmount / 100, currencyCode)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          {/* Return Reason */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <RotateCcw className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h2 className="font-semibold text-sm">Return Reason</h2>
            </div>
            <div className="p-4">
              <p className="text-sm mb-2">
                {returnData.reason ? (reasonLabels[returnData.reason.toUpperCase().replace(/ /g, "_")] || returnData.reason) : "Not specified"}
              </p>
              {returnData.reasonNote && (
                <p className="text-sm text-[var(--muted-foreground)] italic">
                  &quot;{returnData.reasonNote}&quot;
                </p>
              )}
            </div>
          </motion.div>

          {/* Timeline Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <h2 className="font-semibold text-sm">Timeline</h2>
            </div>
            <div className="p-4 text-sm space-y-2">
              {returnData.requestedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Requested</span>
                  <span>{new Date(returnData.requestedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
              {returnData.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Approved</span>
                  <span>{new Date(returnData.approvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
              {returnData.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Received</span>
                  <span>{new Date(returnData.receivedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
              {returnData.refundedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Refunded</span>
                  <span>{new Date(returnData.refundedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
              {!returnData.requestedAt && !returnData.approvedAt && !returnData.receivedAt && !returnData.refundedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Deadline</span>
                  <span>{new Date(returnData.returnDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Shipping Instructions */}
          {returnData.status === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="font-semibold text-sm text-blue-600">Ship Your Return</h2>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Please ship your items to our returns center. Make sure items are securely packaged.
              </p>
              <div className="text-sm space-y-1">
                <p className="text-xs font-medium text-[var(--muted-foreground)]">Return Address:</p>
                <p>Vernont Returns</p>
                <p>123 Fashion Street</p>
                <p>London, W1A 1AA</p>
                <p>United Kingdom</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <Link
              href={`/account/orders/${returnData.orderId}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
            >
              View Original Order
            </Link>

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--destructive)]/30 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/10 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Return Request"
                )}
              </button>
            )}

            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors text-sm font-medium"
            >
              Need Help?
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
