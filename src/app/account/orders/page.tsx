"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Loader2, ShoppingBag, ChevronRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ordersApi, type Order } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-indigo-500/10 text-indigo-500",
  delivered: "bg-green-500/10 text-green-500",
  completed: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
  refunded: "bg-gray-500/10 text-gray-500",
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.display_id?.toString().includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl tracking-wide mb-2">Your Orders</h1>
        <p className="font-serif text-muted-foreground">
          View and track your order history
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 font-serif bg-background border-border focus:border-gold"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 font-serif bg-background border border-border px-4 focus:border-gold focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/account/orders/${order.id}`}
                className="block bg-card border border-border hover:border-gold/50 transition-colors"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-display text-lg tracking-wide">
                          Order #{order.display_id || order.id.slice(-8)}
                        </p>
                        <p className="font-serif text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 text-sm font-serif rounded ${
                          statusColors[order.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Item thumbnails */}
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div
                            key={item.id || i}
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
                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <div className="h-12 w-12 border-2 border-background bg-secondary rounded flex items-center justify-center">
                            <span className="text-xs font-serif text-muted-foreground">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-sm text-muted-foreground">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl tracking-wide">
                        ${((order.total || 0) / 100).toFixed(2)}
                      </p>
                      <p className="font-serif text-xs text-muted-foreground uppercase">
                        {order.currency_code || "USD"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display text-xl tracking-wide mb-2">No orders found</h3>
          {orders.length === 0 ? (
            <>
              <p className="font-serif text-muted-foreground mb-6">
                You haven&apos;t placed any orders yet
              </p>
              <Link href="/fragrances">
                <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                  Start Shopping
                </Button>
              </Link>
            </>
          ) : (
            <p className="font-serif text-muted-foreground">
              No orders match your search criteria
            </p>
          )}
        </div>
      )}
    </div>
  );
}
