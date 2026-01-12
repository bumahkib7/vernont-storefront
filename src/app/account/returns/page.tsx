"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Loader2,
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
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
  refunded: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10", label: "Refunded" },
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

export default function ReturnsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchReturns = async () => {
      try {
        const response = await returnsApi.list({ limit: 50 });
        setReturns(response.returns || []);
      } catch (error) {
        console.error("Failed to fetch returns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReturns();
  }, [authLoading, isAuthenticated]);

  return (
    <div className="space-y-6">
      {/* Returns List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : returns.length > 0 ? (
        <div className="space-y-4">
          {returns.map((returnItem, index) => {
            const status = statusConfig[returnItem.status] || statusConfig.requested;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={returnItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/account/returns/${returnItem.id}`}
                  className="block bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)]/30 transition-colors overflow-hidden"
                >
                  {/* Return Header */}
                  <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <RotateCcw className={`h-5 w-5 ${status.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Return for Order #{returnItem.orderDisplayId || returnItem.orderId.slice(-8)}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {new Date(returnItem.requestedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] hidden sm:block" />
                      </div>
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Item thumbnails */}
                        <div className="flex -space-x-2">
                          {returnItem.items && returnItem.items.length > 0 ? (
                            returnItem.items.slice(0, 3).map((item, i) => (
                              <div
                                key={item.id || i}
                                className="h-10 w-10 border-2 border-[var(--surface)] bg-[var(--background)] rounded-lg overflow-hidden"
                              >
                                {item.thumbnail ? (
                                  <Image
                                    src={item.thumbnail}
                                    alt={item.title || "Product"}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-[var(--muted-foreground)]" />
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="h-10 w-10 border-2 border-[var(--surface)] bg-[var(--background)] rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-[var(--muted-foreground)]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">
                            {returnItem.reason ? (reasonLabels[returnItem.reason] || returnItem.reason) : "Return request"}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {returnItem.items?.length || 0} {(returnItem.items?.length || 0) === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--muted-foreground)]">Refund</p>
                        <p className="font-semibold tabular-nums">
                          {formatPriceMajor(returnItem.refundAmount / 100, returnItem.currencyCode?.toUpperCase() || "GBP")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No returns yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            You haven&apos;t requested any returns
          </p>
          <Link href="/account/orders" className="btn-primary">
            View Your Orders
          </Link>
        </div>
      )}

      {/* Return Policy Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-lg p-5"
      >
        <h3 className="font-semibold mb-4">Return Policy</h3>
        <ul className="text-sm text-[var(--muted-foreground)] space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <span>Returns accepted within 30 days of delivery</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <span>Items must be unused and in original packaging</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <span>Refunds processed within 5-7 business days of receiving return</span>
          </li>
          <li className="flex items-start gap-3">
            <Truck className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <span>Free return shipping on all orders</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
