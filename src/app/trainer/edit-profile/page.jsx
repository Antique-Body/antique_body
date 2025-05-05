"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { SaveIcon } from "@/components/common/Icons";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { Card } from "@/components/custom/Card";
import { AnimatedTabContent, DashboardTabs } from "@/components/custom/DashboardTabs";
import {
    AboutYou,
    AreasOfExpertise,
    Availability,
    BasicInformation,
    ServicesOffered,
} from "@/components/custom/trainer/edit-profile";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const TrainerEditProfilePage = () => {
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState(null);
    const [activeSection, setActiveSection] = useState("basicInfo");
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [formProgress, setFormProgress] = useState(20);

    // Sample trainer data - in a real app this would come from an API
    const [trainerData, setTrainerData] = useState({
        name: "Alex Miller",
        specialty: "Football Conditioning Specialist",
        certifications: ["UEFA A License", "NSCA CSCS"],
        experience: "8 years",
        hourlyRate: 75,
        rating: 4.8,
        proximity: "5 miles away",
        description:
            "Professional strength and conditioning coach with over 8 years of experience working with athletes from amateur to professional levels. Specializing in sport-specific training programs that enhance performance and prevent injuries.",
        philosophy:
            "My approach to training is focused on building sustainable habits and tailoring workouts to individual needs. I believe in a balanced approach that combines strength, conditioning, mobility, and proper recovery techniques.",
        education: ["Bachelor's Degree in Exercise Science", "Master's in Sports Performance"],
        services: [
            {
                name: "Personal Training",
                description: "One-on-one customized training sessions to meet your specific goals.",
            },
            {
                name: "Nutrition Planning",
                description: "Customized meal plans and nutritional guidance to complement your training.",
            },
            {
                name: "Performance Assessment",
                description: "Comprehensive analysis of your current fitness level and performance metrics.",
            },
            {
                name: "Remote Coaching",
                description: "Virtual training sessions and programming for clients who prefer training remotely.",
            },
        ],
        expertise: [
            { area: "Strength Training", level: 90 },
            { area: "Sport-specific Conditioning", level: 95 },
            { area: "Nutrition Planning", level: 85 },
            { area: "Injury Prevention", level: 80 },
            { area: "Recovery Protocols", level: 90 },
        ],
        location: {
            city: "Los Angeles",
            state: "California",
            country: "USA",
        },
        contact: {
            email: "alex.miller@example.com",
            phone: "+1 (555) 123-4567",
        },
        availability: {
            weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["Morning", "Afternoon"],
        },
    });

    // Update form progress whenever any data changes
    useEffect(() => {
        calculateFormProgress();
    }, [trainerData]);

    // Calculate form completion percentage
    const calculateFormProgress = () => {
        // This is a simplified calculation - in a real app you'd check all required fields
        const totalFields = 15; // approximate total number of important fields
        let filledFields = 0;

        if (trainerData.name) filledFields++;
        if (trainerData.specialty) filledFields++;
        if (trainerData.certifications.length > 0) filledFields++;
        if (trainerData.experience) filledFields++;
        if (trainerData.hourlyRate) filledFields++;
        if (trainerData.contact.email) filledFields++;
        if (trainerData.location.city) filledFields++;
        if (trainerData.education.length > 0) filledFields++;
        if (trainerData.description) filledFields++;
        if (trainerData.philosophy) filledFields++;
        if (trainerData.expertise.length > 0) filledFields++;
        if (trainerData.services.length > 0) filledFields++;
        if (trainerData.availability.weekdays.length > 0) filledFields++;
        if (trainerData.availability.timeSlots.length > 0) filledFields++;
        if (trainerData.contact.phone) filledFields++;

        setFormProgress(Math.max(20, Math.round((filledFields / totalFields) * 100)));
    };

    // Handler for text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Show temporary save indicator effect
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);

        // Handle nested properties (using dot notation in the name)
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setTrainerData({
                ...trainerData,
                [parent]: {
                    ...trainerData[parent],
                    [child]: value,
                },
            });
        } else {
            setTrainerData({
                ...trainerData,
                [name]: value,
            });
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload this to storage
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
                setSaveIndicator(true);
                setTimeout(() => setSaveIndicator(false), 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add a new certification
    const [newCertification, setNewCertification] = useState("");

    const addCertification = () => {
        if (newCertification.trim()) {
            setTrainerData({
                ...trainerData,
                certifications: [...trainerData.certifications, newCertification.trim()],
            });
            setNewCertification("");
            setSaveIndicator(true);
            setTimeout(() => setSaveIndicator(false), 1000);
        }
    };

    // Remove a certification
    const removeCertification = (index) => {
        setTrainerData({
            ...trainerData,
            certifications: trainerData.certifications.filter((_, i) => i !== index),
        });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);
    };

    // Add a new education item
    const [newEducation, setNewEducation] = useState("");

    const addEducation = () => {
        if (newEducation.trim()) {
            setTrainerData({
                ...trainerData,
                education: [...trainerData.education, newEducation.trim()],
            });
            setNewEducation("");
            setSaveIndicator(true);
            setTimeout(() => setSaveIndicator(false), 1000);
        }
    };

    // Remove an education item
    const removeEducation = (index) => {
        setTrainerData({
            ...trainerData,
            education: trainerData.education.filter((_, i) => i !== index),
        });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);
    };

    // Add a new service
    const [newService, setNewService] = useState({ name: "", description: "" });

    const addService = () => {
        if (newService.name.trim() && newService.description.trim()) {
            setTrainerData({
                ...trainerData,
                services: [...trainerData.services, { ...newService }],
            });
            setNewService({ name: "", description: "" });
            setSaveIndicator(true);
            setTimeout(() => setSaveIndicator(false), 1000);
        }
    };

    // Remove a service
    const removeService = (index) => {
        setTrainerData({
            ...trainerData,
            services: trainerData.services.filter((_, i) => i !== index),
        });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);
    };

    // Update expertise level
    const updateExpertiseLevel = (index, level) => {
        const updatedExpertise = [...trainerData.expertise];
        updatedExpertise[index].level = Number(level);
        setTrainerData({
            ...trainerData,
            expertise: updatedExpertise,
        });
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Show saving animation
        setSaveIndicator(true);

        // In a real app, you'd save this to your backend
        setTimeout(() => {
            setSaveIndicator(false);
            router.push("/trainer/dashboard");
        }, 1500);
    };

    // Go back to dashboard
    const goBack = () => {
        router.push("/trainer/dashboard");
    };

    // Navigation sections
    const sections = [
        { id: "basicInfo", label: "Basic Information", badgeCount: 0 },
        { id: "aboutYou", label: "About You", badgeCount: 0 },
        { id: "expertise", label: "Expertise", badgeCount: 0 },
        { id: "services", label: "Services", badgeCount: 0 },
        { id: "availability", label: "Availability", badgeCount: 0 },
    ];

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.3),transparent_70%)] px-4 py-6">
            {/* Animated shapes in background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="animate-pulse-slow absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-gradient-to-r from-[#FF7800]/5 to-[#FF5F00]/5 blur-3xl"></div>
                <div className="animate-pulse-slow absolute right-[10%] top-[50%] h-60 w-60 rounded-full bg-gradient-to-r from-[#FF7800]/5 to-[#FF5F00]/5 blur-3xl"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 mx-auto max-w-screen-xl"
            >
                <motion.div variants={fadeIn} className="mb-8 flex items-center justify-center">
                    <BrandLogo />
                </motion.div>

                <motion.div variants={fadeIn} className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <BackButton onClick={goBack} />
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Profile completion</span>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#FF7800] to-[#FF5F00] transition-all duration-1000"
                                style={{ width: `${formProgress}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-[#FF7800]">{formProgress}%</span>
                    </div>
                </motion.div>

                <motion.div variants={fadeIn}>
                    <DashboardTabs activeTab={activeSection} setActiveTab={setActiveSection} tabs={sections} />
                </motion.div>

                <motion.div variants={fadeIn}>
                    <Card variant="darkStrong" width="100%" maxWidth="100%" className="backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="relative space-y-10">
                            {/* Auto-save indicator */}
                            <div
                                className={`pointer-events-none fixed right-10 top-10 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm font-medium text-green-400 transition-all duration-300 ${
                                    saveIndicator ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                <span className="mr-2">●</span> Auto-saving...
                            </div>

                            {/* Active section */}
                            <AnimatedTabContent isActive={activeSection === "basicInfo"} tabId="basicInfo">
                                <BasicInformation
                                    trainerData={trainerData}
                                    handleChange={handleChange}
                                    previewImage={previewImage}
                                    handleImageUpload={handleImageUpload}
                                    newCertification={newCertification}
                                    setNewCertification={setNewCertification}
                                    addCertification={addCertification}
                                    removeCertification={removeCertification}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "aboutYou"} tabId="aboutYou">
                                <AboutYou
                                    trainerData={trainerData}
                                    handleChange={handleChange}
                                    newEducation={newEducation}
                                    setNewEducation={setNewEducation}
                                    addEducation={addEducation}
                                    removeEducation={removeEducation}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "expertise"} tabId="expertise">
                                <AreasOfExpertise trainerData={trainerData} updateExpertiseLevel={updateExpertiseLevel} />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "services"} tabId="services">
                                <ServicesOffered
                                    trainerData={trainerData}
                                    newService={newService}
                                    setNewService={setNewService}
                                    addService={addService}
                                    removeService={removeService}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "availability"} tabId="availability">
                                <Availability
                                    trainerData={trainerData}
                                    handleChange={handleChange}
                                    setTrainerData={setTrainerData}
                                />
                            </AnimatedTabContent>

                            {/* Navigation and Submit */}
                            <div className="flex justify-between border-t border-[#333] pt-8">
                                <div className="flex items-center gap-3">
                                    {sections.map((section, _index) => {
                                        const isActive = activeSection === section.id;

                                        return (
                                            <button
                                                key={section.id}
                                                type="button"
                                                onClick={() => setActiveSection(section.id)}
                                                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] shadow-lg shadow-orange-500/20"
                                                        : "bg-[#333] hover:bg-[#666]"
                                                }`}
                                                aria-label={`Go to ${section.label}`}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="secondary" onClick={goBack}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="orangeFilled"
                                        size="large"
                                        leftIcon={<SaveIcon size={20} />}
                                        className="relative overflow-hidden"
                                    >
                                        <span className={`transition-opacity ${saveIndicator ? "opacity-0" : "opacity-100"}`}>
                                            Save Profile
                                        </span>
                                        <span
                                            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                                                saveIndicator ? "opacity-100" : "opacity-0"
                                            }`}
                                        >
                                            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                            Saving...
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TrainerEditProfilePage;
