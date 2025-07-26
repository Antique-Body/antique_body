"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";


import { EffectBackground } from "@/components/background";
import { Button, Footer, BrandLogo, FormField } from "@/components/common";
import { ProfileImageUpload, LocationStep } from "@/components/custom/shared";
import { UPLOAD_CONFIG } from "@/config/upload";
import { usePrefillFromSession } from "@/hooks";

import { useTrainerRegistration } from "../../../hooks/useTrainerRegistration";

const TrainerRegistration = () => {
  const { formData, errors, loading, handleChange, handleSubmit } =
    useTrainerRegistration();
  const { data: session } = useSession();

  // Generate year options for trainer experience
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Prefill form data from session if available
  usePrefillFromSession({
    formData,
    onChange: handleChange,
    fields: [
      { formKey: "firstName", sessionKey: "firstName" },
      { formKey: "lastName", sessionKey: "lastName" },
    ],
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <EffectBackground />

      <div className="relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <BrandLogo />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Personal Details</h1>
            <p className="text-zinc-400">Complete your profile information</p>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon icon="mdi:account" className="w-5 h-5 text-[#FF6B00]" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName ?? session?.user?.firstName ?? ""}
                    placeholder="Your first name"
                    onChange={handleChange}
                    error={errors.firstName}
                    backgroundStyle="darker"
                  />

                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName ?? session?.user?.lastName ?? ""}
                    placeholder="Your last name"
                    onChange={handleChange}
                    error={errors.lastName}
                    backgroundStyle="darker"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    backgroundStyle="darker"
                  />

                  <FormField
                    label="Gender"
                    name="gender"
                    type="select"
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                    backgroundStyle="darker"
                    options={[
                      { value: "", label: "Select gender" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
                </div>

                {/* Trainer Since */}
                <FormField
                  label="Trainer Since (Year)"
                  name="trainerSince"
                  type="select"
                  value={formData.trainerSince}
                  onChange={handleChange}
                  error={errors.trainerSince}
                  backgroundStyle="darker"
                  options={[
                    { value: "", label: "Select year" },
                    ...yearOptions.map((year) => ({
                      value: year.toString(),
                      label: year.toString(),
                    })),
                  ]}
                />

                {/* Experience calculation display */}
                {formData.trainerSince && (
                  <div className="p-4 rounded-xl border border-[#FF6B00]/20 bg-[#FF6B00]/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF6B00]/20 rounded-xl flex items-center justify-center">
                        <Icon
                          icon="mdi:calendar-clock"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FF6B00]">
                          {currentYear - Number.parseInt(formData.trainerSince)}{" "}
                          years of experience
                        </p>
                        <p className="text-sm text-zinc-400">
                          Trainer since {formData.trainerSince}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <LocationStep
              formData={formData}
              onChange={handleChange}
              errors={errors}
              userType="trainer"
            />
            {/* Profile Image */}

            <ProfileImageUpload
              image={formData.profileImage}
              onImageChange={(file) => {
                handleChange({
                  target: { name: "profileImage", value: file },
                });
              }}
              guidelines={[
                "Professional headshot with neutral background",
                "Clear, well-lit, and focused on your face",
                `JPG, PNG, or GIF format (max ${UPLOAD_CONFIG.profileImage.maxSize}MB)`,
              ]}
              guidelineHelpText="A professional profile photo helps build trust with potential clients."
              error={errors?.profileImage}
              inputId="profile-image-upload"
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#E65A00] hover:to-[#FF6B00] px-6 py-3"
                rightIcon={
                  loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" className="w-5 h-5" />
                  )
                }
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TrainerRegistration;
