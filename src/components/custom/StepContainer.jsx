"use client";

import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";

export const StepContainer = ({
  currentStep,
  stepNumber,
  title,
  emoji,
  icon,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${
        currentStep === stepNumber ? "block" : "hidden"
      } w-full animate-[fadeIn_0.5s_ease] cursor-pointer`}>
      <div className="mb-8 w-full">
        <div className="text-xl font-semibold mb-6 flex items-center justify-center gap-3 text-center">
          {icon ? (
            <Icon icon={icon} className="text-[#FF7800]" width="32" height="32" />
          ) : (
            <span className="text-2xl">{emoji}</span>
          )}
          <span className="bg-gradient-to-r from-[#FF7800] to-[#FFA500] bg-clip-text text-transparent font-bold">{t(title)}</span>
        </div>
        <div className="transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
};
