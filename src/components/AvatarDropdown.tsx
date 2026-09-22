"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
// import Cookies from "universal-cookie";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// const cookies = new Cookies();

export function UserMenu() {
  const [user, setUser] = useState(auth.currentUser);
  const { setTheme } = useTheme();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    // cookies.remove("auth-token");
    localStorage.removeItem("auth-token"); // old approch
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-end p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            src={user.photoURL || "/user.jpg"}
            alt="avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem disabled className="opacity-100 font-semibold">
            {user.displayName || "Anonymous"}
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-70 text-xs">
            {user.email}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setTheme("light")}>
            ☀ Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            🌙 Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            🖥 System
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
