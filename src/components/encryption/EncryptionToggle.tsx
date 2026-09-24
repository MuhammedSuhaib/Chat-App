//? EncryptionToggle: button indicator for current room encryption status and toggling
"use client";

import { Lock, Unlock } from "lucide-react";
import { EncryptionToggleProps } from "./types";

export function EncryptionToggle({
  encryptionEnabled,
  accentColor,
  onToggle,
}: EncryptionToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={encryptionEnabled ? "Encryption ON" : "Encryption OFF"}
      aria-label="Toggle encryption"
      className="p-1.5 rounded-full transition-colors"
      style={{
        color: encryptionEnabled ? accentColor : "#71717a",
        backgroundColor: encryptionEnabled ? `${accentColor}22` : "transparent",
      }}
    >
      {encryptionEnabled ? <Lock size={18} /> : <Unlock size={18} />}
    </button>
  );
}
