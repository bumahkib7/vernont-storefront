"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  title?: string | null;
  thumbnail?: string | null;
  refund_amount?: number | null;
}

interface Return {
  id: string;
  order_id: string;
  order_display_id?: number | null;
  status: string;
  reason?: string | null;
  reason_note?: string | null;
  refund_amount?: number | null;
  currency_code?: string | null;
  created_at: string;
  updated_at: string;
  items?: ReturnItem[] | null;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  requested: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500", label: "Requested" },
  approved: { icon: CheckCircle, color: "bg-blue-500/10 text-blue-500", label: "Approved" },
  received: { icon: Package, color: "bg-indigo-500/10 text-indigo-500", label: "Received" },
  refunded: { icon: CheckCircle, color: "bg-green-500/10 text-green-500", label: "Refunded" },
  rejected: { icon: XCircle, color: "bg-red-500/10 text-red-500", label: "Rejected" },
  canceled: { icon: XCircle, color: "bg-gray-500/10 text-gray-500", label: "Canceled" },
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl tracking-wide mb-2">Your Returns</h1>
        <p className="font-serif text-muted-foreground">
          Track and manage your return requests
        </p>
      </div>

      {/* Returns List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : returns.length > 0 ? (
        <div className="space-y-4">
          {returns.map((returnItem, index) => {
            const status = statusConfig[returnItem.status] || statusConfig.requested;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={returnItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/account/returns/${returnItem.id}`}
                  className="block bg-card border border-border hover:border-gold/50 transition-colors"
                >
                  {/* Return Header */}
                  <div className="p-4 sm:p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                          <RotateCcw className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <p className="font-display text-lg tracking-wide">
                            Return for Order #{returnItem.order_display_id || returnItem.order_id.slice(-8)}
                          </p>
                          <p className="font-serif text-sm text-muted-foreground">
                            {new Date(returnItem.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-serif rounded flex items-center gap-2 ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                      </div>
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Item thumbnails */}
                        <div className="flex -space-x-2">
                          {returnItem.items?.slice(0, 3).map((item, i) => (
                            <div
                              key={item.item_id || i}
                              className="h-12 w-12 border-2 border-background bg-secondary rounded overflow-hidden"
                            >
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title || "Product"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-serif text-sm">
                            {returnItem.reason ? (reasonLabels[returnItem.reason] || returnItem.reason) : "Not specified"}
                          </p>
                          <p className="font-serif text-xs text-muted-foreground">
                            {returnItem.items?.length || 0} item{(returnItem.items?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-xs text-muted-foreground">Refund Amount</p>
                        <p className="font-display text-xl tracking-wide">
                          ${((returnItem.refund_amount ?? 0) / 100).toFixed(2)}
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
        <div className="text-center py-16 bg-card border border-border">
          <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display text-xl tracking-wide mb-2">No returns yet</h3>
          <p className="font-serif text-muted-foreground mb-6">
            You haven&apos;t requested any returns
          </p>
          <Link href="/account/orders">
            <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
              View Your Orders
            </Button>
          </Link>
        </div>
      )}

      {/* Return Policy Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-secondary/30 border border-border p-6"
      >
        <h3 className="font-display text-lg tracking-wide mb-4">Return Policy</h3>
        <ul className="font-serif text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
            <span>Returns accepted within 14 days of delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
            <span>Items must be unused and in original packaging</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
            <span>Refunds processed within 5-7 business days of receiving return</span>
          </li>
          <li className="flex items-start gap-2">
            <Truck className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
            <span>Free return shipping on all orders</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
