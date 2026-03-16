"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
  Search,
  Package,
  ShoppingCart,
  RotateCw,
  Eye,
  Tag,
  Headphones,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import { aiApi, resolveImageUrl, ApiError } from "@/lib/api";
import { useShoppingAssistantStore } from "@/stores/shopping-assistant";
import Image from "next/image";

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
const TOOL_META: Record<string, { icon: typeof Search; label: string; activeLabel: string }> = {
  search_products:      { icon: Search,       label: "Searched products",        activeLabel: "Searching products..." },
  get_product_details:  { icon: Eye,          label: "Viewed product details",   activeLabel: "Loading product details..." },
  check_stock:          { icon: Package,      label: "Checked stock",            activeLabel: "Checking availability..." },
  add_to_cart:          { icon: ShoppingCart,  label: "Added to cart",            activeLabel: "Adding to cart..." },
  remove_from_cart:     { icon: ShoppingCart,  label: "Removed from cart",        activeLabel: "Removing from cart..." },
  get_cart:             { icon: ShoppingCart,  label: "Viewed cart",              activeLabel: "Loading cart..." },
  apply_promo_code:     { icon: Tag,          label: "Applied promo code",       activeLabel: "Applying promo code..." },
  get_customer_orders:  { icon: Package,      label: "Loaded orders",            activeLabel: "Looking up orders..." },
  get_order:            { icon: Package,      label: "Loaded order details",     activeLabel: "Loading order..." },
  get_order_by_display_id: { icon: Package,   label: "Found order",             activeLabel: "Finding order..." },
  check_return_eligibility: { icon: RotateCw, label: "Checked return eligibility", activeLabel: "Checking return eligibility..." },
  initiate_return:      { icon: RotateCw,     label: "Initiated return",         activeLabel: "Initiating return..." },
  get_return_status:    { icon: RotateCw,     label: "Checked return status",    activeLabel: "Checking return status..." },
  cancel_return:        { icon: RotateCw,     label: "Cancelled return",         activeLabel: "Cancelling return..." },
  get_return_reasons:   { icon: RotateCw,     label: "Loaded return reasons",    activeLabel: "Loading return reasons..." },
  escalate_to_human:    { icon: Headphones,   label: "Escalated to support",     activeLabel: "Connecting to support..." },
};

