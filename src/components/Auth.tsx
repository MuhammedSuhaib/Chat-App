"use client";

import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
// import Cookies from "universal-cookie";

// const cookies = new Cookies();

export const Auth = ({ setIsAuth }: { setIsAuth: (val: boolean) => void }) => {
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    localStorage.setItem("auth-token", result.user.refreshToken);
    setIsAuth(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center-safe bg-[#111827] text-white shadow-2xl shadow-black gap-6 p-4">
      <p className="text-base sm:text-lg">Welcome to</p>
      <h1 className="flex flex-wrap justify-center text-3xl sm:text-4xl font-bold tracking-wide text-center leading-tight">
        &lt;
        <span className="text-3xl sm:text-5xl text-purple-400">ℭʎ𝔟𝔢𝔯𝕾𝖖𝖚𝖆𝖉</span>
        /&gt;
      </h1>
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:scale-105 transition-transform"
      >
        <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>
    </div>
  );
};
