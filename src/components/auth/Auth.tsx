//? Auth: Google sign-in screen that sets auth-token cookie + toggleable manual auth forms
"use client";

import { useState } from "react";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { APP_NAME } from "@/lib/constants";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { AuthMode, AuthProps } from "./types";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }: AuthProps) => {
  const [showManualAuth, setShowManualAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const handleAuthSuccess = (refreshToken: string) => {
    cookies.set("auth-token", refreshToken, { path: "/" });
    setIsAuth(true);
  };

  // ------------------------------------------------Login with Google ------------------------------------------------
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      handleAuthSuccess(result.user.refreshToken);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
      } else {
        console.error("Unknown error signing in with Google");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white gap-6 p-4">
      <p className="text-base sm:text-lg text-zinc-400">Welcome to</p>
      <h1 className="flex flex-wrap justify-center text-3xl sm:text-4xl font-bold tracking-wide text-center leading-tight">
        &lt;
        <span className="text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-amber-300 font-extrabold">{APP_NAME}</span>
        /&gt;
      </h1>

      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary via-secondary to-[#ea580c] text-primary-foreground font-semibold shadow-lg shadow-primary/25 border border-primary/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        <Image src="/google-icon.png" alt="Google" width={20} height={20} />
        Continue with Google
      </button>

      {!showManualAuth ? (
        <button
          onClick={() => setShowManualAuth(true)}
          className="text-sm text-zinc-400 hover:text-primary underline underline-offset-4 transition-colors cursor-pointer"
        >
          Use email instead
        </button>
      ) : (
        <div className="card-primary w-full max-w-xs space-y-4 p-5">
          <div className="flex items-center gap-3">
            <hr className="flex-grow border-zinc-800" />
            <span className="text-[11px] text-zinc-500 uppercase tracking-widest">or</span>
            <hr className="flex-grow border-zinc-800" />
          </div>

          <div className="flex rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/60 p-1 text-xs font-semibold">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${authMode === "login" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm" : "text-zinc-400 hover:text-white"}`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${authMode === "signup" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm" : "text-zinc-400 hover:text-white"}`}
            >
              Sign up
            </button>
          </div>

          {authMode === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignUpForm onSuccess={handleAuthSuccess} />
          )}

          <button
            onClick={() => setShowManualAuth(false)}
            className="w-full text-xs text-zinc-500 hover:text-primary transition-colors cursor-pointer text-center block pt-1"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};
