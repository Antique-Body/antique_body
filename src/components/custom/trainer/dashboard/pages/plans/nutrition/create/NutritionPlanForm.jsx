"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DailyMealPlanner } from "./DailyMealPlanner";
import { NutritionPlanInfo } from "./NutritionPlanInfo";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { ArrowLeft, ArrowRight } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const NutritionPlanForm = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [planData, setPlanData] = useState({
        title: "",
        description: "",
        coverImage: null,
        targetGoal: "weight-loss", // weight-loss, muscle-gain, maintenance
        nutritionInfo: {
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
        },
        days: DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = {
                mealPlans: [
                    {
                        name: "Breakfast",
                        time: "08:00",
                        options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                    },
                    {
                        name: "Lunch",
                        time: "13:00",
                        options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                    },
                    {
                        name: "Dinner",
                        time: "19:00",
                        options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                    },
                ],
            };
            return acc;
        }, {}),
    });

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setPlanData({
                ...planData,
                [parent]: {
                    ...planData[parent],
                    [child]: value,
                },
            });
        } else {
            setPlanData({
                ...planData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPlanData({
                ...planData,
                coverImage: file,
            });
        }
    };

    const updateDayMeals = (day, updatedMeals) => {
        setPlanData({
            ...planData,
            days: {
                ...planData.days,
                [day]: {
                    ...planData.days[day],
                    mealPlans: updatedMeals,
                },
            },
        });
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would submit the data to your backend
        // Then redirect to the plans page or show success message
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <NutritionPlanInfo
                        planData={planData}
                        handleChange={handleInfoChange}
                        handleImageChange={handleImageChange}
                    />
                );
            default:
                // Days of week steps (1-7)
                const dayIndex = currentStep - 1;
                if (dayIndex >= 0 && dayIndex < DAYS_OF_WEEK.length) {
                    const day = DAYS_OF_WEEK[dayIndex];
                    return (
                        <DailyMealPlanner
                            day={day}
                            meals={planData.days[day].mealPlans}
                            updateMeals={(updatedMeals) => updateDayMeals(day, updatedMeals)}
                        />
                    );
                }
                return null;
        }
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === DAYS_OF_WEEK.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center">
                <BackButton onClick={() => router.push("/trainer/dashboard/plans")} />
                <h1 className="ml-4 text-2xl font-bold text-white">Create Nutrition Plan</h1>
            </div>

            <Card variant="darkStrong" width="100%" maxWidth="100%" className="mb-6">
                <div className="flex justify-between border-b border-[#333] pb-4 mb-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center mr-3 text-white font-semibold">
                            {currentStep + 1}
                        </div>
                        <h2 className="text-lg font-semibold text-white">
                            {currentStep === 0 ? "Plan Details" : `Day ${currentStep}: ${DAYS_OF_WEEK[currentStep - 1]}`}
                        </h2>
                    </div>
                    <div className="flex space-x-1 items-center">
                        {DAYS_OF_WEEK.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index + 1 < currentStep
                                        ? "bg-[#FF6B00]"
                                        : index + 1 === currentStep
                                          ? "bg-[#FF6B00] animate-pulse"
                                          : "bg-[#444]"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}>
                    {renderStep()}

                    <div className="flex justify-between mt-8 pt-6 border-t border-[#333]">
                        {!isFirstStep && (
                            <Button variant="secondary" onClick={prevStep} leftIcon={<ArrowLeft size={16} />}>
                                Previous
                            </Button>
                        )}
                        <div className="ml-auto">
                            {!isLastStep ? (
                                <Button variant="orangeFilled" onClick={nextStep} rightIcon={<ArrowRight size={16} />}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="orangeFilled" type="submit">
                                    Create Plan
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};
