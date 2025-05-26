"use client";

export const StepProgressBar = ({
  currentStep,
  totalSteps,
  className = "",
  label = "Profile Setup",
}) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-[#333]">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
