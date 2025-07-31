"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const WaterIntake = ({ dailyWaterIntake, onWaterAdd, isLoading }) => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const DAILY_GOAL = 4000; // 4000ml hardcoded goal

  useEffect(() => {
    const percentage = Math.min((dailyWaterIntake / DAILY_GOAL) * 100, 100);
    setWaterLevel(percentage);
  }, [dailyWaterIntake]);

  const handleAddWater = async (amount) => {
    if (isLoading || isAnimating) return;

    setIsAnimating(true);
    try {
      await onWaterAdd(amount);
      // Animation will be handled by the water level change through useEffect
    } catch (error) {
      console.error("Failed to add water:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const getWaterColor = () => {
    if (waterLevel >= 100) return "from-green-400 to-green-500";
    if (waterLevel >= 75) return "from-blue-400 to-blue-500";
    if (waterLevel >= 50) return "from-cyan-400 to-blue-400";
    if (waterLevel >= 25) return "from-cyan-300 to-cyan-400";
    return "from-blue-200 to-cyan-300";
  };

  const getStatusMessage = () => {
    const percentage = (dailyWaterIntake / DAILY_GOAL) * 100;

    if (percentage >= 100) {
      return {
        icon: "mdi:check-circle",
        message: "Great job! Daily goal achieved!",
        color: "text-green-400",
      };
    } else if (percentage >= 75) {
      return {
        icon: "mdi:trending-up",
        message: "Almost there! Keep it up!",
        color: "text-blue-400",
      };
    } else if (percentage >= 50) {
      return {
        icon: "mdi:water-check",
        message: "Good progress on hydration",
        color: "text-cyan-400",
      };
    } else if (percentage >= 25) {
      return {
        icon: "mdi:water-alert",
        message: "Don't forget to drink more water",
        color: "text-yellow-400",
      };
    } else {
      return {
        icon: "mdi:water-off",
        message: "Start hydrating for the day!",
        color: "text-orange-400",
      };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="mdi:water" className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Water Intake</h3>
      </div>

      {/* Water Cup Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Cup Container */}
          <div className="relative w-24 h-32 bg-zinc-700/50 rounded-b-2xl border-2 border-zinc-600 overflow-hidden">
            {/* Water Fill */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getWaterColor()} opacity-80`}
              initial={{ height: 0 }}
              animate={{ height: `${waterLevel}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
              }}
            />

            {/* Water Surface Animation */}
            {waterLevel > 0 && (
              <motion.div
                className={`absolute left-0 right-0 h-2 bg-gradient-to-r ${getWaterColor()} opacity-60`}
                style={{ bottom: `${waterLevel}%` }}
                animate={{
                  scaleX: [1, 1.05, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Cup Handle */}
            <div className="absolute -right-3 top-8 w-6 h-8 border-2 border-zinc-600 rounded-r-lg bg-transparent" />

            {/* Measurement Lines */}
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute left-0 right-0 h-px bg-zinc-500/30"
                style={{ bottom: `${mark}%` }}
              />
            ))}
          </div>

          {/* Droplet Animation for Adding Water */}
          {isAnimating && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ y: -20, opacity: 0, scale: 0.5 }}
              animate={{ y: 40, opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            >
              <Icon icon="mdi:water-drop" className="w-6 h-6 text-blue-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-white mb-1">
          {dailyWaterIntake}ml
        </div>
        <div className="text-sm text-zinc-400 mb-2">
          of {DAILY_GOAL}ml daily goal
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
          <motion.div
            className={`bg-gradient-to-r ${getWaterColor()} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(waterLevel, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-zinc-500">
          {Math.round((dailyWaterIntake / DAILY_GOAL) * 100)}% complete
        </div>
      </div>

      {/* Status Message */}
      <div
        className={`flex items-center justify-center gap-2 text-sm ${statusMessage.color} font-medium mb-4`}
      >
        <Icon icon={statusMessage.icon} className="w-4 h-4" />
        <span>{statusMessage.message}</span>
      </div>

      {/* Add Water Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { amount: 250, icon: "mdi:cup-water", label: "Cup" },
          { amount: 500, icon: "mdi:bottle-water", label: "Bottle" },
          { amount: 750, icon: "mdi:water-bottle", label: "Large" },
        ].map(({ amount, icon, label }) => (
          <motion.button
            key={amount}
            onClick={() => handleAddWater(amount)}
            disabled={isLoading || isAnimating}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-lg border transition-all duration-200
              ${
                isLoading || isAnimating
                  ? "bg-zinc-700/30 border-zinc-600/30 text-zinc-500 cursor-not-allowed"
                  : "bg-zinc-700/50 border-zinc-600 text-white hover:bg-zinc-600/50 hover:border-zinc-500 hover:scale-105"
              }
            `}
            whileTap={!isLoading && !isAnimating ? { scale: 0.95 } : {}}
            whileHover={!isLoading && !isAnimating ? { scale: 1.02 } : {}}
          >
            <Icon icon={icon} className="w-6 h-6 text-blue-400" />
            <span className="text-xs font-medium">{amount}ml</span>
            <span className="text-xs text-zinc-400">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-zinc-700/30 rounded-lg border border-zinc-600/30">
        <div className="flex items-start gap-2">
          <Icon
            icon="mdi:lightbulb-on"
            className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0"
          />
          <div className="text-xs text-zinc-300">
            <p className="font-medium mb-1">Hydration Tips:</p>
            <ul className="space-y-1 text-zinc-400">
              <li>• Start your day with a glass of water</li>
              <li>• Drink water before, during, and after meals</li>
              <li>• Keep a water bottle nearby as a reminder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
