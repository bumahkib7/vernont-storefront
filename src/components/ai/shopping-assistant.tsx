"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatCircle,
  X,
  PaperPlaneRight,
  SpinnerGap,
  Sparkle,
  ArrowCounterClockwise,
  MagnifyingGlass,
  Package,
  ShoppingCart,
  ArrowClockwise,
  Eye,
  Tag,
  Headphones,
  XCircle,
  ShoppingBag,
  GitDiff,
  Shuffle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { aiApi, resolveImageUrl, ApiError } from "@/lib/api";
import { useShoppingAssistantStore } from "@/stores/shopping-assistant";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

// ---------- Types ----------
interface ToolActivity {
  toolName: string;
  toolId: string;
  status: "executing" | "complete" | "error";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tools: ToolActivity[];
}

// ---------- Tool Display Config ----------
const TOOL_META: Record<string, { icon: typeof MagnifyingGlass; label: string; activeLabel: string }> = {
  search_products:      { icon: MagnifyingGlass,       label: "Searched products",        activeLabel: "Searching products..." },
  get_product_details:  { icon: Eye,          label: "Viewed product details",   activeLabel: "Loading product details..." },
  check_stock:          { icon: Package,      label: "Checked stock",            activeLabel: "Checking availability..." },
  add_to_cart:          { icon: ShoppingCart,  label: "Added to cart",            activeLabel: "Adding to cart..." },
  remove_from_cart:     { icon: ShoppingCart,  label: "Removed from cart",        activeLabel: "Removing from cart..." },
  get_cart:             { icon: ShoppingCart,  label: "Viewed cart",              activeLabel: "Loading cart..." },
  apply_promo_code:     { icon: Tag,          label: "Applied promo code",       activeLabel: "Applying promo code..." },
  get_customer_orders:  { icon: Package,      label: "Loaded orders",            activeLabel: "Looking up orders..." },
  get_order:            { icon: Package,      label: "Loaded order details",     activeLabel: "Loading order..." },
  get_order_by_display_id: { icon: Package,   label: "Found order",             activeLabel: "Finding order..." },
  check_return_eligibility: { icon: ArrowClockwise, label: "Checked return eligibility", activeLabel: "Checking return eligibility..." },
  initiate_return:      { icon: ArrowClockwise,     label: "Initiated return",         activeLabel: "Initiating return..." },
  get_return_status:    { icon: ArrowClockwise,     label: "Checked return status",    activeLabel: "Checking return status..." },
  cancel_return:        { icon: ArrowClockwise,     label: "Cancelled return",         activeLabel: "Cancelling return..." },
  get_return_reasons:   { icon: ArrowClockwise,     label: "Loaded return reasons",    activeLabel: "Loading return reasons..." },
  escalate_to_human:    { icon: Headphones,   label: "Escalated to support",     activeLabel: "Connecting to support..." },
  compare_products:     { icon: GitDiff, label: "Compared products",    activeLabel: "Comparing products..." },
  find_similar_products: { icon: Shuffle,      label: "Found similar products",   activeLabel: "Finding similar products..." },
};

// ---------- Helpers ----------
const QUICK_SUGGESTIONS = [
  "What's trending right now?",
  "Show me sunglasses under £300",
  "Help me find frames for my face shape",
  "What's new this season?",
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return generateId();
  const key = "vernont_ai_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = generateId();
    localStorage.setItem(key, id);
  }
  return id;
}

// ---------- Sub-components ----------

