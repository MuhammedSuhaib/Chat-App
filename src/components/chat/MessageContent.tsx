//? MessageContent: parses decrypted text, renders embedded YouTube iframes, and OG preview cards
"use client";

import { LinkPreview } from "./LinkPreview";
import { MessageContentProps } from "./types";

// Extracts a YouTube video ID from common YouTube URL formats.
// Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
};

export function MessageContent({ text, textColor }: MessageContentProps) {
  if (!text) return null;

  return (
    <div
      className="text-[14px] whitespace-pre-wrap leading-relaxed break-words space-y-2"
      style={{ color: textColor }}
    >
      {text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
        if (!part.match(/https?:\/\/[^\s]+/)) return part;

        const ytId = getYouTubeId(part);
        if (ytId) {
          // Render an embedded YouTube player
          return (
            <span key={i} className="block">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-xl border border-white/10 mt-1"
                style={{ aspectRatio: "16/9", maxWidth: "100%" }}
              />
            </span>
          );
        }

        // Regular URL — plain clickable link + OG preview card
        return (
          <span key={i} className="block">
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-400 break-all"
            >
              {part}
            </a>
            <LinkPreview url={part} />
          </span>
        );
      })}
    </div>
  );
}
