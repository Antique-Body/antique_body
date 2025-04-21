import React from "react";

const SelectionCard = ({
  selected,
  onClick,
  emoji,
  title,
  description,
  bgImage,
  className = "",
  aspect = "aspect-[4/3]",
}) => {
  return (
    <div
      className={`relative bg-[rgba(20,20,20,0.8)] border-2 ${
        selected ? "border-[#FF7800]" : "border-[#222]"
      } rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${aspect} overflow-hidden hover:translate-y-[-3px] hover:border-[#FF7800] hover:shadow-[0_5px_15px_rgba(255,120,0,0.15)] ${className}`}
      onClick={onClick}
      style={{
        boxShadow: selected ? "0 0 20px rgba(255, 120, 0, 0.2)" : "none",
      }}>
      {bgImage && (
        <div
          className="absolute top-0 left-0 w-full h-3/5 bg-contain bg-center bg-no-repeat opacity-20"
          style={{
            filter: "blur(2px)",
            backgroundImage: `url("${bgImage}")`,
          }}></div>
      )}
      <div className={`${bgImage ? "relative z-10 pt-14" : ""}`}>
        <div className="text-3xl mb-2">{emoji}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-[#aaa] leading-snug">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SelectionCard;
