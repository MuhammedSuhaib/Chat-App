//? MediaMenuPopover: attachment popover menu to pick local media files, open camera, or share large files via ToffeeShare
"use client";

import { Plus, Camera, Image as ImageIcon, ExternalLink, Share2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MediaMenuPopoverProps } from "./types";

export function MediaMenuPopover({ onPickMedia, onPickCamera }: MediaMenuPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger title="Media Menu" aria-label="Media Menu">
        <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer">
          <Plus size={22} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="bg-zinc-950 border border-zinc-800 w-56 p-1.5 rounded-2xl shadow-2xl space-y-0.5 text-white"
      >
        {/* Pick Media File / GIF */}
        <button
          type="button"
          onClick={onPickMedia}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors text-left"
        >
          <ImageIcon size={15} className="text-zinc-400" />
          <span>Media / GIF</span>
        </button>

        {/* Trigger Camera capture mode */}
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.mediaDevices.getUserMedia({ video: true });
              onPickCamera({ data: "camera_mode", type: "camera" });
            } catch (err) {
              console.error("Camera access error:", err);
              alert("Could not access camera.");
            }
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Camera size={15} className="text-zinc-400" />
          <span>Camera</span>
        </button>

        <div className="border-t border-zinc-800/80 my-1" />

        {/* ToffeeShare External Link for Large Files */}
        <a
          href="https://toffeeshare.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Share unlimited size files directly P2P via ToffeeShare"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-orange-400 hover:text-orange-500 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Share2 size={14} />
            <span>Large Files (ToffeeShare)</span>
          </span>
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </PopoverContent>
    </Popover>
  );
}
