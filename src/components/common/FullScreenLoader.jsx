"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BrandLogo } from "./BrandLogo";

export function FullScreenLoader({ text, isVisible = true }) {
  const { t } = useTranslation();
  const defaultText = t("role.preparing.journey");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when loader is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary gradient orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1/2 -left-1/2 w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255, 107, 0, 0.15) 0%, rgba(255, 154, 0, 0.08) 40%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />

            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute -bottom-1/2 -right-1/2 w-[140vw] h-[140vw] max-w-[1000px] max-h-[1000px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255, 154, 0, 0.12) 0%, rgba(255, 107, 0, 0.06) 40%, transparent 70%)",
                filter: "blur(100px)",
              }}
            />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.sin(i) * 20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 bg-[#FF7800] rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  boxShadow: "0 0 6px rgba(255, 120, 0, 0.6)",
                }}
              />
            ))}

            {/* Greek pattern overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0,50 L25,25 L50,50 L75,25 L100,50 L75,75 L50,50 L25,75 Z' stroke='%23FF7800' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "100px 100px",
                backgroundRepeat: "repeat",
              }}
            />
          </div>

          {/* Main content container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-center max-w-sm mx-auto px-6"
          >
            {/* Brand Logo with enhanced styling */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 relative"
            >
              <div className="relative">
                <BrandLogo
                  logoTitle="ANTIQUE BODY"
                  logoTagline="STRENGTH OF THE ANCIENTS"
                  className="spartacus-font"
                  titleStyle={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textShadow: "0 0 20px rgba(255, 120, 0, 0.5)",
                    marginBottom: "8px",
                  }}
                  containerStyle={{
                    marginBottom: "0",
                  }}
                />

                {/* Glowing underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-[#FF7800] to-transparent mx-auto mt-2"
                  style={{ width: "120px" }}
                />
              </div>
            </motion.div>

            {/* Premium Loading Spinner */}
            <div className="relative mb-12 flex justify-center">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent"
                style={{
                  background:
                    "linear-gradient(45deg, #FF7800, #FF9A00, #FF7800)",
                  mask: "radial-gradient(circle at center, transparent 70%, black 72%)",
                  WebkitMask:
                    "radial-gradient(circle at center, transparent 70%, black 72%)",
                }}
              />

              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 w-20 h-20 rounded-full border border-[#FF7800]/30"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, #FF7800, transparent)",
                  mask: "radial-gradient(circle at center, transparent 75%, black 77%)",
                  WebkitMask:
                    "radial-gradient(circle at center, transparent 75%, black 77%)",
                }}
              />

              {/* Center icon */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-[#FF7800] w-8 h-8 drop-shadow-lg"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255, 120, 0, 0.8))",
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading text with enhanced typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-4"
            >
              {text || defaultText ? (
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-wide text-white leading-tight">
                    {(text || defaultText).split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="font-black bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
                      {(text || defaultText).split(" ").slice(-1)}
                    </span>
                  </h2>

                  <p className="text-sm text-gray-400 font-medium tracking-wider uppercase">
                    Forging Ancient Strength
                  </p>
                </div>
              ) : (
                <h2 className="text-2xl font-bold tracking-wide text-white">
                  <span className="font-black bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
                    Loading...
                  </span>
                </h2>
              )}

              {/* Animated progress dots */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                    className="w-2 h-2 rounded-full bg-[#FF7800]"
                    style={{
                      boxShadow: "0 0 8px rgba(255, 120, 0, 0.6)",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-center space-x-4 text-[#FF7800]/30">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#FF7800]/30" />
                <Icon icon="mdi:shield-star" className="w-4 h-4" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#FF7800]/30" />
              </div>
            </motion.div>
          </motion.div>

          {/* Vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
