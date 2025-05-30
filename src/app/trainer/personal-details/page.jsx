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
  const handleCertChange = (
    id,
    value,
    fieldName = "value",
    fieldValue = null
  ) => {
    let updatedFields;

    if (fieldName === "value") {
      // Handle the main certification name (backward compatibility)
      updatedFields = certFields.map((field) =>
        field.id === id ? { ...field, value } : field
      );
    } else {
      // Handle additional fields like issuer, expiryDate
      updatedFields = certFields.map((field) =>
        field.id === id ? { ...field, [fieldName]: fieldValue } : field
      );
    }

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
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.trainingSince)
        newErrors.trainingSince = "Training since is required";
      if (!formData.specialties || formData.specialties.length === 0)
        newErrors.specialties = "At least one specialty is required";
    }
    if (currentStep === 2) {
      if (!formData.languages || formData.languages.length === 0)
        newErrors.languages = "At least one language is required";
      if (!formData.trainingEnvironment)
        newErrors.trainingEnvironment = "Training environment is required";
      if (!formData.trainingTypes || formData.trainingTypes.length === 0)
        newErrors.trainingTypes = "At least one training type is required";
    }
    if (currentStep === 3) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.location || !formData.location.city)
        newErrors["location.city"] = "City is required";
      if (!formData.location || !formData.location.state)
        newErrors["location.state"] = "State/Province is required";
      if (!formData.location || !formData.location.country)
        newErrors["location.country"] = "Country is required";
      if (!formData.location || !formData.location.postalCode)
        newErrors["location.postalCode"] = "Postal code is required";
      if (!formData.pricingType || formData.pricingType === "")
        newErrors.pricingType = "Pricing approach is required";
      if (
        (formData.pricingType === "fixed" ||
          formData.pricingType === "package_deals") &&
        (!formData.pricePerSession || Number(formData.pricePerSession) <= 0)
      ) {
        newErrors.pricePerSession = "Price per session is required";
      }
    }
    // Step 4: nothing required

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Scroll to top helper
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      router.push("/select-plan");
    } else {
      scrollToTop();
    }
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      scrollToTop();
    }
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Helper to check if Professional Details step is filled enough to continue

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
