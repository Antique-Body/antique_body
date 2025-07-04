"use client";
import { Icon } from "@iconify/react";

import { useClientRegistration } from "../../../hooks/useClientRegistration";

import { EffectBackground } from "@/components/background";
import { Button, Footer, BrandLogo } from "@/components/common";
import { ArrowRight, ArrowLeft } from "@/components/common/Icons";
import {
  BasicInfoStep,
  GoalsAndPreferencesStep,
  ContactAndLocationStep,
  ProfileSetupStep,
  StepProgressBar,
} from "@/components/custom/personal-details/shared";

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
    handleProfileImageChange,
  } = useClientRegistration();

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      icon: "mdi:account-circle",
      component: BasicInfoStep,
    },
    {
      id: 2,
      title: "Goals & Preferences",
      icon: "mdi:target",
      component: GoalsAndPreferencesStep,
    },
    {
      id: 3,
      title: "Contact & Location",
      icon: "mdi:map-marker",
      component: ContactAndLocationStep,
    },
    {
      id: 4,
      title: "Profile & Bio",
      icon: "mdi:account-edit",
      component: ProfileSetupStep,
    },
  ];

  const currentStepData = steps[step - 1];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-black text-white">
      <EffectBackground />

      <div className="relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <BrandLogo />
          </div>

          {/* Step Progress Bar */}
          <StepProgressBar steps={steps} currentStep={step} />

          {/* Form content */}
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
            <CurrentStepComponent
              formData={formData}
              onChange={handleChange}
              onProfileImageChange={handleProfileImageChange}
              errors={errors}
              userType="client"
            />

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 border-t border-zinc-800/50">
              {/* Back button */}
              {step > 1 ? (
                <Button
                  onClick={goToPrevStep}
                  variant="secondary"
                  className="bg-zinc-800/50 hover:bg-zinc-700 border-zinc-700/50"
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {/* Next/Complete button */}
              {step < steps.length ? (
                <Button
                  onClick={goToNextStep}
                  variant="primary"
                  className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#E65A00] hover:to-[#FF6B00]"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#E65A00] hover:to-[#FF6B00]"
                  rightIcon={
                    loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Icon icon="mdi:check" className="w-4 h-4" />
                    )
                  }
                  onClick={handleSubmit}
                >
                  {loading ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </form>

          {/* Minimal tip */}
          <div className="mt-10 sm:mt-12">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
              <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-blue-400 mb-1 text-sm">
                  Quick Tip
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {step === 1 &&
                    "Be honest about your fitness level - this helps us match you with the right trainer."}
                  {step === 2 &&
                    "Clear goals help trainers create personalized workout plans for better results."}
                  {step === 3 &&
                    "Adding your location helps us find trainers near you for in-person sessions."}
                  {step === 4 &&
                    "A complete profile helps trainers understand who they'll be working with."}
                </p>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;
