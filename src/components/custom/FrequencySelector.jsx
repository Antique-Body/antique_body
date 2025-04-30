import { CheckIcon } from "@components/common";

import { Card } from "..";

export const FrequencySelector = ({ selectedFrequency, onSelect }) => (
  <div className="grid grid-cols-3 gap-3">
    {[1, 2, 3, 4, 5, 6, 7].map(num => (
      <div
        key={num}
        className={`relative border-2 bg-[rgba(20,20,20,0.8)] ${
          selectedFrequency === num ? "border-[#FF7800]" : "border-[#222]"
        } flex cursor-pointer flex-col items-center rounded-xl px-2 py-4 text-center transition-all duration-300 hover:translate-y-[-3px] hover:border-[#FF7800] hover:shadow-[0_5px_15px_rgba(255,120,0,0.15)]`}
        onClick={() => onSelect(num)}
        style={{
          boxShadow: selectedFrequency === num ? "0 0 20px rgba(255, 120, 0, 0.2)" : "none",
        }}
      >
        <div className="text-2xl font-bold">{num}</div>
        <div className="mt-1 text-xs text-[#aaa]">{num === 1 ? "time" : "times"} per week</div>
        {selectedFrequency === num && (
          <div className="absolute right-2 top-2 text-[#FF7800]">
            <CheckIcon />
          </div>
        )}
      </div>
    ))}
  </div>
);
