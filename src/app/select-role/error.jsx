"use client";
import { Button } from "@/components/common/Button";

export default function Error({ error, reset }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white">
            <div className="text-center p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-[#ff7800]">Something went wrong!</h2>
                <p className="text-gray-300 mb-6">{error.message}</p>
                <Button onClick={() => reset()} variant="primary">
                    Try again
                </Button>
            </div>
        </div>
    );
}
