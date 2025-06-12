"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { BrandLogo } from "./BrandLogo";

export function FullScreenLoader({ text }) {
  const { t } = useTranslation();
  const defaultText = t("role.preparing.journey");

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 overflow-hidden">
      {/* Minimal, performant background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FF7800]/10 blur-[80px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF9A00]/10 blur-[80px] animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main content with subtle animations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-sm mx-auto"
      >
        {/* Brand Logo */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <BrandLogo
            logoTitle="ANTIQUE BODY"
            logoTagline="STRENGTH OF THE ANCIENTS"
          />
        </motion.div>

        {/* Modern spinner */}
        <div className="relative mb-10 flex justify-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-t-2 border-l-2 border-[#FF7800]"
          ></motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <Icon icon="mdi:dumbbell" className="text-[#FF7800] w-16 h-16" />
          </div>
        </div>

        {/* Loading text with subtle animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {text || defaultText ? (
            <p className="text-xl font-medium tracking-wide text-white">
              {(text || defaultText).split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-bold bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
                {(text || defaultText).split(" ").slice(-1)}
              </span>
            </p>
          ) : (
            <p className="text-xl font-medium tracking-wide text-white">
              <span className="font-bold bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
                Loading...
              </span>
            </p>
          )}

          {/* Animated dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-[#FF7800]"
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
