import { motion } from "framer-motion";
import React from "react";

import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LocationSelector as BaseLocationSelector } from "@/components/custom/personal-details/shared/LocationSelector";

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

export const ClientLocation = ({ clientData, setClientData }) => {
  console.log(clientData, "clientData");
  // Handler for location fields
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name.replace("location.", "")]: value,
      },
    }));
  };
  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SectionTitle title="Location" />
      <motion.div variants={fadeInUp}>
        <BaseLocationSelector
          formData={clientData}
          onChange={handleLocationChange}
          errors={{}}
          title=""
          description="Where are you based? This helps trainers find you."
        />
      </motion.div>
    </motion.div>
  );
};
