"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export const AIImageScanner = ({ isScanning }) => {
  const [scanPosition, setScanPosition] = useState(0);
  const [scanDirection, setScanDirection] = useState("down");
  const [pulseIntensity, setPulseIntensity] = useState(0.5);

  useEffect(() => {
    let animationFrame;
    let pulseFrame;

    if (isScanning) {
      // Main scan line animation
      const animate = () => {
        setScanPosition((prev) => {
          if (prev >= 100 && scanDirection === "down") {
            setScanDirection("up");
            return 100;
          } else if (prev <= 0 && scanDirection === "up") {
            setScanDirection("down");
            return 0;
          }
          return scanDirection === "down" ? prev + 1.2 : prev - 1.2;
        });
        animationFrame = requestAnimationFrame(animate);
      };

      // Pulse animation for AI elements
      const animatePulse = () => {
        setPulseIntensity(() => {
          const newIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.4;
          return Math.max(0.2, Math.min(0.8, newIntensity));
        });
        pulseFrame = requestAnimationFrame(animatePulse);
      };

      animationFrame = requestAnimationFrame(animate);
      pulseFrame = requestAnimationFrame(animatePulse);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (pulseFrame) cancelAnimationFrame(pulseFrame);
    };
  }, [isScanning, scanDirection]);

  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-20">
      {/* Enhanced backdrop with better blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 backdrop-blur-md">
        {/* Advanced corner brackets with glow */}
        <div className="absolute top-3 left-3 w-8 h-8">
          <div className="w-full h-full border-t-3 border-l-3 border-[#FF6B00] rounded-tl-lg shadow-lg shadow-[#FF6B00]/30"></div>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#FF6B00] rounded-full opacity-80 animate-pulse"></div>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8">
          <div className="w-full h-full border-t-3 border-r-3 border-[#FF6B00] rounded-tr-lg shadow-lg shadow-[#FF6B00]/30"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6B00] rounded-full opacity-80 animate-pulse"></div>
        </div>
        <div className="absolute bottom-3 left-3 w-8 h-8">
          <div className="w-full h-full border-b-3 border-l-3 border-[#FF6B00] rounded-bl-lg shadow-lg shadow-[#FF6B00]/30"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#FF6B00] rounded-full opacity-80 animate-pulse"></div>
        </div>
        <div className="absolute bottom-3 right-3 w-8 h-8">
          <div className="w-full h-full border-b-3 border-r-3 border-[#FF6B00] rounded-br-lg shadow-lg shadow-[#FF6B00]/30"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FF6B00] rounded-full opacity-80 animate-pulse"></div>
        </div>

        {/* Grid overlay for tech feel */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>

      {/* Enhanced main scan line with multiple layers */}
      <div
        className="absolute left-0 w-full z-30 transition-all duration-75"
        style={{
          top: `${scanPosition}%`,
          transform: "translateY(-50%)",
        }}
      >
        {/* Main scan line */}
        <div className="relative h-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/40 via-[#FFD700] to-[#FF6B00]/40"></div>

          {/* Bright center core */}
          <div className="absolute top-0 left-1/2 w-20 h-px bg-white transform -translate-x-1/2 shadow-lg shadow-white/50"></div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent blur-sm"></div>
        <div className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FF6B00]/50 to-transparent blur-xs"></div>

        {/* Side sparks */}
        <div className="absolute top-1/2 left-2 w-2 h-2 bg-[#FFD700] rounded-full -translate-y-1/2 animate-ping"></div>
        <div className="absolute top-1/2 right-2 w-2 h-2 bg-[#FFD700] rounded-full -translate-y-1/2 animate-ping"></div>
      </div>

      {/* Vertical scanning guides */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#FF6B00]/30 via-[#FF6B00]/80 to-[#FF6B00]/30 z-25"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#FF6B00]/30 via-[#FF6B00]/80 to-[#FF6B00]/30 z-25"></div>

      {/* Center vertical guide */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#FF6B00]/40 to-transparent transform -translate-x-1/2 z-20"></div>

      {/* Enhanced AI Analysis Interface */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-lg px-5 py-3 rounded-2xl border border-[#FF6B00]/40 shadow-2xl shadow-[#FF6B00]/20">
          {/* AI Brain Icon with pulse */}
          <div className="relative mr-3">
            <div
              className="w-6 h-6 bg-gradient-to-br from-[#FF6B00] to-[#FFD700] rounded-lg flex items-center justify-center shadow-lg"
              style={{ opacity: pulseIntensity + 0.5 }}
            >
              <Icon icon="mdi:brain" className="w-4 h-4 text-white" />
            </div>
            <div className="absolute inset-0 bg-[#FF6B00] rounded-lg animate-ping opacity-30"></div>
          </div>

          {/* Status text with typewriter effect */}
          <div className="flex items-center">
            <span className="text-[#FF6B00] font-bold text-sm tracking-wider mr-2">
              AI ANALYZING
            </span>
            <div className="flex space-x-1">
              <div
                className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="ml-4 flex items-center space-x-1">
            <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFD700] rounded-full transition-all duration-300"
                style={{
                  width: `${(scanPosition / 100) * 50 + 50}%`,
                  boxShadow: "0 0 8px rgba(255, 107, 0, 0.5)",
                }}
              ></div>
            </div>
            <span className="text-[#FF6B00] text-xs font-mono">
              {Math.round((scanPosition / 100) * 50 + 50)}%
            </span>
          </div>
        </div>
      </div>

      {/* Floating data points with enhanced animation */}
      <div className="absolute inset-0 z-15">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${10 + ((i * 4) % 80)}%`,
              left: `${5 + ((i * 7) % 90)}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping opacity-70"></div>
              <div className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Scanning particles effect */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-[#FF6B00] rounded-full opacity-60"
            style={{
              left: `${10 + i * 10}%`,
              top: `${scanPosition}%`,
              transform: "translateY(-50%)",
              boxShadow: "0 0 4px rgba(255, 107, 0, 0.8)",
              animation: `float 1.5s ease-in-out infinite`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Neural network visualization */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-[#FF6B00]/30">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={`neural-${i}`}
                className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: pulseIntensity + 0.3,
                }}
              />
            ))}
          </div>
          <div className="text-[#FF6B00] text-xs font-mono mt-1 text-center">
            NEURAL
          </div>
        </div>
      </div>

      {/* Food detection indicators */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-[#FF6B00]/30">
          <div className="flex items-center space-x-2">
            <Icon
              icon="mdi:food"
              className="w-4 h-4 text-[#FF6B00] animate-pulse"
            />
            <div className="text-[#FF6B00] text-xs font-mono">DETECTING</div>
          </div>
          <div className="flex mt-1 space-x-1">
            <div
              className="w-1 h-4 bg-[#FF6B00] rounded-full animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1 h-4 bg-[#FF6B00]/70 rounded-full animate-pulse"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-1 h-4 bg-[#FF6B00]/50 rounded-full animate-pulse"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(-50%) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50%) translateX(10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
