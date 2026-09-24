//? ChatUI Component: main orchestrator component for real-time chat interface
"use client";

import React, { useState } from "react";
import {
  ChatHeader,
  MessageList,
  MediaPreview,
  ChatInput,
  AppTheme,
  Preview,
} from "./chat";
import { useRoomEncryption } from "./encryption";
import { useAudioRecorder, useRoomMessages } from "@/hooks";
import { MAX_UPLOAD_BYTES } from "@/lib";


export default function ChatUI({ room }: { room: string }) {
  const [input, setInput] = useState("");
  // State holding ID of message currently being edited (null if creating new message)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [theme, setTheme] = useState<AppTheme>({
    text1: "#ffffff",
    text2: "#f97316",
    bgImage: "",
  });

  // Manage room-level encryption state and key derivation
  const { encryptionEnabled, cryptoKey, toggleEncryption } =
    useRoomEncryption(room);

  // Manage audio recording lifecycle
  const { isRecording, startRecording, stopRecording } = useAudioRecorder(
    (audioPreview) => setPreview(audioPreview),
  );

  // Manage Firestore real-time messages and OS notifications
  const { messages, isUploading, saveMessage } = useRoomMessages(
    room,
    encryptionEnabled,
    cryptoKey,
  );

  // Handles for sending or updating an existing message in Firestore.
  // Also processes attached media (images, GIFs, PDFs, audio voice notes).
  const handleAction = async (media?: Preview | null) => {
    await saveMessage(input, editingId, media);
    setInput("");
    setEditingId(null);
    setPreview(null);
  };

  // Reads a user-selected File object and converts it into a Base64 data URL preview.
  // Validates file size to prevent Firestore 1MB document limit rejections.
  const prepareMedia = (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      const fileSizeMb = file.size / (1024 * 1024);
      alert(`File too large (${fileSizeMb.toFixed(1)} MB). Max is 750 KB. Use ToffeeShare: https://toffeeshare.com/`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let type = "image";
      if (file.type === "image/gif") type = "gif";
      if (file.type === "application/pdf") type = "pdf";
      setPreview({ data: reader.result as string, type, name: file.name });
    };
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
        setEncryptionEnabled={toggleEncryption}
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
        onStartRecord={startRecording}
        onStopRecord={stopRecording}
        onPrepareMedia={prepareMedia}
        setPreview={setPreview}
      />
    </div>
  );
}
