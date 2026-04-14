"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CaretLeft,
  SpinnerGap,
  Clock,
  CheckCircle,
  XCircle,
  PaperPlaneRight,
  User,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  body: string;
  senderType: "CUSTOMER" | "ADMIN" | "SYSTEM";
  senderName?: string;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  messages: TicketMessage[];
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ticketId = params.id as string;

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/proxy/store/support/tickets/${ticketId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load ticket");
        const data = await res.json();
        setTicket(data.ticket || data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
        toast.error("Failed to load ticket");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [authLoading, isAuthenticated, ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/proxy/store/support/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: replyText.trim() }),
      });

      if (!res.ok) throw new Error("Failed to send reply");
      const data = await res.json();

      // Append the new message to the conversation
      if (data.message) {
        setTicket((prev) =>
          prev ? { ...prev, messages: [...prev.messages, data.message] } : prev
        );
      } else {
        // Refetch the full ticket if response doesn't include the message
        const refetch = await fetch(`${API_BASE}/api/proxy/store/support/tickets/${ticketId}`, {
          credentials: "include",
        });
        if (refetch.ok) {
          const refreshed = await refetch.json();
          setTicket(refreshed.ticket || refreshed);
        }
      }

      setReplyText("");
      toast.success("Reply sent");
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (isClosing) return;
    setIsClosing(true);
    try {
      const res = await fetch(`${API_BASE}/api/proxy/store/support/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: "Customer confirmed resolution and closed the ticket.", close: true }),
      });

      if (!res.ok) throw new Error("Failed to close ticket");

      setTicket((prev) => prev ? { ...prev, status: "CLOSED" } : prev);
      toast.success("Ticket closed");
    } catch (error) {
      console.error("Failed to close ticket:", error);
      toast.error("Failed to close ticket");
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerGap className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <h3 className="font-semibold text-lg mb-2">Ticket not found</h3>
        <p className="text-[var(--muted-foreground)] mb-4">
          This ticket may not exist or you don&apos;t have access to it.
        </p>
        <Link href="/account/support" className="btn-primary">
          Back to Tickets
        </Link>
      </div>
    );
  }

  const status = statusConfig[ticket.status] || statusConfig.OPEN;
  const StatusIcon = status.icon;
  const isClosed = ticket.status === "CLOSED";
  const canClose = ticket.status === "RESOLVED";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/account/support"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <CaretLeft className="h-4 w-4" />
        Back to Tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main conversation area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket header */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">
                    #{ticket.ticketNumber}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{ticket.subject}</h2>
              </div>
              <div className={`h-10 w-10 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
              </div>
            </div>
          </div>

          {/* Conversation thread */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {ticket.messages.map((msg) => {
                if (msg.senderType === "SYSTEM") {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <p className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-3 py-1.5 rounded-full">
                        {msg.body}
                      </p>
                    </div>
                  );
                }

                const isCustomer = msg.senderType === "CUSTOMER";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${isCustomer ? "order-1" : ""}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isCustomer ? "justify-end" : ""}`}>
                        {!isCustomer && (
                          <div className="h-5 w-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <User className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-[var(--muted-foreground)]">
                          {isCustomer ? "You" : msg.senderName || "Support"}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {new Date(msg.createdAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
                          isCustomer
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--background)] border border-[var(--border)]"
                        }`}
                      >
                        {msg.body}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            {!isClosed && (
              <form onSubmit={handleSendReply} className="border-t border-[var(--border)] p-4">
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSending}
                    className="self-end px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                  >
                    {isSending ? (
                      <SpinnerGap className="h-4 w-4 animate-spin" />
                    ) : (
                      <PaperPlaneRight className="h-4 w-4" />
                    )}
                    Send
                  </button>
                </div>
              </form>
            )}

            {isClosed && (
              <div className="border-t border-[var(--border)] p-4 text-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  This ticket is closed. Need more help?{" "}
                  <Link href="/contact" className="text-[var(--primary)] hover:underline">
                    Create a new ticket
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">Ticket Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Status</span>
                <span className={`font-medium ${status.color}`}>{status.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Priority</span>
                <span className="font-medium">{ticket.priority}</span>
              </div>
              {ticket.category && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Category</span>
                  <span className="font-medium">{ticket.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Created</span>
                <span className="font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Updated</span>
                <span className="font-medium">
                  {new Date(ticket.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Close ticket button (only when RESOLVED) */}
          {canClose && (
            <button
              onClick={handleCloseTicket}
              disabled={isClosing}
              className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isClosing ? (
                <SpinnerGap className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Close Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
