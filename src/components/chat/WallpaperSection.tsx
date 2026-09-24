//? WallpaperSection: handles local file upload and remote URL setting for room background wallpaper
"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, Link as LinkIcon, Trash2 } from "lucide-react";
import { WallpaperSectionProps } from "./types";

export function WallpaperSection({ currentBgImage, onBgImageChange }: WallpaperSectionProps) {
  const [wallpaperType, setWallpaperType] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <ImageIcon size={14} /> Wallpaper
        </label>
        {currentBgImage && (
          <button
            type="button"
            onClick={() => onBgImageChange("")}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            title="Remove wallpaper"
          >
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {/* Segmented Selector */}
      <div className="flex rounded-lg overflow-hidden border border-zinc-800 text-xs font-medium bg-zinc-900/50 p-0.5">
        <button
          type="button"
          onClick={() => setWallpaperType("file")}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            wallpaperType === "file"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Upload size={12} /> Local File
        </button>
        <button
          type="button"
          onClick={() => setWallpaperType("url")}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            wallpaperType === "url"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <LinkIcon size={12} /> Image URL
        </button>
      </div>

      {wallpaperType === "file" ? (
        <label className="flex flex-col items-center justify-center border-zinc-800 hover:border-zinc-600 rounded-xl p-3 cursor-pointer bg-[#3a2704] transition-all group">
          <Upload size={16} className="text-zinc-500 group-hover:text-zinc-300 mb-1" />
          <span className="text-xs text-zinc-400 group-hover:text-zinc-200">
            Choose an image from device
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5">PNG, JPG, WebP, GIF</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  onBgImageChange(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) {
                onBgImageChange(urlInput.trim());
                setUrlInput("");
              }
            }}
            disabled={!urlInput.trim()}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
