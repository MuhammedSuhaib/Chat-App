//? ChatHeader Component: top navigation header with room title, encryption toggle and theme settings popover
"use client";

import { Loader2 } from "lucide-react";
import { EncryptionToggle } from "@/components/encryption";
import { ChatHeaderProps } from "./types";
import { RoomSettingsModal } from "./RoomSettingsModal";

export default function ChatHeader({
  room,
  theme,
  setTheme,
  isUploading,
  encryptionEnabled,
  setEncryptionEnabled,
}: ChatHeaderProps) {
  return (
    <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-md z-20 shrink-0">
      <h1 className="text-2xl font-black italic truncate">
        Room: <span style={{ color: theme.text2 }}>{room}</span>
      </h1>

      <div className="flex items-center gap-3">
        {/* Upload status indicator shown when message or media submission is in progress */}
        {isUploading && (
          <div
            className="flex items-center gap-2 text-[10px] font-bold animate-pulse"
            style={{ color: theme.text2 }}
          >
            <Loader2 size={14} className="animate-spin" /> UPLOADING...
          </div>
        )}

        {/* On-demand encryption toggle */}
        <EncryptionToggle
          encryptionEnabled={encryptionEnabled}
          accentColor={theme.text2}
          onToggle={() => setEncryptionEnabled(!encryptionEnabled)}
        />

        {/* Theme Settings Popover */}
        <RoomSettingsModal theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
}
