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
    className="space-y-4 "
  >
    <SectionTitle title="Specialties & Training Types" />

    {/* Specialty Selector */}
    <motion.div
      variants={fadeInUp}
      className="p-4 sm:p-5 lg:p-6 bg-[rgba(25,25,25,0.6)] border border-[rgba(255,107,0,0.2)] rounded-xl sm:rounded-2xl backdrop-blur-sm hover:border-[rgba(255,107,0,0.3)] transition-all duration-300"
    >
      <h3 className="text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4 flex items-center">
        <span className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#FF8A00]/20 inline-flex items-center justify-center mr-2 sm:mr-3 border border-[#FF6B00]/20">
          <span className="text-[#FF6B00] text-xs sm:text-sm font-bold">1</span>
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
      className="p-4 sm:p-5 lg:p-6 bg-[rgba(25,25,25,0.6)] border border-[rgba(255,107,0,0.2)] rounded-xl sm:rounded-2xl backdrop-blur-sm hover:border-[rgba(255,107,0,0.3)] transition-all duration-300"
    >
      <h3 className="text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4 flex items-center">
        <span className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#FF8A00]/20 inline-flex items-center justify-center mr-2 sm:mr-3 border border-[#FF6B00]/20">
          <span className="text-[#FF6B00] text-xs sm:text-sm font-bold">2</span>
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
