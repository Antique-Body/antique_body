"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BrandLogo } from "@/components";
import Background from "@/components/background";
import { Button } from "@/components/common";
import { ArrowRight, CheckIcon } from "@/components/common/Icons";
import { Footer } from "@/components/custom";
import { Card } from "@/components/custom/Card";
import { PersonalDetailsStep } from "../../../components/custom/personal-details/components/PersonalDetailsStep";
import { ProfessionalDetailsStep } from "../../../components/custom/personal-details/components/ProfessionalDetailsStep";
import { ProfileContactStep } from "../../../components/custom/personal-details/components/ProfileContactStep";
import { VenuesAndSpecialtiesStep } from "../../../components/custom/personal-details/components/VenuesAndSpecialtiesStep";

import { TipsSection } from "@/components/custom/shared/TipsSection";

const TrainerRegistration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    certifications: [""],
    yearsExperience: "",
    bio: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    trainingVenues: [""],
    sports: [],
    contactEmail: "",
    contactPhone: "",
    profileImage: null,
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    availabilityHours: [],
    priceRange: { min: "", max: "" },
    languages: [],
    onlineTraining: false,
    inPersonTraining: true,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [step, setStep] = useState(1);
  const [certFields, setCertFields] = useState([
    { id: 1, value: "", file: null },
  ]);
  const [venueFields, setVenueFields] = useState([{ id: 1, value: "" }]);
  const [stepsCompleted, setStepsCompleted] = useState([
    false,
    false,
    false,
    false,
  ]);

  // Available sports options
  const sportsOptions = [
    "Weightlifting",
    "CrossFit",
    "HIIT",
    "Yoga",
    "Pilates",
    "Running",
    "Cycling",
    "Swimming",
    "Basketball",
    "Football",
    "Soccer",
    "Tennis",
    "Volleyball",
    "Boxing",
    "MMA",
    "Gymnastics",
    "Track & Field",
    "Golf",
    "Powerlifting",
    "Olympic Lifting",
    "Bodybuilding",
    "Functional Training",
    "Rehabilitation",
    "Senior Fitness",
  ];

  // Languages options
  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Arabic",
    "Hindi",
    "Bengali",
    "Bosnian",
    "Croatian",
    "Serbian",
    "Slovenian",
    "Macedonian",
    "Turkish",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested objects like location.city
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle sports selection toggle
  const handleSportToggle = (sport) => {
    if (formData.sports.includes(sport)) {
      setFormData({
        ...formData,
        sports: formData.sports.filter((s) => s !== sport),
      });
    } else {
      setFormData({
        ...formData,
        sports: [...formData.sports, sport],
      });
    }
  };

  // Handle language selection toggle
  const handleLanguageToggle = (language) => {
    if (formData.languages.includes(language)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter((l) => l !== language),
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, language],
      });
    }
  };

  // Handle certification fields
  const handleCertChange = (id, value, file = undefined) => {
    const updatedFields = certFields.map((field) =>
      field.id === id
        ? { ...field, value, ...(file !== undefined && { file }) }
        : field
    );
    setCertFields(updatedFields);

    // Update form data with certification values
    setFormData({
      ...formData,
      certifications: updatedFields
        .map((field) => field.value)
        .filter((value) => value !== ""),
      certificationsFiles: updatedFields.map((field) => field.file || null),
    });
  };

  // Add new certification field
  const addCertField = () => {
    const newField = { id: certFields.length + 1, value: "", file: null };
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
        certificationsFiles: updatedFields.map((field) => field.file || null),
      });
    }
  };

  // Handle venue fields
  const handleVenueChange = (id, value) => {
    const updatedFields = venueFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setVenueFields(updatedFields);

    // Update form data with venue values
    setFormData({
      ...formData,
      trainingVenues: updatedFields
        .map((field) => field.value)
        .filter((value) => value !== ""),
    });
  };

  // Add new venue field
  const addVenueField = () => {
    const newField = { id: venueFields.length + 1, value: "" };
    setVenueFields([...venueFields, newField]);
  };

  // Remove venue field
  const removeVenueField = (id) => {
    if (venueFields.length > 1) {
      const updatedFields = venueFields.filter((field) => field.id !== id);
      setVenueFields(updatedFields);

      // Update form data
      setFormData({
        ...formData,
        trainingVenues: updatedFields
          .map((field) => field.value)
          .filter((value) => value !== ""),
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/select-plan");
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();

    // Mark current step as completed
    const newStepsCompleted = [...stepsCompleted];
    newStepsCompleted[step - 1] = true;
    setStepsCompleted(newStepsCompleted);

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Jump to a specific step if it's completed or the current one
  const jumpToStep = (targetStep) => {
    if (targetStep < step || stepsCompleted[targetStep - 1]) {
      setStep(targetStep);
      window.scrollTo(0, 0);
    }
  };

  // Check if the current step is valid
  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.name.trim() !== "" &&
          formData.location.city.trim() !== "" &&
          formData.location.state.trim() !== "" &&
          formData.location.country.trim() !== ""
        );
      case 2:
        return (
          formData.specialty.trim() !== "" && formData.yearsExperience !== ""
        );
      case 3:
        return (
          formData.sports.length > 0 &&
          formData.trainingVenues.some((venue) => venue.trim() !== "")
        );
      case 4:
        return formData.contactEmail.trim() !== "";
      default:
        return true;
    }
  };

  const steps = [
    { id: 1, title: "Basic Information" },
    { id: 2, title: "Professional Details" },
    { id: 3, title: "Training Venues & Specialties" },
    { id: 4, title: "Profile & Contact" },
  ];

  return (
    <div className="relative min-h-screen text-white">
      <Background />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-center py-4">
          <BrandLogo />
        </header>

        {/* Custom Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col items-center ${
                  step === s.id || stepsCompleted[s.id - 1]
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-70"
                }`}
                onClick={() => jumpToStep(s.id)}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 
                    ${
                      stepsCompleted[s.id - 1]
                        ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                        : step === s.id
                        ? "border-[#FF6B00] text-[#FF6B00]"
                        : "border-gray-600 text-gray-600"
                    } transition-all duration-300`}
                >
                  {stepsCompleted[s.id - 1] ? <CheckIcon size={24} /> : s.id}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === s.id ? "text-[#FF6B00]" : "text-gray-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 h-1 w-full bg-gray-700"></div>
            <div
              className="absolute top-0 h-1 bg-[#FF6B00] transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card
          variant="darkStrong"
          hover={true}
          width="100%"
          maxWidth="none"
          className="mb-8 md:p-8"
        >
          <h1 className="mb-6 text-2xl font-bold md:text-3xl">
            {steps.find((s) => s.id === step)?.title}
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <PersonalDetailsStep
                formData={formData}
                onChange={handleChange}
                userType="trainer"
                title="Tell us about yourself"
                locationTitle="Where are you based?"
                locationDescription="This helps clients find trainers in their area"
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

            {/* Step 3: Training Venues & Specialties */}
            {step === 3 && (
              <VenuesAndSpecialtiesStep
                formData={formData}
                sportsOptions={sportsOptions}
                handleSportToggle={handleSportToggle}
                venueFields={venueFields}
                handleVenueChange={handleVenueChange}
                addVenueField={addVenueField}
                removeVenueField={removeVenueField}
                languageOptions={languageOptions}
                handleLanguageToggle={handleLanguageToggle}
                handleCheckboxChange={handleCheckboxChange}
              />
            )}

            {/* Step 4: Profile Image & Contact */}
            {step === 4 && (
              <ProfileContactStep
                formData={formData}
                onChange={handleChange}
                previewImage={previewImage}
                handleImageUpload={handleImageUpload}
                userType="trainer"
                showTerms={false}
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
                  disabled={!isStepValid()}
                  className={
                    !isStepValid() ? "opacity-70 cursor-not-allowed" : ""
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  rightIcon={<ArrowRight size={20} />}
                  disabled={!isStepValid()}
                  className={
                    !isStepValid() ? "opacity-70 cursor-not-allowed" : ""
                  }
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Tips Section */}
        <Card
          variant="dark"
          hover={false}
          width="100%"
          maxWidth="none"
          className="mb-8 p-6"
        >
          <h2 className="mb-4 text-xl font-semibold text-[#FF6B00]">
            Tips for Completing Your Profile
          </h2>
          <TipsSection step={step} userType="trainer" />
        </Card>

        <Footer />
      </div>
    </div>
  );
};

export default TrainerRegistration;
