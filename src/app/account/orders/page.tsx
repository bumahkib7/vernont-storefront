"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  Loader2,
  ShoppingBag,
  ChevronRight,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { ordersApi, type Order } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatPriceMajor } from "@/context/CartContext";

const statusConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
  processing: { icon: Clock, color: "text-blue-600", bg: "bg-blue-500/10" },
  shipped: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10" },
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-500/10" },
  refunded: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-500/10" },
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersApi.list({ limit: 50 });
        setOrders(response.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [authLoading, isAuthenticated]);

  const filteredOrders = orders.filter((order) => {
    if (searchQuery === "") {
      return statusFilter === "all" || order.status === statusFilter;
    }

    const query = searchQuery.toLowerCase().trim().replace(/^#/, "");

    // Search by display_id
    const matchesDisplayId = order.display_id?.toString().includes(query);

    // Search by order id (last 8 characters or full id)
    const matchesOrderId = order.id.toLowerCase().includes(query);

    // Search by item titles (if items are loaded)
    const matchesItemTitle = order.items?.some(
      (item) => item.title?.toLowerCase().includes(query)
    );

    const matchesSearch = matchesDisplayId || matchesOrderId || matchesItemTitle;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="search"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/account/orders/${order.id}`}
                  className="block bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)]/30 transition-colors overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                          <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Order #{order.display_id || order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {new Date(order.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] hidden sm:block" />
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Item thumbnails */}
                        <div className="flex -space-x-2">
                          {order.items && order.items.length > 0 ? (
                            <>
                              {order.items.slice(0, 3).map((item, i) => (
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
                                      <ShoppingBag className="h-4 w-4 text-[var(--muted-foreground)]" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="h-10 w-10 border-2 border-[var(--surface)] bg-[var(--background)] rounded-lg flex items-center justify-center">
                                  <span className="text-xs text-[var(--muted-foreground)]">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-10 w-10 border-2 border-[var(--surface)] bg-[var(--background)] rounded-lg flex items-center justify-center">
                              <ShoppingBag className="h-4 w-4 text-[var(--muted-foreground)]" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {(order as any).item_count || order.items?.length || 0} {((order as any).item_count || order.items?.length || 0) === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold tabular-nums">
                          {formatPriceMajor((order.total || 0) / 100, order.currency_code?.toUpperCase() || "GBP")}
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
            <ShoppingBag className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No orders found</h3>
          {orders.length === 0 ? (
            <>
              <p className="text-[var(--muted-foreground)] mb-6">
                You haven&apos;t placed any orders yet
              </p>
              <Link href="/fragrances" className="btn-primary">
                Start Shopping
              </Link>
            </>
          ) : (
            <p className="text-[var(--muted-foreground)]">
              No orders match your search criteria
            </p>
          )}
        </div>
      )}
    </div>
  );
}
