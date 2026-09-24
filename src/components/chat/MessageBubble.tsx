//? MessageBubble Component: renders individual message bubbles with alignment and media handlers
"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { auth } from "@/lib/firebase";
import { decryptText } from "@/lib/encryption";
import { Message, MessageBubbleProps } from "./types";
import { MessageActionsMenu } from "./MessageActionsMenu";
import { MessageAttachment } from "./MessageAttachment";
import { MessageContent } from "./MessageContent";

export default function MessageBubble({
  msg,
  room,
  theme,
  cryptoKey,
  onEdit,
}: MessageBubbleProps) {
  // Determine if current logged in user is the author of this message
  const isMine = auth.currentUser?.uid === msg.userId;

  // Decrypted text state: starts as raw text, replaced once decryption resolves
  const [displayText, setDisplayText] = useState<string | null>(
    msg.encrypted ? null : msg.text,
  );

  // Decrypted media state: starts as raw mediaData, replaced once decryption resolves
  const [displayMediaData, setDisplayMediaData] = useState<string | null>(
    msg.encrypted ? null : (msg.mediaData ?? null),
  );

  const [decryptFailed, setDecryptFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!msg.encrypted) {
      setDisplayText(msg.text);
      setDisplayMediaData(msg.mediaData ?? null);
      setDecryptFailed(false);
      return;
    }

    if (!cryptoKey) {
      setDisplayText(null);
      setDisplayMediaData(null);
      setDecryptFailed(false);
      return;
    }

    // Decrypt text if present
    const textPromise = msg.text
      ? decryptText(msg.text, cryptoKey)
      : Promise.resolve(msg.text);

    // Decrypt media if present
    const mediaPromise = msg.mediaData
      ? decryptText(msg.mediaData, cryptoKey)
      : Promise.resolve(msg.mediaData ?? null);

    Promise.all([textPromise, mediaPromise])
      .then(([plainText, plainMedia]) => {
        if (!cancelled) {
          setDisplayText(plainText);
          setDisplayMediaData(plainMedia);
          setDecryptFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDisplayText(null);
          setDisplayMediaData(null);
          setDecryptFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [msg.text, msg.mediaData, msg.encrypted, cryptoKey]);

  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} group w-full`}
    >
      {/* Constrained bubble width so it never stretches full container */}
      <div
        className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMine ? "items-end" : "items-start"}`}
      >
        {/* User avatar & secret actions menu */}
        <MessageActionsMenu
          isMine={isMine}
          photoURL={msg.photoURL}
          displayName={msg.displayName}
          messageId={msg.id}
          room={room}
          accentColor={theme.text2}
          currentText={displayText ?? msg.text}
          onEdit={onEdit}
        />

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
          {/* Decrypted Media Attachments */}
          {displayMediaData && (
            <MessageAttachment
              mediaType={msg.mediaType}
              mediaData={displayMediaData}
              fileName={msg.fileName}
              accentColor={theme.text2}
            />
          )}

          {/* Encrypted message or media, no key available yet / wrong passphrase */}
          {msg.encrypted && (displayText === null || (msg.mediaData && displayMediaData === null)) && (
            <p
              className="flex items-center gap-2 text-[12px] italic opacity-50 mb-1"
              style={{ color: theme.text1 }}
            >
              <Lock size={12} />
              {decryptFailed
                ? "Unable to decrypt (wrong passphrase)"
                : "Encrypted content — unlock to view"}
            </p>
          )}

          {/* Decrypted Text Content with YouTube embeds and OG cards */}
          {displayText && (
            <MessageContent text={displayText} textColor={theme.text1} />
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
