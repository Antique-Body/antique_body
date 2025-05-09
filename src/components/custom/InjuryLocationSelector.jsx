"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import bodyOutline from "../../../public/images/body-outline.png";

const bodyParts = [
  // Front View (Left side of image)
  { id: "head", name: "training_setup.injury.locations.head", position: { top: "10%", left: "29.5%" } },
  { id: "neck", name: "training_setup.injury.locations.neck", position: { top: "18%", left: "29.5%" } },
  { id: "chest", name: "training_setup.injury.locations.chest", position: { top: "25%", left: "29.5%" } },
  { id: "shoulder_l", name: "training_setup.injury.locations.shoulder_left", position: { top: "22%", left: "19%" } },
  { id: "shoulder_r", name: "training_setup.injury.locations.shoulder_right", position: { top: "22%", left: "40%" } },
  { id: "bicep_l", name: "training_setup.injury.locations.bicep_left", position: { top: "29%", left: "18%" } },
  { id: "bicep_r", name: "training_setup.injury.locations.bicep_right", position: { top: "29%", left: "40%" } },
  { id: "forearm_l", name: "training_setup.injury.locations.forearm_left", position: { top: "42%", left: "16%" } },
  { id: "forearm_r", name: "training_setup.injury.locations.forearm_right", position: { top: "42%", left: "44%" } },
  { id: "abdomen", name: "training_setup.injury.locations.abdomen", position: { top: "36%", left: "29%" } },
  { id: "hip_l", name: "training_setup.injury.locations.hip_left", position: { top: "45%", left: "22%" } },
  { id: "hip_r", name: "training_setup.injury.locations.hip_right", position: { top: "45%", left: "37%" } },
  { id: "quad_l", name: "training_setup.injury.locations.quad_left", position: { top: "52%", left: "24%" } },
  { id: "quad_r", name: "training_setup.injury.locations.quad_right", position: { top: "52%", left: "35%" } },
  { id: "knee_l", name: "training_setup.injury.locations.knee_left", position: { top: "67%", left: "24%" } },
  { id: "knee_r", name: "training_setup.injury.locations.knee_right", position: { top: "67%", left: "35%" } },
  { id: "ankle_l", name: "training_setup.injury.locations.ankle_left", position: { top: "92%", left: "24%" } },
  { id: "ankle_r", name: "training_setup.injury.locations.ankle_right", position: { top: "92%", left: "35%" } },

  // Back View (Right side of image)
  { id: "upper_back", name: "training_setup.injury.locations.upper_back", position: { top: "15%", left: "70%" } },
  { id: "lower_back", name: "training_setup.injury.locations.lower_back", position: { top: "30%", left: "70%" } },
  { id: "back_shoulder_l", name: "training_setup.injury.locations.back_shoulder_left", position: { top: "20%", left: "60%" } },
  { id: "back_shoulder_r", name: "training_setup.injury.locations.back_shoulder_right", position: { top: "20%", left: "81%" } },
  { id: "tricep_l", name: "training_setup.injury.locations.tricep_left", position: { top: "30%", left: "60%" } },
  { id: "tricep_r", name: "training_setup.injury.locations.tricep_right", position: { top: "30%", left: "81%" } },
  { id: "glute_l", name: "training_setup.injury.locations.glute_left", position: { top: "45%", left: "65%" } },
  { id: "glute_r", name: "training_setup.injury.locations.glute_right", position: { top: "45%", left: "75%" } },
  { id: "hamstring_l", name: "training_setup.injury.locations.hamstring_left", position: { top: "55%", left: "65%" } },
  { id: "hamstring_r", name: "training_setup.injury.locations.hamstring_right", position: { top: "55%", left: "75%" } },
  { id: "calf_back_l", name: "training_setup.injury.locations.calf_left", position: { top: "75%", left: "64%" } },
  { id: "calf_back_r", name: "training_setup.injury.locations.calf_right", position: { top: "75%", left: "76%" } },
  { id: "achilles_l", name: "training_setup.injury.locations.achilles_left", position: { top: "85%", left: "65%" } },
  { id: "achilles_r", name: "training_setup.injury.locations.achilles_right", position: { top: "85%", left: "76%" } }
];

export const InjuryLocationSelector = ({ onSelect, selectedLocations = [] }) => {
  const { t } = useTranslation();
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
        <h3 className="text-lg text-white mb-1">{t("training_setup.injury.select_locations")}</h3>
        <p className="text-sm text-gray-400">{t("training_setup.injury.tap_locations")}</p>
      </div>

      <div className="relative h-[500px] mx-auto">
        {/* Body outline image */}
        <div className="relative h-full w-full flex justify-center">
          <div className="h-full relative">
            <Image
              src={bodyOutline}
              alt={t("training_setup.injury.body_outline")}
              width="24rem"
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
            aria-label={t(part.name)}
          />
        ))}
      </div>

      {/* Selected body parts list */}
      <div className="mt-4">
        <h4 className="text-white mb-2">{t("training_setup.injury.selected_injuries")}:</h4>
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <p className="text-gray-400 text-sm">{t("training_setup.injury.no_injuries_selected")}</p>
          ) : (
            bodyParts
              .filter((part) => selected.includes(part.id))
              .map((part) => (
                <div
                  key={part.id}
                  className="bg-[#333] px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{t(part.name)}</span>
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

