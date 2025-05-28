"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EffectBackground } from "@/components/background";
import { Button, Footer } from "@/components/common";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Card } from "@/components/common/Card";
import { ArrowRight } from "@/components/common/Icons";
import { StepProgressBar } from "@/components/common/StepProgressBar";
import { TipsSection } from "@/components/custom/personal-details/shared";
import {
  BasicInfoStep,
  ProfessionalDetailsStep,
  ProfileAndContactStep,
  ProfileSetupStep,
} from "@/components/custom/personal-details/trainer";

const TrainerRegistration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",

    // Professional Information
    trainingSince: "",
    specialties: [],
    bio: "",

    // Languages and Training Types
    languages: [],
    trainingEnvironment: "",
    trainingTypes: [],

    // Contact and Location
    email: "",
    phone: "",
    username: "",
    website: "",
    instagram: "",
    motto: "",
    profilePicture: null,
    profileImage: "",
    location: {
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },

    // Availability
    preferredHours: "",
    availableDays: "",

    // Legacy fields for compatibility
    name: "",
    specialty: "",
    certifications: [""],
    yearsExperience: "",
    trainingVenues: [""],
    sports: [],
    contactEmail: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [certFields, setCertFields] = useState([{ id: 1, value: "" }]);

  // Handle form input changes
  const handleChange = (e) => {
    if (!e.target || typeof e.target.name !== "string") return;
    const { name, value } = e.target;
    console.log("handleChange called:", name, value);

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

  // Handle certification fields
  const handleCertChange = (id, value) => {
    const updatedFields = certFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setCertFields(updatedFields);

    // Update form data with certification values
    setFormData({
      ...formData,
      certifications: updatedFields
        .map((field) => field.value)
        .filter((value) => value !== ""),
    });
  };

  // Add new certification field
  const addCertField = () => {
    const newField = { id: certFields.length + 1, value: "" };
    setCertFields([...certFields, newField]);
  };

  // Remove certification field
  const removeCertField = (id) => {
    if (certFields.length > 1) {
      const updatedFields = certFields.filter((field) => field.id !== id);
      setCertFields(updatedFields);

      // Update form data
      setFormData({
        ...formData,
        certifications: updatedFields
          .map((field) => field.value)
          .filter((value) => value !== ""),
      });
    }
  };

  // Validate current step
  const validateStep = (_currentStep) => {
    const newErrors = {};

    // Remove all validation since no fields are required anymore

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      router.push("/select-plan");
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

  // Helper to check if Professional Details step is filled enough to continue
  const canContinueProfessionalDetails = () => {
    // Only allow continue if at least one language is selected
    const hasLanguages = formData.languages && formData.languages.length > 0;
    // Debug log
    console.log("[canContinueProfessionalDetails]", {
      languages: formData.languages,
      hasLanguages,
      certFields,
      trainingEnvironment: formData.trainingEnvironment,
      trainingTypes: formData.trainingTypes,
      result: hasLanguages,
    });
    return hasLanguages;
  };

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
              />
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <ProfessionalDetailsStep
                formData={formData}
                onChange={handleChange}
                certFields={certFields}
                handleCertChange={handleCertChange}
                addCertField={addCertField}
                removeCertField={removeCertField}
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
                <Button
                  onClick={goToNextStep}
                  type="button"
                  disabled={step === 2 && !canContinueProfessionalDetails()}
                >
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
        <TipsSection step={step} userType="trainer" />

        <Footer />
      </div>
    </div>
  );
};

export default TrainerRegistration;
