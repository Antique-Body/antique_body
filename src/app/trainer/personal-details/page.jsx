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
    profileImage: null,
    location: {
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },

    // Availability

    // Legacy fields for compatibility
    name: "",
    specialty: "",
    certifications: [{ name: "", issuer: "", expiryDate: "", file: null }],
    yearsExperience: "",
    trainingVenues: [""],
    sports: [],
    contactEmail: "",
    contactPhone: "",
    currency: "EUR",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log(formData, "formData");

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
  const handleCertChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  // Add new certification field
  const addCertField = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", expiryDate: "", file: null },
      ],
    }));
  };

  // Remove certification field
  const removeCertField = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      scrollToTop();
      return;
    }
    setLoading(true);
    // 1. Pripremi FormData za upload fileova
    const uploadData = new FormData();
    if (formData.profileImage && formData.profileImage instanceof File) {
      uploadData.append("profileImage", formData.profileImage);
    }
    formData.certifications.forEach((cert) => {
      if (cert.file) {
        uploadData.append("certifications", cert.file); // backend očekuje array
      }
    });
    // Log sve što je u uploadData
    for (const pair of uploadData.entries()) {
      console.log("[DEBUG] FormData entry:", pair[0], pair[1]);
    }
    // 2. Prvo uploadaj slike/certifikate
    let uploadedUrls = {};
    if (
      (formData.profileImage && formData.profileImage instanceof File) ||
      formData.certifications.some((c) => c.file)
    ) {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!uploadRes.ok) {
        setErrors({ general: "Greška pri uploadu slika/certifikata." });
        setLoading(false);
        return;
      }
      uploadedUrls = await uploadRes.json();
    }
    // 3. Pripremi podatke za kreiranje profila
    const trainerData = {
      ...formData,
      profileImage: uploadedUrls.profileImage || formData.profileImage,
      certifications: formData.certifications.map((cert, i) => ({
        ...cert,
        documentUrl:
          uploadedUrls.certifications?.[i]?.documentUrl ||
          cert.documentUrl ||
          "",
        file: undefined, // ne šalji file objekte
      })),
      currency: formData.currency || "EUR", // default to EUR if not set
    };
    // 4. Pošalji podatke na backend za kreiranje profila
    const res = await fetch("/api/users/trainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainerData),
    });
    if (!res.ok) {
      const err = await res.json();
      setErrors({ general: err.error || "Greška pri spremanju profila." });
      setLoading(false);
      return;
    }
    setLoading(false);
    // 5. Redirect ako je sve prošlo
    router.push("/trainer/dashboard");
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();
    // if (validateStep(step)) {
    setStep(step + 1);
    // window.scrollTo(0, 0);
    // } else {
    //   scrollToTop();
    // }
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Helper to check if Professional Details step is filled enough to continue

  // Za profilnu sliku
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
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
                certFields={formData.certifications}
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
                onProfileImageChange={handleProfileImageChange}
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
