"use client";

import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function GlobalError({ error, reset }) {
  return <ErrorBoundary error={error} reset={reset} />;
}
