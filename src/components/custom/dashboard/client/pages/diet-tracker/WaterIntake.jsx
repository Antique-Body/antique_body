"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const WaterIntake = ({
  dailyWaterIntake,
  onWaterAdd,
  isLoading,
  onFetchWaterIntake,
  onGetWaterStats,
  onResetWaterIntake,
}) => {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localWaterIntake, setLocalWaterIntake] = useState(
    dailyWaterIntake || 0
  );
  const [waterHistory, setWaterHistory] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const DAILY_GOAL = 4000; // 4000ml hardcoded goal

  // Update local water intake when prop changes
  useEffect(() => {
    setLocalWaterIntake(dailyWaterIntake || 0);
  }, [dailyWaterIntake]);

  useEffect(() => {
    const percentage = Math.min((localWaterIntake / DAILY_GOAL) * 100, 100);
    setWaterLevel(percentage);
  }, [localWaterIntake]);

  const handleAddWater = async (amount) => {
    if (isLoading || isAnimating) return;

    console.log("💧 [WATER UI] Adding water:", amount, "ml");
    setIsAnimating(true);

    try {
      // Update local state immediately for better UX
      const newTotal = localWaterIntake + amount;
      setLocalWaterIntake(newTotal);

      // Add to history
      const waterEntry = {
        id: Date.now(),
        amount,
        timestamp: new Date().toISOString(),
        total: newTotal,
      };
      setWaterHistory((prev) => [waterEntry, ...prev.slice(0, 9)]); // Keep last 10 entries

      console.log(
        "💧 [WATER UI] Local water intake updated to:",
        newTotal,
        "ml"
      );

      // Call the parent function if provided
      if (onWaterAdd) {
        await onWaterAdd(amount);
      }

      console.log("💧 [WATER UI] Water added successfully");
    } catch (error) {
      console.error("💧 [WATER UI] Failed to add water:", error);
      // Revert local state on error
      setLocalWaterIntake((prev) => prev - amount);
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleResetWater = () => {
    console.log("💧 [WATER UI] Resetting water intake");
    setLocalWaterIntake(0);
    setWaterHistory([]);
    setShowResetConfirm(false);

    // Call the parent reset function if provided
    if (onResetWaterIntake) {
      onResetWaterIntake();
    }
  };

  const handleRefreshWater = async () => {
    console.log("💧 [WATER UI] Refreshing water data");
    if (onFetchWaterIntake) {
      try {
        await onFetchWaterIntake();
      } catch (error) {
        console.error("💧 [WATER UI] Error refreshing water data:", error);
      }
    }
  };

  const handleGetWaterStats = () => {
    console.log("💧 [WATER UI] Getting water stats");
    if (onGetWaterStats) {
      const stats = onGetWaterStats();
      console.log("💧 [WATER UI] Water stats:", stats);
      // You could show these stats in a modal or toast
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
    const percentage = (localWaterIntake / DAILY_GOAL) * 100;

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

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:water" className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Water Intake</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefreshWater}
            className="text-xs text-zinc-400 hover:text-blue-400 transition-colors"
            title="Refresh water data"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
          </button>

          {/* Stats Button */}
          <button
            onClick={handleGetWaterStats}
            className="text-xs text-zinc-400 hover:text-green-400 transition-colors"
            title="View water stats"
          >
            <Icon icon="mdi:chart-line" className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
            title="Reset water intake"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </button>
        </div>
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
          {localWaterIntake}ml
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
          {Math.round((localWaterIntake / DAILY_GOAL) * 100)}% complete
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
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { amount: 250, icon: "mdi:cup-water", label: "Cup" },
          { amount: 500, icon: "mdi:cup-water", label: "Bottle" },
          { amount: 750, icon: "mdi:cup-water", label: "Large" },
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

      {/* Water History */}
      {waterHistory.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">
            Today's Intake
          </h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {waterHistory.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between text-xs bg-zinc-700/30 rounded px-2 py-1"
              >
                <span className="text-blue-400">+{entry.amount}ml</span>
                <span className="text-zinc-400">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Reset Water Intake?
            </h3>
            <p className="text-zinc-300 text-sm mb-6">
              This will reset your daily water intake to 0ml. This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetWater}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
