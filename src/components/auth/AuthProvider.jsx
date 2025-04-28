"use client";

import { AuthProvider as ContextAuthProvider } from "./AuthContext";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <ContextAuthProvider>{children}</ContextAuthProvider>
    </SessionProvider>
  );
}
