import Image from "next/image";

import { Button } from "@/components/common/Button";
import { UserProfileIcon, CertificateIcon, TrashIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

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
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-[#FF6B00]">Basic Information</h2>

    {/* Profile Picture */}
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-3xl font-semibold text-white">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="Profile preview"
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserProfileIcon size={64} className="text-white" />
        )}
      </div>

      <div className="flex-1">
        <FormField
          type="file"
          id="profile-image"
          name="profileImage"
          accept="image/*"
          onChange={handleImageUpload}
          subLabel="Upload a professional photo for your profile"
          className="mb-0"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
    </div>

    {/* Certifications Section */}
    <div>
      <h3 className="mb-3 text-lg font-medium">Certifications</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {trainerData.certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]"
          >
            <CertificateIcon size={12} />
            <span>{cert}</span>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="ml-1 rounded-full p-1 text-[#FF6B00] hover:bg-[rgba(255,107,0,0.3)]"
            >
              <TrashIcon size={10} />
            </button>
          </div>
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
        <Button type="button" variant="secondary" onClick={addCertification} disabled={!newCertification.trim()}>
          Add
        </Button>
      </div>
    </div>
  </div>
);
