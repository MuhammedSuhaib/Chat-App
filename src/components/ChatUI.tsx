//? ChatUI Component: main orchestrator component for real-time chat interface
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
  updateDoc,
} from "firebase/firestore";

import {
  ChatHeader,
  MessageList,
  MediaPreview,
  ChatInput,
  Message,
  AppTheme,
  Preview,
} from "./chat";

export default function ChatUI({ room }: { room: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // State holding ID of message currently being edited (null if creating new message)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [theme, setTheme] = useState<AppTheme>({
    text1: "#ffffff",
    text2: "#20e07d",
    bgImage: "",
  });

  // Reference to MediaRecorder instance for audio capture
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Realtime Firestore Listener: subscribes to messages for active room ordered by creation time
  useEffect(() => {
    const q = query(
      collection(db, "rooms", room, "messages"),
      orderBy("createdAt"),
    );
    return onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Message),
      );
    });
  }, [room]);

  // Handles for sending or updating an existing message in Firestore.
  // Also processes attached media (images, GIFs, PDFs, audio voice notes).
  const handleAction = async (media?: Preview | null) => {
    if ((!input.trim() && !media) || !auth.currentUser) return;
    setIsUploading(true);

    try {
      if (editingId) {
        // Update existing message text
        await updateDoc(doc(db, "rooms", room, "messages", editingId), {
          text: input,
        });
        setEditingId(null);
      } else {
        // Create new message document in Firestore
        await addDoc(collection(db, "rooms", room, "messages"), {
          text: input,
          userId: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "User",
          photoURL: auth.currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          mediaType: media?.type || null,
          mediaData: media?.data || null,
          fileName: media?.name || null,
          encrypted: encryptionEnabled,
        });
      }
      setInput("");
      setPreview(null);
    } catch (e) {
      console.error("Error saving message:", e);
    } finally {
      setIsUploading(false);
    }
  };

  // Reads a user-selected File object and converts it into a Base64 data URL preview.
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

  // Initiates microphone access and starts recording audio using MediaRecorder API.
  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () =>
        setPreview({
          data: reader.result as string,
          type: "audio",
          name: "voice_note.webm",
        });
      stream.getTracks().forEach((t) => t.stop());
    };
    rec.start();
    recorderRef.current = rec;
    setIsRecording(true);
  };

  // Stops active audio recording and triggers generation of audio preview blob.
  const stopRecord = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div
      className="flex flex-col h-[100dvh] bg-black text-white overflow-hidden overflow-x-hidden relative"
      style={{
        backgroundImage: theme.bgImage ? `url(${theme.bgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Header bar with room name and theme customization */}
      <ChatHeader
        room={room}
        theme={theme}
        setTheme={setTheme}
        isUploading={isUploading}
        encryptionEnabled={encryptionEnabled}
        setEncryptionEnabled={setEncryptionEnabled}
      />

      {/* Main scrollable list of messages */}
      <MessageList
        messages={messages}
        room={room}
        theme={theme}
        onEdit={(id, text) => {
          setEditingId(id);
          setInput(text);
        }}
      />

      {/* Media attachment modal preview overlay */}
      {preview && (
        <MediaPreview
          preview={preview}
          theme={theme}
          onCancel={() => setPreview(null)}
          onSend={() => handleAction(preview)}
        />
      )}

      {/* Bottom text input & voice recording controls */}
      <ChatInput
        input={input}
        setInput={setInput}
        editingId={editingId}
        theme={theme}
        isRecording={isRecording}
        onSend={() => handleAction()}
        onStartRecord={startRecord}
        onStopRecord={stopRecord}
        onPrepareMedia={prepareMedia}
        setPreview={setPreview}
      />
    </div>
  );
}
