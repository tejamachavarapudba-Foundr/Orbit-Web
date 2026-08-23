"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";

import { getMessagesAction, markMessagesReadAction, sendMessageAction } from "../actions";
import type { Message } from "@/lib/types";

const formatTime = (value: string) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));

type MessageThreadProps = {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
};

export const MessageThread = ({ conversationId, messages: initialMessages, currentUserId }: MessageThreadProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMessages(initialMessages);
    markedReadRef.current = new Set();
  }, [conversationId, initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const unseen = messages.filter((m) => m.senderId !== currentUserId && !m.readAt && !markedReadRef.current.has(m.id));
    if (unseen.length === 0) return;
    unseen.forEach((m) => markedReadRef.current.add(m.id));
    void markMessagesReadAction(unseen, currentUserId);
  }, [messages, currentUserId]);

  // Polls just the message list for this thread — not a full-page refresh —
  // so it can't interrupt an in-flight navigation or re-run the app shell's
  // sidebar/counter queries every few seconds (that combination was the
  // cause of the reported freezing and broken navigation while a thread was open).
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (document.hidden) return;
      try {
        const fresh = await getMessagesAction(conversationId);
        if (!cancelled) setMessages(fresh);
      } catch {
        // transient network hiccup — next tick will retry
      }
    };
    const interval = setInterval(tick, 6000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [conversationId]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    startTransition(async () => {
      const sent = await sendMessageAction(conversationId, text);
      if (sent) setMessages((prev) => [...prev, sent]);
    });
  };

  return (
    <div className="glass flex h-[calc(100vh-160px)] flex-col overflow-hidden rounded-2xl">
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-muted">Say hello 👋</p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    isMine ? "rounded-br-sm bg-gradient-to-r from-primary to-indigo-500 text-on-primary" : "rounded-bl-sm bg-muted-bg/80 text-text"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className={`mt-0.5 text-right text-[10px] ${isMine ? "text-on-primary/70" : "text-muted"}`}>{formatTime(message.createdAt)}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-border/60 p-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a message..."
          className="h-10 flex-1 rounded-full border border-border/70 bg-muted-bg/60 px-4 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim() || isPending}
          aria-label="Send"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-indigo-500 text-on-primary disabled:opacity-40"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
