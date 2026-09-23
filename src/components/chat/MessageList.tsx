//? MessageList Component: displays scrollable list of messages and handles auto-scroll
"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message, RoomChatProps } from "./types";

// Props for MessageList extending common RoomChatProps
interface Props extends RoomChatProps {
  messages: Message[]; // Array of chat messages for the current room
  cryptoKey: CryptoKey | null; // Active room decryption key, if encryption is unlocked
  onEdit: (id: string, text: string) => void;
}

export default function MessageList({
  messages,
  room,
  theme,
  cryptoKey,
  onEdit,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatically scrolls to the bottom whenever a new message is received or added.
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar bg-black/20">
      {/* Map each message in the room to a MessageBubble component */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          room={room}
          theme={theme}
          cryptoKey={cryptoKey}
          onEdit={onEdit}
        />
      ))}
      {/* Anchor element used for auto-scrolling to latest message */}
      <div ref={scrollRef} />
    </main>
  );
}
