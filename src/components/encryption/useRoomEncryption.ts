//? RoomEncryption: custom hook managing PBKDF2 key derivation and room encryption state
"use client";

import { useState } from "react";
import { deriveKey } from "@/lib/encryption";

export function useRoomEncryption(room: string) {
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

  // Toggle encryption: ask for room passphrase, derive AES-GCM key
  const toggleEncryption = async (enable: boolean) => {
    const storageKey = `chat-passphrase:${room}`;
    if (enable) {
      let passphrase = localStorage.getItem(storageKey) || "";
      const entered = window.prompt(
        "Enter shared encryption passphrase for this room:",
        passphrase,
      );
      if (!entered) return; // user cancelled
      passphrase = entered;
      localStorage.setItem(storageKey, passphrase);

      const key = await deriveKey(passphrase, room);
      setCryptoKey(key);
      setEncryptionEnabled(true);
    } else {
      localStorage.removeItem(storageKey);
      setCryptoKey(null);
      setEncryptionEnabled(false);
    }
  };

  return {
    encryptionEnabled,
    cryptoKey,
    toggleEncryption,
  };
}
