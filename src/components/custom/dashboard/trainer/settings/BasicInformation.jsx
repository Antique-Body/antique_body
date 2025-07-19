import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LanguageSelector } from "@/components/custom/personal-details/shared/LanguageSelector";
import { ProfileImageUpload } from "@/components/custom/shared";

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

export const TrainerBasicInformation = ({
  trainerData,
  handleChange,
  previewImage,
  handleImageUpload,
  setTrainerData,
}) => {
  // Helper function to normalize languages data
  const normalizeLanguages = (languages) => {
    if (!languages || languages.length === 0) return [];

    // If languages is an array of objects with 'name' property, extract names
    if (typeof languages[0] === "object" && languages[0].name) {
      return languages.map((lang) => lang.name);
    }

    // If languages is already an array of strings, return as is
    if (typeof languages[0] === "string") {
      return languages;
    }

    // Fallback to empty array
    return [];
  };

  // Get normalized languages
  const normalizedLanguages = normalizeLanguages(trainerData.languages);

  // Handler for LanguageSelector
  const handleLanguagesChange = (langs) => {
    if (setTrainerData) {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          languages: langs,
        },
      }));
    } else if (handleChange) {
      handleChange({ target: { name: "languages", value: langs } });
    }
  };

  // Generate year options for trainer experience
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="px-4">
        <SectionTitle title="Basic Information" />

        {/* Profile Picture */}
        <motion.div variants={fadeInUp}>
          <ProfileImageUpload
            image={previewImage || trainerData.profileImage}
            onImageChange={handleImageUpload}
            guidelines={[
              "Professional headshot with neutral background",
              "Clear, well-lit, and focused on your face",
              "JPG, PNG, or GIF format (max 1MB)",
            ]}
            guidelineHelpText="A professional profile photo helps build trust with clients"
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
              value={trainerData.firstName || ""}
              onChange={handleChange}
              placeholder="Your first name"
              required
              backgroundStyle="semi-transparent"
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={trainerData.lastName || ""}
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
              value={trainerData.dateOfBirth || ""}
              onChange={handleChange}
              required
              backgroundStyle="semi-transparent"
            />
            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={trainerData.gender || ""}
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
        </motion.div>

        {/* Description (moved from AboutYou) */}
        <motion.div variants={fadeInUp}>
          <FormField
            label="Trainer Since (Year)"
            name="trainerSince"
            type="select"
            value={trainerData.trainerSince || ""}
            onChange={handleChange}
            options={[
              { value: "", label: "Select year" },
              ...yearOptions.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              })),
            ]}
            required
            className=""
            backgroundStyle="semi-transparent"
          />
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={trainerData.description}
            onChange={handleChange}
            placeholder="Describe your background and experience..."
            rows={5}
            backgroundStyle="semi-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">
            Tell clients about your background, specialties, and what makes you
            unique as a trainer (250-300 words recommended)
          </p>
        </motion.div>

        {/* Languages Section */}
        <motion.div variants={fadeInUp}>
          <div className="mb-2 font-medium text-gray-300 mt-4">
            Languages you speak
          </div>
          <LanguageSelector
            selectedLanguages={normalizedLanguages}
            onChange={handleLanguagesChange}
          />
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <FormField
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={trainerData.contactEmail || ""}
              onChange={handleChange}
              placeholder="Your contact email"
              required
              backgroundStyle="semi-transparent"
            />
            <FormField
              label="Contact Phone"
              name="contactPhone"
              value={trainerData.contactPhone || ""}
              onChange={handleChange}
              placeholder="Your contact phone"
              backgroundStyle="semi-transparent"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
