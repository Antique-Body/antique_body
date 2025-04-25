"use client";
import Background from "@/components/background";
import { ProgressBar } from "@components/common";
import {
  BrandLogo,
  FrequencySelector,
  NavigationButtons,
  SelectionCard,
  StepContainer,
  WelcomeCard,
} from "@components/custom";
import { useWorkoutForm } from "@hooks/useWorkoutForm";
import { TOTAL_STEPS, stepConfig } from "../utils/index";

const UserDashboard = () => {
  const {
    currentStep,
    userSelections,
    handleSelection,
    goToNextStep,
    goToPrevStep,
    startTraining,
    isCurrentStepSelected,
    canFinish,
  } = useWorkoutForm();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
      <Background />

      <div className="max-w-[550px] mx-auto px-5 py-5 relative z-20 h-screen flex flex-col items-center overflow-y-auto">
        <header className="mb-8 pt-3 w-full text-center">
          <BrandLogo />
        </header>

        <WelcomeCard
          title={<>Let's create your workout plan </>}
          subtitle="Answer a few questions to get started"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
              <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
          }
        />

        {stepConfig.map((step) => (
          <StepContainer
            key={step.stepNumber}
            currentStep={currentStep}
            stepNumber={step.stepNumber}
            title={step.title}
            emoji={step.emoji}
            icon={step.icon}
            >
            {step.isFrequencyStep ? (
              <FrequencySelector
                selectedFrequency={userSelections.frequency}
                onSelect={(value) => handleSelection("frequency", value)}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {step.options.map((option) => (
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
            )}
          </StepContainer>
        ))}

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevStep={goToPrevStep}
          onNextStep={goToNextStep}
          onStartTraining={startTraining}
          isCurrentStepSelected={isCurrentStepSelected()}
          canFinish={canFinish()}
        />

        <div className="mt-4 flex w-full">
          <ProgressBar
            value={currentStep}
            maxValue={TOTAL_STEPS}
            label="Step"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
