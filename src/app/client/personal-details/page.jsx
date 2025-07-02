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
      title: "Basic Info",
      subtitle: "Tell us about yourself",
      icon: "mdi:account",
      component: BasicInfoStep,
    },
    {
      id: 2,
      title: "Goals & Preferences",
      subtitle: "What are your fitness goals?",
      icon: "mdi:target",
      component: GoalsAndPreferencesStep,
    },
    {
      id: 3,
      title: "Contact & Location",
      subtitle: "How can trainers reach you?",
      icon: "mdi:map-marker",
      component: ContactAndLocationStep,
    },
    {
      id: 4,
      title: "Profile Setup",
      subtitle: "Complete your profile",
      icon: "mdi:camera-account",
      component: ProfileSetupStep,
    },
  ];

  const currentStepData = steps[step - 1];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-black text-white">
      <EffectBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Compact header with logo and progress */}
        <div className="flex items-center justify-between mb-6">
          <BrandLogo />

          {/* Compact step indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400 hidden sm:inline">
              {step}/{steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((s, index) => (
                <div
                  key={s.id}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index + 1 <= step ? "bg-[#FF6B00]" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step header - much more compact */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 mb-4">
            <Icon
              icon={currentStepData.icon}
              className="w-7 h-7 text-[#FF6B00]"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">{currentStepData.title}</h1>
          <p className="text-zinc-400">{currentStepData.subtitle}</p>
        </div>

        {/* Main content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step content */}
          <CurrentStepComponent
            formData={formData}
            onChange={handleChange}
            onProfileImageChange={handleProfileImageChange}
            errors={errors}
            userType="client"
          />

          {/* Navigation buttons - inline with content */}
          <div className="flex items-center justify-between gap-4 pt-8 border-t border-zinc-800">
            {/* Back button */}
            {step > 1 ? (
              <Button
                onClick={goToPrevStep}
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                leftIcon={<ArrowLeft size={18} />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {/* Progress indicator */}
            <div className="text-center">
              <div className="text-xs text-zinc-400 mb-1">
                Step {step} of {steps.length}
              </div>
              <div className="text-sm font-medium text-white">
                {Math.round((step / steps.length) * 100)}% Complete
              </div>
            </div>

            {/* Next/Complete button */}
            {step < steps.length ? (
              <Button
                onClick={goToNextStep}
                variant="primary"
                className="bg-[#FF6B00] hover:bg-[#E65A00]"
                rightIcon={<ArrowRight size={18} />}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="bg-[#FF6B00] hover:bg-[#E65A00]"
                rightIcon={
                  loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" className="w-4 h-4" />
                  )
                }
                onClick={handleSubmit}
              >
                {loading ? "Saving..." : "Complete"}
              </Button>
            )}
          </div>
        </form>

        {/* Tips section - only show on larger screens and not taking much space */}
        <div className="hidden lg:block mt-12">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:lightbulb" className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-400 mb-1 text-sm">
                  Quick Tip
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {step === 1 &&
                    "Be honest about your fitness level - this helps us match you with the right trainer for your needs."}
                  {step === 2 &&
                    "Setting clear goals helps trainers create personalized workout plans that get you results faster."}
                  {step === 3 &&
                    "Adding your location helps us find trainers near you, making it easier to meet in person."}
                  {step === 4 &&
                    "A good profile photo and description help trainers understand who they'll be working with."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ClientRegistration;
