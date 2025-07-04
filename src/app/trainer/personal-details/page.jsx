"use client";
import { useTrainerRegistration } from "../../../hooks/useTrainerRegistration";

import { EffectBackground } from "@/components/background";
import { Button, Footer } from "@/components/common";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Card } from "@/components/common/Card";
import { ArrowRight } from "@/components/common/Icons";
import { StepProgressBar } from "@/components/common/StepProgressBar";
import {
  TipsSection,
  BasicInfoStep,
  ProfessionalDetailsStep,
  ContactAndLocationStep,
  ProfileSetupStep,
} from "@/components/custom/personal-details/shared";

const TrainerRegistration = () => {
  const {
    formData,
    errors,
    step,
    loading,
    handleChange,
    handleCertChange,
    addCertField,
    removeCertField,
    handleSubmit,
    goToNextStep,
    goToPrevStep,
    handleProfileImageChange,
  } = useTrainerRegistration();

  return (
    <div className="relative min-h-screen  text-white">
      <EffectBackground />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-center py-4">
          <BrandLogo />
        </header>

        {/* Progress Bar */}
        <StepProgressBar currentStep={step} totalSteps={4} />

        <Card
          variant="darkStrong"
          hover={true}
          width="100%"
          maxWidth="none"
          className="mb-12 md:p-8"
        >
          <h1 className="mb-6 text-2xl font-bold md:text-3xl">
            {step === 1 && "Basic Information"}
            {step === 2 && "Professional Details"}
            {step === 3 && "Contact & Location"}
            {step === 4 && "Profile Setup"}
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <BasicInfoStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
                userType="trainer"
              />
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <ProfessionalDetailsStep
                formData={formData}
                onChange={handleChange}
                certFields={formData.certifications}
                handleCertChange={handleCertChange}
                addCertField={addCertField}
                removeCertField={removeCertField}
                errors={errors}
              />
            )}

            {/* Step 3: Contact & Location */}
            {step === 3 && (
              <ContactAndLocationStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
                userType="trainer"
              />
            )}

            {/* Step 4: Profile Setup */}
            {step === 4 && (
              <ProfileSetupStep
                formData={formData}
                onChange={handleChange}
                onProfileImageChange={handleProfileImageChange}
                errors={errors}
                userType="trainer"
                titleText="Profile Image"
                descriptionText="Upload your professional photo that clients will see"
                bioPlaceholder="Write a brief description about yourself, your training philosophy, and what makes you unique as a trainer..."
                guidelines={[
                  "Professional headshot with neutral background",
                  "Clear, well-lit, and focused on your face",
                  "JPG, PNG, or GIF format (max 1MB)",
                ]}
                guidelineHelpText="A professional profile photo helps build trust with potential clients."
              />
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button
                  onClick={goToPrevStep}
                  variant="secondary"
                  type="button"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button onClick={goToNextStep} type="button">
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  rightIcon={
                    loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    ) : (
                      <ArrowRight size={20} />
                    )
                  }
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>
        </Card>
        <TipsSection step={step} userType="trainer" />

        <Footer />
      </div>
    </div>
  );
};

export default TrainerRegistration;
