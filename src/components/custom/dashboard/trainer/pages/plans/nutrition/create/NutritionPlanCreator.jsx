"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/common";
import { BackButton } from "@/components/common/BackButton";
import { useNutritionPlanForm } from "@/hooks/useNutritionPlanForm";

import { MobileStepHeader } from "../../training/create/components/MobileStepHeader";
import { NavigationButtons } from "../../training/create/components/NavigationButtons";
import { StepIndicator } from "../../training/create/components/StepIndicator";

import { BasicInfo } from "./steps/BasicInfo";
import { Features } from "./steps/Features";
import { MealPlanning } from "./steps/MealPlanning";
import { Preview } from "./steps/Preview";


const STEPS = [
  { id: "basic", label: "Basic Info", icon: "mdi:information" },
  { id: "meals", label: "Meal Planning", icon: "mdi:food" },
  { id: "features", label: "Features", icon: "mdi:star" },
  { id: "preview", label: "Preview", icon: "mdi:eye" },
];

export const NutritionPlanCreator = ({ initialData }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    formData,
    updateFormData,
    handleSubmit,
    isValid,
    isSubmitting,
    prefillForm,
    templates,
  } = useNutritionPlanForm(initialData);

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/trainer/dashboard/plans?fromTab=nutrition&refresh=1");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfo
            data={formData}
            onChange={updateFormData}
            prefillForm={prefillForm}
            templates={templates}
          />
        );
      case 1:
        return <MealPlanning data={formData} onChange={updateFormData} />;
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
                ? "Update Nutrition Plan"
                : "Create Nutrition Plan"}
            </h1>
          </div>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

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
              isNextDisabled={!isValid(currentStep)}
              isLastStep={currentStep === STEPS.length - 1}
              isEdit={!!initialData?.id}
              isLoading={isSubmitting}
              planType="nutrition"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
