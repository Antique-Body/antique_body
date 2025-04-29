"use client";
import { Button } from "@/components/common/Button";

export default function ClientError({ error, reset }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <Button onClick={() => reset()} variant="primary">
                Try again
            </Button>
        </div>
    );
}
