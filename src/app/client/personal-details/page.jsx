"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EffectBackground } from "@/components/background";
import { Button, Footer } from "@/components/common";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Card } from "@/components/common/Card";
import { ArrowRight } from "@/components/common/Icons";
import { StepProgressBar } from "@/components/common/StepProgressBar";
import {
  BasicInfoStep,
  FitnessGoalsStep,
  HealthInfoStep,
  PreferencesLocationStep,
  ProfileSetupStep,
} from "@/components/custom/personal-details/client";
import { TipsSection } from "@/components/custom/personal-details/shared";

const ClientRegistration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",

    // Physical Information
    height: "",
    weight: "",
    activityLevel: "",

    // Fitness Goals & Preferences
    fitnessGoals: [],
    workoutPreferences: [],
    exerciseExperience: "",
    trainingFrequency: "",

    // Health Information
    medicalClearance: "",
    medicalConditions: [],
    medicalDetails: "",
    currentInjuries: [],
    injuryDetails: "",

    // Schedule & Location
    location: {
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    preferredDays: [],
    preferredTimeSlots: [],
    sessionDuration: "",

    // Trainer Preferences
    trainerGenderPreference: "",
    trainingStyle: "",
    budgetRange: "",
    specialRequests: "",
    phone: "",

    // Profile Setup
    profileImage: "",
    bio: "",
    motivation: "",

    // Legacy compatibility fields
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // Handle form input changes
  const handleChange = (e) => {
    if (!e.target || typeof e.target.name !== "string") return;
    const { name, value } = e.target;

    if (typeof name === "string" && name.includes(".")) {
      // Handle nested objects like location.city
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate current step
  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        // Basic info validation - optional for demo
        if (!formData.firstName?.trim()) {
          newErrors.firstName = "First name is required";
        }
        if (!formData.lastName?.trim()) {
          newErrors.lastName = "Last name is required";
        }
        if (!formData.email?.trim()) {
          newErrors.email = "Email is required";
        }
        break;

      case 2:
        // Fitness goals validation - at least one goal required
        if (!formData.fitnessGoals || formData.fitnessGoals.length === 0) {
          newErrors.fitnessGoals = "Please select at least one fitness goal";
        }
        break;

      case 3:
        // Health info validation - medical clearance required
        if (!formData.medicalClearance) {
          newErrors.medicalClearance =
            "Please indicate your medical clearance status";
        }
        break;

      case 4:
        // Location and preferences validation
        if (!formData.location?.city?.trim()) {
          newErrors.location = "City is required";
        }
        if (!formData.phone?.trim()) {
          newErrors.phone = "Phone number is required";
        }
        break;

      case 5:
        // Profile setup validation - optional for demo
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      // Here you would typically send the data to your API
      console.log("Client registration data:", formData);

      // For now, redirect to a success page or dashboard
      router.push("/client/dashboard");
    }
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Get step title
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Fitness Goals & Preferences";
      case 3:
        return "Health Information";
      case 4:
        return "Schedule & Trainer Preferences";
      case 5:
        return "Profile Setup";
      default:
        return "";
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <EffectBackground />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-center py-4">
          <BrandLogo />
        </header>

        {/* Progress Bar */}
        <StepProgressBar currentStep={step} totalSteps={5} />

        <Card
          variant="darkStrong"
          hover={true}
          width="100%"
          maxWidth="none"
          className="mb-12 md:p-8"
        >
          <h1 className="mb-6 text-2xl font-bold md:text-3xl">
            {getStepTitle()}
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

            {/* Step 2: Fitness Goals & Preferences */}
            {step === 2 && (
              <FitnessGoalsStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            {/* Step 3: Health Information */}
            {step === 3 && (
              <HealthInfoStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            {/* Step 4: Schedule & Trainer Preferences */}
            {step === 4 && (
              <PreferencesLocationStep
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            {/* Step 5: Profile Setup */}
            {step === 5 && (
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

              {step < 5 ? (
                <Button onClick={goToNextStep} type="button">
                  Continue
                </Button>
              ) : (
                <Button type="submit" rightIcon={<ArrowRight size={20} />}>
                  Complete Profile
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
