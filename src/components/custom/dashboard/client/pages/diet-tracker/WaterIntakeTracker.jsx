"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export const WaterIntakeTracker = ({
  currentIntake = 0,
  dailyGoal = 2.5,
  date,
  onUpdateWater,
}) => {
  const [localIntake, setLocalIntake] = useState(currentIntake);
  const [isUpdating, setIsUpdating] = useState(false);
  const [animateAdd, setAnimateAdd] = useState(false);

  useEffect(() => {
    setLocalIntake(currentIntake);
  }, [currentIntake]);

  const handleWaterUpdate = async (newAmount) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      setLocalIntake(newAmount);

      // Trigger animation
      setAnimateAdd(true);
      setTimeout(() => setAnimateAdd(false), 600);

      if (onUpdateWater) {
        await onUpdateWater(date, newAmount);
      }
    } catch (error) {
      console.error("Error updating water intake:", error);
      // Revert on error
      setLocalIntake(currentIntake);
    } finally {
      setIsUpdating(false);
    }
  };

  const addWater = (amount) => {
    const newAmount = Math.max(0, localIntake + amount);
    handleWaterUpdate(newAmount);
  };

  const setWater = (amount) => {
    const newAmount = Math.max(0, amount);
    handleWaterUpdate(newAmount);
  };

  const percentage = Math.min((localIntake / dailyGoal) * 100, 100);
  const isGoalMet = localIntake >= dailyGoal;
  const isOverGoal = localIntake > dailyGoal;

  // Water glass representations (8 glasses = 2L, so scale accordingly)
  const totalGlasses = 8;
  const filledGlasses = Math.floor((localIntake / dailyGoal) * totalGlasses);

  // Quick add amounts in liters
  const quickAddAmounts = [
    { amount: 0.25, label: "Glass", icon: "mdi:cup-water" },
    { amount: 0.5, label: "Bottle", icon: "mdi:beaker" },
    { amount: 1.0, label: "Liter", icon: "mdi:water" },
  ];

  return (
    <div
      className={`relative bg-gradient-to-br from-blue-900/20 to-cyan-800/10 border border-blue-700/30 rounded-2xl p-6 space-y-6 overflow-hidden ${
        animateAdd ? "animate-pulse" : ""
      }`}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 animate-pulse" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isGoalMet
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : isOverGoal
                    ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                    : "bg-gradient-to-br from-blue-600 to-blue-700"
              }`}
            >
              <Icon icon="mdi:water" className="w-6 h-6 text-white" />
            </div>
            {isGoalMet && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Icon icon="mdi:check" className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Fluid Intake</h3>
            <p className="text-sm text-zinc-400 font-medium">
              {localIntake.toFixed(1)}L of {dailyGoal}L daily
            </p>
          </div>
        </div>

        {isGoalMet && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium animate-pulse">
            <Icon icon="mdi:trophy" className="w-4 h-4" />
            Goal reached!
          </div>
        )}
      </div>

      {/* Visual Water Glasses */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-zinc-300">Progress</span>
          <span className="text-sm font-bold text-blue-400">
            {percentage.toFixed(0)}%
          </span>
        </div>

        {/* Water glasses visualization */}
        <div className="flex gap-1 justify-center">
          {Array.from({ length: totalGlasses }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-6 h-8 border-2 rounded-b-lg transition-all duration-300 ${
                  i < filledGlasses
                    ? "bg-blue-400 border-blue-400"
                    : "border-zinc-600 bg-transparent"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${
              isGoalMet
                ? "bg-gradient-to-r from-green-500 via-green-400 to-emerald-500"
                : "bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
          {/* Shimmer effect */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 animate-pulse"
            style={{ width: `${Math.min(percentage + 20, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-zinc-300">Quick Add</h4>
        <div className="grid grid-cols-3 gap-3">
          {quickAddAmounts.map((item) => (
            <button
              key={item.amount}
              onClick={() => addWater(item.amount)}
              disabled={isUpdating}
              className="group flex flex-col items-center gap-2 py-4 px-3 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 hover:from-blue-600/30 hover:to-cyan-600/20 border border-blue-500/30 hover:border-blue-400/40 rounded-xl text-blue-300 hover:text-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <Icon
                icon={item.icon}
                className="w-6 h-6 group-hover:animate-bounce"
              />
              <div className="text-center">
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-xs text-zinc-400">+{item.amount}L</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-300">
          Manual Entry
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={localIntake}
              onChange={(e) => setWater(parseFloat(e.target.value) || 0)}
              disabled={isUpdating}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 font-medium"
              placeholder="Liters..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
              L
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addWater(-0.25)}
              disabled={isUpdating || localIntake <= 0}
              className="w-12 h-12 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/40 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
            >
              <Icon icon="mdi:minus" className="w-5 h-5" />
            </button>
            <button
              onClick={() => addWater(0.25)}
              disabled={isUpdating}
              className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/40 rounded-xl text-blue-300 hover:text-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hydration Messages */}
      {!isGoalMet && localIntake < dailyGoal * 0.3 && (
        <div className="flex items-start gap-3 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl">
          <Icon
            icon="mdi:alert"
            className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-amber-200">
            <strong className="text-amber-300">Hydration:</strong> Start your
            day with a glass of water! Your body loses water during sleep.
          </div>
        </div>
      )}

      {!isGoalMet &&
        localIntake >= dailyGoal * 0.3 &&
        localIntake < dailyGoal * 0.7 && (
          <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
            <Icon
              icon="mdi:information"
              className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-blue-200">
              <strong className="text-blue-300">Tip:</strong> Great progress!
              Keep up with regular fluid intake throughout the day.
            </div>
          </div>
        )}

      {isGoalMet && !isOverGoal && (
        <div className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-700/30 rounded-xl">
          <Icon
            icon="mdi:check-circle"
            className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-green-200">
            <strong className="text-green-300">Great job!</strong> You've
            reached your daily hydration goal! Keep up the good habits.
          </div>
        </div>
      )}

      {isOverGoal && (
        <div className="flex items-start gap-3 p-4 bg-cyan-900/20 border border-cyan-700/30 rounded-xl">
          <Icon
            icon="mdi:star"
            className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-cyan-200">
            <strong className="text-cyan-300">Fantastic!</strong> You've
            exceeded your daily goal! Excellent choice for your health.
          </div>
        </div>
      )}
    </div>
  );
};
