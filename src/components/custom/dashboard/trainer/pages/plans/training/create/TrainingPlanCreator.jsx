"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { BackButton } from "@/components/common/BackButton";
import { useTrainingPlanForm } from "@/hooks/useTrainingPlanForm";

import { NavigationButtons } from "./components/NavigationButtons";
import { BasicInfo, Features, Preview, Schedule } from "./steps";

const STEPS = [
  { id: "basic", label: "Basic Info", icon: "mdi:information" },
  { id: "schedule", label: "Schedule", icon: "mdi:calendar" },
  { id: "features", label: "Features", icon: "mdi:star" },
  { id: "preview", label: "Preview", icon: "mdi:eye" },
];

export const TrainingPlanCreator = ({ initialData }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const topRef = useRef(null);

  const {
    formData,
    updateFormData,
    handleSubmit,
    getValidationErrors,
    prefillForm,
    templates,
  } = useTrainingPlanForm(initialData);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNext = async () => {
    // Check validation for current step
    const errors = getValidationErrors(currentStep);

    if (errors.length > 0) {
      setValidationErrors(errors);
      scrollToTop();
      return;
    }

    // Clear any previous errors
    setValidationErrors([]);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsLoading(true);
      try {
        await handleSubmit();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    // Clear errors when going back
    setValidationErrors([]);

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/trainer/dashboard/plans?fromTab=training");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Pass prefillForm and templates to BasicInfo
        return (
          <BasicInfo
            data={formData}
            onChange={updateFormData}
            prefillForm={prefillForm}
            templates={templates}
          />
        );
      case 1:
        return <Schedule data={formData} onChange={updateFormData} />;
      case 2:
        return <Features data={formData} onChange={updateFormData} />;
      case 3:
        return <Preview data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-5 max-w-7xl mx-auto">
      {/* Scroll to top reference */}
      <div ref={topRef} />

      {/* Simplified Header with Back Button */}
      <div className="mb-8 relative pb-2 flex items-center gap-4">
        <BackButton onClick={handleBack} />
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {initialData?.id ? "Update Training Plan" : "Create Training Plan"}
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Design a comprehensive training program for your clients
          </p>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div>
        <div>
          {/* Step Content */}
          <div className="min-h-[400px]">{renderStep()}</div>
        </div>

        {/* Navigation Buttons */}
        <div className="border-t border-[#333] p-6">
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onBack={handleBack}
            onNext={handleNext}
            isNextDisabled={false} // Always allow next, validation happens in handleNext
            isLastStep={currentStep === STEPS.length - 1}
            isEdit={!!initialData?.id}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
