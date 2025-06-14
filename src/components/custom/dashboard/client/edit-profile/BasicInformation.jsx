import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { ProfileImageUpload } from "@/components/custom/shared";

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

export const BasicInformation = ({
  clientData,
  handleChange,
  previewImage,
  handleImageUpload,
}) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    <SectionTitle title="Basic Information" />
    {/* Profile Picture */}
    <motion.div variants={fadeInUp}>
      <ProfileImageUpload
        image={previewImage || clientData.profileImage}
        onImageChange={handleImageUpload}
        guidelines={[
          "Choose a clear photo that shows your face",
          "Well-lit with a simple background",
          "JPG, PNG, or GIF format (max 1MB)",
        ]}
        guidelineHelpText="A profile photo helps trainers recognize you and personalizes your experience."
        inputId="profile-image"
        label={null}
        description={null}
      />
    </motion.div>
    {/* Personal Info */}
    <motion.div variants={fadeInUp}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={clientData.firstName || ""}
          onChange={handleChange}
          placeholder="Your first name"
          required
          backgroundStyle="semi-transparent"
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={clientData.lastName || ""}
          onChange={handleChange}
          placeholder="Your last name"
          required
          backgroundStyle="semi-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={clientData.dateOfBirth || ""}
          onChange={handleChange}
          required
          backgroundStyle="semi-transparent"
        />
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={clientData.gender || ""}
          onChange={handleChange}
          options={[
            { value: "", label: "Select gender" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          required
          backgroundStyle="semi-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label="Height (cm)"
          name="height"
          type="number"
          value={clientData.height || ""}
          onChange={handleChange}
          placeholder="Enter your height in cm"
          min="100"
          max="250"
          required
          backgroundStyle="semi-transparent"
        />
        <FormField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={clientData.weight || ""}
          onChange={handleChange}
          placeholder="Enter your weight in kg"
          min="30"
          max="250"
          required
          backgroundStyle="semi-transparent"
        />
      </div>
    </motion.div>
    {/* Description/Bio */}
    <motion.div variants={fadeInUp}>
      <FormField
        label="About Me"
        name="description"
        type="textarea"
        value={clientData.description || ""}
        onChange={handleChange}
        placeholder="Tell trainers about yourself and your fitness journey..."
        rows={5}
        backgroundStyle="semi-transparent"
      />
      <p className="mt-1 text-xs text-gray-400">
        Help trainers understand your background, goals, and what you're looking
        for in a coach.
      </p>
    </motion.div>
  </motion.div>
);
