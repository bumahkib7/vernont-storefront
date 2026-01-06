"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, MapPin, Heart, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ordersApi, customerApi } from "@/lib/api";

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
}

export default function AccountDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Fetch recent orders (only when authenticated)
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

  // Fetch addresses (only when authenticated)
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

  const quickLinks = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Your Addresses",
      description: "Edit addresses for orders",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Your Wishlist",
      description: "View your saved items",
      icon: Heart,
      href: "/wishlist",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-3xl tracking-wide mb-2">
          Welcome back, {user?.firstName || "there"}
        </h1>
        <p className="font-serif text-muted-foreground">
          Manage your account and view your orders
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={link.href}
              className="block p-6 bg-card border border-border hover:border-gold/50 transition-colors group"
            >
              <link.icon className="h-8 w-8 mb-4 text-gold" />
              <h3 className="font-display text-lg tracking-wide mb-1 group-hover:text-gold transition-colors">
                {link.title}
              </h3>
              <p className="font-serif text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl tracking-wide">Recent Orders</h2>
          <Link href="/account/orders">
            <Button variant="ghost" className="text-gold hover:text-gold/80">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-border hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-secondary flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-sm tracking-wide">
                      Order #{order.display_id || order.id.slice(-8)}
                    </p>
                    <p className="font-serif text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm tracking-wide">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-serif rounded ${
                      order.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "shipped"
                        ? "bg-blue-500/10 text-blue-500"
                        : order.status === "processing"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-serif text-muted-foreground mb-4">
              You haven&apos;t placed any orders yet
            </p>
            <Link href="/fragrances">
              <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Default Address */}
      <div className="bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl tracking-wide">Default Address</h2>
          <Link href="/account/addresses">
            <Button variant="ghost" className="text-gold hover:text-gold/80">
              Manage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoadingAddresses ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : defaultAddress ? (
          <div className="p-4 border border-border">
            <p className="font-display text-sm tracking-wide mb-1">
              {defaultAddress.first_name} {defaultAddress.last_name}
            </p>
            <p className="font-serif text-sm text-muted-foreground">
              {defaultAddress.address_1}
            </p>
            <p className="font-serif text-sm text-muted-foreground">
              {defaultAddress.city}, {defaultAddress.country_code}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-serif text-muted-foreground mb-4">
              No addresses saved yet
            </p>
            <Link href="/account/addresses">
              <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                Add Address
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