// ---------- Helpers ----------
const QUICK_SUGGESTIONS = [
  "Help me find the right pair",
  "What's on sale?",
  "Size guide",
  "Recommend something popular",
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
    icon: Sparkles,
    label: tool.toolName.replace(/_/g, " "),
    activeLabel: `Running ${tool.toolName.replace(/_/g, " ")}...`,
  };
  const Icon = meta.icon;
  const isActive = tool.status === "executing";
  const isError = tool.status === "error";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
        isActive
          ? "bg-neutral-100 text-neutral-600 animate-pulse"
          : isError
          ? "bg-red-50 text-red-600"
          : "bg-neutral-50 text-neutral-500"
      }`}
    >
      {isActive ? (
        <Loader2 className="w-2.5 h-2.5 animate-spin" />
      ) : isError ? (
        <XCircle className="w-2.5 h-2.5" />
      ) : (
        <Icon className="w-2.5 h-2.5" />
      )}
      {isActive ? meta.activeLabel : meta.label}
    </span>
  );
}

/** Markdown message renderer with image support */
function MessageContent({ content }: { content: string }) {
  if (!content) return null;

  // Convert [Attached image: URL] to markdown
  const processed = content.replace(
    /\[Attached image:\s*(https?:\/\/[^\]]+)\]/g,
    "![]($1)"
  );

  return (
    <Markdown
      components={{
        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="mb-1.5 ml-3 list-disc space-y-0.5 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-1.5 ml-3 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="text-[13px]">{children}</li>,
        code: ({ children, className: cn }) => {
          if (cn?.includes("language-")) {
            return (
              <pre className="my-1.5 overflow-x-auto rounded bg-black/5 p-2 text-[11px]">
                <code className="font-mono">{children}</code>
              </pre>
            );
          }
          return <code className="rounded bg-black/5 px-1 py-0.5 text-[11px] font-mono">{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
            {children}
          </a>
        ),
        img: ({ src, alt }) => {
          const resolved = resolveImageUrl(typeof src === "string" ? src : undefined);
          if (!resolved) return null;
          return (
            <span className="my-1.5 block">
              <span className="relative block overflow-hidden rounded-lg border border-neutral-200 max-w-[200px]">
                <Image
                  src={resolved}
                  alt={alt || "Product"}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover rounded-lg"
                  unoptimized
                />
              </span>
            </span>
          );
        },
        table: ({ children }) => (
          <div className="my-1.5 overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-[11px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-neutral-50">{children}</thead>,
        th: ({ children }) => <th className="px-2 py-1 text-left font-medium">{children}</th>,
        td: ({ children }) => <td className="border-t px-2 py-1">{children}</td>,
      }}
    >
      {processed}
    </Markdown>
  );
}

// ---------- Main Component ----------
export function ShoppingAssistant() {
  const { isOpen, productContext, prefillMessage, open, close, clearContext } =
    useShoppingAssistantStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);

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

  // NDJSON streaming chat
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

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

            // Handle SSE-style "data: " prefix (backwards compat)
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
                  // Legacy: plain text token
                  const fallback = parsed.content || parsed.delta || parsed.text || "";
                  if (fallback) {
                    accumulated += fallback;
                    updateMsg();
                  }
                }
              }
            } catch {
              // Non-JSON line — treat as plain text
              if (jsonStr.trim()) {
                accumulated += jsonStr;
                updateMsg();
              }
            }
          }
        }

        // Fallback if empty
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
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorText } : m
          )
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

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleProductQuestion = () => {
    if (productContext) {
      const text = `Tell me about the ${productContext.name}${productContext.brand ? ` by ${productContext.brand}` : ""}. What should I know before buying?`;
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
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={open}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors flex items-center justify-center group"
            aria-label="Open AI shopping assistant"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {messages.length === 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--primary,#2563eb)] rounded-full border-2 border-white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <div>
                  <h3 className="text-sm font-medium">Shopping Assistant</h3>
                  <p className="text-[10px] text-neutral-400">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleNewConversation}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="New conversation"
                    title="New conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={close}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center text-center pt-6 pb-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-neutral-600" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">Hi! How can I help?</h4>
                  <p className="text-xs text-neutral-500 mb-5 max-w-[250px]">
                    I can help you find products, check orders, process returns, or give recommendations.
                  </p>

                  {/* Product context button */}
                  {productContext && (
                    <button
                      onClick={handleProductQuestion}
                      className="w-full mb-3 px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-left text-xs hover:border-black transition-colors"
                    >
                      <span className="text-neutral-500 block mb-0.5">Ask about this product</span>
                      <span className="font-medium">{productContext.name}</span>
                    </button>
                  )}

                  {/* Quick Suggestions */}
                  <div className="w-full space-y-2">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs text-left hover:border-black hover:bg-neutral-50 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[88%] min-w-0">
                      {/* Tool activity pills */}
                      {msg.role === "assistant" && msg.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {msg.tools.map((tool) => (
                            <ToolPill key={tool.toolId} tool={tool} />
                          ))}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`px-3 py-2 rounded-xl text-[13px] leading-relaxed overflow-hidden break-words [overflow-wrap:anywhere] ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-br-sm"
                            : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.content ? (
                          msg.role === "assistant" ? (
                            <MessageContent content={msg.content} />
                          ) : (
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                          )
                        ) : (
                          <span className="flex items-center gap-1.5 text-neutral-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Thinking...
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
              <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800">
                Please wait a moment before sending another message.
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-neutral-200 bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="p-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
