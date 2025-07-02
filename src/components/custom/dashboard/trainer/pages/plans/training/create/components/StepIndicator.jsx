"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle */}
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-[#FF6B00] text-white"
                  : "bg-[#333] text-gray-400"
              }`}
            >
              <Icon icon={step.icon} className="w-5 h-5" />

              {/* Completion check mark */}
              {index < currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Icon icon="mdi:check" className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Step label */}
          <div className="ml-3 mr-6">
            <p
              className={`text-sm font-medium ${
                index <= currentStep ? "text-white" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-[#333] mr-2">
              <motion.div
                className="h-full bg-[#FF6B00]"
                initial={{ width: "0%" }}
                animate={{ width: index < currentStep ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
