import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LocationSelector } from "@/components/custom/personal-details/shared/LocationSelector";

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
}) => {
  const triggerFileInput = () => {
    document.getElementById("profile-image").click();
  };

  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SectionTitle title="Basic Information" />

      {/* Profile Picture */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col items-start gap-6 md:flex-row"
      >
        <div className="bg-[rgba(30,30,30,0.6)] rounded-lg border border-[#333] p-6 w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Image and upload controls */}
            <div className="flex flex-col items-center">
              {/* Profile image */}
              <div
                className="relative cursor-pointer"
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#444] hover:border-[#FF6B00]/50 transition-all duration-300">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#282828] to-[#1a1a1a] flex items-center justify-center">
                      <div className="text-center flex flex-col items-center">
                        <Icon
                          icon="mdi:account"
                          width={50}
                          height={50}
                          className="text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-2">Add Photo</p>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  {previewImage && isHovering && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Icon
                        icon="mdi:camera"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Icon icon="mdi:camera" width={16} height={16} />
                  {previewImage ? "Change" : "Upload"}
                </button>

                {previewImage && (
                  <button
                    type="button"
                    onClick={() => handleImageUpload(null)}
                    className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:delete" width={16} height={16} />
                    Remove
                  </button>
                )}
              </div>

              {/* Status text */}
              {previewImage && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <Icon icon="mdi:check-circle" width={14} height={14} />
                  Photo uploaded
                </p>
              )}
            </div>

            {/* Right side - Guidelines */}
            <div className="flex-1">
              <div className="p-4 bg-[#222] rounded-lg">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:information-outline"
                    width={18}
                    height={18}
                    className="text-[#FF6B00]"
                  />
                  Photo Guidelines
                </h3>

                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    Professional headshot with neutral background
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    Clear, well-lit, and focused on your face
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    JPG, PNG, or GIF format (max 1MB)
                  </li>
                </ul>

                <p className="mt-3 text-xs text-gray-400 border-t border-[#333] pt-3">
                  A professional profile photo helps build trust with clients
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="profile-image"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
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

      {/* Location Selector */}
      <motion.div variants={fadeInUp}>
        <LocationSelector
          formData={trainerData}
          onChange={handleChange}
          errors={{}}
          title="Location"
          description="Where are you based? This helps clients find you."
        />
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
};
