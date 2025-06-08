import { motion } from "framer-motion";
import React from "react";

import { SectionTitle } from "@/components/custom/dashboard/shared";
import { SpecialtySelector } from "@/components/custom/personal-details/shared/SpecialtySelector";
import { TrainingTypeSelector } from "@/components/custom/personal-details/shared/TrainingTypeSelector";

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
      staggerChildren: 0.1,
    },
  },
};

export const Specialties = ({ trainerData, handleChange, setTrainerData }) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    <SectionTitle title="Specialties & Training Types" />

    {/* Specialty Selector */}
    <motion.div variants={fadeInUp}>
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
    <motion.div variants={fadeInUp} className="mt-8">
      <TrainingTypeSelector
        selectedEnvironment={
          trainerData.trainerProfile.trainingEnvironments?.[0] || ""
        }
        selectedTypes={trainerData.trainerProfile.trainingTypes || []}
        onEnvironmentChange={(environment) => {
          setTrainerData({
            ...trainerData,
            trainerProfile: {
              ...trainerData.trainerProfile,
              trainingEnvironments: [environment],
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
