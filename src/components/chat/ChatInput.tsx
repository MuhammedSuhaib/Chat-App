"use client";

import { useRef } from "react";
import { Send, Mic, Camera, Image as ImageIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppTheme, Preview } from "./types";

interface Props {
  input: string;
  setInput: (v: string) => void;
  editingId: string | null;
  theme: AppTheme;
  isRecording: boolean;
  onSend: () => void;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onPrepareMedia: (file: File) => void;
  setPreview: (p: Preview | null) => void;
}

export default function ChatInput({
  input,
  setInput,
  editingId,
  theme,
  isRecording,
  onSend,
  onStartRecord,
  onStopRecord,
  onPrepareMedia,
  setPreview,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <footer className="p-4 bg-black/80 border-t border-zinc-900 backdrop-blur-md">
      <div className="flex items-end gap-3 max-w-5xl mx-auto">
        <Popover>
          <PopoverTrigger title="Media Menu" aria-label="Media Menu">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all">
              <Plus size={22} />
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="bg-zinc-900 border-zinc-800 w-40 p-1 rounded-xl shadow-2xl">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors"
            >
              <ImageIcon size={16} className="text-zinc-500" /> Media / GIF
            </button>
            <button
              onClick={async () => {
                await navigator.mediaDevices.getUserMedia({ video: true });
                setPreview({ data: "camera_mode", type: "camera" });
              }}
              className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors"
            >
              <Camera size={16} className="text-zinc-500" /> Camera
            </button>
          </PopoverContent>
        </Popover>

        <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-1.5 focus-within:border-zinc-700 transition-all">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={editingId ? "Updating message..." : "Type transmission..."}
            className="w-full bg-transparent border-none focus:ring-0 text-[14px] py-2 px-0 resize-none text-zinc-100 placeholder:text-zinc-800"
            rows={1}
          />
        </div>

        <button
          onClick={onSend}
          onPointerDown={input ? undefined : onStartRecord}
          onPointerUp={input ? undefined : onStopRecord}
          className={`p-3 rounded-full transition-all duration-300 shadow-xl ${isRecording ? "bg-red-600 scale-125 shadow-red-500/50" : ""}`}
          style={{
            backgroundColor: input ? theme.text2 : "#18181b",
            color: input ? "black" : "#52525b",
            boxShadow: input ? `0 0 15px ${theme.text2}66` : "none",
          }}
          title={input ? "Send" : "Hold Mic"}
          aria-label={input ? "Send" : "Microphone"}
        >
          {input ? <Send size={22} /> : <Mic size={22} className={isRecording ? "animate-pulse" : ""} />}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,application/pdf,image/gif"
        onChange={(e) => e.target.files?.[0] && onPrepareMedia(e.target.files[0])}
      />
    </footer>
  );
}
