"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BackButton } from "@/components/common/BackButton";
import { Card } from "@/components/custom/Card";
import {
    PlanTypeStep,
    PlanDetailsStep,
    PlanDaysStep,
    PlanNutritionStep,
    PlanReviewStep,
} from "@/components/custom/trainer/dashboard/pages/plans";
const STEPS = {
    TYPE: 0,
    DETAILS: 1,
    DAYS: 2,
    NUTRITION: 3,
    REVIEW: 4,
};

const CreatePlanPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(STEPS.TYPE);
    const [planData, setPlanData] = useState({
        type: "",
        title: "",
        summary: "",
        description: "",
        forAthletes: "",
        days: [],
        nutrition: {
            dailyCalories: "",
            macros: {
                protein: "",
                carbs: "",
                fats: "",
            },
            mealPlan: "",
        },
    });

    const handleTypeSelect = (type) => {
        setPlanData((prev) => ({ ...prev, type: type }));
        setCurrentStep(STEPS.DETAILS);
    };

    const handleDetailsSubmit = (details) => {
        setPlanData((prev) => ({ ...prev, ...details }));
        setCurrentStep(STEPS.DAYS);
    };

    const handleDaysSubmit = (days) => {
        setPlanData((prev) => ({ ...prev, days }));
        setCurrentStep(STEPS.NUTRITION);
    };

    const handleNutritionSubmit = (nutrition) => {
        setPlanData((prev) => ({ ...prev, nutrition }));
        setCurrentStep(STEPS.REVIEW);
    };

    const handleSavePlan = () => {
        // Here you would send the data to your API
        // eslint-disable-next-line no-console
        console.log("Saving plan:", planData);

        // Navigate back to plans list
        router.push("/trainer/dashboard/plans");
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case STEPS.TYPE:
                return "Select Plan Type";
            case STEPS.DETAILS:
                return "Plan Details";
            case STEPS.DAYS:
                return "Training Schedule";
            case STEPS.NUTRITION:
                return "Nutrition Plan";
            case STEPS.REVIEW:
                return "Review & Save";
            default:
                return "Create New Plan";
        }
    };

    const getProgressPercentage = () => (currentStep / (Object.keys(STEPS).length - 1)) * 100;

    const renderStepContent = () => {
        switch (currentStep) {
            case STEPS.TYPE:
                return <PlanTypeStep onSelect={handleTypeSelect} />;
            case STEPS.DETAILS:
                return <PlanDetailsStep initialData={planData} onSubmit={handleDetailsSubmit} />;
            case STEPS.DAYS:
                return <PlanDaysStep initialData={planData.days} onSubmit={handleDaysSubmit} planType={planData.type} />;
            case STEPS.NUTRITION:
                return <PlanNutritionStep initialData={planData.nutrition} onSubmit={handleNutritionSubmit} />;
            case STEPS.REVIEW:
                return <PlanReviewStep planData={planData} onSubmit={handleSavePlan} />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="w-full pb-12">
            <div className="mb-6 flex items-center border-b border-[#333] px-6 py-4">
                <BackButton
                    onClick={() => (currentStep === STEPS.TYPE ? router.push("/trainer/dashboard/plans") : handlePrevStep())}
                />

                <div className="ml-8">
                    <h1 className="text-3xl font-bold text-white">Create New Training Plan</h1>
                    <p className="mt-2 text-gray-400">{getStepTitle()}</p>
                </div>
            </div>

            <div className="px-6">
                {/* Progress bar */}
                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#222]">
                    <div
                        className="h-full bg-gradient-to-r from-[#FF7800] to-[#FF9A00] transition-all duration-500 ease-out"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>

                {/* Step indicators */}
                <div className="mb-8 flex items-center justify-between px-2">
                    {Object.values(STEPS).map((step) => (
                        <div
                            key={step}
                            className={`flex flex-col items-center ${step <= currentStep ? "text-[#FF6B00]" : "text-gray-600"}`}
                        >
                            <div
                                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                                    step <= currentStep ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]" : "bg-[#222] text-gray-600"
                                } ${step === currentStep ? "ring-2 ring-[#FF6B00]" : ""}`}
                            >
                                {step + 1}
                            </div>
                            <span className="hidden text-xs sm:block">
                                {Object.keys(STEPS)[step].toLowerCase().replace("_", " ")}
                            </span>
                        </div>
                    ))}
                </div>

                <Card variant="darkStrong" width="100%" maxWidth="100%" className="min-h-[60vh]">
                    {renderStepContent()}
                </Card>
            </div>
        </div>
    );
};

export default CreatePlanPage;
