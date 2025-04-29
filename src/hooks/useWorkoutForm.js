import { stepConfig, TOTAL_STEPS } from "@/app/utils";
import { useState, useCallback } from "react";

export const useWorkoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userSelections, setUserSelections] = useState({
    hasInjury: null,
    injuryLocations: [],
    wantsRehabilitation: null,
    environment: null,
    equipment: null,
    experience: null,
    goal: null,
    frequency: null,
    measurements: null,
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

  const isCurrentStepSelected = useCallback(() => {
    const currentStepConfig = stepConfig.find(
      (step) => step.stepNumber === currentStep
    );
    
    if (!currentStepConfig) return false;

    // Special handling for injury locations
    if (currentStepConfig.isInjuryLocationStep) {
      return userSelections.injuryLocations && userSelections.injuryLocations.length > 0;
    }
    
    // Normal field checking
    return userSelections[currentStepConfig.field] !== null && 
           userSelections[currentStepConfig.field] !== undefined;
  }, [currentStep, userSelections]);

  // Determine if a step should be skipped based on dependencies
  const shouldSkipStep = useCallback((step) => {
    // If the step depends on another field
    if (step.dependsOn) {
      const { field, value, values } = step.dependsOn;
      
      // If we have multiple allowed values, check if current value is in that list
      if (values && Array.isArray(values)) {
        return !values.includes(userSelections[field]);
      }
      
      // Otherwise check for exact value match
      return userSelections[field] !== value;
    }
    return false;
  }, [userSelections]);

  const canFinish = useCallback(() => {
    // Check if the frequency step and measurement step are completed
    return userSelections.frequency !== null && 
           userSelections.measurements !== null && 
           userSelections.measurements?.isValid === true;
  }, [userSelections]);

  return {
    currentStep,
    userSelections,
    handleSelection,
    goToNextStep,
    goToPrevStep,
    isCurrentStepSelected,
    canFinish,
    shouldSkipStep,
  };
};
