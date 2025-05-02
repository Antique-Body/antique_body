import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/common/Button";
import { UserProfileIcon, CertificateIcon, TrashIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

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
  <motion.div variants={staggerItems} initial="hidden" animate="visible" className="space-y-6">
    <motion.h2
      variants={fadeInUp}
      className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-xl font-semibold text-transparent"
    >
      Basic Information
    </motion.h2>

    {/* Profile Picture */}
    <motion.div variants={fadeInUp} className="flex flex-col items-start gap-6 md:flex-row">
      <div className="group relative flex h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-3xl font-semibold text-white shadow-lg shadow-orange-800/20">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="Profile preview"
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <UserProfileIcon size={64} className="m-auto text-white opacity-90" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-sm font-medium text-white">Change Photo</span>
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
        <p className="mt-2 text-xs text-gray-400">Your profile photo helps clients recognize you and builds trust</p>
      </div>
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Full Name"
        name="name"
        value={trainerData.name}
        onChange={handleChange}
        placeholder="Your full name"
        required
      />

      <FormField
        label="Specialty"
        name="specialty"
        value={trainerData.specialty}
        onChange={handleChange}
        placeholder="Your main area of specialization"
        required
      />
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Experience"
        name="experience"
        value={trainerData.experience}
        onChange={handleChange}
        placeholder="e.g. 5 years"
        required
      />

      <FormField
        label="Hourly Rate ($)"
        name="hourlyRate"
        type="number"
        value={trainerData.hourlyRate}
        onChange={handleChange}
        placeholder="Your hourly rate"
        required
      />
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Email"
        name="contact.email"
        type="email"
        value={trainerData.contact.email}
        onChange={handleChange}
        placeholder="Your contact email"
        required
      />

      <FormField
        label="Phone"
        name="contact.phone"
        value={trainerData.contact.phone}
        onChange={handleChange}
        placeholder="Your contact phone"
      />
    </motion.div>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField
        label="City"
        name="location.city"
        value={trainerData.location.city}
        onChange={handleChange}
        placeholder="Your city"
        required
      />

      <FormField
        label="State/Province"
        name="location.state"
        value={trainerData.location.state}
        onChange={handleChange}
        placeholder="Your state/province"
        required
      />

      <FormField
        label="Country"
        name="location.country"
        value={trainerData.location.country}
        onChange={handleChange}
        placeholder="Your country"
        required
      />
    </motion.div>

    {/* Certifications Section */}
    <motion.div variants={fadeInUp}>
      <h3 className="mb-3 text-lg font-medium">Certifications</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {trainerData.certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 rounded-full border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-3 py-1.5 text-sm font-medium text-[#FF6B00] shadow-sm transition-all duration-200 hover:border-[rgba(255,107,0,0.5)] hover:bg-[rgba(255,107,0,0.2)]"
          >
            <CertificateIcon size={14} className="mr-1" />
            <span>{cert}</span>
            <Button
              type="button"
              onClick={() => removeCertification(index)}
              className="ml-1 rounded-full p-1 text-[#FF6B00] transition-colors hover:bg-[rgba(255,107,0,0.3)]"
              variant="ghost"
              size="small"
              leftIcon={<TrashIcon size={12} />}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <FormField
          name="newCertification"
          value={newCertification}
          onChange={e => setNewCertification(e.target.value)}
          placeholder="Add new certification"
          className="mb-0 flex-1"
        />
        <Button
          type="button"
          variant="orangeOutline"
          onClick={addCertification}
          disabled={!newCertification.trim()}
          className="transition-all duration-300 hover:shadow-md hover:shadow-orange-900/10"
        >
          Add
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-400">Add certifications to build credibility with potential clients</p>
    </motion.div>
  </motion.div>
);
