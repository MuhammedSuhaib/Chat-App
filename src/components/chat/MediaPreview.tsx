//? MediaPreview Component: modal preview layer for pending media attachments before sending
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MediaPreviewProps } from "./types";
import Image from "next/image";

export default function MediaPreview({
  preview,
  theme,
  onCancel,
  onSend,
}: MediaPreviewProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Render preview based on media type */}
        {preview.type === "image" || preview.type === "gif" ? (
          <Image
            src={preview.data}
            alt="Preview"
            title="Media preview"
            width={400}
            height={256}
            unoptimized
            className="rounded-xl mb-4 max-h-64 w-full object-cover shadow-2xl"
          />
        ) : preview.type === "audio" ? (
          <div className="p-4">
            <audio src={preview.data} controls className="w-full h-10" />
          </div>
        ) : (
          <div className="p-8 bg-black rounded-xl mb-4 text-center">
            {preview.name}
          </div>
        )}

        {/* Action Buttons: Cancel or Send Now */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isSending}
            className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-[11px] uppercase tracking-widest disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ backgroundColor: theme.text2, color: "black" }}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
