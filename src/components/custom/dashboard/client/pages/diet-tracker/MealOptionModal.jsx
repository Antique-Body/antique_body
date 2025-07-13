"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

export const MealOptionModal = ({
  isOpen,
  onClose,
  meal,
  currentOption,
  onSelectOption,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    try {
      await onSelectOption(selectedOption);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    onClose();
  };

  if (!meal || !meal.options) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:silverware-fork-knife"
            className="w-5 h-5 text-[#FF6B00]"
          />
          <span>Choose {meal.name} Option</span>
        </div>
      }
      size="large"
      primaryButtonText={selectedOption ? "Select Option" : "Cancel"}
      primaryButtonAction={selectedOption ? handleSelectOption : handleClose}
      primaryButtonDisabled={isSubmitting}
      secondaryButtonText={selectedOption ? "Cancel" : null}
      secondaryButtonAction={selectedOption ? handleClose : null}
    >
      <div className="space-y-4">
        <p className="text-zinc-400 text-sm">
          Choose from {meal.options.length} available options for your{" "}
          {meal.name.toLowerCase()}:
        </p>

        <div className="grid gap-4">
          {meal.options.map((option, index) => {
            const isCurrentOption =
              currentOption &&
              currentOption.name === option.name &&
              currentOption.calories === option.calories;
            const isSelected = selectedOption === option;

            return (
              <div
                key={index}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-[#FF6B00] bg-[#FF6B00]/5 ring-2 ring-[#FF6B00]/30"
                    : isCurrentOption
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {/* Current Option Badge */}
                {isCurrentOption && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                    Current
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center">
                    <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex gap-4">
                  {/* Image */}
                  {option.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={option.imageUrl}
                          alt={option.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      {option.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                      {option.description}
                    </p>

                    {/* Nutrition Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-2 bg-zinc-700/30 rounded">
                        <div className="text-[#FF6B00] font-semibold text-sm">
                          {option.calories || 0}
                        </div>
                        <div className="text-zinc-400 text-xs">cal</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-700/30 rounded">
                        <div className="text-[#FF6B00] font-semibold text-sm">
                          {option.protein || 0}g
                        </div>
                        <div className="text-zinc-400 text-xs">protein</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-700/30 rounded">
                        <div className="text-[#FF6B00] font-semibold text-sm">
                          {option.carbs || 0}g
                        </div>
                        <div className="text-zinc-400 text-xs">carbs</div>
                      </div>
                      <div className="text-center p-2 bg-zinc-700/30 rounded">
                        <div className="text-[#FF6B00] font-semibold text-sm">
                          {option.fat || 0}g
                        </div>
                        <div className="text-zinc-400 text-xs">fat</div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    {option.ingredients && option.ingredients.length > 0 && (
                      <div className="mt-3">
                        <p className="text-zinc-400 text-xs mb-1">
                          Ingredients:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {option.ingredients
                            .slice(0, 6)
                            .map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-zinc-700/50 text-zinc-300 text-xs rounded"
                              >
                                {ingredient}
                              </span>
                            ))}
                          {option.ingredients.length > 6 && (
                            <span className="px-2 py-1 bg-zinc-700/50 text-zinc-400 text-xs rounded">
                              +{option.ingredients.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection Info */}
        {selectedOption && (
          <div className="p-4 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:information" className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[#FF6B00] font-medium text-sm">
                Selected: {selectedOption.name}
              </span>
            </div>
            <p className="text-[#FF6B00]/80 text-sm">
              This will update your meal log and nutrition tracking for today.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isSubmitting && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400 text-sm">
                Updating your meal...
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
