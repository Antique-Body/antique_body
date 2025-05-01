"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import bodyOutline from "../../../public/images/body-outline.png";

const bodyParts = [
  // Front View (Left side of image)
  { id: "head", name: "Head", position: { top: "10%", left: "27.5%" } },
  { id: "neck", name: "Neck", position: { top: "18%", left: "27.5%" } },
  { id: "chest", name: "Chest", position: { top: "25%", left: "27.5%" } },
  { id: "shoulder_l", name: "Left Shoulder", position: { top: "22%", left: "17%" } },
  { id: "shoulder_r", name: "Right Shoulder", position: { top: "22%", left: "38%" } },
  { id: "bicep_l", name: "Left Bicep", position: { top: "29%", left: "16%" } },
  { id: "bicep_r", name: "Right Bicep", position: { top: "29%", left: "38%" } },
  { id: "forearm_l", name: "Left Forearm", position: { top: "42%", left: "14%" } },
  { id: "forearm_r", name: "Right Forearm", position: { top: "42%", left: "42%" } },
  { id: "abdomen", name: "Abdomen", position: { top: "36%", left: "27%" } },
  { id: "hip_l", name: "Left Hip", position: { top: "45%", left: "20%" } },
  { id: "hip_r", name: "Right Hip", position: { top: "45%", left: "35%" } },
  { id: "quad_l", name: "Left Quad", position: { top: "52%", left: "22%" } },
  { id: "quad_r", name: "Right Quad", position: { top: "52%", left: "33%" } },
  { id: "knee_l", name: "Left Knee", position: { top: "67%", left: "22%" } },
  { id: "knee_r", name: "Right Knee", position: { top: "67%", left: "33%" } },
  { id: "ankle_l", name: "Left Ankle", position: { top: "92%", left: "22%" } },
  { id: "ankle_r", name: "Right Ankle", position: { top: "92%", left: "33%" } },

  // Back View (Right side of image)
  { id: "upper_back", name: "Upper Back", position: { top: "15%", left: "72%" } },
  { id: "lower_back", name: "Lower Back", position: { top: "30%", left: "72%" } },
  { id: "back_shoulder_l", name: "Left Back Shoulder", position: { top: "20%", left: "62%" } },
  { id: "back_shoulder_r", name: "Right Back Shoulder", position: { top: "20%", left: "83%" } },
  { id: "tricep_l", name: "Left Tricep", position: { top: "30%", left: "62%" } },
  { id: "tricep_r", name: "Right Tricep", position: { top: "30%", left: "83%" } },
  { id: "glute_l", name: "Left Glute", position: { top: "45%", left: "67%" } },
  { id: "glute_r", name: "Right Glute", position: { top: "45%", left: "77%" } },
  { id: "hamstring_l", name: "Left Hamstring", position: { top: "55%", left: "67%" } },
  { id: "hamstring_r", name: "Right Hamstring", position: { top: "55%", left: "77%" } },
  { id: "calf_back_l", name: "Left Calf", position: { top: "75%", left: "66%" } },
  { id: "calf_back_r", name: "Right Calf", position: { top: "75%", left: "78%" } },
  { id: "achilles_l", name: "Left Achilles", position: { top: "85%", left: "67%" } },
  { id: "achilles_r", name: "Right Achilles", position: { top: "85%", left: "78%" } }
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
              src={bodyOutline}
              alt="Body outline"
              width='24rem'
              height={500}
              className="opacity-70"
              priority
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

