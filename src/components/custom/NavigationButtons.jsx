import { ArrowLeft, ArrowRight, Button } from "@components/common";

export const NavigationButtons = ({
    currentStep,
    totalSteps,
    onPrevStep,
    onNextStep,
    onStartTraining,
    isCurrentStepSelected,
    canFinish,
    shouldShowNextStep = true,
}) => {
    return (
        <div className="w-full flex justify-between items-center gap-4 mt-6">
            {currentStep > 1 ? (
                <Button onClick={onPrevStep} variant="ghost" size="small" leftIcon={<ArrowLeft size={18} />}>
                    Back
                </Button>
            ) : (
                <div style={{ minWidth: "120px" }}></div>
            )}

            {currentStep < totalSteps ? (
                <Button
                    onClick={onNextStep}
                    disabled={!isCurrentStepSelected || !shouldShowNextStep}
                    className="min-w-[120px]"
                    rightIcon={<ArrowRight size={18} />}
                >
                    Next
                </Button>
            ) : (
                <Button
                    onClick={onStartTraining}
                    disabled={!canFinish || !shouldShowNextStep}
                    className="min-w-[120px]"
                    rightIcon={<ArrowRight size={18} />}
                >
                    Start Training
                </Button>
            )}
        </div>
    );
};
