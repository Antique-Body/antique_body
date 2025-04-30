"use client";

import { SessionProvider } from "next-auth/react";

import { AuthProvider as ContextAuthProvider } from "./AuthContext";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <ContextAuthProvider>{children}</ContextAuthProvider>
    </SessionProvider>
  );
}
