import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
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

export const BasicInformation = ({
  trainerData,
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

    {/* Contact Info */}
    <motion.div variants={fadeInUp}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Email"
          name="contactEmail"
          type="email"
          value={trainerData.contactEmail || ""}
          onChange={handleChange}
          placeholder="Your contact email"
          required
          backgroundStyle="semi-transparent"
        />
        <FormField
          label="Phone"
          name="contactPhone"
          value={trainerData.contactPhone || ""}
          onChange={handleChange}
          placeholder="Your contact phone"
          backgroundStyle="semi-transparent"
        />
      </div>
    </motion.div>

    {/* Pricing Section */}
    <motion.div variants={fadeInUp}>
      <div className="space-y-4">
        <FormField
          label="Pricing Approach"
          name="pricingType"
          type="select"
          value={trainerData.pricingType || ""}
          onChange={handleChange}
          options={[
            { value: "", label: "Select pricing approach" },
            { value: "fixed", label: "Fixed Rate - Set My Price" },
            { value: "negotiable", label: "Negotiable - Will Discuss" },
            { value: "package_deals", label: "Package Deals Available" },
            { value: "contact_for_pricing", label: "Contact for Pricing" },
            { value: "free_consultation", label: "Free Consultation First" },
            { value: "prefer_not_to_say", label: "Prefer Not to Display" },
          ]}
          backgroundStyle="semi-transparent"
        />

        {/* Show price fields only for specific pricing types */}
        {(trainerData.pricingType === "fixed" ||
          trainerData.pricingType === "package_deals") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              label={
                trainerData.pricingType === "package_deals"
                  ? "Starting Price per Session"
                  : "Price per Session"
              }
              name="pricePerSession"
              type="number"
              value={trainerData.pricePerSession || ""}
              onChange={handleChange}
              placeholder="50"
              min="0"
              step="5"
              backgroundStyle="semi-transparent"
            />

            <FormField
              label="Currency"
              name="currency"
              type="select"
              value={trainerData.currency || "EUR"}
              onChange={handleChange}
              options={[
                { value: "BAM", label: "BAM - Bosnian Mark" },
                { value: "RSD", label: "RSD - Serbian Dinar" },
                { value: "EUR", label: "EUR - Euro" },
                { value: "USD", label: "USD - US Dollar" },
                { value: "GBP", label: "GBP - British Pound" },
              ]}
              backgroundStyle="semi-transparent"
            />
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);
