import { useState, useEffect, useRef } from "react";
import { FormField } from "@/components/common/FormField";

export const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [localValues, setLocalValues] = useState(value);
  const [isDragging, setIsDragging] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    setLocalValues(value);
  }, [value]);

  const handleMouseDown = (handle) => (e) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging !== null && trackRef.current) {
        const trackRect = trackRef.current.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const trackLeft = trackRect.left;

        // Calculate percentage position
        const percent = Math.max(
          0,
          Math.min(1, (e.clientX - trackLeft) / trackWidth)
        );

        // Calculate value based on percentage
        const value = min + Math.round(percent * (max - min));

        // Update the appropriate handle
        if (isDragging === "min") {
          const newMin = Math.min(value, localValues[1] - 5);
          setLocalValues([newMin, localValues[1]]);
        } else {
          const newMax = Math.max(value, localValues[0] + 5);
          setLocalValues([localValues[0], newMax]);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging !== null) {
        setIsDragging(null);
        onChange(localValues[0], localValues[1]);
      }
    };

    if (isDragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, localValues, min, max, onChange]);

  const getPercent = (value) => ((value - min) / (max - min)) * 100;

  const minPercent = getPercent(localValues[0]);
  const maxPercent = getPercent(localValues[1]);

  const handleInputChange = (index) => (e) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    const newValues = [...localValues];

    if (index === 0) {
      newValues[0] = Math.min(newValue, newValues[1] - 5);
    } else {
      newValues[1] = Math.max(newValue, newValues[0] + 5);
    }

    setLocalValues(newValues);
  };

  const handleInputBlur = () => {
    onChange(localValues[0], localValues[1]);
  };

  return (
    <div className="mb-4">
      {/* Range slider track */}
      <div className="relative h-8 mb-6">
        <div
          ref={trackRef}
          className="absolute h-1 bg-zinc-700 rounded-full w-full top-1/2 transform -translate-y-1/2"
        >
          {/* Range highlight */}
          <div
            className="absolute h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />

          {/* Min handle */}
          <div
            className={`absolute w-5 h-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full cursor-grab top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:ring-4 hover:ring-[#FF6B00]/20 transition-all ${
              isDragging === "min"
                ? "ring-4 ring-[#FF6B00]/40 cursor-grabbing scale-110"
                : ""
            }`}
            style={{ left: `${minPercent}%` }}
            onMouseDown={handleMouseDown("min")}
            onTouchStart={handleMouseDown("min")}
          />

          {/* Max handle */}
          <div
            className={`absolute w-5 h-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full cursor-grab top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:ring-4 hover:ring-[#FF6B00]/20 transition-all ${
              isDragging === "max"
                ? "ring-4 ring-[#FF6B00]/40 cursor-grabbing scale-110"
                : ""
            }`}
            style={{ left: `${maxPercent}%` }}
            onMouseDown={handleMouseDown("max")}
            onTouchStart={handleMouseDown("max")}
          />
        </div>
      </div>

      {/* Price range inputs and labels */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1.5">
            Min Price
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-zinc-700/50 border border-zinc-700 rounded-l-lg">
              <span className="text-zinc-400">$</span>
            </div>
            <FormField
              type="number"
              name="minPrice"
              value={localValues[0]}
              onChange={handleInputChange(0)}
              onBlur={handleInputBlur}
              min={min}
              max={localValues[1] - 5}
              className="mb-0 pl-8 py-1.5 rounded-lg bg-zinc-800/80 border-zinc-700"
            />
          </div>
        </div>

        <div className="pt-5">
          <div className="w-6 h-0.5 bg-zinc-700"></div>
        </div>

        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1.5">
            Max Price
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-zinc-700/50 border border-zinc-700 rounded-l-lg">
              <span className="text-zinc-400">$</span>
            </div>
            <FormField
              type="number"
              name="maxPrice"
              value={localValues[1]}
              onChange={handleInputChange(1)}
              onBlur={handleInputBlur}
              min={localValues[0] + 5}
              max={max}
              className="mb-0 pl-8 py-1.5 rounded-lg bg-zinc-800/80 border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Price range indicators */}
      <div className="flex justify-between text-xs text-zinc-400 mt-3">
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
          <span>${min}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
          <span>${max}</span>
        </div>
      </div>
    </div>
  );
};
