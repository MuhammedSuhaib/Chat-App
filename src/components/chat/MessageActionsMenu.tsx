//? MessageActionsMenu: avatar trigger with secret menu for editing and deleting user messages
"use client";

import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageActionsMenuProps } from "./types";

export function MessageActionsMenu({
  isMine,
  photoURL,
  displayName,
  messageId,
  room,
  accentColor,
  currentText,
  onEdit,
}: MessageActionsMenuProps) {
  return (
    <div
      className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar menu trigger (allows Edit/Delete for user's own messages) */}
      <Popover>
        <PopoverTrigger asChild>
          <Image
            src={photoURL || "/user.jpg"}
            alt="avatar"
            width={32}
            height={32}
            unoptimized
            className="size-8 rounded-full border border-white/10 cursor-pointer active:scale-90 transition-transform shrink-0"
            style={{
              boxShadow: isMine ? `0 0 10px ${accentColor}44` : "none",
            }}
            title="Secret Menu"
          />
        </PopoverTrigger>
        {isMine && (
          <PopoverContent className="bg-zinc-950/90 w-fit p-1 backdrop-blur-md flex gap-2">
            <button
              onClick={() => onEdit(messageId, currentText)}
              className="flex items-center gap-2 w-full text-[11px] font-bold hover:bg-white/5 transition-colors"
            >
              <Edit3 size={18} style={{ color: accentColor }} />
            </button>
            <button
              onClick={async () =>
                await deleteDoc(doc(db, "rooms", room, "messages", messageId))
              }
              className="flex items-center gap-2 w-full text-[11px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </PopoverContent>
        )}
      </Popover>
      <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
        {displayName}
      </span>
    </div>
  );
}
