import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { ProfileImageUpload } from "@/components/custom/shared";
import { EXPERIENCE_LEVELS } from "@/enums";

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

export const ClientBasicInformation = ({
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

    {/* Contact Information */}
    <motion.div variants={fadeInUp}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contact Email"
            name="email"
            type="email"
            value={clientData.email || ""}
            onChange={handleChange}
            placeholder="your.email@example.com"
            backgroundStyle="semi-transparent"
          />
          <FormField
            label="Contact Phone"
            name="phone"
            type="tel"
            value={clientData.phone || ""}
            onChange={handleChange}
            placeholder="+1234567890"
            backgroundStyle="semi-transparent"
          />
        </div>
      </div>
    </motion.div>

    {/* Fitness Experience */}
    <motion.div variants={fadeInUp}>
      <div className="space-y-4">
        <FormField
          label="Experience Level"
          name="experienceLevel"
          type="select"
          value={clientData.experienceLevel || ""}
          onChange={handleChange}
          options={[
            { value: "", label: "Select your experience level" },
            ...EXPERIENCE_LEVELS,
          ]}
          backgroundStyle="semi-transparent"
        />
        <FormField
          label="Previous Activities"
          name="previousActivities"
          type="textarea"
          value={clientData.previousActivities || ""}
          onChange={handleChange}
          placeholder="Describe any previous fitness activities or sports you've participated in..."
          rows={3}
          backgroundStyle="semi-transparent"
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        This information helps trainers understand your fitness background and
        tailor workouts accordingly.
      </p>
    </motion.div>
  </motion.div>
);
