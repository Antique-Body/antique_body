"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

const specialtyOptions = [
  { id: "weight-loss", label: "Weight Loss", icon: "mdi:scale-bathroom" },
  { id: "muscle-building", label: "Muscle Building", icon: "mdi:arm-flex" },
  { id: "strength-training", label: "Strength Training", icon: "mdi:dumbbell" },
  { id: "cardio-fitness", label: "Cardio Fitness", icon: "mdi:heart-pulse" },
  {
    id: "functional-training",
    label: "Functional Training",
    icon: "mdi:human-handsup",
  },
  { id: "sports-performance", label: "Sports Performance", icon: "mdi:trophy" },
  { id: "rehabilitation", label: "Rehabilitation", icon: "mdi:medical-bag" },
  { id: "yoga-pilates", label: "Yoga/Pilates", icon: "mdi:yoga" },
  { id: "crossfit", label: "CrossFit", icon: "mdi:weight-lifter" },
  { id: "bodybuilding", label: "Bodybuilding", icon: "mdi:account-muscle" },
  { id: "powerlifting", label: "Powerlifting", icon: "mdi:weight" },
  { id: "martial-arts", label: "Martial Arts", icon: "mdi:karate" },
  { id: "dance-fitness", label: "Dance Fitness", icon: "mdi:dance-ballroom" },
  {
    id: "senior-fitness",
    label: "Senior Fitness",
    icon: "mdi:account-supervisor",
  },
  { id: "youth-training", label: "Youth Training", icon: "mdi:account-child" },
];

export const SpecialtySelector = ({ selectedSpecialties = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpecialties = specialtyOptions.filter((specialty) =>
    specialty.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpecialtyToggle = (specialtyId) => {
    const newSelection = selectedSpecialties.includes(specialtyId)
      ? selectedSpecialties.filter((id) => id !== specialtyId)
      : [...selectedSpecialties, specialtyId];

    onChange(newSelection);
  };

  const getSelectedSpecialtyLabels = () =>
    selectedSpecialties
      .map((id) => specialtyOptions.find((spec) => spec.id === id)?.label)
      .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Icon
          icon="mdi:magnify"
          width={18}
          height={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm placeholder-gray-400 focus:border-[#FF6B00] focus:outline-none transition-colors"
        />
      </div>

      {/* Specialty Pills */}
      <div className="flex flex-wrap gap-2">
        {filteredSpecialties.map((specialty) => {
          const isSelected = selectedSpecialties.includes(specialty.id);

          return (
            <button
              key={specialty.id}
              type="button"
              onClick={() => handleSpecialtyToggle(specialty.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25 scale-105"
                  : "bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#FF6B00]/50 hover:text-white hover:bg-[#FF6B00]/10"
              }`}
            >
              <Icon
                icon={specialty.icon}
                width={16}
                height={16}
                className={isSelected ? "text-white" : "text-gray-400"}
              />
              <span>{specialty.label}</span>
              {isSelected && (
                <Icon
                  icon="mdi:check"
                  width={14}
                  height={14}
                  className="text-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Count & Clear All */}
      {selectedSpecialties.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:check-circle"
              width={16}
              height={16}
              className="text-[#FF6B00]"
            />
            <span className="text-sm text-[#FF6B00] font-medium">
              {selectedSpecialties.length} specialt
              {selectedSpecialties.length === 1 ? "y" : "ies"} selected
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredSpecialties.length === 0 && searchTerm && (
        <div className="text-center py-6 text-gray-400">
          <Icon
            icon="mdi:magnify"
            width={24}
            height={24}
            className="mx-auto mb-2 opacity-50"
          />
          <p className="text-sm">
            No specialties found matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* Selected Specialties Preview */}
      {selectedSpecialties.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Selected Specialties:
          </h4>
          <div className="flex flex-wrap gap-1">
            {getSelectedSpecialtyLabels().map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-xs rounded-md font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
