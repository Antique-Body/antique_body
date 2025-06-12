import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";

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

export const HealthInfo = ({ clientData, handleChange }) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    <SectionTitle title="Health Information" />
    <motion.div variants={fadeInUp}>
      <FormField
        label="Medical Conditions"
        name="medicalConditions"
        type="textarea"
        value={clientData.medicalConditions || ""}
        onChange={handleChange}
        placeholder="List any medical conditions, injuries, or health concerns that may affect your training..."
        rows={3}
        backgroundStyle="semi-transparent"
      />
    </motion.div>
    <motion.div variants={fadeInUp}>
      <FormField
        label="Allergies"
        name="allergies"
        type="textarea"
        value={clientData.allergies || ""}
        onChange={handleChange}
        placeholder="List any allergies or sensitivities..."
        rows={2}
        backgroundStyle="semi-transparent"
      />
    </motion.div>
    <p className="text-xs text-gray-400 mt-3">
      This information will only be shared with trainers you choose to work with
      to ensure your safety.
    </p>
  </motion.div>
);
