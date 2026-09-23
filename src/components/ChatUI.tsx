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
import { deriveKey, encryptText } from "@/lib/encryption";

export default function ChatUI({ room }: { room: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // State holding ID of message currently being edited (null if creating new message)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

  // Toggle encryption: ask for a room passphrase, derive a key, remember it for this browser
  const handleToggleEncryption = async (next: boolean) => {
    if (next) {
      const storageKey = `chat-passphrase:${room}`;
      let passphrase = localStorage.getItem(storageKey) || "";
      if (!passphrase) {
        const entered = window.prompt(
          "Set/enter a shared encryption passphrase for this room:",
        );
        if (!entered) return; // user cancelled, keep encryption off
        passphrase = entered;
        localStorage.setItem(storageKey, passphrase);
      }
      const key = await deriveKey(passphrase, room);
      setCryptoKey(key);
      setEncryptionEnabled(true);
    } else {
      setEncryptionEnabled(false);
    }
  };
  const [theme, setTheme] = useState<AppTheme>({
    text1: "#ffffff",
    text2: "#20e07d",
    bgImage: "",
  });

  // Reference to MediaRecorder instance for audio capture
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Request Notification permission when user enters chat room
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Realtime Firestore Listener: subscribes to messages for active room ordered by creation time
  useEffect(() => {
    const q = query(
      collection(db, "rooms", room, "messages"),
      orderBy("createdAt"),
    );
    let initialLoad = true;
    return onSnapshot(q, (snapshot) => {
      if (initialLoad) {
        initialLoad = false;
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data() as Message;
            // Notify if message was sent by someone else and page/tab is hidden or not focused
            if (
              data.userId !== auth.currentUser?.uid &&
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted" &&
              document.hidden
            ) {
              const body = data.encrypted
                ? "🔒 Encrypted Message"
                : data.text || (data.mediaType ? `[${data.mediaType.toUpperCase()}]` : "New Message");
              new Notification(`New message from ${data.displayName || "User"}`, {
                body,
                icon: data.photoURL || "/icon-192x192.png",
              });
            }
          }
        });
      }

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
      const shouldEncrypt = encryptionEnabled && !!cryptoKey && !!input.trim();
      const outgoingText =
        shouldEncrypt && cryptoKey ? await encryptText(input, cryptoKey) : input;

      if (editingId) {
        // Update existing message text
        await updateDoc(doc(db, "rooms", room, "messages", editingId), {
          text: outgoingText,
          encrypted: shouldEncrypt,
        });
        setEditingId(null);
      } else {
        // Create new message document in Firestore
        await addDoc(collection(db, "rooms", room, "messages"), {
          text: outgoingText,
          userId: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "User",
          photoURL: auth.currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          mediaType: media?.type || null,
          mediaData: media?.data || null,
          fileName: media?.name || null,
          encrypted: shouldEncrypt,
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      rec.onstop = () => {
        const mimeType = rec.mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: mimeType });
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
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  // Stops active audio recording and triggers generation of audio preview blob.
  const stopRecord = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
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
        setEncryptionEnabled={handleToggleEncryption}
      />

      {/* Main scrollable list of messages */}
      <MessageList
        messages={messages}
        room={room}
        theme={theme}
        cryptoKey={cryptoKey}
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
