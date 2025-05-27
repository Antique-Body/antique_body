import { useState, useEffect, useRef } from "react";

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
      <div className="flex justify-between mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-zinc-400">$</span>
          </div>
          <input
            type="number"
            value={localValues[0]}
            onChange={handleInputChange(0)}
            onBlur={handleInputBlur}
            min={min}
            max={localValues[1] - 5}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-7 pr-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-zinc-400">$</span>
          </div>
          <input
            type="number"
            value={localValues[1]}
            onChange={handleInputChange(1)}
            onBlur={handleInputBlur}
            min={localValues[0] + 5}
            max={max}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-7 pr-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
          />
        </div>
      </div>

      <div className="relative h-8">
        {/* Track */}
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
            className={`absolute w-5 h-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full cursor-grab top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg ${isDragging === "min" ? "ring-2 ring-[#FF6B00]/40 cursor-grabbing" : ""}`}
            style={{ left: `${minPercent}%` }}
            onMouseDown={handleMouseDown("min")}
            onTouchStart={handleMouseDown("min")}
          />

          {/* Max handle */}
          <div
            className={`absolute w-5 h-5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full cursor-grab top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg ${isDragging === "max" ? "ring-2 ring-[#FF6B00]/40 cursor-grabbing" : ""}`}
            style={{ left: `${maxPercent}%` }}
            onMouseDown={handleMouseDown("max")}
            onTouchStart={handleMouseDown("max")}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-zinc-400 mt-1">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};
