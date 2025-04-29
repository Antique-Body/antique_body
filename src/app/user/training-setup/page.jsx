"use client";
import { TOTAL_STEPS, stepConfig } from "@/app/utils";
import Background from "@/components/background";
import { useWorkoutForm } from "@/hooks/useWorkoutForm";
import { ProgressBar, TrainerIcon } from "@components/common";
import {
    BrandLogo,
    Card,
    FrequencySelector,
    MeasurementsInput,
    NavigationButtons,
    SelectionCard,
    StepContainer,
} from "@components/custom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Constants
const MEASUREMENT_CONSTRAINTS = {
    WEIGHT: { min: 30, max: 300 },
    HEIGHT: { min: 100, max: 250 },
};

const TrainingSetup = () => {
    const router = useRouter();
    const { data: session, update } = useSession();
    const { currentStep, userSelections, handleSelection, goToNextStep, goToPrevStep, isCurrentStepSelected, canFinish } =
        useWorkoutForm();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    // Redirect if already completed training setup
    useEffect(() => {
        if (session?.user?.hasCompletedTrainingSetup) {
            router.push("/user/dashboard");
        }
    }, [session, router]);

    // Validation effect
    useEffect(() => {
        if (!userSelections.measurements) {
            setValidationError(null);
            return;
        }

        const { weight, height } = userSelections.measurements;
        const weightValue = Number(weight);
        const heightValue = Number(height);

        if (
            isNaN(weightValue) ||
            weightValue < MEASUREMENT_CONSTRAINTS.WEIGHT.min ||
            weightValue > MEASUREMENT_CONSTRAINTS.WEIGHT.max
        ) {
            setValidationError(
                `Weight must be between ${MEASUREMENT_CONSTRAINTS.WEIGHT.min} and ${MEASUREMENT_CONSTRAINTS.WEIGHT.max} kg`,
            );
            return;
        }

        if (
            isNaN(heightValue) ||
            heightValue < MEASUREMENT_CONSTRAINTS.HEIGHT.min ||
            heightValue > MEASUREMENT_CONSTRAINTS.HEIGHT.max
        ) {
            setValidationError(
                `Height must be between ${MEASUREMENT_CONSTRAINTS.HEIGHT.min} and ${MEASUREMENT_CONSTRAINTS.HEIGHT.max} cm`,
            );
            return;
        }

        setValidationError(null);
    }, [userSelections.measurements]);

    // Helper functions
    const getFrequencyEnum = useCallback(freq => {
        const num = Number(freq);
        return isNaN(num) || num < 1 || num > 7 ? 3 : num;
    }, []);

    const formatEquipment = useCallback(equip => equip.replace("-", "_"), []);

    // API functions
    const saveUserData = useCallback(async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            if (validationError) {
                return false;
            }

            const userData = {
                measurements: {
                    weight: Number(userSelections.measurements.weight),
                    height: Number(userSelections.measurements.height),
                    bmi: Number(userSelections.measurements.bmi.toFixed(2)),
                },
                environment: userSelections.environment,
                equipment: formatEquipment(userSelections.equipment),
                experience: userSelections.experience,
                goal: userSelections.goal,
                frequency: getFrequencyEnum(userSelections.frequency),
            };

            const response = await fetch("/api/users/trainingSetup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save user data");
            }

            // Update session to mark training setup as completed
            await update({ hasCompletedTrainingSetup: true });

            return true;
        } catch (error) {
            console.error("Error saving user data:", error);
            setSaveError(error.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [userSelections, validationError, formatEquipment, getFrequencyEnum, update]);

    // Event handlers
    const handleStartTraining = useCallback(async () => {
        const success = await saveUserData();
        if (success) {
            router.push("/user/dashboard");
        }
    }, [saveUserData, router]);

    const areMeasurementsValid = useCallback(() => {
        return currentStep !== 6 || userSelections.measurements?.isValid === true;
    }, [currentStep, userSelections.measurements]);

    // Render functions
    const renderStepContent = useCallback(
        step => {
            if (step.isFrequencyStep) {
                return (
                    <FrequencySelector
                        selectedFrequency={userSelections.frequency}
                        onSelect={value => handleSelection("frequency", value)}
                    />
                );
            }

            if (step.isMeasurementsStep) {
                return <MeasurementsInput onSelect={value => handleSelection("measurements", value)} />;
            }

            return (
                <div className="grid grid-cols-2 gap-4">
                    {step.options.map(option => (
                        <SelectionCard
                            key={option.value}
                            selected={userSelections[step.field] === option.value}
                            onClick={() => handleSelection(step.field, option.value)}
                            icon={option.icon}
                            emoji={option.emoji}
                            title={option.title}
                            description={option.description}
                            bgImage={option.bgImage}
                        />
                    ))}
                </div>
            );
        },
        [userSelections, handleSelection],
    );

    const renderErrorMessages = () => {
        if (!saveError && !validationError) return null;

        return (
            <>
                {saveError && (
                    <div className="text-sm text-red-500 text-center mt-4 bg-red-500/10 p-3 rounded-lg">{saveError}</div>
                )}

                {validationError && (
                    <div className="text-sm text-red-500 text-center mt-4 bg-red-500/10 p-3 rounded-lg">{validationError}</div>
                )}
            </>
        );
    };

    // Don't render anything if training setup is completed
    if (session?.user?.hasCompletedTrainingSetup) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative">
            <Background />

            <div className="max-w-[550px] mx-auto px-5 py-5 relative z-20 min-h-screen flex flex-col items-center">
                <header className="pt-10 w-full text-center justify-center">
                    <BrandLogo />
                </header>

                <div className="mb-5">
                    <Card width="100%">
                        <div className="text-2xl sm:text-3xl font-bold mb-2">Let's create your workout plan</div>
                        <div className="text-[#aaa] text-base mb-4">Answer a few questions to get started</div>
                        <div
                            className="relative mt-2 mb-1 w-[60px] h-[60px] bg-gradient-to-br from-[#FF7800] to-[#FF9A00] rounded-full flex justify-center items-center"
                            style={{ boxShadow: "0 5px 15px rgba(255, 120, 0, 0.3)" }}
                        >
                            <TrainerIcon />
                        </div>
                    </Card>
                </div>

                {stepConfig.map(step => (
                    <StepContainer
                        key={step.stepNumber}
                        currentStep={currentStep}
                        stepNumber={step.stepNumber}
                        title={step.title}
                        emoji={step.emoji}
                        icon={step.icon}
                    >
                        {renderStepContent(step)}
                    </StepContainer>
                ))}

                <NavigationButtons
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    onPrevStep={goToPrevStep}
                    onNextStep={goToNextStep}
                    onStartTraining={handleStartTraining}
                    isCurrentStepSelected={isCurrentStepSelected()}
                    canFinish={canFinish()}
                    shouldShowNextStep={areMeasurementsValid()}
                />

                {isSaving && <div className="text-sm text-gray-500 text-center mt-4">Saving your preferences...</div>}

                {renderErrorMessages()}

                <div className="mt-4 flex w-full">
                    <ProgressBar value={currentStep} maxValue={TOTAL_STEPS} label="Step" />
                </div>
            </div>
        </div>
    );
};

export default TrainingSetup;
