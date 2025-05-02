"use client";

import { AuthProvider as ContextAuthProvider } from "./AuthContext";

export default function AuthProvider({ children }) {
  return <ContextAuthProvider>{children}</ContextAuthProvider>;
}
