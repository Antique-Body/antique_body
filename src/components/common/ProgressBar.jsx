import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#aaa]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-[#aaa]">{percentage}% Complete</span>
      </div>
      <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF7800] to-[#FF9A00] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
