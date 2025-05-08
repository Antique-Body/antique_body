"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Background from "@/components/background";
import { Button, Footer } from "@/components/common";
import { ArrowRight } from "@/components/common/Icons";
import { StepProgressBar } from "@/components/common/StepProgressBar";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { Card } from "@/components/custom/Card";
import { TipsSection } from "@/components/custom/shared/TipsSection";
import {
    BasicInfoStep,
    ProfessionalDetailsStep,
    ProfileAndContactStep,
    VenuesAndSpecialtiesStep,
} from "@/components/custom/trainer/personal-details/steps";

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
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [step, setStep] = useState(1);
    const [certFields, setCertFields] = useState([{ id: 1, value: "" }]);
    const [venueFields, setVenueFields] = useState([{ id: 1, value: "" }]);

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

    // Handle certification fields
    const handleCertChange = (id, value) => {
        const updatedFields = certFields.map((field) => (field.id === id ? { ...field, value } : field));
        setCertFields(updatedFields);

        // Update form data with certification values
        setFormData({
            ...formData,
            certifications: updatedFields.map((field) => field.value).filter((value) => value !== ""),
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
                certifications: updatedFields.map((field) => field.value).filter((value) => value !== ""),
            });
        }
    };

    // Handle venue fields
    const handleVenueChange = (id, value) => {
        const updatedFields = venueFields.map((field) => (field.id === id ? { ...field, value } : field));
        setVenueFields(updatedFields);

        // Update form data with venue values
        setFormData({
            ...formData,
            trainingVenues: updatedFields.map((field) => field.value).filter((value) => value !== ""),
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
                trainingVenues: updatedFields.map((field) => field.value).filter((value) => value !== ""),
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
        <div className="relative min-h-screen bg-[#0a0a0a] text-white">
            <Background />
            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <header className="mb-8 flex items-center justify-center py-4">
                    <BrandLogo />
                </header>

                {/* Progress Bar */}
                <StepProgressBar currentStep={step} totalSteps={4} />

                <Card variant="darkStrong" hover={true} width="100%" maxWidth="none" className="mb-12 md:p-8">
                    <h1 className="mb-6 text-2xl font-bold md:text-3xl">
                        {step === 1 && "Basic Information"}
                        {step === 2 && "Professional Details"}
                        {step === 3 && "Training Venues & Specialties"}
                        {step === 4 && "Profile Image & Contact"}
                    </h1>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Information */}
                        {step === 1 && <BasicInfoStep formData={formData} onChange={handleChange} userType="trainer" />}

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
                            />
                        )}

                        {/* Step 4: Profile Image & Contact */}
                        {step === 4 && (
                            <ProfileAndContactStep
                                formData={formData}
                                onChange={handleChange}
                                previewImage={previewImage}
                                handleImageUpload={handleImageUpload}
                            />
                        )}

                        {/* Navigation buttons */}
                        <div className="mt-8 flex justify-between">
                            {step > 1 ? (
                                <Button onClick={goToPrevStep} variant="secondary" type="button">
                                    Back
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {step < 4 ? (
                                <Button
                                    onClick={goToNextStep}
                                    type="button"
                                    disabled={step === 3 && formData.sports.length === 0}
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
