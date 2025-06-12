import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
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
  const [isAdding, setIsAdding] = useState(false);

  // Gym search using Google Places API
  const gymAsyncSearch = async (query) => {
    const lat = trainerData.trainerProfile.location?.lat;
    const lon = trainerData.trainerProfile.location?.lon;
    if (!lat || !lon) return [];
    return searchGyms(query, lat, lon);
  };

  // Gyms list (max 3)
  const gyms = Array.isArray(trainerData.trainerProfile.location.gyms)
    ? trainerData.trainerProfile.location.gyms
    : [];

  // Add gym to list
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
    setIsAdding(false);
  };

  // Remove gym from list
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

      {/* Gyms Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Training Locations
          </h3>
          {gyms.length < 3 && !isAdding && (
            <Button
              type="button"
              variant="outlineGradient"
              size="small"
              onClick={() => setIsAdding(true)}
              className="group transition-all"
              leftIcon={
                <Icon
                  icon="material-symbols:add-circle"
                  className="text-[#FF6B00] group-hover:text-white"
                  width={18}
                  height={18}
                />
              }
            >
              Add Gym
            </Button>
          )}
        </div>

        {/* Description text */}
        <p className="text-sm text-gray-400">
          Add up to 3 gyms or fitness centers where you train clients. This
          helps clients find trainers who work at their preferred locations.
        </p>

        {/* Selected gyms list */}
        {gyms.length > 0 && (
          <div className="mt-4 space-y-3">
            {gyms.map((gym, idx) => (
              <motion.div
                key={gym.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center rounded-lg bg-gradient-to-r from-[#222]/80 to-[#111]/80 border border-[#FF6B00]/20 p-3 backdrop-blur-sm"
              >
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00]/10">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-[#FF6B00]"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{gym.label}</div>
                  <div className="text-xs text-gray-400 truncate max-w-md">
                    {gym.address}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveGym(idx)}
                  className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="Remove gym"
                >
                  <Icon
                    icon="mdi:close-circle-outline"
                    width={20}
                    height={20}
                  />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add gym form */}
        {gyms.length < 3 && isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-lg border border-[#FF6B00]/30 bg-black/40 p-4 backdrop-blur-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-[#FF6B00]">
                Add Training Location
              </h4>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Cancel adding gym"
              >
                <Icon icon="mdi:close" width={18} height={18} />
              </Button>
            </div>

            <FormField
              label=""
              name="gym"
              type="searchableSelect"
              value={""}
              asyncSearch={gymAsyncSearch}
              onSelectOption={handleAddGym}
              onChange={() => {}}
              placeholder="Start typing gym name..."
              className="mb-2"
              inputClassName="border-[#FF6B00]/30 focus:border-[#FF6B00] bg-black/30"
            />

            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => setIsAdding(false)}
                className="mr-2 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="orangeFilled"
                size="small"
                disabled={true}
                className="opacity-50"
              >
                Add Location
              </Button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <Icon
                icon="mdi:information-outline"
                className="mr-1 inline"
                width={14}
                height={14}
              />
              Search for your gym by name and select it from the dropdown. If
              your location isn't found, try a more general search.
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {gyms.length === 0 && !isAdding && (
          <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-gray-700 bg-black/20 p-6 text-center">
            <div className="mb-3 rounded-full bg-[#FF6B00]/10 p-3">
              <Icon
                icon="mdi:map-marker-plus"
                className="text-[#FF6B00]"
                width={24}
                height={24}
              />
            </div>
            <h4 className="mb-1 font-medium text-white">
              No Training Locations Added
            </h4>
            <p className="mb-4 text-sm text-gray-400">
              Add gyms or fitness centers where you train clients
            </p>
            <Button
              type="button"
              variant="outlineGradient"
              onClick={() => setIsAdding(true)}
              leftIcon={
                <Icon icon="material-symbols:add" width={18} height={18} />
              }
            >
              Add Your First Location
            </Button>
          </div>
        )}

        {/* Help text for max limit */}
        {gyms.length === 3 && (
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Icon
              icon="mdi:information-outline"
              className="mr-1"
              width={14}
              height={14}
            />
            Maximum of 3 locations reached
          </div>
        )}
      </div>
    </motion.div>
  );
};
