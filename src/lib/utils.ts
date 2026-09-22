import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This is the standard `cn` utility (shadcn/ui convention) for merging Tailwind classes safely.

// - `clsx(inputs)` — combines class names, handling conditionals/arrays/falsy values
// - `twMerge(...)` — resolves conflicting Tailwind classes (e.g. `"p-2 p-4"` → keeps `p-4`)

//! DON`t try to learn more its useless i dig it n out of my head 