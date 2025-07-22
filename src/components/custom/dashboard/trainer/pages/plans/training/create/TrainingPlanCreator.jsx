"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { MobileStepHeader } from "./components/MobileStepHeader";
import { NavigationButtons } from "./components/NavigationButtons";
import { StepIndicator } from "./components/StepIndicator";
import { BasicInfo } from "./steps/BasicInfo";
import { Features } from "./steps/Features";
import { Preview } from "./steps/Preview";
import { Schedule } from "./steps/Schedule";

import { Card } from "@/components/common";
import { BackButton } from "@/components/common/BackButton";
import { useTrainingPlanForm } from "@/hooks/useTrainingPlanForm";

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Scroll to top reference */}
        <div ref={topRef} />

        {/* Mobile Step Header - Only visible on mobile */}
        <div className="lg:hidden mb-6">
          <MobileStepHeader
            currentStep={currentStep}
            steps={STEPS}
            onBack={handleBack}
          />
        </div>

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton onClick={handleBack} />
            <h1 className="text-2xl font-bold text-white">
              {initialData?.id
                ? "Update Training Plan"
                : "Create Training Plan"}
            </h1>
          </div>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
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

        {/* Main Content Card */}
        <Card
          variant="dark"
          className="border border-[#333] shadow-2xl backdrop-blur-sm !w-full p-0"
        >
          <div className="sm:p-6 lg:p-8">
            {/* Step Content */}
            <div className="min-h-[400px]">{renderStep()}</div>

            {/* Navigation Buttons */}
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
        </Card>
      </div>
    </div>
  );
};
