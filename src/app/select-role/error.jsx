"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b  text-white">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#ff7800]">
          Something went wrong!
        </h2>
        <p className="text-gray-300 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[#ff7800] hover:bg-[#e66e00] text-white rounded-lg transition-colors">
          Try again
        </button>
      </div>
    </div>
  );
}
