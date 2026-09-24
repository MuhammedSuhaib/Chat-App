//? RoomSettingsModal: settings popover containing highlight color, background wallpaper, and browser notifications
"use client";

import { useState } from "react";
import { Settings, Bell, Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppTheme, RoomSettingsModalProps } from "./types";
import { ColorPaletteSection } from "./ColorPaletteSection";
import { WallpaperSection } from "./WallpaperSection";

export function RoomSettingsModal({ theme, setTheme }: RoomSettingsModalProps) {
  const [notificationStatus, setNotificationStatus] = useState<string | null>(
    null,
  );

  const handleRequestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const res = await Notification.requestPermission();
      setNotificationStatus(res);
      setTimeout(() => setNotificationStatus(null), 3000);
    } else {
      alert("Notifications are not supported in this browser.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger title="Theme Settings" aria-label="Theme Settings">
        <div className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-zinc-400 hover:text-white">
          <Settings size={20} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="bg-zinc-950 border border-zinc-800 p-4 w-72 space-y-4 rounded-2xl shadow-2xl text-white"
      >
        {" "}
        {/* Notifications Button */}
        <div className="pt-2  border-zinc-800/80">
          <button
            type="button"
            onClick={handleRequestNotification}
            className=" flex items-center justify-center rounded-b-sm gap-2 bg-[#3a2704] hover:bg-zinc-800 text-xs font-semibold py-2 px-3 transition-all"
          >
            <Bell size={13} style={{ color: theme.text2 }} />
            <span>
              {notificationStatus
                ? `Permission: ${notificationStatus}`
                : "Enable Notifications"}
            </span>
          </button>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Palette size={15} style={{ color: theme.text2 }} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Appearance
            </h2>
          </div>
          <span className="text-xs text-zinc-500">Theme</span>
        </div>
        {/* Modular Color Palette & Custom Picker */}
        <ColorPaletteSection
          currentColor={theme.text2}
          onColorChange={(color) => setTheme({ ...theme, text2: color })}
        />
        {/* Modular Wallpaper Background Upload & URL */}
        <WallpaperSection
          currentBgImage={theme.bgImage}
          onBgImageChange={(bgImage) => setTheme({ ...theme, bgImage })}
        />
      </PopoverContent>
    </Popover>
  );
}
