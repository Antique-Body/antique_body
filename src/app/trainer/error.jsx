"use client";

import { Button } from "@/components/common/Button";

export default function TrainerError({ reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button
        onClick={() => reset()}
        variant="primary"
        className="px-4 py-2 rounded hover:bg-primary-dark"
      >
        Try again
      </Button>
    </div>
  );
}
