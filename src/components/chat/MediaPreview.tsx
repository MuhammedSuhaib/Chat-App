//? MediaPreview Component: modal preview layer for pending media attachments before sending
"use client";

import { Play, FileText } from "lucide-react";
import { Preview, BaseChatProps } from "./types";

// Props for MediaPreview extending common BaseChatProps
interface Props extends BaseChatProps {
  preview: Preview;
  onCancel: () => void;
  onSend: () => void;
}

export default function MediaPreview({
  preview,
  theme,
  onCancel,
  onSend,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">
          Encrypted Preview
        </h2>

        {/* Render preview based on media type */}
        {preview.type === "image" || preview.type === "gif" ? (
          <img
            src={preview.data}
            alt="Preview"
            title="Media preview"
            className="rounded-xl mb-4 max-h-64 w-full object-cover shadow-2xl"
          />
        ) : preview.type === "audio" ? (
          <div className="p-8 bg-black rounded-xl mb-4 flex justify-center">
            <Play size={40} style={{ color: theme.text2 }} />
          </div>
        ) : (
          <div className="p-8 bg-black rounded-xl mb-4 text-center">
            <FileText size={40} className="mx-auto text-red-500 mb-2" />
            {preview.name}
          </div>
        )}

        {/* Action Buttons: Cancel or Send Now */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-[11px] uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="flex-1 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg"
            style={{ backgroundColor: theme.text2, color: "black" }}
          >
            Send Now
          </button>
        </div>
      </div>
    </div>
  );
}
