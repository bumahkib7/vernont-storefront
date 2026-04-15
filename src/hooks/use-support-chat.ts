"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { importKey, encrypt, decrypt } from "@/lib/chat-crypto";

// --------------- Types ---------------

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderRole: "CUSTOMER" | "ADMIN" | "SYSTEM";
  messageType: string;
  body: string;
  status: string;
  createdAt: string;
  clientMessageId?: string;
}

export interface ConversationUpdate {
  id: string;
  status: string;
  assignedAdminUserId?: string | null;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadForCustomer: number;
}

interface UseSupportChatReturn {
  messages: SupportMessage[];
  isConnected: boolean;
  isConnecting: boolean;
  conversationId: string | null;
  conversationStatus: string | null;
  hasAgent: boolean;
  unreadCount: number;
  startConversation: (initialMessage?: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  markRead: () => Promise<void>;
  disconnect: () => void;
}

// --------------- Constants ---------------

const DIRECT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const API_BASE_URL =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : DIRECT_API_URL;

// WebSocket connects directly via the native WebSocket API (no SockJS).
// The backend auth cookie is SameSite=None; Secure so it's sent on the
// cross-origin handshake; the storefront's origin is on the CORS allow-list.
const WS_URL = (() => {
  const base = DIRECT_API_URL.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  return `${base}/ws`;
})();

const STORAGE_KEY = "vernont_support_chat";

// --------------- Helpers ---------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function chatFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

function loadPersistedState(): { conversationId: string | null } {
  if (typeof window === "undefined") return { conversationId: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { conversationId: parsed.conversationId || null };
    }
  } catch {
    // ignore
  }
  return { conversationId: null };
}

function persistState(conversationId: string | null) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ conversationId }));
  } catch {
    // ignore
  }
}

// --------------- Hook ---------------