/** Compact tool activity pill */
function ToolPill({ tool }: { tool: ToolActivity }) {
  const meta = TOOL_META[tool.toolName] || {
    icon: Sparkle,
    label: tool.toolName.replace(/_/g, " "),
    activeLabel: `Running ${tool.toolName.replace(/_/g, " ")}...`,
  };
  const Icon = meta.icon;
  const isActive = tool.status === "executing";
  const isError = tool.status === "error";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
        isActive
          ? "bg-blue-50 text-blue-700 animate-pulse"
          : isError
          ? "bg-red-50 text-red-600"
          : "bg-neutral-50 text-neutral-600"
      }`}
    >
      {isActive ? (
        <SpinnerGap className="w-3 h-3 animate-spin" />
      ) : isError ? (
        <XCircle className="w-3 h-3" />
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {isActive ? meta.activeLabel : meta.label}
    </span>
  );
}

/** Markdown message renderer with product images */
function MessageContent({ content }: { content: string }) {
  if (!content) return null;

  const processed = content.replace(
    /\[Attached image:\s*(https?:\/\/[^\]]+)\]/g,
    "![]($1)"
  );

  return (
    <Markdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
        code: ({ children, className: cn }) => {
          if (cn?.includes("language-")) {
            return (
              <pre className="my-2 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs text-neutral-100">
                <code className="font-mono">{children}</code>
              </pre>
            );
          }
          return <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800">{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
        a: ({ href, children }) => {
          // If it's a product link, render as a styled link
          if (href?.startsWith("/product/")) {
            return (
              <Link href={href} className="text-neutral-900 underline underline-offset-2 font-medium hover:text-neutral-600 transition-colors">
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors">
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => {
          const resolved = resolveImageUrl(typeof src === "string" ? src : undefined);
          if (!resolved) return null;
          return (
            <span className="my-2 block">
              <span className="relative block overflow-hidden rounded-lg border border-neutral-200 max-w-[200px] shadow-sm">
                <Image
                  src={resolved}
                  alt={alt || "Product"}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover"
                />
              </span>
            </span>
          );
        },
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto rounded-lg border border-neutral-200 shadow-sm">
            <table className="w-full text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-neutral-50 border-b border-neutral-200">{children}</thead>,
        th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-neutral-900">{children}</th>,
        td: ({ children }) => <td className="border-t border-neutral-100 px-3 py-2 text-neutral-700">{children}</td>,
      }}
    >
      {processed}
    </Markdown>
  );
}

// ---------- Main Component ----------
export function ShoppingAssistant() {
  const {
    isOpen, productContext, prefillMessage, nudgeMessage,
    open, close, clearContext, dismissNudge, showNudge,
  } = useShoppingAssistantStore();

  const { addItem } = useCart();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Handle prefilled message from store
  useEffect(() => {
    if (isOpen && prefillMessage) {
      sendMessage(prefillMessage);
      clearContext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefillMessage]);

  // Proactive nudge after browsing for a while
  useEffect(() => {
    if (hasInteracted || isOpen) return;
    const timer = setTimeout(() => {
      showNudge("Need help finding the perfect pair? I can search for you!");
    }, 15000); // 15s after page load
    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen, showNudge]);

  // Product context nudge
  useEffect(() => {
    if (productContext && !isOpen && !hasInteracted) {
      const timer = setTimeout(() => {
        showNudge(`Want to know more about ${productContext.name}? Ask me!`);
      }, 8000); // 8s on product page
      return () => clearTimeout(timer);
    }
  }, [productContext, isOpen, hasInteracted, showNudge]);

  // NDJSON streaming chat
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;
      setHasInteracted(true);

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
        tools: [],
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      setRateLimited(false);

      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date(), tools: [] },
      ]);

      try {
        const response = await aiApi.chat(sessionId, text.trim());
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";
        const toolActivities: ToolActivity[] = [];

        const updateMsg = () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated, tools: [...toolActivities] } : m
            )
          );
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const jsonStr = trimmed.startsWith("data: ") ? trimmed.slice(6) : trimmed;
            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);

              switch (parsed.type) {
                case "message": {
                  const token = parsed.content || parsed.text || parsed.delta || "";
                  if (token) {
                    accumulated += token;
                    updateMsg();
                  }
                  break;
                }
                case "tool_call": {
                  toolActivities.push({
                    toolName: parsed.tool,
                    toolId: parsed.tool_id || generateId(),
                    status: "executing",
                  });
                  updateMsg();
                  break;
                }
                case "tool_result": {
                  const idx = toolActivities.findIndex(
                    (t) => t.toolId === parsed.tool_id || t.toolName === parsed.tool
                  );
                  if (idx !== -1) {
                    toolActivities[idx].status = parsed.status === "error" ? "error" : "complete";
                  }
                  updateMsg();
                  break;
                }
                case "done":
                  break;
                case "error":
                  accumulated += "\n\nSorry, something went wrong. Please try again.";
                  updateMsg();
                  break;
                default: {
                  const fallback = parsed.content || parsed.delta || parsed.text || "";
                  if (fallback) {
                    accumulated += fallback;
                    updateMsg();
                  }
                }
              }
            } catch {
              if (jsonStr.trim()) {
                accumulated += jsonStr;
                updateMsg();
              }
            }
          }
        }

        if (!accumulated) {
          accumulated = "I'm sorry, I couldn't generate a response. Please try again.";
          updateMsg();
        }
      } catch (err) {
        const errorText =
          err instanceof ApiError && err.status === 429
            ? "You're sending messages too quickly. Please wait a moment."
            : "Sorry, I'm having trouble right now. Please try again in a moment.";

        if (err instanceof ApiError && err.status === 429) setRateLimited(true);

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: errorText } : m))
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, sessionId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleProductQuestion = () => {
    if (productContext) {
      const text = `Tell me about the ${productContext.name}${productContext.brand ? ` by ${productContext.brand}` : ""}. Is it available? What should I know before buying?`;
      sendMessage(text);
      clearContext();
    }
  };

  const handleNewConversation = async () => {
    try {
      await aiApi.clearSession(sessionId);
    } catch {
      // Silently ignore
    }
    setMessages([]);
    setRateLimited(false);
    if (typeof window !== "undefined") {
      const newId = generateId();
      localStorage.setItem("vernont_ai_session", newId);
    }
  };

  return (
    <>
      {/* Nudge Banner + Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Proactive nudge - Less intrusive, positioned higher */}
            <AnimatePresence>
              {nudgeMessage && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative max-w-[260px] bg-white border-2 border-neutral-200 text-neutral-900 text-xs leading-relaxed px-4 py-3 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl hover:border-neutral-300 transition-all"
                  onClick={() => { dismissNudge(); open(); }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); dismissNudge(); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3 h-3 text-neutral-600" />
                  </button>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkle className="w-3 h-3 text-white" weight="fill" />
                    </div>
                    <span className="font-medium">{nudgeMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat bubble - Modern gradient style */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => { setHasInteracted(true); open(); }}
              className="w-16 h-16 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group relative"
              aria-label="Open AI shopping assistant"
            >
              <ChatCircle className="w-7 h-7 group-hover:scale-110 transition-transform" weight="fill" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <Sparkle className="w-2.5 h-2.5 text-white" weight="fill" />
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window - Redesigned with Pretavoir style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
          >
            {/* Header - Modern clean design */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <Sparkle className="w-5 h-5 text-white" weight="fill" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Shopping Assistant</h3>
                  <p className="text-xs text-neutral-500">AI-powered personal stylist</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleNewConversation}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="New conversation"
                    aria-label="Start new conversation"
                  >
                    <ArrowCounterClockwise className="w-5 h-5 text-neutral-600" />
                  </button>
                )}
                <button
                  onClick={close}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-neutral-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center text-center pt-6 pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Sparkle className="w-8 h-8 text-white" weight="fill" />
                  </div>
                  <h4 className="font-semibold text-base text-neutral-900 mb-1">Your personal stylist</h4>
                  <p className="text-sm text-neutral-600 mb-6 max-w-[280px] leading-relaxed">
                    I search our catalog, check stock, find the best match for you, and add to your bag — all in one conversation.
                  </p>

                  {/* Product context card */}
                  {productContext && (
                    <button
                      onClick={handleProductQuestion}
                      className="w-full mb-4 px-4 py-3.5 bg-white border-2 border-neutral-200 rounded-xl text-left hover:border-neutral-900 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {productContext.image && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
                            <Image
                              src={resolveImageUrl(productContext.image) || ""}
                              alt={productContext.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block mb-0.5">Ask about this product</span>
                          <span className="text-sm font-semibold text-neutral-900 block truncate group-hover:text-neutral-700">{productContext.name}</span>
                          {productContext.price && (
                            <span className="text-xs text-neutral-600">{productContext.price}</span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Sparkle className="w-4 h-4 text-white" weight="fill" />
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Quick action buttons */}
                  <div className="w-full space-y-2">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl text-sm text-left font-medium text-neutral-900 hover:border-neutral-900 hover:shadow-md transition-all flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <MagnifyingGlass className="w-4 h-4 text-neutral-600" />
                        </div>
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    {[
                      { icon: MagnifyingGlass, label: "Smart search" },
                      { icon: ShoppingBag, label: "Add to bag" },
                      { icon: Package, label: "Track orders" },
                      { icon: ArrowClockwise, label: "Easy returns" },
                    ].map(({ icon: Icon, label }) => (
                      <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 shadow-sm">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%] min-w-0">
                      {/* Tool activity pills */}
                      {msg.role === "assistant" && msg.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {msg.tools.map((tool) => (
                            <ToolPill key={tool.toolId} tool={tool} />
                          ))}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden break-words shadow-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-br-md"
                            : "bg-white text-neutral-800 border border-neutral-200 rounded-bl-md"
                        }`}
                      >
                        {msg.content ? (
                          msg.role === "assistant" ? (
                            <MessageContent content={msg.content} />
                          ) : (
                            <span className="whitespace-pre-wrap font-medium">{msg.content}</span>
                          )
                        ) : (
                          <span className="flex items-center gap-2 text-neutral-400">
                            <SpinnerGap className="w-4 h-4 animate-spin" />
                            Looking into it...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Rate limit warning */}
            {rateLimited && (
              <div className="px-5 py-3 bg-yellow-50 border-t border-yellow-200 text-sm text-yellow-800 font-medium">
                Please wait a moment before sending another message.
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-4 border-t border-neutral-200 bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isStreaming ? "AI is responding..." : "Ask about products, orders, or anything..."}
                disabled={isStreaming}
                className="flex-1 px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-xl text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="p-3 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex-shrink-0"
                aria-label="Send message"
              >
                {isStreaming ? (
                  <SpinnerGap className="w-5 h-5 animate-spin" />
                ) : (
                  <PaperPlaneRight className="w-5 h-5" weight="fill" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
