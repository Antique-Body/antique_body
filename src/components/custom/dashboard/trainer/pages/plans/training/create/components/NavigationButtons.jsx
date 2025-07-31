"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

// Helper function to get the main button text
function getMainButtonText({ isEdit, isLoading, planType }) {
  const typeLabel = planType === "nutrition" ? "Nutrition" : "Training";
  if (isEdit) {
    return isLoading
      ? `Updating ${typeLabel} Plan...`
      : `Update ${typeLabel} Plan`;
  } else {
    return isLoading
      ? `Creating ${typeLabel} Plan...`
      : `Create ${typeLabel} Plan`;
  }
}

// Default mapping for next step labels
const defaultStepLabels = {
  nutrition: ["Meal Planning", "Features", "Preview"],
  training: ["Schedule", "Features", "Preview"],
};

function getNextStepLabel(planType, currentStep, stepLabels) {
  const labels = stepLabels[planType] || stepLabels["training"];
  return labels[currentStep] || "Preview";
}

// Configuration object for step hints
const stepHints = {
  nutrition: [
    "Add basic information about your nutrition plan",
    "Create meal plans and daily nutrition schedules",
    "Set special features and dietary information",
    "Review everything before creating your plan",
  ],
  training: [
    "Add basic information about your training plan",
    "Create sessions and add exercises to build your plan",
    "Set special features and target audience",
    "Review everything before creating your plan",
  ],
};

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled,
  isLastStep,
  isLoading = false,
  planType = "training", // "training" or "nutrition"
  isEdit = false,
  stepLabels = defaultStepLabels,
}) => (
  <div className="mt-8">
    {/* Mobile-First Layout */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Back button - Secondary action */}
      <div className="order-2 sm:order-1 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto py-3 px-6 text-base font-medium"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
          {currentStep === 0 ? "Back to Plans" : "Previous Step"}
        </Button>
      </div>

      {/* Next/Submit button - Primary action */}
      <div className="order-1 sm:order-2 w-full sm:w-auto">
        <Button
          variant="orangeFilled"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="w-full sm:w-auto py-3 px-6 text-base font-semibold"
          loading={isLoading}
        >
          {isLastStep ? (
            <>
              {!isLoading && (
                <Icon icon="mdi:rocket-launch" className="w-5 h-5 mr-2" />
              )}
              {getMainButtonText({ isEdit, isLoading, planType })}
            </>
          ) : (
            <>
              Continue to {getNextStepLabel(planType, currentStep, stepLabels)}
              <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Mobile progress helper */}
        <div className="mt-2 text-center text-sm text-gray-400 sm:hidden">
          {isLastStep
            ? isLoading
              ? "Saving your plan..."
              : "Ready to create your plan!"
            : `Next: Step ${currentStep + 2} of ${totalSteps}`}
        </div>
      </div>
    </div>

    {/* Desktop Progress Indicator */}
    <div className="hidden sm:flex items-center justify-center mt-6 gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            index <= currentStep ? "w-8 bg-[#FF6B00]" : "w-6 bg-[#333]"
          }`}
        />
      ))}
    </div>

    {/* Helpful hints */}
    <div className="mt-4 text-center">
      <div className="text-xs text-gray-500 max-w-md mx-auto">
        {stepHints[planType] && stepHints[planType][currentStep]}
      </div>
    </div>
  </div>
);
