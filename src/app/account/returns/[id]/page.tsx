"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { returnsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ReturnItem {
  item_id: string;
  quantity: number;
  reason_id?: string;
  note?: string;
  // Optional fields that may be enriched by the backend
  id?: string;
  order_line_item_id?: string;
  title?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  unit_price?: number | null;
  refund_amount?: number | null;
}

interface Return {
  id: string;
  order_id: string;
  order_display_id?: number | null;
  customer_id?: string | null;
  status: string;
  reason?: string | null;
  reason_note?: string | null;
  refund_amount?: number | null;
  currency_code?: string | null;
  requested_at?: string | null;
  approved_at?: string | null;
  received_at?: string | null;
  refunded_at?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  items?: ReturnItem[] | null;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string; label: string }> = {
  requested: { icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500", label: "Requested" },
  approved: { icon: CheckCircle, color: "text-blue-500", bgColor: "bg-blue-500", label: "Approved" },
  received: { icon: Package, color: "text-indigo-500", bgColor: "bg-indigo-500", label: "Received" },
  refunded: { icon: CreditCard, color: "text-green-500", bgColor: "bg-green-500", label: "Refunded" },
  rejected: { icon: XCircle, color: "text-red-500", bgColor: "bg-red-500", label: "Rejected" },
  canceled: { icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-500", label: "Canceled" },
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
        setReturnData(response.return);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !returnData) {
    return (
      <div className="text-center py-16">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h2 className="font-display text-2xl tracking-wide mb-2">Return Not Found</h2>
        <p className="font-serif text-muted-foreground mb-6">
          {error || "We couldn't find this return request"}
        </p>
        <Link href="/account/returns">
          <Button variant="outline" className="border-border hover:border-gold">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Returns
          </Button>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account/returns">
          <Button variant="ghost" size="icon" className="hover:text-gold">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl md:text-3xl tracking-wide">
            Return Request
          </h1>
          <p className="font-serif text-muted-foreground">
            For Order #{returnData.order_display_id || returnData.order_id.slice(-8)}
          </p>
        </div>
        <span className={`px-4 py-2 text-sm font-serif rounded flex items-center gap-2 ${status.color} bg-opacity-10`} style={{ backgroundColor: `${status.bgColor}15` }}>
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </span>
      </div>

      {/* Rejected/Canceled Notice */}
      {(isRejected || isCanceled) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 border ${isRejected ? "bg-red-500/10 border-red-500/20" : "bg-gray-500/10 border-gray-500/20"}`}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className={`h-6 w-6 ${isRejected ? "text-red-500" : "text-gray-500"}`} />
            <div>
              <h2 className={`font-display text-lg tracking-wide ${isRejected ? "text-red-500" : "text-gray-500"}`}>
                Return {isRejected ? "Rejected" : "Canceled"}
              </h2>
              {isRejected && returnData.rejection_reason && (
                <p className="font-serif text-sm text-muted-foreground mt-1">
                  Reason: {returnData.rejection_reason}
                </p>
              )}
              {isCanceled && (
                <p className="font-serif text-sm text-muted-foreground mt-1">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-6"
        >
          <h2 className="font-display text-lg tracking-wide mb-6">Return Progress</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />

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
                          ? "bg-gold text-primary"
                          : "bg-secondary text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`mt-2 font-serif text-xs sm:text-sm text-center ${
                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card border border-border"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg tracking-wide">Items Being Returned</h2>
          </div>
          <div className="divide-y divide-border">
            {returnData.items?.map((item) => (
              <div key={item.item_id} className="p-6 flex gap-4">
                <div className="h-20 w-20 bg-secondary flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm tracking-wide mb-1">
                    {item.title || "Product"}
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
                  <p className="font-serif text-xs text-muted-foreground">Refund</p>
                  <p className="font-display text-sm tracking-wide">
                    ${((item.refund_amount || item.unit_price || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Refund Summary */}
          <div className="p-6 bg-secondary/30">
            <div className="flex justify-between">
              <span className="font-display tracking-wide">Total Refund</span>
              <span className="font-display text-xl tracking-wide text-gold">
                ${((returnData.refund_amount ?? 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Details Sidebar */}
        <div className="space-y-6">
          {/* Return Reason */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg tracking-wide">Return Reason</h2>
            </div>
            <p className="font-serif text-sm mb-2">
              {returnData.reason ? (reasonLabels[returnData.reason] || returnData.reason) : "Not specified"}
            </p>
            {returnData.reason_note && (
              <p className="font-serif text-sm text-muted-foreground italic">
                &quot;{returnData.reason_note}&quot;
              </p>
            )}
          </motion.div>

          {/* Timeline Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg tracking-wide">Timeline</h2>
            </div>
            <div className="space-y-3 font-serif text-sm">
              {returnData.requested_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested</span>
                  <span>{new Date(returnData.requested_at).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.approved_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span>{new Date(returnData.approved_at).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.received_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received</span>
                  <span>{new Date(returnData.received_at).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.refunded_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refunded</span>
                  <span>{new Date(returnData.refunded_at).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.rejected_at && (
                <div className="flex justify-between text-red-500">
                  <span>Rejected</span>
                  <span>{new Date(returnData.rejected_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Shipping Instructions */}
          {returnData.status === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-500/10 border border-blue-500/20 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-blue-500" />
                <h2 className="font-display text-lg tracking-wide text-blue-500">Ship Your Return</h2>
              </div>
              <p className="font-serif text-sm text-muted-foreground mb-4">
                Please ship your items to our returns center. Make sure items are securely packaged.
              </p>
              <div className="font-serif text-sm space-y-1">
                <p className="font-display text-xs tracking-wide text-muted-foreground">Return Address:</p>
                <p>Vernont Returns</p>
                <p>123 Fashion Street</p>
                <p>London, W1A 1AA</p>
                <p>United Kingdom</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Link href={`/account/orders/${returnData.order_id}`} className="block">
              <Button
                variant="outline"
                className="w-full border-border hover:border-gold"
              >
                View Original Order
              </Button>
            </Link>

            {canCancel && (
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Return Request"
                )}
              </Button>
            )}

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
    </div>
  );
}
