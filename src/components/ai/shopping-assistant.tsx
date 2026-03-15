"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiApi, ApiError } from "@/lib/api";
import { useShoppingAssistantStore } from "@/stores/shopping-assistant";

// ---------- Types ----------
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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

// ---------- Component ----------
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

  // Streaming chat send
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);
      setRateLimited(false);

      // Placeholder for assistant response
      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      try {
        const response = await aiApi.chat(sessionId, text.trim());

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                const token = parsed.content || parsed.delta || parsed.text || "";
                if (token) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: m.content + token } : m
                    )
                  );
                }
              } catch {
                // Plain text token (non-JSON SSE)
                if (data.trim()) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: m.content + data } : m
                    )
                  );
                }
              }
            }
          }
        }

        // If assistant message is still empty after stream, add fallback
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && !m.content
              ? { ...m, content: "I'm sorry, I couldn't generate a response. Please try again." }
              : m
          )
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setRateLimited(true);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "You're sending messages too quickly. Please wait a moment and try again." }
                : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "Sorry, I'm having trouble right now. Please try again in a moment." }
                : m
            )
          );
        }
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
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
                    I can help you find the perfect product, answer questions, or give recommendations.
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
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-black text-white rounded-br-sm"
                          : "bg-neutral-100 text-neutral-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.content || (
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Thinking...
                        </span>
                      )}
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
