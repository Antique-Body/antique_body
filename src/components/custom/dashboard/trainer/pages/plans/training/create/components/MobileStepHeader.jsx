"use client";

import { Icon } from "@iconify/react";

export const MobileStepHeader = ({ currentStep, steps, onBack }) => {
  const currentStepData = steps[currentStep];

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
          aria-label="Go back"
        >
          <Icon icon="mdi:chevron-left" className="w-6 h-6" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FF6B00]/20">
              <Icon
                icon={currentStepData.icon}
                className="w-5 h-5 text-[#FF6B00]"
              />
            </div>
            <h2 className="text-xl font-bold text-white truncate">
              {currentStepData.label}
            </h2>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-[#333] rounded-full overflow-hidden mb-2">
            <div
              className="absolute inset-0 bg-[#FF6B00] rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step counter and navigation dots */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </div>

            {/* Mini step dots */}
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? "bg-[#FF6B00]" : "bg-[#333]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
