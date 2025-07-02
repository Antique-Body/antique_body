"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const MobileStepHeader = ({ currentStep, steps, onBack }) => {
  const currentStepData = steps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#1a1a1a]/90 to-[#222]/90 backdrop-blur-md border border-[#333] rounded-2xl p-4 shadow-xl"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#333] text-white hover:bg-[#444] transition-colors shadow-md"
        >
          <Icon icon="mdi:chevron-left" className="w-6 h-6" />
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#FF6B00]/20">
              <Icon
                icon={currentStepData.icon}
                className="w-5 h-5 text-[#FF6B00]"
              />
            </div>
            <h2 className="text-xl font-bold text-white truncate">
              {currentStepData.label}
            </h2>
          </div>

          {/* Enhanced Progress bar */}
          <div className="relative h-2 bg-[#333] rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ width: '30%' }}
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
                    index <= currentStep
                      ? 'bg-[#FF6B00]'
                      : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};