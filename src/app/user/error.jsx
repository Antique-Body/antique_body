"use client";
import { Button } from "@/components/common/Button";

export default function UserError({ reset }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <Button onClick={() => reset()} variant="primary">
        Try again
      </Button>
    </div>
  );
}
