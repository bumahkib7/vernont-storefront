"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChatCircle,
  SpinnerGap,
  CaretRight,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { icon: typeof Clock; label: string; color: string; bg: string }> = {
  OPEN: { icon: Clock, label: "Open", color: "text-blue-600", bg: "bg-blue-500/10" },
  IN_PROGRESS: { icon: Clock, label: "In Progress", color: "text-amber-600", bg: "bg-amber-500/10" },
  WAITING_ON_CUSTOMER: { icon: Clock, label: "Awaiting Reply", color: "text-orange-600", bg: "bg-orange-500/10" },
  RESOLVED: { icon: CheckCircle, label: "Resolved", color: "text-green-600", bg: "bg-green-500/10" },
  CLOSED: { icon: XCircle, label: "Closed", color: "text-gray-600", bg: "bg-gray-500/10" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-gray-500" },
  MEDIUM: { label: "Medium", color: "text-blue-500" },
  HIGH: { label: "High", color: "text-orange-500" },
  URGENT: { label: "Urgent", color: "text-red-500" },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type FilterTab = "all" | "open" | "resolved";

export default function SupportTicketsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch(`/api/proxy/store/support/tickets`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load tickets");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch support tickets:", error);
        toast.error("Failed to load support tickets");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [authLoading, isAuthenticated]);

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open") {
      return ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER"].includes(ticket.status);
    }
    if (activeTab === "resolved") {
      return ["RESOLVED", "CLOSED"].includes(ticket.status);
    }
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "resolved", label: "Resolved" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Support Tickets</h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <SpinnerGap className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-3">
          {filteredTickets.map((ticket, index) => {
            const status = statusConfig[ticket.status] || statusConfig.OPEN;
            const priority = priorityConfig[ticket.priority] || priorityConfig.MEDIUM;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/account/support/${ticket.id}`}
                  className="block bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)]/30 transition-colors p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`h-10 w-10 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-[var(--muted-foreground)]">
                            #{ticket.ticketNumber}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                          <span className={`text-xs font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                        <p className="font-medium text-sm truncate">
                          {ticket.subject}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {ticket.category && (
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {ticket.category}
                            </span>
                          )}
                          <span className="text-xs text-[var(--muted-foreground)]">
                            Updated {new Date(ticket.updatedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CaretRight className="h-4 w-4 text-[var(--muted-foreground)] flex-shrink-0 mt-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
            <ChatCircle className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No support tickets yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
            Need help? Create a ticket or use our live chat.
          </p>
          <Link href="/contact" className="btn-primary">
            Create a Ticket
          </Link>
        </div>
      )}
    </div>
  );
}
