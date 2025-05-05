"use client";

export default function UserError({ reset }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button onClick={() => reset()} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                Try again
            </button>
        </div>
    );
}
