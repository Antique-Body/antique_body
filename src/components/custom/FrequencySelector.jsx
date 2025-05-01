import { CheckIcon } from "@components/common";
import { Card } from "..";

export const FrequencySelector = ({ selectedFrequency, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
        <Card
          key={num}
          className={`p-0 cursor-pointer`}
          padding="0"
          width="100%"
          maxWidth="none"
          borderRadius="15px"
          bgGradientFrom="rgba(20,20,20,0.8)"
          bgGradientTo="rgba(20,20,20,0.8)"
          borderColor={selectedFrequency === num ? "#FF7800" : "#222"}
          shadow={selectedFrequency === num ? "0 0 20px rgba(255, 120, 0, 0.2)" : "none"}
          hoverTranslateY="-3px"
          hoverBorderColor="#FF7800"
          hoverShadow="0 5px 15px rgba(255,120,0,0.15)"
          onClick={() => onSelect(num)}
        >
          <div className="py-4 px-2 flex flex-col items-center text-center">
            <div className="font-bold text-2xl">{num}</div>
            <div className="text-xs text-[#aaa] mt-1">
              {num === 1 ? "time" : "times"} per week
            </div>
            {selectedFrequency === num && (
              <div className="absolute top-2 right-2 text-[#FF7800]">
                <CheckIcon />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};