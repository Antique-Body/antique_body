"use client";

import { Icon } from '@iconify/react';
import { useTranslation } from "react-i18next";
import { Card } from "..";

export const FrequencySelector = ({ selectedFrequency, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
        <Card
          key={num}
          className={`p-0 cursor-pointer transition-all duration-300 ${selectedFrequency === num ? 'scale-105' : ''}`}
          padding="0"
          width="100%"
          maxWidth="none"
          borderRadius="15px"
          bgGradientFrom={selectedFrequency === num ? "rgba(30,30,30,0.95)" : "rgba(20,20,20,0.8)"}
          bgGradientTo={selectedFrequency === num ? "rgba(30,30,30,0.95)" : "rgba(20,20,20,0.8)"}
          borderColor={selectedFrequency === num ? "#FF7800" : "#222"}
          shadow={selectedFrequency === num ? "0 0 20px rgba(255, 120, 0, 0.3)" : "none"}
          hoverTranslateY="-3px"
          hoverBorderColor="#FF7800"
          hoverBgGradientFrom="rgba(25,25,25,0.9)"
          hoverBgGradientTo="rgba(25,25,25,0.9)"
          hoverShadow="0 8px 20px rgba(255,120,0,0.2)"
          onClick={() => onSelect(num)}
        >
          <div className="py-5 px-2 flex flex-col items-center text-center">
            <div className={`font-bold text-3xl ${selectedFrequency === num ? 'text-[#FF7800]' : ''} transition-colors duration-300`}>
              {num}
            </div>
            <div className="text-xs text-[#aaa] mt-2">
              {t("training_setup.frequency.times_per_week", { count: num })}
            </div>
            {selectedFrequency === num && (
              <div className="absolute top-2 right-2 text-[#FF7800]">
                <Icon icon="mdi:check-circle" width="20" height="20" />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};