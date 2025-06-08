import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LocationSelector } from "@/components/custom/personal-details/shared/LocationSelector";
import { SpecialtySelector } from "@/components/custom/personal-details/shared/SpecialtySelector";

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
  newCertification,
  setNewCertification,
  addCertification,
  removeCertification,
}) => (
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
      <div className="group relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF7800] to-[#FF9A00] text-3xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/30">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="Profile preview"
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon
            icon="lucide:user"
            width={64}
            className="text-white transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs font-medium text-white">Change photo</span>
        </div>
      </div>

      <div className="flex-1">
        <FormField
          type="file"
          id="profile-image"
          name="profileImage"
          accept="image/*"
          onChange={handleImageUpload}
          subLabel="Upload a professional photo for your profile - high quality headshot recommended"
          className="mb-0"
        />
        <p className="mt-2 text-xs text-gray-400">
          Your profile photo helps clients recognize you and builds trust
        </p>
      </div>
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

    {/* Specialty Selector */}
    <motion.div variants={fadeInUp}>
      <SpecialtySelector
        selectedSpecialties={trainerData.specialties || []}
        onChange={(specialties) =>
          handleChange({
            target: { name: "specialties", value: specialties },
          })
        }
      />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <FormField
          label="Price per Session"
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
    </motion.div>

    {/* Certifications Section */}
    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Certifications
    </motion.h3>

    <motion.div variants={fadeInUp}>
      <div className="mb-4 flex flex-wrap gap-2">
        {trainerData.certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 rounded-full border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.15)] px-3 py-1.5 text-sm font-medium text-[#FF7800] shadow-sm transition-all duration-200 hover:border-[rgba(255,120,0,0.5)] hover:bg-[rgba(255,120,0,0.2)]"
          >
            <Icon icon="lucide:certificate" width={14} className="mr-1" />
            <span>{cert}</span>
            <Button
              type="button"
              onClick={() => removeCertification(index)}
              className="ml-1 rounded-full p-1 text-[#FF7800] transition-colors hover:bg-[rgba(255,120,0,0.3)]"
              variant="ghost"
              size="small"
              leftIcon={<Icon icon="lucide:trash-2" width={12} />}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <FormField
            name="newCertification"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add new certification"
            className="mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="orangeFilled"
            onClick={addCertification}
            disabled={!newCertification.trim()}
            className="group overflow-hidden transition-all duration-300"
            leftIcon={
              <Icon
                icon="lucide:trash-2"
                width={16}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            }
          >
            Add
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Add certifications to build credibility with potential clients
      </p>
    </motion.div>
  </motion.div>
);
