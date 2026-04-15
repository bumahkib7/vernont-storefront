"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChatsCircle,
  X,
  PaperPlaneRight,
  SpinnerGap,
  WifiHigh,
  WifiSlash,
  Headphones,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useSupportChat, type SupportMessage } from "@/hooks/use-support-chat";

// --------------- Storage ---------------

const WIDGET_STATE_KEY = "vernont_support_widget";

function loadWidgetOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(WIDGET_STATE_KEY) === "open";
  } catch {
    return false;
  }
}

function persistWidgetOpen(open: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WIDGET_STATE_KEY, open ? "open" : "closed");
  } catch {
    // ignore
  }
}

// --------------- Message Bubble ---------------

function MessageBubble({ message, isOwn }: { message: SupportMessage; isOwn: boolean }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isFailed = message.status === "FAILED";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && message.senderRole === "ADMIN" && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 ml-1 mb-0.5 block">
            Support
          </span>
        )}
        {!isOwn && message.senderRole === "SYSTEM" && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 ml-1 mb-0.5 block">
            System
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isOwn
              ? `bg-neutral-900 text-white rounded-br-md ${isFailed ? "opacity-60" : ""}`
              : message.senderRole === "SYSTEM"
              ? "bg-blue-50 text-blue-800 border border-blue-100 rounded-bl-md"
              : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-md"
          }`}
        >
          <span className="whitespace-pre-wrap">{message.body}</span>
        </div>
        <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? "justify-end" : "justify-start"} px-1`}>
          <span className="text-[10px] text-neutral-400">{time}</span>
          {isFailed && (
            <span className="text-[10px] text-red-500 font-medium">Failed to send</span>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------- Main Component ---------------

export function SupportChat() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(loadWidgetOpen);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide support chat for admin users - they should use the admin panel
  const isAdminUser = user?.roles?.some((role: string) =>
    ["ADMIN", "CUSTOMER_SERVICE", "DEVELOPER"].includes(role)
  ) ?? false;

  const {
    messages,
    isConnected,
    isConnecting,
    conversationId,
    hasAgent,
    unreadCount,
    startConversation,
    sendMessage,
    markRead,
  } = useSupportChat(isAuthenticated && !isAdminUser ? user?.id ?? null : null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Persist open/closed state
  useEffect(() => {
    persistWidgetOpen(isOpen);
  }, [isOpen]);

  // Mark read when opening with unread messages
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markRead();
    }
  }, [isOpen, unreadCount, markRead]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isSending) return;

      setError(null);
      setIsSending(true);
      setInput("");

      try {
        // Start a new conversation if none exists
        if (!conversationId) {
          await startConversation(text);
        } else {
          await sendMessage(text);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        // Restore input so user can retry
        setInput(text);
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending, conversationId, startConversation, sendMessage]
  );

  // Hide support chat for admin users
  if (isAdminUser) {
    return null;
  }

  // If not authenticated, render a simple link to contact page
  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-[86px] right-6 z-40">
        <Link
          href="/contact"
          className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-neutral-200 rounded-full shadow-lg hover:shadow-xl hover:border-neutral-300 transition-all text-sm font-semibold text-neutral-800"
        >
          <Headphones className="w-5 h-5 text-neutral-600" />
          Need Help?
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Collapsed button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[86px] right-6 z-40"
          >
            <button
              onClick={handleOpen}
              className="relative flex items-center gap-2.5 px-5 py-3 bg-white border-2 border-neutral-200 rounded-full shadow-lg hover:shadow-xl hover:border-neutral-300 transition-all group"
              aria-label="Open live support chat"
            >
              <Headphones className="w-5 h-5 text-neutral-700 group-hover:text-neutral-900 transition-colors" />
              <span className="text-sm font-semibold text-neutral-800">
                Need Help?
              </span>
              {/* Unread badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[86px] right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 flex-shrink-0 bg-gradient-to-r from-neutral-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center">
                  <ChatsCircle className="w-5 h-5 text-white" weight="fill" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Live Support
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {isConnected ? (
                      <>
                        <WifiHigh className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Connected
                        </span>
                      </>
                    ) : isConnecting ? (
                      <>
                        <SpinnerGap className="w-3 h-3 text-amber-500 animate-spin" />
                        <span className="text-[10px] text-amber-600 font-medium">
                          Connecting...
                        </span>
                      </>
                    ) : (
                      <>
                        <WifiSlash className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400 font-medium">
                          Offline
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close support chat"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-neutral-50/40">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center text-center pt-8 pb-4">
                  <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Headphones className="w-7 h-7 text-neutral-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                    How can we help?
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed mb-4">
                    Send us a message and our support team will get back to you
                    as soon as possible.
                  </p>
                  <div className="space-y-2 w-full">
                    {[
                      "I have a question about my order",
                      "I need help with a return",
                      "I need sizing advice",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-left font-medium text-neutral-700 hover:border-neutral-300 hover:shadow-sm transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.senderRole === "CUSTOMER"}
                    />
                  ))}

                  {/* Waiting for agent notice */}
                  {conversationId && !hasAgent && (
                    <div className="flex justify-center py-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-[11px] text-amber-700 font-medium">
                        <SpinnerGap className="w-3 h-3 animate-spin" />
                        Waiting for support agent...
                      </span>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error notice */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Input area */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2.5 px-4 py-3.5 border-t border-neutral-200 bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isSending
                    ? "Sending..."
                    : "Type your message..."
                }
                disabled={isSending}
                className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                {isSending ? (
                  <SpinnerGap className="w-4 h-4 animate-spin" />
                ) : (
                  <PaperPlaneRight className="w-4 h-4" weight="fill" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
