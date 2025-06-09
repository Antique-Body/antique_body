import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LocationSelector as BaseLocationSelector } from "@/components/custom/personal-details/shared/LocationSelector";
import { searchGyms } from "@/lib/googlePlaces";

// Custom LocationSelector that allows manual entry for state/country
const LocationSelector = ({ trainerData, setTrainerData, errors }) => {
  // Generic handler for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prev) => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        location: {
          ...prev.trainerProfile.location,
          [name.replace("location.", "")]: value,
        },
      },
    }));
  };

  return (
    <BaseLocationSelector
      formData={trainerData.trainerProfile}
      onChange={handleChange}
      errors={errors}
      title="Location"
      description="Where are you based? This helps clients find you."
      cityFieldProps={{
        onSelectOption: (option) => {
          setTrainerData((prev) => ({
            ...prev,
            trainerProfile: {
              ...prev.trainerProfile,
              location: {
                ...prev.trainerProfile.location,
                city: option.city || option.label || "",
                lat: option.lat,
                lon: option.lon,
                state: option.state || "",
                country: option.country || "",
              },
            },
          }));
        },
      }}
    />
  );
};

export const WorkoutSpaceLocation = ({
  trainerData,
  setTrainerData,
  errors = {},
}) => {
  // Gym search using Google Places API
  const gymAsyncSearch = async (query) => {
    const lat = trainerData.trainerProfile.location?.lat;
    const lon = trainerData.trainerProfile.location?.lon;
    if (!lat || !lon) return [];
    return searchGyms(query, lat, lon);
  };

  // Gymovi: lista gymova (max 3)
  const gyms = Array.isArray(trainerData.trainerProfile.location.gyms)
    ? trainerData.trainerProfile.location.gyms
    : [];

  // Dodaj gym u listu
  const handleAddGym = (gym) => {
    if (!gym || gyms.length >= 3) return;
    if (gyms.some((g) => g.value === gym.value)) return;
    setTrainerData((prev) => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        location: {
          ...prev.trainerProfile.location,
          gyms: [...gyms, gym],
        },
      },
    }));
  };

  // Ukloni gym iz liste
  const handleRemoveGym = (idx) => {
    setTrainerData((prev) => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        location: {
          ...prev.trainerProfile.location,
          gyms: gyms.filter((_, i) => i !== idx),
        },
      },
    }));
  };

  return (
    <motion.div className="space-y-6">
      <SectionTitle title="Workout Space & Location" />
      {/* Location Selector */}
      <LocationSelector
        trainerData={trainerData}
        setTrainerData={setTrainerData}
        errors={errors}
      />
      {/* Gymovi lista */}
      <div className="space-y-2">
        {gyms.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium text-[#FF6B00]">
              Selected Gyms:
            </span>
            <ul className="mt-2 space-y-1">
              {gyms.map((gym, idx) => (
                <li
                  key={gym.value}
                  className="flex items-center gap-2 bg-[#222]/60 border border-[#FF6B00]/20 rounded px-3 py-2"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">{gym.label}</div>
                    <div className="text-xs text-gray-400">{gym.address}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-2 text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveGym(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Dodaj gym ako ima mjesta */}
        {gyms.length < 3 && (
          <FormField
            label={
              gyms.length === 0 ? "Gym / Fitness Center" : "Add Another Gym"
            }
            name="gym"
            type="searchableSelect"
            value={""}
            asyncSearch={gymAsyncSearch}
            onSelectOption={handleAddGym}
            onChange={() => {}}
            placeholder="Start typing gym name..."
            subLabel="Select the gym or fitness center where you train."
          />
        )}
      </div>
    </motion.div>
  );
};
