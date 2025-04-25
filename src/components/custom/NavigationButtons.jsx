import { ArrowLeft, ArrowRight, Button } from "@components/common";

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onStartTraining,
  isCurrentStepSelected,
  canFinish,
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
          className="min-w-[120px]"
          rightIcon={<ArrowRight size={18} />}>
          Next
        </Button>
      ) : (
        <Button
          onClick={onStartTraining}
          disabled={!canFinish}
          className="min-w-[120px]"
          rightIcon={<ArrowRight size={18} />}>
          Start Training
        </Button>
      )}
    </div>
  );
};
