import { useState } from "react";
import { TOTAL_STEPS, stepConfig } from "../utils";

export const useWorkoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userSelections, setUserSelections] = useState({
    trainingType: null,
    environment: null,
    equipment: null,
    experience: null,
    goal: null,
    frequency: null,
  });

  const handleSelection = (field, value) => {
    setUserSelections({
      ...userSelections,
      [field]: value,
    });
  };

  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTraining = () => {
    alert(
      "Starting workout with: " +
        "\nTraining type: " +
        userSelections.trainingType +
        "\nEnvironment: " +
        userSelections.environment +
        "\nEquipment: " +
        userSelections.equipment +
        "\nExperience: " +
        userSelections.experience +
        "\nGoal: " +
        userSelections.goal +
        "\nFrequency: " +
        userSelections.frequency +
        " times per week"
    );
  };

  const isCurrentStepSelected = () => {
    const currentStepConfig = stepConfig.find(step => step.stepNumber === currentStep);
    return userSelections[currentStepConfig.field] !== null;
  };

  const canFinish = () => userSelections.frequency !== null;

  return {
    currentStep,
    userSelections,
    handleSelection,
    goToNextStep,
    goToPrevStep,
    startTraining,
    isCurrentStepSelected,
    canFinish
  };
}; 