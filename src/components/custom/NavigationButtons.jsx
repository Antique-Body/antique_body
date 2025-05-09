"use client";

import { Button } from "@components/common";
import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="w-full flex justify-between items-center gap-4 mt-6">
      {currentStep > 1 ? (
        <button
          onClick={onPrevStep}
          className="bg-[#111] border border-[#333] hover:border-[#444] hover:bg-[#1a1a1a] hover:scale-[1.02] text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer gap-2"
          style={{ minWidth: "130px" }}>
          <Icon icon="mdi:arrow-left" width="20" height="20" />
          {t("training_setup.previous")}
        </button>
      ) : (
        <div style={{ minWidth: "130px" }}></div>
      )}

      {currentStep < totalSteps ? (
        <Button
          onClick={onNextStep}
          disabled={!isCurrentStepSelected || !shouldShowNextStep}
          className={`min-w-[130px] ${(!isCurrentStepSelected || !shouldShowNextStep) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'} transition-all duration-300`}
          rightIcon={<Icon icon="mdi:arrow-right" width="20" height="20" />}>
          {t("training_setup.next")}
        </Button>
      ) : (
        <Button
          onClick={onStartTraining}
          disabled={!canFinish || !shouldShowNextStep}
          className={`min-w-[150px] ${(!canFinish || !shouldShowNextStep) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'} transition-all duration-300`}
          rightIcon={<Icon icon="mdi:dumbbell" width="20" height="20" />}>
          {t("training_setup.start_training")}
        </Button>
      )}
    </div>
  );
};
