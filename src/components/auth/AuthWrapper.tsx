//? AuthWrapper: gates the app behind an auth cookie — shows Auth screen if not authenticated
"use client";

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Auth } from "./Auth";

const cookies = new Cookies();

// wrapper to show Auth screen if not authenticated
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  // state to track auth status
  const [isAuth, setIsAuth] = useState(false);

  // check cookie once on mount
  useEffect(() => {
    const token = cookies.get("auth-token");
    if (token) setIsAuth(true); // if token exists, set as authenticated
  }, []);

  // show Auth if not authenticated
  if (!isAuth) return <Auth setIsAuth={setIsAuth} />;

  // otherwise show children
  return <>{children}</>;
}
