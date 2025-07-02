"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled,
  isLastStep,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mt-8 pt-6 border-t border-[#333]"
  >
    {/* Mobile-First Layout */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Next/Submit button - Primary action first on mobile */}
      <motion.div
        className="order-1 sm:order-2 w-full sm:w-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="orangeFilled"
          onClick={onNext}
          disabled={false}
          className="w-full sm:w-auto py-3 px-6 text-base font-semibold shadow-lg shadow-[#FF6B00]/25 disabled:shadow-none"
        >
          {isLastStep ? (
            <>
              <Icon icon="mdi:rocket-launch" className="w-5 h-5 mr-2" />
              Create Training Plan
            </>
          ) : (
            <>
              Continue to{" "}
              {currentStep === 0
                ? "Schedule"
                : currentStep === 1
                ? "Features"
                : "Preview"}
              <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Mobile progress helper */}
        <div className="mt-2 text-center text-sm text-gray-400 sm:hidden">
          {isLastStep
            ? "Ready to create your plan!"
            : `Next: Step ${currentStep + 2} of ${totalSteps}`}
        </div>
      </motion.div>

      {/* Back button - Secondary action */}
      <motion.div
        className="order-2 sm:order-1 w-full sm:w-auto"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto py-3 px-6 text-base font-medium border-[#444] hover:border-[#555] hover:bg-[#222]"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
          {currentStep === 0 ? "Back to Plans" : "Previous Step"}
        </Button>
      </motion.div>
    </div>

    {/* Desktop Progress Indicator */}
    <div className="hidden sm:flex items-center justify-center mt-6 gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index <= currentStep ? "w-8 bg-[#FF6B00]" : "w-6 bg-[#333]"
          }`}
        />
      ))}
    </div>

    {/* Helpful hints */}
    <div className="mt-4 text-center">
      <div className="text-xs text-gray-500 max-w-md mx-auto">
        {currentStep === 0 && "Add basic information about your training plan"}
        {currentStep === 1 &&
          "Create sessions and add exercises to build your plan"}
        {currentStep === 2 && "Set special features and target audience"}
        {currentStep === 3 && "Review everything before creating your plan"}
      </div>
    </div>
  </motion.div>
);
