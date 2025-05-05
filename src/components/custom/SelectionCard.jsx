"use client";

import { useTranslation } from "react-i18next";

import { Card } from "..";

export const SelectionCard = ({
  selected,
  onClick,
  emoji,
  title,
  description,
  bgImage,
  className = "",
  aspect = "aspect-[4/3]",
  icon
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={`relative ${aspect} overflow-hidden cursor-pointer ${className}`}
      borderTop={false}
      borderColor={selected ? "#FF7800" : "#222"}
      shadow={selected ? "0 0 20px rgba(255, 120, 0, 0.2)" : "0 5px 15px rgba(0,0,0,0.2)"}
      bgGradientFrom="rgba(20,20,20,0.8)"
      bgGradientTo="rgba(20,20,20,0.8)"
      padding="0"
      width="100%"
      onClick={onClick}
      // Hover props
      hoverTranslateY="-3px"
      hoverBorderColor="#FF7800"
      hoverShadow="0 5px 15px rgba(255,120,0,0.15)"
      {...(bgImage && {
        style: {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      })}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold mb-2">{t(title)}</h3>
        <p className="text-sm text-[#aaa]">{t(description)}</p>
      </div>
    </Card>
  );
};