"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Package, MapPin, Heart, Settings, LogOut, Loader2, RotateCcw } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";

const accountNavigation = [
  { name: "Dashboard", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Returns", href: "/account/returns", icon: RotateCcw },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Settings", href: "/account/profile", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </PageLayout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-[80vh] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:w-64 flex-shrink-0"
            >
              {/* User Info */}
              <div className="mb-6 p-6 bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center text-xl font-display text-gold">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-display text-lg tracking-wide">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="font-serif text-sm text-muted-foreground truncate max-w-[150px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {accountNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 font-serif text-sm transition-colors ${
                        isActive
                          ? "bg-gold/10 text-gold border-l-2 border-gold"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full font-serif text-sm text-destructive hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
