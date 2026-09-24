//? ColorPaletteSection: preset color chips and custom hex/color picker for room accent theme
"use client";

import { Check, Pipette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PRESET_COLORS } from "@/lib";
import { ColorPaletteSectionProps } from "./types";

export function ColorPaletteSection({ currentColor, onColorChange }: ColorPaletteSectionProps) {
  const isCustomColor = !PRESET_COLORS.some(
    (c) => c.toLowerCase() === currentColor.toLowerCase(),
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-300 block">
        Accent Color
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {PRESET_COLORS.map((color) => {
          const isSelected = currentColor.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              aria-label={`Select accent color ${color}`}
              className="size-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center border border-white/10"
              style={{
                backgroundColor: color,
                boxShadow: isSelected ? `0 0 10px ${color}aa` : "none",
              }}
            >
              {isSelected && (
                <Check
                  size={12}
                  className={color === "#ffffff" ? "text-black" : "text-white"}
                />
              )}
            </button>
          );
        })}

        {/* Custom Hex / Pipette Popover Trigger */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Custom Color / Hex"
              aria-label="Custom Color / Hex"
              className="size-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center border border-dashed border-zinc-600 hover:border-zinc-400 bg-zinc-900 cursor-pointer relative"
              style={{
                backgroundColor: isCustomColor ? currentColor : undefined,
                boxShadow: isCustomColor ? `0 0 10px ${currentColor}aa` : "none",
              }}
            >
              <Pipette
                size={11}
                className={isCustomColor ? "text-black" : "text-zinc-400"}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="bg-zinc-950 border border-zinc-800 p-3 w-64 rounded-2xl shadow-2xl space-y-3 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                Custom Value
              </span>
              {/* Native Color Picker Trigger */}
              <div className="relative size-6 rounded-full overflow-hidden border border-zinc-700 hover:border-zinc-500 cursor-pointer shadow-inner">
                <input
                  type="color"
                  value={
                    currentColor.startsWith("#") && currentColor.length === 7
                      ? currentColor
                      : "#f97316"
                  }
                  onChange={(e) => onColorChange(e.target.value)}
                  className="absolute -top-2 -left-2 size-10 cursor-pointer bg-transparent"
                  title="Open native color picker"
                  aria-label="Open native color picker"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div
                className="size-7 rounded-lg border border-white/10 shrink-0"
                style={{ backgroundColor: currentColor }}
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                placeholder="#f97316 or rgb(...)"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Enter Hex, RGB, HSL, or select visually via the palette circle.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
