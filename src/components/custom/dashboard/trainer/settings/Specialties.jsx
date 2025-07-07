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
    className="space-y-8 p-4 mx-6"
  >
    <SectionTitle title="Specialties & Training Types" />

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
