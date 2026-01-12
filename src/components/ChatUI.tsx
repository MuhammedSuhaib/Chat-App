"use client";

import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { 
  Send, Mic, Camera, Image as ImageIcon, FileText, Trash2, 
  Plus, X, Play, Settings, Edit3, Loader2, Download 
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- Types ---
interface Message {
  id: string;
  text: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  userId: string;
  mediaType?: "image" | "audio" | "pdf" | "gif";
  mediaData?: string;
  fileName?: string;
}

interface AppTheme {
  text1: string; // Normal text
  text2: string; // Highlight/Accent text
  bgImage: string;
}

export default function ChatUI({ room }: { room: string }) {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<{data: string, type: string, name?: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<AppTheme>({
    text1: "#ffffff",
    text2: "#20e07d",
    bgImage: "" 
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // --- Firebase Sync ---
  useEffect(() => {
    const q = query(collection(db, "rooms", room, "messages"), orderBy("createdAt"));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    });
  }, [room]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Action Handlers ---
  const handleAction = async (media?: typeof preview) => {
    if ((!input.trim() && !media) || !auth.currentUser) return;
    setIsUploading(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, "rooms", room, "messages", editingId), { text: input });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "rooms", room, "messages"), {
          text: input,
          userId: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "User",
          photoURL: auth.currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          mediaType: media?.type || null,
          mediaData: media?.data || null,
          fileName: media?.name || null,
        });
      }
      setInput("");
      setPreview(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const prepareMedia = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let type = "image";
      if (file.type === "image/gif") type = "gif";
      if (file.type === "application/pdf") type = "pdf";
      setPreview({ data: reader.result as string, type, name: file.name });
    };
  };

  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: any[] = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => setPreview({ data: reader.result as string, type: "audio", name: "voice_note.webm" });
      stream.getTracks().forEach(t => t.stop());
    };
    rec.start();
    recorderRef.current = rec;
    setIsRecording(true);
  };

  return (
    <div 
      className="flex flex-col h-[100dvh] bg-black text-white overflow-hidden relative"
      style={{ 
        backgroundImage: theme.bgImage ? `url(${theme.bgImage})` : "none",
        backgroundSize: "cover", backgroundPosition: "center"
      }}
    >
      {/* 1. Header */}
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-md z-20">
        <h1 className="text-2xl font-black italic">
          Room: <span style={{ color: theme.text2 }}>{room}</span>
        </h1>
        
        <div className="flex items-center gap-4">
          {isUploading && <div className="flex items-center gap-2 text-[10px] font-bold animate-pulse" style={{color: theme.text2}}><Loader2 size={14} className="animate-spin" /> UPLOADING...</div>}
          <Popover>
            <PopoverTrigger title="Theme Settings" aria-label="Theme Settings">
              <Settings className="text-zinc-500 hover:text-white transition-colors cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="bg-zinc-900 border-zinc-800 p-4 w-64 space-y-4 shadow-2xl">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500">Highlight Color</label>
                <input type="color" className="w-full h-8 bg-transparent" value={theme.text2} onChange={e => setTheme({...theme, text2: e.target.value})} title="Highlight Color" aria-label="Highlight Color" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500">Background Image URL</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-zinc-700 p-2 text-xs mt-1 rounded" 
                  placeholder="https://..."
                  onBlur={e => setTheme({...theme, bgImage: e.target.value})}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* 2. Message List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-black/20">
        {messages.map((msg) => {
          const isMine = auth.currentUser?.uid === msg.userId;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
              <div className={`flex flex-col max-w-[85%] ${isMine ? "items-end" : "items-start"}`}>
                
                {/* Secret Menu on PFP Tap */}
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
                          onClick={() => { setEditingId(msg.id); setInput(msg.text); }}
                          className="flex items-center gap-2 w-full p-2 text-[11px] font-bold hover:bg-white/5 transition-colors"
                        ><Edit3 size={14} style={{color: theme.text2}}/> EDIT</button>
                        <button 
                          onClick={async () => await deleteDoc(doc(db, "rooms", room, "messages", msg.id))}
                          className="flex items-center gap-2 w-full p-2 text-[11px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        ><Trash2 size={14}/> DELETE</button>
                      </PopoverContent>
                    )}
                  </Popover>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{msg.displayName}</span>
                </div>

                {/* Bubble */}
                <div 
                  className={`p-3 rounded-2xl border transition-all duration-300 ${isMine ? "bg-zinc-900 border-white/5" : "bg-black/80 backdrop-blur-sm border-zinc-800"}`}
                  style={{ 
                    borderLeft: !isMine ? `3px solid ${theme.text2}` : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isMine ? `0 4px 20px ${theme.text2}11` : "none"
                  }}
                >
                  {/* Media Content */}
                  {msg.mediaType === "image" && <img src={msg.mediaData} className="rounded-lg mb-2 max-h-64 shadow-lg border border-white/5" alt="Shared" />}
                  {msg.mediaType === "gif" && <img src={msg.mediaData} className="rounded-lg mb-2 max-h-64" alt="GIF" />}
                  {msg.mediaType === "audio" && (
                    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl mb-1">
                      <Play size={16} style={{fill: theme.text2, color: theme.text2}} />
                      <audio src={msg.mediaData} controls className="h-8 opacity-70" />
                    </div>
                  )}
                  {msg.mediaType === "pdf" && (
                    <div className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg mb-1 border border-white/10">
                      <FileText size={20} className="text-red-500" />
                      <span className="text-[10px] truncate max-w-[100px]">{msg.fileName}</span>
                      <a href={msg.mediaData} download={msg.fileName} title="Download"><Download size={14} /></a>
                    </div>
                  )}

                  {msg.text && (
                    <p className="text-[14px] whitespace-pre-wrap leading-relaxed" style={{ color: theme.text1 }}>
                      {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                        part.match(/https?:\/\/[^\s]+/) ? (
                          <a key={i} href={part} target="_blank" className="text-blue-500 underline hover:text-blue-400">
                            {part}
                          </a>
                        ) : part
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
        })}
        <div ref={scrollRef} />
      </main>

      {/* 3. Media Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Encrypted Preview</h2>
            {preview.type === "image" || preview.type === "gif" ? <img src={preview.data} alt="Preview" title="Media preview" className="rounded-xl mb-4 max-h-64 w-full object-cover shadow-2xl" /> : 
             preview.type === "audio" ? <div className="p-8 bg-black rounded-xl mb-4 flex justify-center"><Play size={40} style={{color: theme.text2}}/></div> :
             <div className="p-8 bg-black rounded-xl mb-4 text-center"><FileText size={40} className="mx-auto text-red-500 mb-2"/>{preview.name}</div>}
            
            <div className="flex gap-2">
              <button onClick={() => setPreview(null)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold text-[11px] uppercase tracking-widest">Cancel</button>
              <button onClick={() => handleAction(preview)} className="flex-1 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg" style={{backgroundColor: theme.text2, color: 'black'}}>Send Now</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Input Bar */}
      <footer className="p-4 bg-black/80 border-t border-zinc-900 backdrop-blur-md">
        <div className="flex items-end gap-3 max-w-5xl mx-auto">
          
          <Popover>
            <PopoverTrigger title="Media Menu" aria-label="Media Menu">
              <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all"><Plus size={22} /></div>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="bg-zinc-900 border-zinc-800 w-40 p-1 rounded-xl shadow-2xl">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors"><ImageIcon size={16} className="text-zinc-500"/> Media / GIF</button>
              <button onClick={async () => {
                 const s = await navigator.mediaDevices.getUserMedia({ video: true });
                 setPreview({data: 'camera_mode', type: 'camera'}); // Simplified for example
              }} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors"><Camera size={16} className="text-zinc-500"/> Camera</button>
            </PopoverContent>
          </Popover>

          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-1.5 focus-within:border-zinc-700 transition-all">
            <textarea
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault(); handleAction();
                }
              }}
              placeholder={editingId ? "Updating message..." : "Type transmission..."}
              className="w-full bg-transparent border-none focus:ring-0 text-[14px] py-2 px-0 resize-none text-zinc-100 placeholder:text-zinc-800"
              rows={1}
            />
          </div>

          <button 
            onClick={() => handleAction()}
            onPointerDown={input ? undefined : startRecord}
            onPointerUp={input ? undefined : () => { recorderRef.current?.stop(); setIsRecording(false); }}
            className={`p-3 rounded-full transition-all duration-300 shadow-xl ${isRecording ? "bg-red-600 scale-125 shadow-red-500/50" : ""}`}
            style={{ 
              backgroundColor: input ? theme.text2 : "#18181b", 
              color: input ? "black" : "#52525b",
              boxShadow: input ? `0 0 15px ${theme.text2}66` : "none"
            }}
            title={input ? "Send" : "Hold Mic"}
            aria-label={input ? "Send" : "Microphone"}
          >
            {input ? <Send size={22} /> : <Mic size={22} className={isRecording ? "animate-pulse" : ""} />}
          </button>
        </div>
      </footer>

      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} hidden accept="image/*,application/pdf,image/gif" onChange={e => e.target.files?.[0] && prepareMedia(e.target.files[0])} />
    </div>
  );
}