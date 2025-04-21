import React from "react";
import { CheckIcon } from "./Icons";

const FrequencySelector = ({ selectedFrequency, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
        <div
          key={num}
          className={`relative bg-[rgba(20,20,20,0.8)] border-2 ${
            selectedFrequency === num
              ? "border-[#FF7800]"
              : "border-[#222]"
          } rounded-xl py-4 px-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center hover:translate-y-[-3px] hover:border-[#FF7800] hover:shadow-[0_5px_15px_rgba(255,120,0,0.15)]`}
          onClick={() => onSelect(num)}
          style={{
            boxShadow:
              selectedFrequency === num
                ? "0 0 20px rgba(255, 120, 0, 0.2)"
                : "none",
          }}>
          <div className="font-bold text-2xl">{num}</div>
          <p className="text-xs text-[#aaa] mt-1">
            {num === 1 ? "day" : "days"}/week
          </p>
          {selectedFrequency === num && (
            <div className="absolute top-2 right-2">
              <CheckIcon size={16} className="text-[#FF7800]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FrequencySelector; 