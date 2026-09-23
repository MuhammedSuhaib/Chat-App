"use client";

import { FileText, Trash2, Edit3, Play, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Message, AppTheme } from "./types";

interface Props {
  msg: Message;
  room: string;
  theme: AppTheme;
  onEdit: (id: string, text: string) => void;
}

export default function MessageBubble({ msg, room, theme, onEdit }: Props) {
  const isMine = auth.currentUser?.uid === msg.userId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
      <div className={`flex flex-col max-w-[85%] ${isMine ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <Popover>
            <PopoverTrigger asChild>
              <img
                src={msg.photoURL}
                alt="avatar"
                className="size-8 rounded-full border border-white/10 cursor-pointer active:scale-90 transition-transform"
                style={{ boxShadow: isMine ? `0 0 10px ${theme.text2}44` : "none" }}
                title="Secret Menu"
              />
            </PopoverTrigger>
            {isMine && (
              <PopoverContent className="bg-zinc-950/90 border-white/10 w-32 p-1 backdrop-blur-md">
                <button
                  onClick={() => onEdit(msg.id, msg.text)}
                  className="flex items-center gap-2 w-full p-2 text-[11px] font-bold hover:bg-white/5 transition-colors"
                >
                  <Edit3 size={14} style={{ color: theme.text2 }} /> EDIT
                </button>
                <button
                  onClick={async () => await deleteDoc(doc(db, "rooms", room, "messages", msg.id))}
                  className="flex items-center gap-2 w-full p-2 text-[11px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </PopoverContent>
            )}
          </Popover>
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{msg.displayName}</span>
        </div>

        <div
          className={`p-3 rounded-2xl border transition-all duration-300 ${isMine ? "bg-zinc-900 border-white/5" : "bg-black/80 backdrop-blur-sm border-zinc-800"}`}
          style={{
            borderLeft: !isMine ? `3px solid ${theme.text2}` : "1px solid rgba(255,255,255,0.05)",
            boxShadow: isMine ? `0 4px 20px ${theme.text2}11` : "none",
          }}
        >
          {msg.mediaType === "image" && (
            <img src={msg.mediaData} className="rounded-lg mb-2 max-h-64 shadow-lg border border-white/5" alt="Shared" />
          )}
          {msg.mediaType === "gif" && <img src={msg.mediaData} className="rounded-lg mb-2 max-h-64" alt="GIF" />}
          {msg.mediaType === "audio" && (
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl mb-1">
              <Play size={16} style={{ fill: theme.text2, color: theme.text2 }} />
              <audio src={msg.mediaData} controls className="h-8 opacity-70" />
            </div>
          )}
          {msg.mediaType === "pdf" && (
            <div className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg mb-1 border border-white/10">
              <FileText size={20} className="text-red-500" />
              <span className="text-[10px] truncate max-w-[100px]">{msg.fileName}</span>
              <a href={msg.mediaData} download={msg.fileName} title="Download">
                <Download size={14} />
              </a>
            </div>
          )}

          {msg.text && (
            <p className="text-[14px] whitespace-pre-wrap leading-relaxed" style={{ color: theme.text1 }}>
              {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                part.match(/https?:\/\/[^\s]+/) ? (
                  <a key={i} href={part} target="_blank" className="text-blue-500 underline hover:text-blue-400">
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
            </p>
          )}

          <div className="flex justify-between items-center mt-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
            <span>{msg.createdAt?.toDate?.().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
