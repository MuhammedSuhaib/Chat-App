// LinkPreview: fetches OG metadata for a URL and renders a preview card.
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { OGData, LinkPreviewProps } from "./types";

export function LinkPreview({ url }: LinkPreviewProps) {
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: OGData) => {
        if (!cancelled && (d.title || d.image)) {
          setData(d);
        } else if (!cancelled) {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Skeleton while loading
  if (loading) {
    return (
      <div className="mt-2 rounded-xl border border-white/10 bg-zinc-900/60 p-3 animate-pulse space-y-2">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-2 bg-white/10 rounded w-full" />
        <div className="h-2 bg-white/10 rounded w-1/2" />
      </div>
    );
  }

  // No OG data found — render nothing (the plain link is already shown)
  if (failed || !data) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex flex-col rounded-xl border border-white/10 bg-zinc-900/70 overflow-hidden hover:bg-zinc-800/70 transition-colors no-underline"
    >
      {/* OG image */}
      {data.image && (
        <div className="relative w-full" style={{ aspectRatio: "2/1" }}>
          <Image
            src={data.image}
            alt={data.title || "Link preview"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {/* Text content */}
      <div className="p-3 space-y-1">
        {/* Site name */}
        <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
          <Globe size={10} />
          {data.siteName}
        </span>

        {/* Title */}
        {data.title && (
          <p className="text-[13px] font-semibold text-white leading-snug line-clamp-2">
            {data.title}
          </p>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}
      </div>
    </a>
  );
}