export function useSupportChat(userId: string | null): UseSupportChatReturn {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    () => loadPersistedState().conversationId
  );
  const [conversationStatus, setConversationStatus] = useState<string | null>(null);
  const [hasAgent, setHasAgent] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const stompClientRef = useRef<Client | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conversationIdRef = useRef(conversationId);
  const encryptionKeyRef = useRef<CryptoKey | null>(null);
  const rawEncryptionKeyRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Persist conversation ID
  useEffect(() => {
    persistState(conversationId);
  }, [conversationId]);

  // Load existing messages when conversation ID is set
  const loadMessages = useCallback(async (convId: string) => {
    try {
      const data = await chatFetch(`/store/chat/conversations/${convId}/messages?size=50`);

      // Capture per-conversation encryption key (delivered via HTTPS)
      if (data.encryptionKey) {
        rawEncryptionKeyRef.current = data.encryptionKey;
        try {
          encryptionKeyRef.current = await importKey(data.encryptionKey);
        } catch {
          encryptionKeyRef.current = null;
        }
      }

      const loaded: SupportMessage[] = (data.messages || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          senderUserId: m.senderUserId,
          senderRole: m.senderRole,
          messageType: m.messageType || "TEXT",
          body: m.body,
          status: m.status,
          createdAt: m.createdAt,
          clientMessageId: m.clientMessageId,
        })
      );
      // Messages come newest-first from API, reverse for display
      setMessages(loaded.reverse());
      setHasAgent(loaded.some((m) => m.senderRole === "ADMIN"));
    } catch {
      // Conversation may have been deleted — clear it
      setConversationId(null);
    }
  }, []);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (!userId || stompClientRef.current?.connected) return;

    setIsConnecting(true);

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Subscribe to personal chat messages
        client.subscribe("/user/queue/chat-messages", (frame) => {
          (async () => {
            try {
              const raw = JSON.parse(frame.body);

              // Decrypt message body if it arrived encrypted
              let body: string;
              if (raw.encryptedBody && raw.iv && encryptionKeyRef.current) {
                try {
                  body = await decrypt(encryptionKeyRef.current, raw.encryptedBody, raw.iv);
                } catch {
                  body = "[Decryption failed]";
                }
              } else {
                body = raw.body || raw.encryptedBody || "";
              }

              const msg: SupportMessage = {
                id: raw.id,
                conversationId: raw.conversationId,
                senderUserId: raw.senderUserId,
                senderRole: raw.senderRole,
                messageType: raw.messageType || "TEXT",
                body,
                status: raw.status,
                createdAt: raw.createdAt,
                clientMessageId: raw.clientMessageId,
              };

              // Only add messages for our conversation
              if (
                conversationIdRef.current &&
                msg.conversationId === conversationIdRef.current
              ) {
                setMessages((prev) => {
                  // Deduplicate by id or clientMessageId
                  const exists = prev.some(
                    (m) =>
                      m.id === msg.id ||
                      (msg.clientMessageId &&
                        m.clientMessageId === msg.clientMessageId)
                  );
                  if (exists) return prev;
                  return [...prev, msg];
                });

                if (msg.senderRole === "ADMIN") {
                  setHasAgent(true);
                  setUnreadCount((c) => c + 1);
                }
              }
            } catch {
              // ignore parse errors
            }
          })();
        });

        // Subscribe to conversation updates (status changes, assignment)
        client.subscribe("/user/queue/chat-updates", (frame) => {
          try {
            const update = JSON.parse(frame.body) as ConversationUpdate;
            if (
              conversationIdRef.current &&
              update.id === conversationIdRef.current
            ) {
              setConversationStatus(update.status);
              if (update.assignedAdminUserId) {
                setHasAgent(true);
              }
            }
          } catch {
            // ignore
          }
        });

        // Load existing messages if we have a conversation
        if (conversationIdRef.current) {
          loadMessages(conversationIdRef.current);
        }
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setIsConnected(false);
        setIsConnecting(false);
      },
      onWebSocketError: () => {
        setIsConnected(false);
        setIsConnecting(false);
      },
    });

    stompClientRef.current = client;
    client.activate();
  }, [userId, loadMessages]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    // Clear encryption keys from memory
    encryptionKeyRef.current = null;
    rawEncryptionKeyRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (userId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  // Reload messages if conversationId changes while connected
  useEffect(() => {
    if (conversationId && isConnected) {
      loadMessages(conversationId);
    }
  }, [conversationId, isConnected, loadMessages]);

  // Start a new conversation
  const startConversation = useCallback(
    async (initialMessage?: string) => {
      const data = await chatFetch("/store/chat/conversations", {
        method: "POST",
        body: JSON.stringify({
          subject: "Support Request",
          conversationType: "SUPPORT",
          priority: "NORMAL",
          initialMessage: initialMessage || undefined,
        }),
      });

      const conv = data.conversation;
      setConversationId(conv.id);
      setConversationStatus(conv.status);
      setHasAgent(!!conv.assignedAdminUserId);
      setMessages([]);

      // Store encryption key from conversation creation (delivered via HTTPS)
      if (conv.encryptionKey) {
        rawEncryptionKeyRef.current = conv.encryptionKey;
        try {
          encryptionKeyRef.current = await importKey(conv.encryptionKey);
        } catch {
          encryptionKeyRef.current = null;
        }
      }

      // If initial message was included, load messages to show it
      if (initialMessage) {
        await loadMessages(conv.id);
      }
    },
    [loadMessages]
  );

  // Send a message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationIdRef.current) {
        throw new Error("No active conversation");
      }

      const clientMessageId = generateId();

      // Optimistic local insert
      const optimistic: SupportMessage = {
        id: `local-${clientMessageId}`,
        conversationId: conversationIdRef.current,
        senderUserId: userId || "",
        senderRole: "CUSTOMER",
        messageType: "TEXT",
        body: text,
        status: "SENT",
        createdAt: new Date().toISOString(),
        clientMessageId,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        // Encrypt message body if we have a session key
        let requestBody: string;
        if (encryptionKeyRef.current) {
          try {
            const encrypted = await encrypt(encryptionKeyRef.current, text);
            requestBody = JSON.stringify({
              body: text,
              messageType: "TEXT",
              clientMessageId,
              metadata: {
                encrypted: true,
                encryptedBody: encrypted.encryptedBody,
                iv: encrypted.iv,
              },
            });
          } catch {
            // Fall back to plaintext on encryption failure
            requestBody = JSON.stringify({
              body: text,
              messageType: "TEXT",
              clientMessageId,
            });
          }
        } else {
          requestBody = JSON.stringify({
            body: text,
            messageType: "TEXT",
            clientMessageId,
          });
        }

        const data = await chatFetch(
          `/store/chat/conversations/${conversationIdRef.current}/messages`,
          {
            method: "POST",
            body: requestBody,
          }
        );

        // Replace optimistic message with server response
        const serverMsg = data.message as SupportMessage;
        setMessages((prev) =>
          prev.map((m) =>
            m.clientMessageId === clientMessageId ? serverMsg : m
          )
        );
      } catch (err) {
        // Mark optimistic message as failed
        setMessages((prev) =>
          prev.map((m) =>
            m.clientMessageId === clientMessageId
              ? { ...m, status: "FAILED" }
              : m
          )
        );
        throw err;
      }
    },
    [userId]
  );

  // Mark conversation as read
  const markRead = useCallback(async () => {
    if (!conversationIdRef.current) return;
    setUnreadCount(0);
    try {
      await chatFetch(
        `/store/chat/conversations/${conversationIdRef.current}/read`,
        { method: "POST", body: JSON.stringify({}) }
      );
    } catch {
      // ignore
    }
  }, []);

  return {
    messages,
    isConnected,
    isConnecting,
    conversationId,
    conversationStatus,
    hasAgent,
    unreadCount,
    startConversation,
    sendMessage,
    markRead,
    disconnect,
  };
}
