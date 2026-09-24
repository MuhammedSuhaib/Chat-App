//? RoomEncryption: custom hook managing PBKDF2 key derivation and room encryption state
"use client";

import { useState } from "react";
import { deriveKey } from "@/lib/encryption";

export function useRoomEncryption(room: string) {
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

  // Toggle encryption: ask for room passphrase, derive AES-GCM key, cache in localStorage
  const toggleEncryption = async (enable: boolean) => {
    if (enable) {
      const storageKey = `chat-passphrase:${room}`;
      let passphrase = localStorage.getItem(storageKey) || "";
      if (!passphrase) {
        const entered = window.prompt(
          "Set/enter a shared encryption passphrase for this room:",
        );
        if (!entered) return; // user cancelled
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

  return {
    encryptionEnabled,
    cryptoKey,
    toggleEncryption,
  };
}
