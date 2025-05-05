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
    BasicInformation,
    DietaryPreferences,
    FitnessGoals,
    MedicalInformation,
    PhysicalMeasurements,
} from "@/components/custom/client/edit-profile";

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

const ClientEditProfilePage = () => {
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState(null);
    const [activeSection, setActiveSection] = useState("basicInfo");
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [formProgress, setFormProgress] = useState(20);

    // Sample client data - in a real app this would come from an API
    const [clientData, setClientData] = useState({
        name: "John Smith",
        age: 32,
        gender: "Male",
        contact: {
            email: "john.smith@example.com",
            phone: "+1 (555) 987-6543",
        },
        location: {
            city: "Los Angeles",
            state: "California",
            country: "USA",
        },
        fitnessGoals: ["Weight Loss", "Muscle Gain", "Improve Cardiovascular Health"],
        currentWeight: 85, // kg
        targetWeight: 75, // kg
        height: 178, // cm
        bodyFat: 22, // %
        measurements: {
            chest: 100, // cm
            waist: 90, // cm
            hips: 95, // cm
            arms: 35, // cm
            thighs: 55, // cm
        },
        medicalConditions: ["None"],
        allergies: ["None"],
        injuries: ["Minor lower back pain"],
        dietaryPreferences: {
            diet: "Omnivore",
            restrictions: ["Low sugar"],
            intolerances: ["None"],
            calorieGoal: 2200,
            macros: {
                protein: 35, // %
                carbs: 45, // %
                fats: 20, // %
            },
        },
        fitnessLevel: "Intermediate",
        activityLevel: "Moderately active",
        preferredWorkoutDays: ["Monday", "Wednesday", "Friday"],
        preferredWorkoutTimes: ["Evening"],
        bio: "I'm looking to get back in shape after a few years of low activity. I used to play soccer regularly and want to regain my fitness and strength.",
    });

    // Update form progress whenever any data changes
    useEffect(() => {
        calculateFormProgress();
    }, [clientData]);

    // Calculate form completion percentage
    const calculateFormProgress = () => {
        // This is a simplified calculation - in a real app you'd check all required fields
        const totalFields = 15; // approximate total number of important fields
        let filledFields = 0;

        if (clientData.name) filledFields++;
        if (clientData.age) filledFields++;
        if (clientData.gender) filledFields++;
        if (clientData.contact.email) filledFields++;
        if (clientData.location.city) filledFields++;
        if (clientData.currentWeight) filledFields++;
        if (clientData.height) filledFields++;
        if (clientData.fitnessGoals.length > 0) filledFields++;
        if (clientData.measurements.chest) filledFields++;
        if (clientData.measurements.waist) filledFields++;
        if (clientData.bodyFat) filledFields++;
        if (clientData.dietaryPreferences.diet) filledFields++;
        if (clientData.dietaryPreferences.calorieGoal) filledFields++;
        if (clientData.fitnessLevel) filledFields++;
        if (clientData.bio) filledFields++;

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
            setClientData({
                ...clientData,
                [parent]: {
                    ...clientData[parent],
                    [child]: value,
                },
            });
        } else {
            setClientData({
                ...clientData,
                [name]: value,
            });
        }
    };

    // Handle nested macros (third level)
    const _handleMacroChange = (e) => {
        const { name, value } = e.target;

        // Show temporary save indicator effect
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);

        setClientData({
            ...clientData,
            dietaryPreferences: {
                ...clientData.dietaryPreferences,
                macros: {
                    ...clientData.dietaryPreferences.macros,
                    [name]: value,
                },
            },
        });
    };

    // Handle nested measurements (second level)
    const handleMeasurementChange = (e) => {
        const { name, value } = e.target;

        // Show temporary save indicator effect
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);

        setClientData({
            ...clientData,
            measurements: {
                ...clientData.measurements,
                [name]: value,
            },
        });
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

    // Add or remove from simple arrays
    const handleArrayItemChange = (array, item, isAdding) => {
        // Show temporary save indicator effect
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1000);

        if (isAdding) {
            if (!clientData[array].includes(item) && item.trim()) {
                setClientData({
                    ...clientData,
                    [array]: [...clientData[array], item.trim()],
                });
            }
        } else {
            setClientData({
                ...clientData,
                [array]: clientData[array].filter((i) => i !== item),
            });
        }
    };

    // State for new items
    const [newGoal, setNewGoal] = useState("");
    const [newMedicalCondition, setNewMedicalCondition] = useState("");
    const [newAllergy, setNewAllergy] = useState("");
    const [newInjury, setNewInjury] = useState("");
    const [newDietaryRestriction, setNewDietaryRestriction] = useState("");
    const [newIntolerance, setNewIntolerance] = useState("");

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Show saving animation
        setSaveIndicator(true);

        // In a real app, you'd save this to your backend
        setTimeout(() => {
            setSaveIndicator(false);
            router.push("/client/dashboard");
        }, 1500);
    };

    // Go back to dashboard
    const goBack = () => {
        router.push("/client/dashboard");
    };

    // Navigation sections
    const sections = [
        { id: "basicInfo", label: "Basic Information", badgeCount: 0 },
        { id: "fitnessGoals", label: "Fitness Goals", badgeCount: 0 },
        { id: "measurements", label: "Measurements", badgeCount: 0 },
        { id: "medicalInfo", label: "Medical Info", badgeCount: 0 },
        { id: "dietaryPrefs", label: "Diet & Nutrition", badgeCount: 0 },
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
                                    clientData={clientData}
                                    handleChange={handleChange}
                                    previewImage={previewImage}
                                    handleImageUpload={handleImageUpload}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "fitnessGoals"} tabId="fitnessGoals">
                                <FitnessGoals
                                    clientData={clientData}
                                    handleChange={handleChange}
                                    newGoal={newGoal}
                                    setNewGoal={setNewGoal}
                                    addGoal={() => handleArrayItemChange("fitnessGoals", newGoal, true)}
                                    removeGoal={(goal) => handleArrayItemChange("fitnessGoals", goal, false)}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "measurements"} tabId="measurements">
                                <PhysicalMeasurements
                                    clientData={clientData}
                                    handleChange={handleChange}
                                    handleMeasurementChange={handleMeasurementChange}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "medicalInfo"} tabId="medicalInfo">
                                <MedicalInformation
                                    clientData={clientData}
                                    newCondition={newMedicalCondition}
                                    setNewCondition={setNewMedicalCondition}
                                    addCondition={() => handleArrayItemChange("medicalConditions", newMedicalCondition, true)}
                                    removeCondition={(condition) =>
                                        handleArrayItemChange("medicalConditions", condition, false)
                                    }
                                    newAllergy={newAllergy}
                                    setNewAllergy={setNewAllergy}
                                    addAllergy={() => handleArrayItemChange("allergies", newAllergy, true)}
                                    removeAllergy={(allergy) => handleArrayItemChange("allergies", allergy, false)}
                                    newInjury={newInjury}
                                    setNewInjury={setNewInjury}
                                    addInjury={() => handleArrayItemChange("injuries", newInjury, true)}
                                    removeInjury={(injury) => handleArrayItemChange("injuries", injury, false)}
                                />
                            </AnimatedTabContent>

                            <AnimatedTabContent isActive={activeSection === "dietaryPrefs"} tabId="dietaryPrefs">
                                <DietaryPreferences
                                    clientData={{
                                        ...clientData,
                                        dietType: clientData.dietaryPreferences.diet,
                                        calorieGoal: clientData.dietaryPreferences.calorieGoal,
                                        proteinPercentage: clientData.dietaryPreferences.macros.protein,
                                        carbsPercentage: clientData.dietaryPreferences.macros.carbs,
                                        fatsPercentage: clientData.dietaryPreferences.macros.fats,
                                        dietaryRestrictions: clientData.dietaryPreferences.restrictions,
                                        foodIntolerances: clientData.dietaryPreferences.intolerances,
                                    }}
                                    handleChange={(e) => {
                                        const { name, value } = e.target;

                                        // Show temporary save indicator effect
                                        setSaveIndicator(true);
                                        setTimeout(() => setSaveIndicator(false), 1000);

                                        if (name === "dietType") {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    diet: value,
                                                },
                                            });
                                        } else if (name === "calorieGoal") {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    calorieGoal: value,
                                                },
                                            });
                                        } else if (name === "proteinPercentage") {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    macros: {
                                                        ...clientData.dietaryPreferences.macros,
                                                        protein: value,
                                                    },
                                                },
                                            });
                                        } else if (name === "carbsPercentage") {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    macros: {
                                                        ...clientData.dietaryPreferences.macros,
                                                        carbs: value,
                                                    },
                                                },
                                            });
                                        } else if (name === "fatsPercentage") {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    macros: {
                                                        ...clientData.dietaryPreferences.macros,
                                                        fats: value,
                                                    },
                                                },
                                            });
                                        } else {
                                            // Handle other properties
                                            handleChange(e);
                                        }
                                    }}
                                    newRestriction={newDietaryRestriction}
                                    setNewRestriction={setNewDietaryRestriction}
                                    addRestriction={() => {
                                        if (newDietaryRestriction.trim()) {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    restrictions: [
                                                        ...clientData.dietaryPreferences.restrictions,
                                                        newDietaryRestriction.trim(),
                                                    ],
                                                },
                                            });
                                            setSaveIndicator(true);
                                            setTimeout(() => setSaveIndicator(false), 1000);
                                            setNewDietaryRestriction("");
                                        }
                                    }}
                                    removeRestriction={(restriction) => {
                                        setClientData({
                                            ...clientData,
                                            dietaryPreferences: {
                                                ...clientData.dietaryPreferences,
                                                restrictions: clientData.dietaryPreferences.restrictions.filter(
                                                    (r) => r !== restriction
                                                ),
                                            },
                                        });
                                        setSaveIndicator(true);
                                        setTimeout(() => setSaveIndicator(false), 1000);
                                    }}
                                    newIntolerance={newIntolerance}
                                    setNewIntolerance={setNewIntolerance}
                                    addIntolerance={() => {
                                        if (newIntolerance.trim()) {
                                            setClientData({
                                                ...clientData,
                                                dietaryPreferences: {
                                                    ...clientData.dietaryPreferences,
                                                    intolerances: [
                                                        ...clientData.dietaryPreferences.intolerances,
                                                        newIntolerance.trim(),
                                                    ],
                                                },
                                            });
                                            setSaveIndicator(true);
                                            setTimeout(() => setSaveIndicator(false), 1000);
                                            setNewIntolerance("");
                                        }
                                    }}
                                    removeIntolerance={(intolerance) => {
                                        setClientData({
                                            ...clientData,
                                            dietaryPreferences: {
                                                ...clientData.dietaryPreferences,
                                                intolerances: clientData.dietaryPreferences.intolerances.filter(
                                                    (i) => i !== intolerance
                                                ),
                                            },
                                        });
                                        setSaveIndicator(true);
                                        setTimeout(() => setSaveIndicator(false), 1000);
                                    }}
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
                                        leftIcon={<SaveIcon size={16} />}
                                        className="relative overflow-hidden"
                                    >
                                        <span className={`transition-opacity ${saveIndicator ? "opacity-0" : "opacity-100"}`}>
                                            Save Changes
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

export default ClientEditProfilePage;
