//? LoginForm: handles email/password sign-in and password reset flow
"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoginFormProps } from "./types";

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------Login Manually------------------------------------------------
  const login = async () => {
    setError(null);
    setLoading(true);
    try {
      const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
      onSuccess(user.user.refreshToken);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          setError("Invalid email or password.");
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

  // ------------------------------------------------Password Reset------------------------------------------------
  const resetPassword = async () => {
    if (!loginEmail) {
      setError("Please enter your email first.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      setError("✅ Password reset email sent to " + loginEmail);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found") {
          setError("Email not registered. Please sign up first.");
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
        if (!loginEmail || !loginPassword) {
          setError("Please fill in both email and password.");
          return;
        }
        login();
      }}
      className="space-y-3"
    >
      <input
        type="email"
        placeholder="Email"
        value={loginEmail}
        onChange={(event) => setLoginEmail(event.target.value)}
        className="input-primary w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(event) => setLoginPassword(event.target.value)}
        className="input-primary w-full"
      />

      <div className="flex items-center justify-between text-xs">
        <label
          htmlFor="Remember"
          className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            id="Remember"
            name="Remember"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="accent-primary cursor-pointer rounded"
          />
          Remember me
        </label>
        <button
          type="button"
          disabled={!loginEmail || loading}
          onClick={resetPassword}
          className="text-primary hover:text-secondary hover:underline disabled:opacity-50 cursor-pointer transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      {error && (
        <p
          className={`text-xs px-3 py-2 rounded-lg ${
            error.startsWith("✅")
              ? "bg-green-950/60 border border-green-800/60 text-green-400"
              : "bg-red-950/60 border border-red-800/60 text-red-400"
          }`}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Please wait…" : "Login"}
      </button>
    </form>
  );
};
