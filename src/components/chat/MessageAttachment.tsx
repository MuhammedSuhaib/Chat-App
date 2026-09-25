//? MessageAttachment: renders decrypted media payloads (Image, GIF, Audio voice note, PDF)
"use client";

import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { MessageAttachmentProps } from "./types";

export function MessageAttachment({
  mediaType,
  mediaData,
  fileName,
}: MessageAttachmentProps) {
  if (!mediaType || !mediaData) return null;

  return (
    <>
      {mediaType === "image" && (
        <Image
          src={mediaData}
          width={400}
          height={256}
          unoptimized
          className="rounded-lg mb-2 max-h-64 max-w-full shadow-lg border border-white/5 object-cover"
          alt="Shared"
        />
      )}

      {mediaType === "gif" && (
        <Image
          src={mediaData}
          width={400}
          height={256}
          unoptimized
          className="rounded-lg mb-2 max-h-64 max-w-full object-cover"
          alt="GIF"
        />
      )}

      {mediaType === "audio" && (
          <audio
            src={mediaData}
            controls
            className="h-8 px-2 opacity-70 max-w-full"
          />
      )}

      {mediaType === "pdf" && (
        <div className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg mb-1 border border-white/10">
          <FileText size={20} className="text-red-500 shrink-0" />
          <span className="text-[10px] truncate max-w-[120px]">
            {fileName}
          </span>
          <a href={mediaData} download={fileName} title="Download">
            <Download size={14} />
          </a>
        </div>
      )}
    </>
  );
}
