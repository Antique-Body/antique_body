"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const WorkInProgress = ({
  title,
  subtitle,
  description,
  className = "",
  showAnimation = true,
  variant = "default",
}) => {
  // Default texts with fallbacks
  const defaultTitle = title || "Work in Progress";
  const defaultSubtitle = subtitle || "We're building something amazing";
  const defaultDescription =
    description ||
    "This feature is currently under development. Our team is working hard to bring you the best experience possible.";

  // Simple animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Miner animations
  const pickaxeAnimation = {
    idle: { rotate: -20, y: 0 },
    digging: {
      rotate: [-20, 20, -20],
      y: [0, 8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const minerBodyAnimation = {
    idle: { y: 0 },
    working: {
      y: [0, 2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl flex items-center justify-center">
            <Icon
              icon="mdi:hammer-wrench"
              width={24}
              height={24}
              className="text-white"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {defaultTitle}
          </h3>
          <p className="text-gray-400 text-sm">{defaultSubtitle}</p>
        </motion.div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-gray-400"
        >
          <motion.div
            animate={showAnimation ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Icon
              icon="mdi:cog"
              width={20}
              height={20}
              className="text-[#FF6B00]"
            />
          </motion.div>
          <span className="text-sm font-medium">{defaultTitle}</span>
        </motion.div>
      </div>
    );
  }

  // Default full variant - mining theme
  return (
    <div
      className={`w-full min-h-[70vh] px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          {/* Main Content Container */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Mining Scene */}
            <div className="order-2 lg:order-1">
              <div className="relative max-w-lg mx-auto lg:mx-0">
                {/* Main Mining Scene Container */}
                <div className="relative bg-gradient-to-b from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-3xl p-8 lg:p-12 shadow-2xl border border-[#333] overflow-hidden">
                  {/* Underground layers effect */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#8B4513] via-[#A0522D] to-transparent opacity-30"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#654321] to-transparent opacity-40"></div>

                  {/* Mining tunnel entrance */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-t from-black via-[#1a1a1a] to-[#2a2a2a] rounded-t-3xl border-2 border-[#444] shadow-inner">
                    <div className="absolute inset-2 bg-gradient-to-t from-black to-[#1a1a1a] rounded-t-2xl"></div>
                  </div>

                  {/* Miner Character */}
                  <div className="relative z-20 flex justify-center items-end h-48">
                    <motion.div
                      animate={showAnimation ? "working" : "idle"}
                      variants={minerBodyAnimation}
                      className="relative"
                    >
                      {/* Miner Body */}
                      <div className="w-16 h-20 bg-gradient-to-b from-[#4A5568] to-[#2D3748] rounded-xl relative border border-[#555] shadow-lg">
                        {/* Head */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-[#F7E6D3] to-[#E2D5C7] rounded-full border-2 border-[#D4C4B0] shadow-md"></div>

                        {/* Mining Helmet */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF5722] rounded-t-full border-2 border-[#FF5722] shadow-lg">
                          {/* Helmet Light */}
                          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#FFEB3B] rounded-full shadow-lg">
                            <div className="w-full h-full bg-gradient-to-r from-[#FFEB3B] to-[#FFF176] rounded-full animate-pulse"></div>
                            {/* Light beam */}
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-[#FFEB3B]/60 to-transparent"></div>
                          </div>
                        </div>

                        {/* Arms */}
                        <div className="absolute -left-3 top-4 w-5 h-12 bg-gradient-to-b from-[#F7E6D3] to-[#E2D5C7] rounded-full border border-[#D4C4B0] shadow-md"></div>
                        <div className="absolute -right-3 top-4 w-5 h-12 bg-gradient-to-b from-[#F7E6D3] to-[#E2D5C7] rounded-full border border-[#D4C4B0] shadow-md"></div>

                        {/* Work vest details */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#FF6B00] rounded-full"></div>
                        <div className="absolute top-6 left-2 w-1 h-4 bg-[#666] rounded"></div>
                        <div className="absolute top-6 right-2 w-1 h-4 bg-[#666] rounded"></div>
                      </div>

                      {/* Pickaxe */}
                      <motion.div
                        animate={showAnimation ? "digging" : "idle"}
                        variants={pickaxeAnimation}
                        className="absolute -right-8 top-8 origin-bottom-left"
                      >
                        {/* Pickaxe handle */}
                        <div className="w-1 h-12 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-full"></div>
                        {/* Pickaxe head */}
                        <div className="absolute -top-1 -left-2 w-6 h-3 bg-gradient-to-r from-[#666] to-[#888] rounded-sm shadow-md">
                          <div className="absolute left-0 top-1 w-2 h-1 bg-[#999] rounded-sm"></div>
                        </div>
                      </motion.div>

                      {/* Legs */}
                      <div className="absolute -bottom-2 left-2 w-3 h-8 bg-gradient-to-b from-[#2D3748] to-[#1A202C] rounded-b-lg"></div>
                      <div className="absolute -bottom-2 right-2 w-3 h-8 bg-gradient-to-b from-[#2D3748] to-[#1A202C] rounded-b-lg"></div>

                      {/* Boots */}
                      <div className="absolute -bottom-4 left-1 w-4 h-3 bg-[#1A202C] rounded-lg border border-[#333]"></div>
                      <div className="absolute -bottom-4 right-1 w-4 h-3 bg-[#1A202C] rounded-lg border border-[#333]"></div>
                    </motion.div>
                  </div>

                  {/* Mining dust particles */}
                  {showAnimation && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, -40],
                            x: [0, Math.random() * 20 - 10],
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut",
                          }}
                          className="absolute bottom-16 left-1/2 w-2 h-2 bg-[#D2B48C] rounded-full"
                          style={{
                            left: `${45 + Math.random() * 10}%`,
                          }}
                        />
                      ))}
                    </>
                  )}

                  {/* Mining equipment scattered around */}
                  <div className="absolute bottom-6 left-6 w-8 h-6 bg-gradient-to-b from-[#666] to-[#444] rounded-lg border border-[#555] shadow-md">
                    <div className="w-full h-2 bg-[#FF6B00] rounded-t-lg"></div>
                  </div>

                  <div className="absolute bottom-8 right-8 w-6 h-6 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-full border border-[#555] shadow-md"></div>

                  {/* Rock pile */}
                  <div className="absolute bottom-4 right-6 space-x-1 flex">
                    <div className="w-3 h-3 bg-[#696969] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#808080] rounded-full"></div>
                    <div className="w-4 h-4 bg-[#555] rounded-full"></div>
                  </div>

                  {/* Support beams */}
                  <div className="absolute top-4 left-4 w-2 h-20 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-full shadow-md"></div>
                  <div className="absolute top-4 right-4 w-2 h-20 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-full shadow-md"></div>
                  <div className="absolute top-4 left-4 w-20 h-2 bg-gradient-to-r from-[#8B4513] to-[#654321] rounded-full shadow-md"></div>

                  {/* Mining cart */}
                  <div className="absolute bottom-6 left-16 w-12 h-8 bg-gradient-to-b from-[#444] to-[#222] rounded-lg border border-[#555] shadow-lg">
                    <div className="absolute -bottom-2 left-1 w-3 h-3 bg-[#333] rounded-full border border-[#555]"></div>
                    <div className="absolute -bottom-2 right-1 w-3 h-3 bg-[#333] rounded-full border border-[#555]"></div>
                    <div className="absolute top-1 left-1 right-1 bottom-2 bg-gradient-to-b from-[#8B4513] to-[#654321] rounded"></div>
                  </div>

                  {/* Ambient lighting effects */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#FF6B00]/5 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Floating tools around the scene */}
                <motion.div
                  animate={showAnimation ? { rotate: 360, y: [-5, 5, -5] } : {}}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl flex items-center justify-center shadow-lg border border-[#FF5722]"
                >
                  <Icon
                    icon="mdi:cog"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </motion.div>

                <motion.div
                  animate={showAnimation ? { rotate: -360, y: [5, -5, 5] } : {}}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-6 w-10 h-10 bg-gradient-to-br from-[#666] to-[#444] rounded-xl flex items-center justify-center shadow-lg border border-[#555]"
                >
                  <Icon
                    icon="mdi:wrench"
                    width={18}
                    height={18}
                    className="text-[#FF6B00]"
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full text-[#FF6B00] font-medium mb-6">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={
                        showAnimation
                          ? {
                              scale: [1, 1.2, 1],
                              opacity: [0.4, 1, 0.4],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-[#FF6B00] rounded-full"
                    />
                  ))}
                </div>
                <span>In Development</span>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {defaultTitle}
                </h1>

                <p className="text-[#FF6B00] font-semibold text-lg sm:text-xl lg:text-2xl">
                  {defaultSubtitle}
                </p>

                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                  {defaultDescription}
                </p>
              </div>

              {/* Features Coming Soon */}
              <div className="mt-8 space-y-3">
                <h3 className="text-white font-semibold text-lg mb-4">
                  What's Coming:
                </h3>
                <div className="space-y-2 text-left">
                  {[
                    "Advanced Analytics Dashboard",
                    "Real-time Progress Tracking",
                    "Interactive Data Visualization",
                    "Personalized Recommendations",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                      <span className="text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full text-[#FF6B00] font-medium">
                  <Icon icon="mdi:clock-outline" width={16} height={16} />
                  <span>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
