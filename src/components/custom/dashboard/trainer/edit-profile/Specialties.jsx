import { motion } from "framer-motion";
import React from "react";

import { SectionTitle } from "@/components/custom/dashboard/shared";
import {
  SpecialtySelector,
  TrainingTypeSelector,
} from "@/components/custom/shared";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const Specialties = ({ trainerData, handleChange, setTrainerData }) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-8"
  >
    <SectionTitle title="Specialties & Training Types" />

    {/* Stats Overview */}
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
            <span className="text-[#FF6B00] text-xl font-bold">
              {trainerData.trainerProfile.specialties?.length || 0}
            </span>
          </div>
          <div>
            <h3 className="text-gray-300 font-medium">Specialties</h3>
            <p className="text-xs text-gray-400">Selected expertise areas</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
            <span className="text-[#FF6B00] text-xl font-bold">
              {trainerData.trainerProfile.trainingTypes?.length || 0}
            </span>
          </div>
          <div>
            <h3 className="text-gray-300 font-medium">Training Types</h3>
            <p className="text-xs text-gray-400">Types of training offered</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
            <span className="text-[#FF6B00] text-xl font-bold">1</span>
          </div>
          <div>
            <h3 className="text-gray-300 font-medium">Environment</h3>
            <p className="text-xs text-gray-400">
              {trainerData.trainerProfile.trainingEnvironment
                ? "Set"
                : "Not set yet"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Specialty Selector */}
    <motion.div
      variants={fadeInUp}
      className="p-6 bg-[rgba(25,25,25,0.5)] border border-[#333] rounded-lg"
    >
      <h3 className="text-base font-medium text-gray-300 mb-4 flex items-center">
        <span className="w-8 h-8 rounded-full bg-[#FF6B00]/20 inline-flex items-center justify-center mr-2">
          <span className="text-[#FF6B00]">1</span>
        </span>
        Specialties
      </h3>

      <SpecialtySelector
        selectedSpecialties={trainerData.trainerProfile.specialties || []}
        onChange={(specialties) =>
          handleChange({
            target: { name: "specialties", value: specialties },
          })
        }
      />
    </motion.div>

    {/* Training Types Selector */}
    <motion.div
      variants={fadeInUp}
      className="p-6 bg-[rgba(25,25,25,0.5)] border border-[#333] rounded-lg"
    >
      <h3 className="text-base font-medium text-gray-300 mb-4 flex items-center">
        <span className="w-8 h-8 rounded-full bg-[#FF6B00]/20 inline-flex items-center justify-center mr-2">
          <span className="text-[#FF6B00]">2</span>
        </span>
        Training Setup
      </h3>

      <TrainingTypeSelector
        selectedEnvironment={
          trainerData.trainerProfile.trainingEnvironment || ""
        }
        selectedTypes={trainerData.trainerProfile.trainingTypes || []}
        onEnvironmentChange={(environment) => {
          setTrainerData({
            ...trainerData,
            trainerProfile: {
              ...trainerData.trainerProfile,
              trainingEnvironment: environment,
            },
          });
        }}
        onTypeToggle={(type) => {
          const currentTypes = trainerData.trainerProfile.trainingTypes || [];
          const updatedTypes = currentTypes.includes(type)
            ? currentTypes.filter((t) => t !== type)
            : [...currentTypes, type];

          setTrainerData({
            ...trainerData,
            trainerProfile: {
              ...trainerData.trainerProfile,
              trainingTypes: updatedTypes,
            },
          });
        }}
      />
    </motion.div>
  </motion.div>
);
