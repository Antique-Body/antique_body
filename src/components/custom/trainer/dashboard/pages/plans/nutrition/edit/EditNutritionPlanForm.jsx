"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DailyMealPlanner } from "../../create-nutrition-plan/DailyMealPlanner";
import { NutritionPlanInfo } from "../../create-nutrition-plan/NutritionPlanInfo";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { ChevronLeftIcon, ChevronRightIcon, SaveIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const EditNutritionPlanForm = ({ initialData }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [planData, setPlanData] = useState(initialData);
    const [previewImage, setPreviewImage] = useState(initialData.coverImage);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState("Monday");
    const formRef = useRef(null);
    const tabsRef = useRef(null);

    // Track changes to mark form as dirty
    useEffect(() => {
        setIsDirty(true);
    }, [planData]);

    // Scroll to active tab
    useEffect(() => {
        if (tabsRef.current && currentStep > 0) {
            const activeTabEl = tabsRef.current.querySelector(`[data-day="${activeTab}"]`);
            if (activeTabEl) {
                const containerWidth = tabsRef.current.offsetWidth;
                const tabPos = activeTabEl.offsetLeft;
                const scrollPos = tabPos - containerWidth / 2 + activeTabEl.offsetWidth / 2;
                tabsRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
            }
        }
    }, [activeTab, currentStep]);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setPlanData({
                ...planData,
                [parent]: {
                    ...planData[parent],
                    [child]: value,
                },
            });
        } else {
            setPlanData({
                ...planData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setPlanData((prev) => ({
                ...prev,
                coverImage: file,
            }));
        }
    };

    const updateDayMeals = (day, updatedMeals) => {
        setPlanData({
            ...planData,
            days: {
                ...planData.days,
                [day]: {
                    ...planData.days[day],
                    mealPlans: updatedMeals,
                },
            },
        });
    };

    const nextStep = () => {
        if (formRef.current) {
            // Briefly add a class for animation
            formRef.current.classList.add("form-transition-out");
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.classList.remove("form-transition-out");
                        formRef.current.classList.add("form-transition-in");
                        setTimeout(() => {
                            if (formRef.current) {
                                formRef.current.classList.remove("form-transition-in");
                            }
                        }, 500);
                    }
                }, 50);
            }, 200);
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (formRef.current) {
            formRef.current.classList.add("form-slide-right");
            setTimeout(() => {
                setCurrentStep((prev) => prev - 1);
                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.classList.remove("form-slide-right");
                        formRef.current.classList.add("form-slide-from-left");
                        setTimeout(() => {
                            if (formRef.current) {
                                formRef.current.classList.remove("form-slide-from-left");
                            }
                        }, 500);
                    }
                }, 50);
            }, 200);
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Show success notification
            setNotification({
                type: "success",
                message: "Nutrition plan updated successfully!",
            });

            setIsDirty(false);
            setIsSaving(false);

            // Navigate after delay
            setTimeout(() => {
                router.push("/trainer/dashboard/plans");
            }, 1500);
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to update plan. Please try again.",
            });
            console.error(error);
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
                router.push("/trainer/dashboard/plans");
            }
        } else {
            router.push("/trainer/dashboard/plans");
        }
    };

    const handleDaySelection = (day) => {
        setActiveTab(day);
    };

    // Function to add a new day if it doesn't exist yet
    const handleAddDay = (day) => {
        if (!planData.days[day]) {
            setPlanData({
                ...planData,
                days: {
                    ...planData.days,
                    [day]: {
                        mealPlans: [
                            {
                                name: "Breakfast",
                                time: "08:00",
                                options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                            },
                            {
                                name: "Lunch",
                                time: "13:00",
                                options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                            },
                            {
                                name: "Dinner",
                                time: "19:00",
                                options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
                            },
                        ],
                    },
                },
            });
        }
        setActiveTab(day);
    };

    const renderStep = () => {
        if (currentStep === 0) {
            return (
                <NutritionPlanInfo
                    planData={planData}
                    handleChange={handleInfoChange}
                    handleImageChange={handleImageChange}
                    previewImage={previewImage}
                />
            );
        } else if (currentStep === 1) {
            return (
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Weekly Meal Plan</h3>
                        <p className="text-gray-400 mb-4">
                            Create custom meal plans for each day of the week. You can add different meal options so clients can
                            choose based on their preferences.
                        </p>

                        {/* Day selection tabs */}
                        <div
                            className="flex overflow-x-auto py-2 mb-6 custom-scrollbar no-scrollbar border-b border-[#333]"
                            ref={tabsRef}
                        >
                            {DAYS_OF_WEEK.map((day) => {
                                const hasMealPlan = !!planData.days[day];
                                return (
                                    <div
                                        key={day}
                                        data-day={day}
                                        className={`flex cursor-pointer items-center px-4 py-2 mr-2 rounded-t-lg transition-all duration-300 border-b-2 ${
                                            activeTab === day
                                                ? "border-[#FF6B00] text-[#FF6B00] bg-[rgba(255,107,0,0.1)]"
                                                : hasMealPlan
                                                  ? "border-transparent text-gray-300 hover:text-white"
                                                  : "border-transparent text-gray-500 hover:text-gray-300"
                                        }`}
                                        onClick={() => (hasMealPlan ? handleDaySelection(day) : handleAddDay(day))}
                                    >
                                        <span className="whitespace-nowrap">{day}</span>
                                        {!hasMealPlan && (
                                            <span className="ml-2 text-xs bg-[#333] px-2 py-0.5 rounded-full">+ Add</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Day content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {planData.days[activeTab] && (
                                    <DailyMealPlanner
                                        day={activeTab}
                                        meals={planData.days[activeTab].mealPlans}
                                        updateMeals={(updatedMeals) => updateDayMeals(activeTab, updatedMeals)}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Animation variants for framer-motion
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 rounded-lg p-4 shadow-lg ${
                            notification.type === "success" ? "bg-green-800" : "bg-red-800"
                        }`}
                    >
                        <p className="text-white">{notification.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <BackButton onClick={handleCancel} />
                    <h1 className="ml-4 text-2xl font-bold text-white">Edit Nutrition Plan</h1>
                </div>

                <div className="flex space-x-2">
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="orangeFilled" onClick={handleSubmit} loading={isSaving} leftIcon={<SaveIcon size={16} />}>
                        Save Changes
                    </Button>
                </div>
            </div>

            <Card variant="darkStrong" width="100%" maxWidth="100%" className="mb-6">
                {/* Progress navigation */}
                <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-6">
                    <div className="flex">
                        <div
                            className={`flex items-center cursor-pointer px-4 py-2 mr-2 rounded-lg transition-all duration-300 ${
                                currentStep === 0 ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]" : "text-gray-400 hover:bg-[#222]"
                            }`}
                            onClick={() => setCurrentStep(0)}
                        >
                            <span className="mr-2 text-xl">📋</span>
                            <span>Plan Details</span>
                        </div>
                        <div
                            className={`flex items-center cursor-pointer px-4 py-2 mr-2 rounded-lg transition-all duration-300 ${
                                currentStep === 1 ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]" : "text-gray-400 hover:bg-[#222]"
                            }`}
                            onClick={() => setCurrentStep(1)}
                        >
                            <span className="mr-2 text-xl">🍎</span>
                            <span>Meal Planning</span>
                        </div>
                    </div>
                    <div className="hidden md:flex space-x-1 items-center">
                        {[0, 1].map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index < currentStep
                                        ? "bg-[#FF6B00]"
                                        : index === currentStep
                                          ? "bg-[#FF6B00] animate-pulse"
                                          : "bg-[#444]"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="transition-all duration-300">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageVariants}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-8 pt-6 border-t border-[#333]">
                        {currentStep > 0 && (
                            <Button variant="secondary" onClick={prevStep} leftIcon={<ChevronLeftIcon size={16} />}>
                                Previous
                            </Button>
                        )}
                        <div className="ml-auto">
                            {currentStep === 0 ? (
                                <Button variant="orangeFilled" onClick={nextStep} rightIcon={<ChevronRightIcon size={16} />}>
                                    Next
                                </Button>
                            ) : (
                                <Button variant="orangeFilled" onClick={handleSubmit} loading={isSaving}>
                                    Update Plan
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Card>

            {/* Custom CSS for transitions */}
            <style jsx>{`
                .form-transition-out {
                    opacity: 0;
                    transform: translateX(-20px);
                    transition: all 0.2s ease-out;
                }
                .form-transition-in {
                    opacity: 1;
                    transform: translateX(0);
                    transition: all 0.3s ease-in;
                }
                .form-slide-right {
                    opacity: 0;
                    transform: translateX(20px);
                    transition: all 0.2s ease-out;
                }
                .form-slide-from-left {
                    opacity: 1;
                    transform: translateX(0);
                    transition: all 0.3s ease-in;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};
