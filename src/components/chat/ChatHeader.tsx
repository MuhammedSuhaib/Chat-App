"use client";

import { Settings, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppTheme } from "./types";

interface Props {
  room: string;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  isUploading: boolean;
}

export default function ChatHeader({ room, theme, setTheme, isUploading }: Props) {
  return (
    <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-md z-20">
      <h1 className="text-2xl font-black italic">
        Room: <span style={{ color: theme.text2 }}>{room}</span>
      </h1>

      <div className="flex items-center gap-4">
        {isUploading && (
          <div className="flex items-center gap-2 text-[10px] font-bold animate-pulse" style={{ color: theme.text2 }}>
            <Loader2 size={14} className="animate-spin" /> UPLOADING...
          </div>
        )}
        <Popover>
          <PopoverTrigger title="Theme Settings" aria-label="Theme Settings">
            <Settings className="text-zinc-500 hover:text-white transition-colors cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="bg-zinc-900 border-zinc-800 p-4 w-64 space-y-4 shadow-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500">Highlight Color</label>
              <input
                type="color"
                className="w-full h-8 bg-transparent"
                value={theme.text2}
                onChange={(e) => setTheme({ ...theme, text2: e.target.value })}
                title="Highlight Color"
                aria-label="Highlight Color"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500">Background Image URL</label>
              <input
                type="text"
                className="w-full bg-black border border-zinc-700 p-2 text-xs mt-1 rounded"
                placeholder="https://..."
                onBlur={(e) => setTheme({ ...theme, bgImage: e.target.value })}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
