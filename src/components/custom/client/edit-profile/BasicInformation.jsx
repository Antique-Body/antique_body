import { motion } from "framer-motion";
import Image from "next/image";

import { UserProfileIcon } from "@/components/common/Icons";
import { FormField, SectionTitle } from "@/components/shared";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerItems = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const BasicInformation = ({ clientData, handleChange, previewImage, handleImageUpload }) => (
  <motion.div className="space-y-6" variants={staggerItems} initial="hidden" animate="visible">
    <SectionTitle title="Basic Information" />

    {/* Profile Picture */}
    <motion.div variants={fadeInUp} className="flex flex-col items-start gap-6 md:flex-row">
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
          <UserProfileIcon size={64} className="text-white transition-transform duration-300 group-hover:scale-110" />
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
          subLabel="Upload a profile photo that clearly shows your face"
          className="mb-0"
        />
      </div>
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Full Name"
        name="name"
        value={clientData.name}
        onChange={handleChange}
        placeholder="Your full name"
        required
        backgroundStyle="semi-transparent"
      />

      <FormField
        label="Age"
        name="age"
        type="number"
        value={clientData.age}
        onChange={handleChange}
        placeholder="Your age"
        required
        backgroundStyle="semi-transparent"
      />
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative">
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={clientData.gender}
          onChange={handleChange}
          options={["Male", "Female", "Non-binary", "Prefer not to say"]}
          placeholder="Select your gender"
          required
          backgroundStyle="semi-transparent"
        />
        <div className="absolute -bottom-1 h-px w-full bg-gradient-to-r from-transparent via-[#FF7800]/30 to-transparent"></div>
      </div>

      <div className="relative">
        <FormField
          label="Bio"
          name="bio"
          type="textarea"
          value={clientData.bio}
          onChange={handleChange}
          placeholder="Share your fitness journey, goals, or what motivates you..."
          rows={3}
          backgroundStyle="semi-transparent"
        />
        <div className="absolute -bottom-1 h-px w-full bg-gradient-to-r from-transparent via-[#FF7800]/30 to-transparent"></div>
      </div>
    </motion.div>

    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Contact Information
    </motion.h3>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="group relative overflow-hidden rounded-lg border border-[#333]">
        <FormField
          label="Email"
          name="contact.email"
          type="email"
          value={clientData.contact.email}
          onChange={handleChange}
          placeholder="Your contact email"
          required
          backgroundStyle="semi-transparent"
        />
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FF7800] to-[#FF9A00] transition-all duration-500 group-hover:w-full"></div>
      </div>

      <div className="group relative overflow-hidden rounded-lg border border-[#333]">
        <FormField
          label="Phone"
          name="contact.phone"
          value={clientData.contact.phone}
          onChange={handleChange}
          placeholder="Your contact phone"
          backgroundStyle="semi-transparent"
        />
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FF7800] to-[#FF9A00] transition-all duration-500 group-hover:w-full"></div>
      </div>
    </motion.div>

    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Location
    </motion.h3>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField
        label="City"
        name="location.city"
        value={clientData.location.city}
        onChange={handleChange}
        placeholder="Your city"
        required
        backgroundStyle="semi-transparent"
      />

      <FormField
        label="State/Province"
        name="location.state"
        value={clientData.location.state}
        onChange={handleChange}
        placeholder="Your state/province"
        required
        backgroundStyle="semi-transparent"
      />

      <FormField
        label="Country"
        name="location.country"
        value={clientData.location.country}
        onChange={handleChange}
        placeholder="Your country"
        required
        backgroundStyle="semi-transparent"
      />
    </motion.div>

    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Fitness Background
    </motion.h3>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[rgba(20,20,20,0.8)] to-[rgba(30,30,30,0.8)] p-0.5">
        <FormField
          label="Fitness Level"
          name="fitnessLevel"
          type="select"
          value={clientData.fitnessLevel}
          onChange={handleChange}
          options={["Beginner", "Intermediate", "Advanced", "Professional"]}
          placeholder="Select your fitness level"
          backgroundStyle="transparent"
        />
        <div
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "linear-gradient(45deg, rgba(255,120,0,0.1), rgba(255,120,0,0))" }}
        ></div>
      </div>

      <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[rgba(20,20,20,0.8)] to-[rgba(30,30,30,0.8)] p-0.5">
        <FormField
          label="Activity Level"
          name="activityLevel"
          type="select"
          value={clientData.activityLevel}
          onChange={handleChange}
          options={[
            "Sedentary (office job)",
            "Lightly active",
            "Moderately active",
            "Very active",
            "Extremely active (physical job)",
          ]}
          placeholder="Select your typical activity level"
          backgroundStyle="transparent"
        />
        <div
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "linear-gradient(45deg, rgba(255,120,0,0.1), rgba(255,120,0,0))" }}
        ></div>
      </div>
    </motion.div>
  </motion.div>
);
