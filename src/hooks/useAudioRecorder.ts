//? useAudioRecorder: custom hook managing microphone stream and audio blob preparation
"use client";

import { useRef, useState } from "react";
import { Preview } from "@/components/chat/types";

export function useAudioRecorder(onAudioReady: (preview: Preview) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Initiates microphone access and starts recording audio using MediaRecorder API.
  const startRecording = async () => {
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
          onAudioReady({
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
  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
