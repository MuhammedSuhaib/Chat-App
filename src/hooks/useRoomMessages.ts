//? useRoomMessages: subscribes to realtime Firestore messages, dispatches system notifications, and provides send/edit handlers
"use client";

import { useEffect, useState } from "react";
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
import { Message, Preview } from "@/components/chat/types";
import { encryptText } from "@/lib/encryption";

export function useRoomMessages(
  room: string,
  encryptionEnabled: boolean,
  cryptoKey: CryptoKey | null,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  // Saves a new message or updates an existing message document in Firestore.
  const saveMessage = async (
    text: string,
    editingId: string | null,
    media?: Preview | null,
  ) => {
    if ((!text.trim() && !media) || !auth.currentUser) return;
    setIsUploading(true);

    try {
      const isEncrypted = encryptionEnabled && !!cryptoKey;

      if (editingId) {
        // Update existing message text
        const outgoingText =
          isEncrypted && text.trim()
            ? await encryptText(text, cryptoKey)
            : text;
        await updateDoc(doc(db, "rooms", room, "messages", editingId), {
          text: outgoingText,
          encrypted: isEncrypted,
        });
      } else {
        // Encrypt message text and/or media payload when encryption is enabled
        const outgoingText =
          isEncrypted && text.trim()
            ? await encryptText(text, cryptoKey)
            : text;
        const outgoingMediaData =
          isEncrypted && media?.data
            ? await encryptText(media.data, cryptoKey)
            : media?.data || null;

        // Create new message document in Firestore
        await addDoc(collection(db, "rooms", room, "messages"), {
          text: outgoingText,
          userId: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "User",
          photoURL: auth.currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          mediaType: media?.type || null,
          mediaData: outgoingMediaData,
          fileName: media?.name || null,
          encrypted: isEncrypted,
        });
      }
    } catch (e) {
      console.error("Error saving message:", e);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    messages,
    isUploading,
    saveMessage,
  };
}
