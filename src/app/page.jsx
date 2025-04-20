"use client";

import React from "react";
import Background from "../components/background";
import AudioPlayButton from "../components/custom/AudioPlayButton";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center relative">
      {/* Background with all artifacts enabled */}
      <Background />

      {/* Audio player component */}
      <AudioPlayButton audioSrc="/audio/gladiator-theme.mp3" />

      <div className="z-10 relative text-white text-center p-6 rounded-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-4">
          ANTIQUE <span className="text-[#FF7800]">BODY</span>
        </h1>
        <p>
          Your antique-themed UI is ready. Navigate to the login page for a
          complete example.
        </p>
      </div>
    </main>
  );
}
