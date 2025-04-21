import React from "react";
import Button from "./Button";
import { ArrowLeft, ArrowRight } from "./Icons";

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onStartTraining,
  isCurrentStepSelected,
  canFinish
}) => {
  return (
    <div className="w-full flex justify-between items-center gap-4 mt-6">
      {currentStep > 1 ? (
        <button
          onClick={onPrevStep}
          className="bg-[#111] border border-[#333] hover:border-[#444] text-white px-8 py-3 rounded-xl transition-all flex items-center justify-center"
          style={{ minWidth: "120px" }}>
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
      ) : (
        <div style={{ minWidth: "120px" }}></div>
      )}

      {currentStep < totalSteps ? (
        <Button
          onClick={onNextStep}
          disabled={!isCurrentStepSelected}
          primary={isCurrentStepSelected}
          className="px-8 py-3"
          style={{ minWidth: "120px" }}>
          Next
          <ArrowRight size={18} className="ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onStartTraining}
          disabled={!canFinish}
          primary={canFinish}
          className="px-8 py-3"
          style={{ minWidth: "120px" }}>
          Get Started
          <ArrowRight size={18} className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons; 