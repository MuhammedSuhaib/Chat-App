//? SignUpForm: handles manual email/password registration with display name
"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SignUpFormProps } from "./types";

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------Signup Manually------------------------------------------------
  const register = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword,
      );
      await updateProfile(userCredential.user, {
        displayName: username.trim() || "User",
      });
      onSuccess(userCredential.user.refreshToken);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setError("Email is already in use. Try logging in or use a different email.");
        } else if (err.code === "auth/weak-password") {
          setError("Password must be at least 6 characters.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!registerEmail || !registerPassword) {
          setError("Please fill in both email and password.");
          return;
        }
        register();
      }}
      className="space-y-3"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-primary w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={registerEmail}
        onChange={(event) => setRegisterEmail(event.target.value)}
        className="input-primary w-full"
      />

      <input
        type="password"
        placeholder="Password (min. 6 characters)"
        value={registerPassword}
        onChange={(event) => setRegisterPassword(event.target.value)}
        minLength={6}
        className="input-primary w-full"
      />

      {error && (
        <p className="text-xs bg-red-950/60 border border-red-800/60 text-red-400 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Please wait…" : "Join"}
      </button>
    </form>
  );
};
