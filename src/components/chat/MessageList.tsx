"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message, AppTheme } from "./types";

interface Props {
  messages: Message[];
  room: string;
  theme: AppTheme;
  onEdit: (id: string, text: string) => void;
}

export default function MessageList({ messages, room, theme, onEdit }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/20">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} room={room} theme={theme} onEdit={onEdit} />
      ))}
      <div ref={scrollRef} />
    </main>
  );
}
