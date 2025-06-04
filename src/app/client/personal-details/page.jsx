"use client";
import { useClientRegistration } from "../../../hooks/useClientRegistration";

import { EffectBackground } from "@/components/background";
import { Button, Footer } from "@/components/common";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Card } from "@/components/common/Card";
import { ArrowRight } from "@/components/common/Icons";
import { StepProgressBar } from "@/components/common/StepProgressBar";
import {
  BasicInfoStep,
  FitnessGoalsStep,
  ProfileAndContactStep,
  ProfileSetupStep,
} from "@/components/custom/personal-details/client";
import { TipsSection } from "@/components/custom/personal-details/shared";

const ClientRegistration = () => {
  const {
    formData,
    errors,
    step,
    loading,
    handleChange,
    handleSubmit,
    goToNextStep,
    goToPrevStep,
  } = useClientRegistration();

  return (
    <div className="relative min-h-screen text-white">
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
            {step === 2 && "Fitness Goals"}
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
              />
            )}

            {/* Step 2: Fitness Goals */}
            {step === 2 && (
              <FitnessGoalsStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            {/* Step 3: Contact & Location */}
            {step === 3 && (
              <ProfileAndContactStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            {/* Step 4: Profile Setup */}
            {step === 4 && (
              <ProfileSetupStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
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
                <div></div>
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
                  {loading ? "Saving..." : "Find Your Trainer"}
                </Button>
              )}
            </div>
          </form>
        </Card>
        <TipsSection step={step} userType="client" />

        <Footer />
      </div>
    </div>
  );
};

export default ClientRegistration;
