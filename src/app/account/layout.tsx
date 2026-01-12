"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Loader2,
  RotateCcw,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

const accountNavigation = [
  { name: "Overview", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Returns", href: "/account/returns", icon: RotateCcw },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile", href: "/account/profile", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Redirect to login if not authenticated (after initial load completes)
  useEffect(() => {
    // Only redirect if we've finished loading AND we're not authenticated
    // The isAuthenticated can come from persisted Zustand state, so we trust it
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Show loading only if we're loading AND not authenticated from persisted state
  // If user is authenticated (from persisted state), show content immediately
  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
        <Footer />
      </div>
    );
  }

  // If not authenticated and not loading, we'll be redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
        <Footer />
      </div>
    );
  }

  const currentPage = accountNavigation.find((item) => item.href === pathname);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Account Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-lg font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "My Account"}
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--background)] transition-colors"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mt-6 -mb-px">
            {accountNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[var(--border)]"
          >
            <nav className="px-4 py-2">
              {accountNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0 ${
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 w-full text-[var(--destructive)]"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Breadcrumb */}
      {pathname !== "/account" && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/account" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Account
            </Link>
            <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)] font-medium">
              {currentPage?.name || "Page"}
            </span>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
