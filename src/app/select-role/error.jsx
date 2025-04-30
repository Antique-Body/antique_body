"use client";
import { Button } from "@/components/common/Button";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white">
      <div className="max-w-md p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-[#ff7800]">Something went wrong!</h2>
        <p className="mb-6 text-gray-300">{error.message}</p>
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
      </div>
    </div>
  );
}
