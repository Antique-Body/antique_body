"use client";

import React from "react";
import Background from "../components/background";
import AudioPlayButton from "../components/custom/AudioPlayButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Background with all artifacts enabled */}
      <Background />

      <div className="spartacus-font z-10 relative text-white text-center p-6 rounded-lg backdrop-blur-sm">
        <h1 className="text-7xl mb-4">
          ANTIQUE <span className="text-[#FF7800] ">BODY</span>
        </h1>
        <p className="text-lg">
          Your antique-themed UI is ready. Navigate to the login page for a
          complete example.
        </p>
      </div>
      {/* Audio player component */}
      <AudioPlayButton audioSrc="/audio/gladiator-theme.mp3" />
    </main>
  );
}
