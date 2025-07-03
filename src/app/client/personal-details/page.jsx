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
      title: "Basic Information",
      subtitle: "Personal details and background",
      icon: "mdi:account-circle",
      component: BasicInfoStep,
    },
    {
      id: 2,
      title: "Goals & Preferences",
      subtitle: "Your fitness objectives",
      icon: "mdi:target",
      component: GoalsAndPreferencesStep,
    },
    {
      id: 3,
      title: "Contact & Location",
      subtitle: "How trainers can reach you",
      icon: "mdi:map-marker",
      component: ContactAndLocationStep,
    },
    {
      id: 4,
      title: "Profile & Bio",
      subtitle: "Complete your profile",
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

          {/* Enhanced Steps Design - Mobile Optimized */}
          <div className="mb-4 sm:mb-6">
            {/* Progress Card */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-r from-zinc-900/40 to-zinc-900/30 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/3 via-transparent to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Steps with Icons and Connection Lines - Responsive */}
                <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-6">
                  <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                    {steps.map((s, index) => (
                      <div key={s.id} className="flex items-center">
                        {/* Step Circle with Icon - Responsive */}
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              index + 1 === step
                                ? "border-[#FF6B00] bg-[#FF6B00]/10 shadow-lg shadow-[#FF6B00]/20"
                                : index + 1 < step
                                ? "border-[#FF6B00] bg-[#FF6B00]"
                                : "border-zinc-600 bg-zinc-800/50"
                            }`}
                          >
                            {index + 1 < step ? (
                              <Icon
                                icon="mdi:check"
                                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
                              />
                            ) : (
                              <Icon
                                icon={s.icon}
                                className={`w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${
                                  index + 1 === step
                                    ? "text-[#FF6B00]"
                                    : index + 1 < step
                                    ? "text-white"
                                    : "text-zinc-400"
                                }`}
                              />
                            )}
                          </div>

                          {/* Step Number Badge */}
                          <div
                            className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center ${
                              index + 1 === step
                                ? "bg-[#FF6B00] text-white"
                                : index + 1 < step
                                ? "bg-green-500 text-white"
                                : "bg-zinc-600 text-zinc-300"
                            }`}
                          >
                            {s.id}
                          </div>

                          {/* Step Label */}
                          <div className="mt-2 sm:mt-3 text-center">
                            <p
                              className={`text-xs sm:text-sm font-medium ${
                                index + 1 === step
                                  ? "text-white"
                                  : index + 1 < step
                                  ? "text-zinc-300"
                                  : "text-zinc-500"
                              }`}
                            >
                              {s.title}
                            </p>
                          </div>
                        </div>

                        {/* Connection Line */}
                        {index < steps.length - 1 && (
                          <div className="mx-2 sm:mx-3 lg:mx-4 relative">
                            <div
                              className={`h-0.5 w-8 sm:w-12 lg:w-16 transition-all duration-300 ${
                                index + 1 < step
                                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00]"
                                  : "bg-zinc-700"
                              }`}
                            />
                            {/* Animated dots for active connection */}
                            {index + 1 === step && (
                              <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
                                <div className="h-full w-4 sm:w-6 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent border */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent" />
            </div>
          </div>

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
