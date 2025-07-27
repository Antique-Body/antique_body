"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

// Animation and timing constants
const SCAN_SPEED = 1; // percentage per frame
const PROGRESS_INTERVAL = 80; // milliseconds
const PROGRESS_INCREMENT = 1; // percentage per update
const MAX_PROGRESS = 100; // maximum progress percentage
const MIN_PROGRESS = 0; // minimum progress percentage

// Detection constants
const DETECTION_POINTS_COUNT = 5; // number of detection points to generate
const DETECTION_THRESHOLD = 30; // progress percentage to start detection
const DETECTION_INTERVAL = 15; // progress percentage between detections
const MIN_CONFIDENCE = 75; // minimum confidence percentage
const MAX_CONFIDENCE = 100; // maximum confidence percentage

// Detection point positioning
const MIN_POSITION = 20; // minimum position percentage
const MAX_POSITION_RANGE = 60; // position range percentage

// Phase timing constants
const PHASE_DELAYS = {
  detecting: 1000, // milliseconds
  analyzing: 3000, // milliseconds
  processing: 5000, // milliseconds
};

// UI constants
const ANIMATION_DELAY_BASE = 200; // milliseconds
const BOUNCE_DOTS_COUNT = 3; // number of bouncing dots

export const AIImageScanner = ({ isScanning }) => {
  const [scanPosition, setScanPosition] = useState(MIN_PROGRESS);
  const [scanDirection, setScanDirection] = useState("down");
  const [analysisProgress, setAnalysisProgress] = useState(MIN_PROGRESS);
  const [currentPhase, setCurrentPhase] = useState("scanning");
  const [detectionPoints, setDetectionPoints] = useState([]);

  useEffect(() => {
    if (isScanning) {
      // Generate detection points
      const points = Array.from({ length: DETECTION_POINTS_COUNT }, (_, i) => ({
        id: i,
        x: MIN_POSITION + Math.random() * MAX_POSITION_RANGE,
        y: MIN_POSITION + Math.random() * MAX_POSITION_RANGE,
        detected: false,
        confidence: Math.floor(
          MIN_CONFIDENCE + Math.random() * (MAX_CONFIDENCE - MIN_CONFIDENCE)
        ),
      }));
      setDetectionPoints(points);

      // Analysis phases
      setTimeout(() => setCurrentPhase("detecting"), PHASE_DELAYS.detecting);
      setTimeout(() => setCurrentPhase("analyzing"), PHASE_DELAYS.analyzing);
      setTimeout(() => setCurrentPhase("processing"), PHASE_DELAYS.processing);
    }
  }, [isScanning]);

  useEffect(() => {
    let animationFrame;
    let progressTimer;

    if (isScanning) {
      // Scan line animation
      const animate = () => {
        setScanPosition((prev) => {
          if (prev >= MAX_PROGRESS && scanDirection === "down") {
            setScanDirection("up");
            return MAX_PROGRESS;
          } else if (prev <= MIN_PROGRESS && scanDirection === "up") {
            setScanDirection("down");
            return MIN_PROGRESS;
          }
          return scanDirection === "down"
            ? prev + SCAN_SPEED
            : prev - SCAN_SPEED;
        });
        animationFrame = requestAnimationFrame(animate);
      };

      // Progress animation
      const updateProgress = () => {
        setAnalysisProgress((prev) => {
          if (prev >= MAX_PROGRESS) return MAX_PROGRESS;
          return prev + PROGRESS_INCREMENT;
        });

        // Activate detection points as progress increases
        if (analysisProgress > DETECTION_THRESHOLD) {
          setDetectionPoints((prev) =>
            prev.map((point, index) => ({
              ...point,
              detected:
                analysisProgress >
                DETECTION_THRESHOLD + index * DETECTION_INTERVAL,
            }))
          );
        }
      };

      animationFrame = requestAnimationFrame(animate);
      progressTimer = setInterval(updateProgress, PROGRESS_INTERVAL);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isScanning, scanDirection, analysisProgress]);

  if (!isScanning) return null;

  const getPhaseText = () => {
    switch (currentPhase) {
      case "scanning":
        return "SCANNING IMAGE";
      case "detecting":
        return "DETECTING OBJECTS";
      case "analyzing":
        return "ANALYZING NUTRITION";
      case "processing":
        return "PROCESSING RESULTS";
      default:
        return "SCANNING IMAGE";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm">
        {/* Corner frames */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#FF6B00] rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#FF6B00] rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#FF6B00] rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#FF6B00] rounded-br-lg"></div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 107, 0, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 107, 0, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      </div>

      {/* Scan line */}
      <div
        className="absolute left-0 w-full z-30 transition-all duration-75"
        style={{
          top: `${scanPosition}%`,
          transform: "translateY(-50%)",
        }}
      >
        <div className="relative h-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>
          <div className="absolute top-0 left-1/2 w-16 h-px bg-white transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-1/2 left-0 w-full h-6 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent blur-sm"></div>
      </div>

      {/* Detection points */}
      {detectionPoints.map((point) => (
        <div
          key={point.id}
          className={`absolute z-25 transition-all duration-500 ${point.detected ? "opacity-100" : "opacity-0"}`}
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            {/* Detection crosshair */}
            <div className="w-6 h-6 border-2 border-[#FF6B00] rounded-full relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-[#FF6B00] transform -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-px h-full bg-[#FF6B00] transform -translate-x-1/2"></div>

              {point.detected && (
                <div className="absolute inset-1 bg-green-400 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:check" className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {/* Confidence label */}
            {point.detected && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs">
                <span className="text-[#FF6B00] font-mono">
                  {point.confidence}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Status panel */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-[#FF6B00]/50 shadow-xl">
          <div className="flex items-center space-x-4">
            {/* AI icon */}
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <Icon icon="mdi:brain" className="w-5 h-5 text-white" />
            </div>

            {/* Status text */}
            <div className="flex items-center space-x-3">
              <span className="text-[#FF6B00] font-semibold text-sm tracking-wide">
                {getPhaseText()}
              </span>

              <div className="flex space-x-1">
                {Array.from({ length: BOUNCE_DOTS_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-[#FF6B00] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * ANIMATION_DELAY_BASE}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B00] rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <span className="text-[#FF6B00] text-xs font-mono w-8">
                {analysisProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple detection counter */}
      <div className="absolute top-6 right-6 z-30">
        <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#FF6B00]/50">
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:target" className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-white text-sm font-mono">
              {detectionPoints.filter((p) => p.detected).length}/
              {detectionPoints.length}
            </span>
          </div>
          <div className="text-[#FF6B00] text-xs text-center mt-1">
            DETECTED
          </div>
        </div>
      </div>
    </div>
  );
};
