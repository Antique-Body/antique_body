"use client";

import { Icon } from "@iconify/react";

export const LoadingState = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin"></div>
          <Icon
            icon="mdi:nutrition"
            className="absolute inset-0 m-auto text-[#FF6B00] w-6 h-6"
          />
        </div>
        <h3 className="text-xl font-semibold text-white mt-6 mb-2">
          Loading Your Nutrition Plan
        </h3>
        <p className="text-zinc-400 text-center max-w-md">
          We're fetching your personalized diet plan and meal tracking data...
        </p>
      </div>
    </div>
  );
};
