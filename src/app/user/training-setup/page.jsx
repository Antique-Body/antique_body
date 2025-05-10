"use client";

import { ProgressBar, TrainerIcon } from "@components/common";
import {
  BrandLogo,
  Card,
  FrequencySelector,
  InjuryLocationSelector,
  MeasurementsInput,
  NavigationButtons,
  SelectionCard,
  StepContainer,
} from "@components/custom";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TOTAL_STEPS, stepConfig } from "@/app/utils";
import { EffectBackground } from "@/components/background";
import { useWorkoutForm } from "@/hooks/useWorkoutForm";


// Constants
const MEASUREMENT_CONSTRAINTS = {
  METRIC: {
    WEIGHT: { min: 30, max: 300 },
    HEIGHT: { min: 100, max: 250 },
  },
};

const TrainingSetup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {  update } = useSession();
  const {
    currentStep,
    userSelections,
    handleSelection,
    goToNextStep,
    goToPrevStep,
    isCurrentStepSelected,
    canFinish,
    shouldSkipStep,
  } = useWorkoutForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Prefetch dashboard for faster transition
  useEffect(() => {
    // Prefetch dashboard in background for smoother transition
    router.prefetch("/user/dashboard");
  }, [router]);

  // Validation effect
  useEffect(() => {
    if (!userSelections.measurements) {
      setValidationError(null);
      return;
    }

    // The MeasurementsInput component now converts all values to metric
    // for the API, so we only need to validate against metric constraints
    const { weight, height } = userSelections.measurements;
    const weightValue = Number(weight);
    const heightValue = Number(height);

    if (
      isNaN(weightValue) ||
      weightValue < MEASUREMENT_CONSTRAINTS.METRIC.WEIGHT.min ||
      weightValue > MEASUREMENT_CONSTRAINTS.METRIC.WEIGHT.max
    ) {
      setValidationError(
        t("dashboard.weight_validation", {
          min: MEASUREMENT_CONSTRAINTS.METRIC.WEIGHT.min,
          max: MEASUREMENT_CONSTRAINTS.METRIC.WEIGHT.max,
        })
      );
      return;
    }

    if (
      isNaN(heightValue) ||
      heightValue < MEASUREMENT_CONSTRAINTS.METRIC.HEIGHT.min ||
      heightValue > MEASUREMENT_CONSTRAINTS.METRIC.HEIGHT.max
    ) {
      setValidationError(
        t("dashboard.height_validation", {
          min: MEASUREMENT_CONSTRAINTS.METRIC.HEIGHT.min,
          max: MEASUREMENT_CONSTRAINTS.METRIC.HEIGHT.max,
        })
      );
      return;
    }

    setValidationError(null);
  }, [userSelections.measurements, t]);

  // Check if current step should be skipped
  useEffect(() => {
    const currentConfig = stepConfig.find(
      (step) => step.stepNumber === currentStep
    );
    if (currentConfig && shouldSkipStep(currentConfig)) {
      // Use setTimeout to break the synchronous update cycle
      const timer = setTimeout(() => {
        goToNextStep();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentStep, shouldSkipStep, goToNextStep]);

  // Helper functions
  const getFrequencyEnum = useCallback((freq) => {
    const num = Number(freq);
    return isNaN(num) || num < 1 || num > 7 ? 3 : num;
  }, []);

  const formatEquipment = useCallback((equip) => equip.replace("-", "_"), []);

  // API functions
  const saveUserData = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      if (validationError) {
        return false;
      }

      // Measurements are already converted to metric units in the MeasurementsInput component
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
        hasInjury: userSelections.hasInjury !== "no",
        injuryType: userSelections.hasInjury,
        injuryLocations:
          userSelections.hasInjury !== "no"
            ? userSelections.injuryLocations
            : [],
        wantsRehabilitation:
          userSelections.hasInjury !== "no"
            ? userSelections.wantsRehabilitation
            : null,
      };

      // Start the fetch but don't wait for it - fire and forget
      // This will run in the background while we redirect
      fetch("/api/users/trainingSetup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then(() => {
          // Update session in background after data is saved
          update({ hasCompletedTrainingSetup: true }).catch((err) => {
            console.error("Failed to update session:", err);
          });
        })
        .catch((err) => {
          console.error("Error saving training setup in background:", err);
        });

      // Return success immediately to trigger redirection
      return true;
    } catch (error) {
      console.error("Error preparing training data:", error);
      setSaveError(error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    userSelections,
    validationError,
    formatEquipment,
    getFrequencyEnum,
    update,
  ]);

  // Event handlers
  const handleStartTraining = useCallback(async () => {
    try {
      // Start showing redirect UI immediately
      setIsRedirecting(true);

      // Save data in background
      saveUserData()
        .then((success) => {
          if (success) {
            // Redirect to loading screen instead of dashboard
            router.push("/user/training-setup/loading");
          } else {
            // If save failed, stop showing redirect UI
            setIsRedirecting(false);
          }
        })
        .catch((error) => {
          console.error("Error in save process:", error);
          setSaveError(error.message || t("save_failed"));
          setIsRedirecting(false);
        });
    } catch (error) {
      setSaveError(error.message);
      setIsRedirecting(false);
    }
  }, [saveUserData, router, t]);

  const areMeasurementsValid = useCallback(() => currentStep !== 9 || userSelections.measurements?.isValid === true, [currentStep, userSelections.measurements]);

  // Render functions
  const renderStepContent = useCallback(
    (step) => {
      if (step.isFrequencyStep) {
        return (
          <FrequencySelector
            selectedFrequency={userSelections.frequency}
            onSelect={(value) => handleSelection("frequency", value)}
          />
        );
      }

      if (step.isMeasurementsStep) {
        return (
          <MeasurementsInput
            onSelect={(value) => handleSelection("measurements", value)}
          />
        );
      }

      if (step.isInjuryLocationStep) {
        return (
          <InjuryLocationSelector
            selectedLocations={userSelections.injuryLocations || []}
            onSelect={(value) => handleSelection("injuryLocations", value)}
          />
        );
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {step.options.map((option) => (
            <SelectionCard
              key={option.value}
              selected={userSelections[step.field] === option.value}
              onClick={() => handleSelection(step.field, option.value)}
              icon={option.icon}
              iconName={option.iconName}
              emoji={option.emoji}
              title={option.title}
              description={option.description}
              bgImage={option.bgImage}
            />
          ))}
        </div>
      );
    },
    [userSelections, handleSelection]
  );

  const renderErrorMessages = () => {
    if (!saveError && !validationError) return null;

    return (
      <>
        {saveError && (
          <div className="text-sm text-red-500 text-center mt-4 bg-red-500/10 p-3 rounded-lg flex items-center justify-center gap-2">
            <Icon icon="mdi:alert-circle" className="text-red-500" />
            {saveError}
          </div>
        )}

        {validationError && (
          <div className="text-sm text-red-500 text-center mt-4 bg-red-500/10 p-3 rounded-lg flex items-center justify-center gap-2">
            <Icon icon="mdi:alert-circle" className="text-red-500" />
            {validationError}
          </div>
        )}
      </>
    );
  };

  const renderLoadingState = () => (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-white text-center">
          <div className="mb-4 flex flex-col items-center">
            <Icon
              icon="line-md:loading-twotone-loop"
              width="48"
              height="48"
              className="text-[#FF7800] mb-3"
            />
            {isRedirecting
              ? t("training_setup.redirecting")
              : t("training_setup.saving")}
          </div>
        </div>
      </div>
    );

  // Show loading indicator while saving or redirecting
  if (isSaving || isRedirecting) {
    return renderLoadingState();
  }

  return (
    <div className="min-h-screen  text-white relative">
      <EffectBackground />

      <div className="max-w-[600px] mx-auto px-5 py-5 relative z-20 min-h-screen flex flex-col items-center">
        <header className="pt-10 w-full text-center justify-center">
          <BrandLogo />
        </header>

        <div className="mb-6 w-full">
          <Card
            width="100%"
            borderTop={true}
            hover={true}
            hoverBorderColor="#FF7800">
            <div className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <Icon
                icon="mdi:dumbbell"
                className="text-[#FF7800]"
                width="32"
                height="32"
              />
              {t("training_setup.title")}
            </div>
            <div className="text-[#aaa] text-base mb-4">
              {t("training_setup.description")}
            </div>
            <div
              className="relative inline-block mt-2 mb-1 w-[60px] h-[60px] bg-gradient-to-br from-[#FF7800] to-[#FF9A00] rounded-full flex justify-center items-center"
              style={{ boxShadow: "0 5px 15px rgba(255, 120, 0, 0.3)" }}>
              <TrainerIcon />
            </div>
          </Card>
        </div>

        {stepConfig.map((step) => {
          // Skip steps that should be skipped in the UI
          if (shouldSkipStep(step)) {
            return null;
          }

          return (
            <StepContainer
              key={step.stepNumber}
              currentStep={currentStep}
              stepNumber={step.stepNumber}
              title={step.title}
              emoji={step.emoji}
              icon={step.icon}>
              {renderStepContent(step)}
            </StepContainer>
          );
        })}

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

        {renderErrorMessages()}

        <div className="mt-6 flex w-full">
          <ProgressBar
            value={currentStep}
            maxValue={TOTAL_STEPS}
            label={t("training_setup.step")}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingSetup;
