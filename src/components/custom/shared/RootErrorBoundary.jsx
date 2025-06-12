"use client";

import { useEffect, useState } from "react";

import { ErrorBoundary } from "@/components/common";

export default function RootErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Global error handler for uncaught exceptions
    const handleGlobalError = (event) => {
      event.preventDefault();
      setError(event.error || new Error("An unexpected error occurred"));
    };

    // Add global error listener
    window.addEventListener("error", handleGlobalError);

    // Add unhandled promise rejection listener
    window.addEventListener("unhandledrejection", (event) => {
      setError(event.reason || new Error("Unhandled promise rejection"));
    });

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleGlobalError);
    };
  }, []);

  if (error) {
    return <ErrorBoundary error={error} reset={() => setError(null)} />;
  }

  return children;
}
