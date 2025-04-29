import { stepConfig, TOTAL_STEPS } from "@/app/utils";
import { useState, useCallback, useRef } from "react";

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

  // Use refs to track previous values and prevent unnecessary updates
  const prevSelectionsRef = useRef(userSelections);
  const prevStepRef = useRef(currentStep);

  // Determine if a step should be skipped based on dependencies
  const shouldSkipStep = useCallback((step) => {
    // If the step depends on another field
    if (step.dependsOn) {
      const { field, value, values } = step.dependsOn;
      
      // For injury-related steps, we need to check if the user has any injuries
      if (field === "hasInjury") {
        // If the step should only show for certain injury types
        if (values && Array.isArray(values)) {
          return !values.includes(userSelections[field]);
        }
        
        // If there's a specific value to check against
        if (value !== undefined) {
          return userSelections[field] !== value;
        }
      }
      
      // For other dependencies
      if (values && Array.isArray(values)) {
        return !values.includes(userSelections[field]);
      }
      
      return userSelections[field] !== value;
    }
    return false;
  }, [userSelections]);

  const handleSelection = useCallback((field, value) => {
    setUserSelections(prevSelections => {
      // If the value is the same as current, don't update
      if (prevSelections[field] === value) {
        return prevSelections;
      }
      
      // Create a new object for the update
      const newSelections = { ...prevSelections };

      // Special handling for injury locations
      if (field === "injuryLocations") {
        newSelections[field] = value;
      }
      // Special handling for hasInjury
      else if (field === "hasInjury") {
        // Always update the hasInjury field
        newSelections[field] = value;
        
        // Only reset related fields when changing to "no"
        if (value === "no") {
          newSelections.injuryLocations = [];
          newSelections.wantsRehabilitation = null;
        }
      }
      // Normal field update
      else {
        newSelections[field] = value;
      }

      // Update the ref with the new state
      prevSelectionsRef.current = newSelections;
      return newSelections;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => {
        const newStep = prev + 1;
        
        // Check if the next step should be skipped
        const nextStepConfig = stepConfig.find(step => step.stepNumber === newStep);
        if (nextStepConfig && shouldSkipStep(nextStepConfig)) {
          return newStep + 1;
        }
        
        return newStep;
      });
    }
  }, [currentStep, shouldSkipStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => {
        let newStep = prev - 1;
        
        // Check if the previous step should be skipped
        while (newStep >= 1) {
          const prevStepConfig = stepConfig.find(step => step.stepNumber === newStep);
          if (prevStepConfig && shouldSkipStep(prevStepConfig)) {
            newStep -= 1;
          } else {
            break;
          }
        }
        
        // Make sure we don't go below step 1
        newStep = Math.max(1, newStep);
        
        // Update the ref with the new step
        prevStepRef.current = newStep;
        return newStep;
      });
    }
  }, [currentStep, shouldSkipStep]);

  const isCurrentStepSelected = useCallback(() => {
    const currentStepConfig = stepConfig.find(
      (step) => step.stepNumber === currentStep
    );
    
    if (!currentStepConfig) return false;

    // Special handling for injury locations
    if (currentStepConfig.isInjuryLocationStep) {
      return userSelections.injuryLocations && userSelections.injuryLocations.length > 0;
    }

    // Special handling for measurements step
    if (currentStepConfig.isMeasurementsStep) {
      return userSelections.measurements?.isValid === true;
    }
    
    // Special handling for frequency step
    if (currentStepConfig.isFrequencyStep) {
      return userSelections.frequency !== null && userSelections.frequency !== undefined;
    }
    
    // Normal field checking
    const fieldValue = userSelections[currentStepConfig.field];
    return fieldValue !== null && fieldValue !== undefined;
  }, [currentStep, userSelections]);

  const canFinish = useCallback(() => {
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
