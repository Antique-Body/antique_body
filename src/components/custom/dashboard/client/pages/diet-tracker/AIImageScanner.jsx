"use client";

import { useEffect, useState } from "react";

export const AIImageScanner = ({ isScanning }) => {
  const [scanPosition, setScanPosition] = useState(0);
  const [scanDirection, setScanDirection] = useState("down");

  useEffect(() => {
    let animationFrame;

    if (isScanning) {
      const animate = () => {
        setScanPosition((prev) => {
          // Change direction when reaching boundaries
          if (prev >= 100 && scanDirection === "down") {
            setScanDirection("up");
            return 100;
          } else if (prev <= 0 && scanDirection === "up") {
            setScanDirection("down");
            return 0;
          }

          // Move scan line
          return scanDirection === "down" ? prev + 0.8 : prev - 0.8;
        });

        animationFrame = requestAnimationFrame(animate);
      };

      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isScanning, scanDirection]);

  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10">
        {/* Corner brackets for a tech feel */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00]"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00]"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00]"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00]"></div>
      </div>

      {/* Scan lines */}
      <div
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00]/40 via-[#FF6B00] to-[#FF6B00]/40 z-20"
        style={{ top: `${scanPosition}%` }}
      >
        {/* Bright center line */}
        <div className="absolute top-0 left-0 w-full h-px bg-[#FF8B20]"></div>

        {/* Glow effect */}
        <div className="absolute top-1/2 left-0 w-full h-6 -translate-y-1/2 bg-[#FF6B00]/20 blur-sm"></div>
      </div>

      {/* Vertical side lines */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#FF6B00]/20 via-[#FF6B00] to-[#FF6B00]/20 z-20"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#FF6B00]/20 via-[#FF6B00] to-[#FF6B00]/20 z-20"></div>

      {/* AI Analysis text */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FF6B00]/30">
          <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse mr-2"></div>
          <span className="text-xs text-[#FF6B00] font-medium tracking-wider">
            AI ANALYZING
          </span>
        </div>
      </div>

      {/* Data points effect */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#FF6B00]/70 animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${1 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
