"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";

export const PortionAdjustModal = ({
  isOpen,
  onClose,
  onSave,
  mealData,
  currentPortion = 1,
}) => {
  const [portionMultiplier, setPortionMultiplier] = useState(currentPortion);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPortionMultiplier(currentPortion);
    }
  }, [isOpen, currentPortion]);

  const handleSave = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSave(portionMultiplier);
      onClose();
    } catch (error) {
      console.error("Error updating portion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPortionMultiplier(currentPortion);
    onClose();
  };

  const portionPresets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const calculateNutrition = (base, multiplier) => {
    return Math.round((base || 0) * multiplier);
  };

  const baseMeal = mealData?.selectedOption || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Icon icon="mdi:scale" className="w-5 h-5 text-[#FF6B00]" />
          <span>Adjust Portion Size</span>
        </div>
      }
      size="medium"
      primaryButtonText={isSubmitting ? "Updating..." : "Update Portion"}
      primaryButtonAction={handleSave}
      primaryButtonDisabled={isSubmitting}
      secondaryButtonText="Cancel"
      secondaryButtonAction={handleClose}
    >
      <div className="space-y-6">
        {/* Current Meal Info */}
        <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {mealData?.mealName || "Meal"}
          </h3>
          <p className="text-zinc-400 text-sm">
            {baseMeal.name || "Adjust the portion size for this meal"}
          </p>
        </div>

        {/* Portion Size Selector */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-300">Select Portion Size</h4>
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {portionPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setPortionMultiplier(preset)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                  portionMultiplier === preset
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                <span className="text-lg font-semibold">{preset}x</span>
                <span className="text-xs">
                  {preset < 1 ? "Small" : preset === 1 ? "Normal" : preset <= 1.5 ? "Large" : "Extra"}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Custom Portion Size
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={portionMultiplier}
                onChange={(e) => setPortionMultiplier(parseFloat(e.target.value) || 1)}
                className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/50 transition-colors"
                placeholder="Enter multiplier..."
              />
              <span className="text-sm text-zinc-400">x normal portion</span>
            </div>
          </div>

          {/* Portion Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>0.25x</span>
              <span>Current: {portionMultiplier}x</span>
              <span>2x</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={portionMultiplier}
              onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Nutrition Preview */}
        <div className="bg-gradient-to-r from-zinc-800/60 to-zinc-700/40 rounded-lg border border-zinc-700/50 p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Icon icon="mdi:nutrition" className="w-4 h-4" />
            Nutrition with {portionMultiplier}x portion
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Calories:</span>
                <span className="text-white font-medium">
                  {calculateNutrition(baseMeal.calories, portionMultiplier)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Protein:</span>
                <span className="text-white font-medium">
                  {calculateNutrition(baseMeal.protein, portionMultiplier)}g
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Carbs:</span>
                <span className="text-white font-medium">
                  {calculateNutrition(baseMeal.carbs, portionMultiplier)}g
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Fat:</span>
                <span className="text-white font-medium">
                  {calculateNutrition(baseMeal.fat, portionMultiplier)}g
                </span>
              </div>
            </div>
          </div>

          {/* Comparison with Original */}
          {portionMultiplier !== 1 && (
            <div className="mt-3 pt-3 border-t border-zinc-700/50">
              <div className="text-xs text-zinc-400 text-center">
                {portionMultiplier > 1 ? (
                  <span className="text-blue-400">
                    <Icon icon="mdi:trending-up" className="w-3 h-3 inline mr-1" />
                    {Math.round((portionMultiplier - 1) * 100)}% more than normal portion
                  </span>
                ) : (
                  <span className="text-yellow-400">
                    <Icon icon="mdi:trending-down" className="w-3 h-3 inline mr-1" />
                    {Math.round((1 - portionMultiplier) * 100)}% less than normal portion
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Portion Guidelines */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon icon="mdi:information" className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-300">Portion Guidelines</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• 0.5x = Half portion (lighter meal or snack)</li>
                <li>• 1x = Standard recommended portion</li>
                <li>• 1.5x = Large portion (post-workout or higher calorie needs)</li>
                <li>• 2x = Extra large portion (bulk or high activity days)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B00;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B00;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Modal>
  );
};