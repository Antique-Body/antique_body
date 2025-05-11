"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EffectBackground } from "@/components/background";
import { Button, StepProgressBar } from "@/components/common";
import { Footer } from "@/components/common/Footer";
import { CheckIcon } from "@/components/common/Icons";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { Card } from "@/components/custom/Card";
import {
    BasicInfoStep,
    BodyMetricsStep,
    HealthInfoStep,
    ProfileAndContactStep,
    TrainingPreferencesStep,
} from "@/components/custom/client/personal-details/steps";
import { TipsSection } from "@/components/custom/shared/TipsSection";

const ClientRegistration = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        height: { feet: "", inches: "" },
        weight: "",
        targetWeight: "",
        fitnessLevel: "",
        goals: [],
        healthConditions: [""],
        injuries: [""],
        dietaryPreferences: [],
        trainingFrequency: "",
        trainingPreference: [],
        location: {
            city: "",
            state: "",
            country: "",
        },
        availableEquipment: [],
        preferredTrainingTime: [],
        motivationLevel: "",
        bio: "",
        contactEmail: "",
        contactPhone: "",
        profileImage: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [step, setStep] = useState(1);
    const [healthFields, setHealthFields] = useState([{ id: 1, value: "" }]);
    const [injuryFields, setInjuryFields] = useState([{ id: 1, value: "" }]);

    // Available options for selections
    const fitnessLevelOptions = ["Beginner", "Intermediate", "Advanced", "Elite Athlete"];
    const goalsOptions = [
        "Lose Weight",
        "Build Muscle",
        "Improve Flexibility",
        "Increase Strength",
        "Improve Cardiovascular Health",
        "Sports Performance",
        "Rehabilitation",
        "Overall Wellness",
        "Stress Reduction",
        "Prepare for Event/Competition",
        "Improve Balance & Coordination",
        "Increase Energy Levels",
    ];
    const dietaryPreferencesOptions = [
        "No Special Diet",
        "Vegetarian",
        "Vegan",
        "Pescatarian",
        "Paleo",
        "Keto",
        "Gluten-Free",
        "Dairy-Free",
        "Low Carb",
        "High Protein",
        "Intermittent Fasting",
    ];
    const trainingFrequencyOptions = ["1-2 times per week", "3-4 times per week", "5+ times per week"];
    const trainingPreferenceOptions = [
        "Gym Workouts",
        "Home Workouts",
        "Outdoor Activities",
        "Sport-Specific Training",
        "Group Classes",
        "One-on-One Coaching",
        "Online/Virtual Training",
        "Team Sports",
        "HIIT",
        "Yoga/Pilates",
    ];
    const equipmentOptions = [
        "No Equipment",
        "Dumbbells",
        "Barbell & Weights",
        "Resistance Bands",
        "Pull-up Bar",
        "Bench",
        "Kettlebells",
        "Cardio Equipment",
        "Suspension Trainer",
        "Full Gym Access",
    ];
    const timeOptions = [
        "Early Morning (5-8 AM)",
        "Morning (8-11 AM)",
        "Mid-Day (11 AM-2 PM)",
        "Afternoon (2-5 PM)",
        "Evening (5-8 PM)",
        "Night (8-11 PM)",
        "Weekends Only",
    ];
    const motivationLevelOptions = ["Need lots of encouragement", "Moderately self-motivated", "Highly self-motivated"];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            // Handle nested objects like height.feet
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

    // Handle toggle selection for multi-select options
    const handleToggle = (field, item) => {
        if (formData[field].includes(item)) {
            setFormData({
                ...formData,
                [field]: formData[field].filter((i) => i !== item),
            });
        } else {
            setFormData({
                ...formData,
                [field]: [...formData[field], item],
            });
        }
    };

    // Handle health condition fields
    const handleHealthChange = (id, value) => {
        const updatedFields = healthFields.map((field) => (field.id === id ? { ...field, value } : field));
        setHealthFields(updatedFields);

        // Update form data
        setFormData({
            ...formData,
            healthConditions: updatedFields.map((field) => field.value).filter((value) => value !== ""),
        });
    };

    // Add new health condition field
    const addHealthField = () => {
        const newField = { id: healthFields.length + 1, value: "" };
        setHealthFields([...healthFields, newField]);
    };

    // Remove health condition field
    const removeHealthField = (id) => {
        if (healthFields.length > 1) {
            const updatedFields = healthFields.filter((field) => field.id !== id);
            setHealthFields(updatedFields);

            // Update form data
            setFormData({
                ...formData,
                healthConditions: updatedFields.map((field) => field.value).filter((value) => value !== ""),
            });
        }
    };

    // Handle injury fields
    const handleInjuryChange = (id, value) => {
        const updatedFields = injuryFields.map((field) => (field.id === id ? { ...field, value } : field));
        setInjuryFields(updatedFields);

        // Update form data
        setFormData({
            ...formData,
            injuries: updatedFields.map((field) => field.value).filter((value) => value !== ""),
        });
    };

    // Add new injury field
    const addInjuryField = () => {
        const newField = { id: injuryFields.length + 1, value: "" };
        setInjuryFields([...injuryFields, newField]);
    };

    // Remove injury field
    const removeInjuryField = (id) => {
        if (injuryFields.length > 1) {
            const updatedFields = injuryFields.filter((field) => field.id !== id);
            setInjuryFields(updatedFields);

            // Update form data
            setFormData({
                ...formData,
                injuries: updatedFields.map((field) => field.value).filter((value) => value !== ""),
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
        "Submitting user profile data:", formData;
        // Here you would typically send data to your backend
        router.push("/select-plan");
    };

    // Move to next step
    const goToNextStep = (e) => {
        e.preventDefault();
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    // Move to previous step
    const goToPrevStep = (e) => {
        e.preventDefault();
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div className="relative min-h-screen  text-white">
            <EffectBackground />
            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
                {/* Header with logo */}
                <header className="mb-8 flex items-center justify-center py-4">
                    <BrandLogo />
                </header>

                {/* Progress Bar */}
                <StepProgressBar currentStep={step} totalSteps={5} />

                <Card variant="darkStrong" hover={true} width="100%" maxWidth="none" className="mb-12 md:p-8">
                    <h1 className="mb-6 text-2xl font-bold md:text-3xl">
                        {step === 1 && "Basic Information"}
                        {step === 2 && "Body Metrics & Goals"}
                        {step === 3 && "Health & Dietary Information"}
                        {step === 4 && "Training Preferences"}
                        {step === 5 && "Profile & Contact Details"}
                    </h1>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Information */}
                        {step === 1 && <BasicInfoStep formData={formData} onChange={handleChange} userType="client" />}

                        {/* Step 2: Body Metrics & Goals */}
                        {step === 2 && (
                            <BodyMetricsStep
                                formData={formData}
                                onChange={handleChange}
                                handleToggle={handleToggle}
                                fitnessLevelOptions={fitnessLevelOptions}
                                goalsOptions={goalsOptions}
                            />
                        )}

                        {/* Step 3: Health & Dietary Information */}
                        {step === 3 && (
                            <HealthInfoStep
                                formData={formData}
                                healthFields={healthFields}
                                handleHealthChange={handleHealthChange}
                                addHealthField={addHealthField}
                                removeHealthField={removeHealthField}
                                injuryFields={injuryFields}
                                handleInjuryChange={handleInjuryChange}
                                addInjuryField={addInjuryField}
                                removeInjuryField={removeInjuryField}
                                handleToggle={handleToggle}
                                dietaryPreferencesOptions={dietaryPreferencesOptions}
                            />
                        )}

                        {/* Step 4: Training Preferences */}
                        {step === 4 && (
                            <TrainingPreferencesStep
                                formData={formData}
                                onChange={handleChange}
                                handleToggle={handleToggle}
                                trainingFrequencyOptions={trainingFrequencyOptions}
                                trainingPreferenceOptions={trainingPreferenceOptions}
                                equipmentOptions={equipmentOptions}
                                timeOptions={timeOptions}
                                motivationLevelOptions={motivationLevelOptions}
                            />
                        )}

                        {/* Step 5: Profile & Contact Details */}
                        {step === 5 && (
                            <ProfileAndContactStep
                                formData={formData}
                                onChange={handleChange}
                                previewImage={previewImage}
                                handleImageUpload={handleImageUpload}
                            />
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-between">
                            {step > 1 ? (
                                <Button onClick={goToPrevStep} variant="secondary" type="button">
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
                                <Button type="submit" rightIcon={<CheckIcon size={20} />}>
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
