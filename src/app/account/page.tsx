"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Heart,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ordersApi, customerApi } from "@/lib/api";
import { formatPriceMajor } from "@/context/CartContext";

interface Order {
  id: string;
  display_id?: number | null;
  status: string;
  total: number;
  created_at: string;
  currency_code: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    thumbnail?: string | null;
  }> | null;
}

interface Address {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  city?: string | null;
  country_code?: string | null;
  postal_code?: string | null;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-500" />;
    case "processing":
    case "pending":
      return <Clock className="h-4 w-4 text-amber-500" />;
    default:
      return <Package className="h-4 w-4 text-[var(--muted-foreground)]" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-green-500/10 text-green-600";
    case "shipped":
      return "bg-blue-500/10 text-blue-600";
    case "processing":
    case "pending":
      return "bg-amber-500/10 text-amber-600";
    case "cancelled":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-[var(--muted)]/10 text-[var(--muted-foreground)]";
  }
};

export default function AccountDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoadingOrders(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersApi.list({ limit: 3 });
        setRecentOrders(response.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoadingAddresses(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await customerApi.listAddresses();
        setAddresses(response.addresses || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [authLoading, isAuthenticated]);

  const defaultAddress = addresses[0];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold">{recentOrders.length}</p>
          <p className="text-sm text-[var(--muted-foreground)]">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <MapPin className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold">{addresses.length}</p>
          <p className="text-sm text-[var(--muted-foreground)]">Saved Addresses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-[var(--muted-foreground)]">Wishlist Items</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-[var(--muted-foreground)]">Payment Methods</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="font-semibold">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--background)] transition-colors"
                  >
                    {/* Order image or icon */}
                    <div className="h-14 w-14 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {order.items?.[0]?.thumbnail ? (
                        <Image
                          src={order.items[0].thumbnail}
                          alt=""
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-[var(--muted-foreground)]" />
                      )}
                    </div>

                    {/* Order details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          Order #{order.display_id || order.id.slice(-8)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {order.items && order.items.length > 0 && (
                          <span className="ml-2">
                            ({order.items.length} {order.items.length === 1 ? "item" : "items"})
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Price and arrow */}
                    <div className="flex items-center gap-3">
                      <p className="font-semibold tabular-nums">
                        {formatPriceMajor(order.total / 100, order.currency_code?.toUpperCase() || "GBP")}
                      </p>
                      <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-[var(--muted-foreground)]" />
                </div>
                <p className="font-medium mb-1">No orders yet</p>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  When you place an order, it will appear here
                </p>
                <Link href="/fragrances" className="btn-primary btn-sm">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Default Address */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="font-semibold">Default Address</h2>
              <Link
                href="/account/addresses"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Manage
              </Link>
            </div>

            {isLoadingAddresses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
              </div>
            ) : defaultAddress ? (
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-[var(--muted-foreground)] flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {defaultAddress.first_name} {defaultAddress.last_name}
                    </p>
                    <p className="text-[var(--muted-foreground)]">{defaultAddress.address_1}</p>
                    <p className="text-[var(--muted-foreground)]">
                      {defaultAddress.city}
                      {defaultAddress.postal_code && `, ${defaultAddress.postal_code}`}
                    </p>
                    <p className="text-[var(--muted-foreground)]">
                      {defaultAddress.country_code?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  No address saved yet
                </p>
                <Link
                  href="/account/addresses"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Add address
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              <Link
                href="/account/orders"
                className="flex items-center gap-3 p-4 hover:bg-[var(--background)] transition-colors"
              >
                <Package className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">Track an order</span>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
              <Link
                href="/account/returns"
                className="flex items-center gap-3 p-4 hover:bg-[var(--background)] transition-colors"
              >
                <Package className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">Start a return</span>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
              <Link
                href="/account/profile"
                className="flex items-center gap-3 p-4 hover:bg-[var(--background)] transition-colors"
              >
                <Settings className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">Edit profile</span>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-4 hover:bg-[var(--background)] transition-colors"
              >
                <Heart className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">View wishlist</span>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] ml-auto" />
              </Link>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Need help?</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-3">
              Our support team is here to assist you with any questions.
            </p>
            <Link
              href="/contact"
              className="text-sm text-[var(--primary)] hover:underline font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
