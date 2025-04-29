"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const bodyParts = [
  { id: "neck", name: "Neck", position: { top: "5%", left: "50%" } },
  { id: "shoulder_l", name: "Left Shoulder", position: { top: "15%", left: "35%" } },
  { id: "shoulder_r", name: "Right Shoulder", position: { top: "15%", left: "65%" } },
  { id: "back_upper", name: "Upper Back", position: { top: "20%", left: "50%" } },
  { id: "elbow_l", name: "Left Elbow", position: { top: "30%", left: "25%" } },
  { id: "elbow_r", name: "Right Elbow", position: { top: "30%", left: "75%" } },
  { id: "back_lower", name: "Lower Back", position: { top: "35%", left: "50%" } },
  { id: "wrist_l", name: "Left Wrist", position: { top: "40%", left: "20%" } },
  { id: "wrist_r", name: "Right Wrist", position: { top: "40%", left: "80%" } },
  { id: "hip_l", name: "Left Hip", position: { top: "45%", left: "40%" } },
  { id: "hip_r", name: "Right Hip", position: { top: "45%", left: "60%" } },
  { id: "knee_l", name: "Left Knee", position: { top: "60%", left: "40%" } },
  { id: "knee_r", name: "Right Knee", position: { top: "60%", left: "60%" } },
  { id: "ankle_l", name: "Left Ankle", position: { top: "80%", left: "40%" } },
  { id: "ankle_r", name: "Right Ankle", position: { top: "80%", left: "60%" } },
];

export const InjuryLocationSelector = ({ onSelect, selectedLocations = [] }) => {
  const [selected, setSelected] = useState(selectedLocations);

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  const toggleBodyPart = (partId) => {
    setSelected((prev) => {
      if (prev.includes(partId)) {
        return prev.filter((id) => id !== partId);
      } else {
        return [...prev, partId];
      }
    });
  };

  return (
    <div className="w-full p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg text-white mb-1">Select your injury locations</h3>
        <p className="text-sm text-gray-400">Tap on the body parts where you have injuries</p>
      </div>

      <div className="relative h-[500px] mx-auto">
        {/* Body outline image */}
        <div className="relative h-full w-full flex justify-center">
          <div className="h-full relative">
            <Image
              src="/images/body-outline.png"
              alt="Body outline"
              width={280}
              height={500}
              className="opacity-70"
            />
          </div>
        </div>

        {/* Interactive markers */}
        {bodyParts.map((part) => (
          <button
            key={part.id}
            onClick={() => toggleBodyPart(part.id)}
            className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              selected.includes(part.id)
                ? "bg-red-500 scale-110"
                : "bg-white bg-opacity-30 hover:bg-opacity-50"
            }`}
            style={{
              top: part.position.top,
              left: part.position.left,
            }}
            aria-label={part.name}
          />
        ))}
      </div>

      {/* Selected body parts list */}
      <div className="mt-4">
        <h4 className="text-white mb-2">Selected injuries:</h4>
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <p className="text-gray-400 text-sm">No injuries selected</p>
          ) : (
            bodyParts
              .filter((part) => selected.includes(part.id))
              .map((part) => (
                <div
                  key={part.id}
                  className="bg-[#333] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{part.name}</span>
                  <button
                    onClick={() => toggleBodyPart(part.id)}
                    className="w-4 h-4 flex items-center justify-center ml-1 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

