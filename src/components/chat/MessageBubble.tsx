//? MessageBubble Component: renders individual message bubbles with alignment and media handlers
"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, Edit3, Play, Download, Lock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { decryptText } from "@/lib/encryption";
import { Message, RoomChatProps } from "./types";

// Props for MessageBubble extending common RoomChatProps
interface Props extends RoomChatProps {
  msg: Message; // The message object containing text, author details, timestamp, and optional media payload
  cryptoKey: CryptoKey | null; // Active room decryption key, if encryption is unlocked
  onEdit: (id: string, text: string) => void;
}

export default function MessageBubble({
  msg,
  room,
  theme,
  cryptoKey,
  onEdit,
}: Props) {
  // Determine if current logged in user is the author of this message
  const isMine = auth.currentUser?.uid === msg.userId;

  // Decrypted text state: starts as raw text, replaced once decryption resolves
  const [displayText, setDisplayText] = useState<string | null>(
    msg.encrypted ? null : msg.text,
  );
  const [decryptFailed, setDecryptFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!msg.encrypted) {
      setDisplayText(msg.text);
      setDecryptFailed(false);
      return;
    }
    if (!cryptoKey) {
      setDisplayText(null);
      setDecryptFailed(false);
      return;
    }
    decryptText(msg.text, cryptoKey)
      .then((plain) => {
        if (!cancelled) {
          setDisplayText(plain);
          setDecryptFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDisplayText(null);
          setDecryptFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [msg.text, msg.encrypted, cryptoKey]);

  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} group w-full`}
    >
      {/* Constrained bubble width so it never stretches full container */}
      <div
        className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMine ? "items-end" : "items-start"}`}
      >
        {/* User avatar & display name header */}
        <div
          className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* Avatar menu trigger (allows Edit/Delete for user's own messages) */}
          <Popover>
            <PopoverTrigger asChild>
              <img
                src={msg.photoURL}
                alt="avatar"
                className="size-8 rounded-full border border-white/10 cursor-pointer active:scale-90 transition-transform shrink-0"
                style={{
                  boxShadow: isMine ? `0 0 10px ${theme.text2}44` : "none",
                }}
                title="Secret Menu"
              />
            </PopoverTrigger>
            {isMine && (
              <PopoverContent className="bg-zinc-950/90 border-white/10 w-32 p-1 backdrop-blur-md">
                <button
                  onClick={() => onEdit(msg.id, displayText ?? msg.text)}
                  className="flex items-center gap-2 w-full p-2 text-[11px] font-bold hover:bg-white/5 transition-colors"
                >
                  <Edit3 size={14} style={{ color: theme.text2 }} /> EDIT
                </button>
                <button
                  onClick={async () =>
                    await deleteDoc(doc(db, "rooms", room, "messages", msg.id))
                  }
                  className="flex items-center gap-2 w-full p-2 text-[11px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </PopoverContent>
            )}
          </Popover>
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
            {msg.displayName}
          </span>
        </div>

        {/* Message Content Bubble Container */}
        <div
          className={`p-3 rounded-2xl border transition-all duration-300 break-words ${isMine ? "bg-zinc-900 border-white/5" : "bg-black/80 backdrop-blur-sm border-zinc-800"}`}
          style={{
            borderLeft: !isMine
              ? `3px solid ${theme.text2}`
              : "1px solid rgba(255,255,255,0.05)",
            boxShadow: isMine ? `0 4px 20px ${theme.text2}11` : "none",
          }}
        >
          {/* Media Renderers */}
          {msg.mediaType === "image" && (
            <img
              src={msg.mediaData}
              className="rounded-lg mb-2 max-h-64 max-w-full shadow-lg border border-white/5"
              alt="Shared"
            />
          )}
          {msg.mediaType === "gif" && (
            <img
              src={msg.mediaData}
              className="rounded-lg mb-2 max-h-64 max-w-full"
              alt="GIF"
            />
          )}
          {msg.mediaType === "audio" && (
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl mb-1">
              <Play
                size={16}
                style={{ fill: theme.text2, color: theme.text2 }}
              />
              <audio
                src={msg.mediaData}
                controls
                className="h-8 opacity-70 max-w-full"
              />
            </div>
          )}
          {msg.mediaType === "pdf" && (
            <div className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg mb-1 border border-white/10">
              <FileText size={20} className="text-red-500 shrink-0" />
              <span className="text-[10px] truncate max-w-[120px]">
                {msg.fileName}
              </span>
              <a href={msg.mediaData} download={msg.fileName} title="Download">
                <Download size={14} />
              </a>
            </div>
          )}

          {/* Encrypted message, no key available yet / wrong passphrase */}
          {msg.encrypted && displayText === null && (
            <p
              className="flex items-center gap-2 text-[12px] italic opacity-50"
              style={{ color: theme.text1 }}
            >
              <Lock size={12} />
              {decryptFailed
                ? "Unable to decrypt (wrong passphrase)"
                : "Encrypted message — unlock to view"}
            </p>
          )}

          {/* Text Content with URL Regex Parsing */}
          {displayText && (
            <p
              className="text-[14px] whitespace-pre-wrap leading-relaxed break-words"
              style={{ color: theme.text1 }}
            >
              {displayText.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                part.match(/https?:\/\/[^\s]+/) ? (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    className="text-blue-500 underline hover:text-blue-400"
                  >
                    {part}
                  </a>
                ) : (
                  part
                ),
              )}
            </p>
          )}

          {/* Timestamp footer */}
          <div className="flex justify-between items-center mt-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
            <span>{msg.createdAt?.toDate?.().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
