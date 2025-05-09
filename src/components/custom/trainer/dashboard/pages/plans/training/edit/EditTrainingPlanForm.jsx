"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { TrainingPlanInfo } from "../../nutrition/create/TrainingPlanInfo";
import { ExerciseLibrary } from "../create/ExerciseLibrary";
import { SessionsSchedule } from "../create/SessionsSchedule";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { ChevronLeftIcon, ChevronRightIcon, SaveIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

const STEPS = [
    { id: "info", label: "Plan Information", icon: "📋" },
    { id: "sessions", label: "Training Sessions", icon: "💪" },
    { id: "exercises", label: "Exercise Library", icon: "🏋️" },
];

export const EditTrainingPlanForm = ({ initialData }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [planData, setPlanData] = useState(initialData);
    const [previewImage, setPreviewImage] = useState(initialData.coverImage);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const formRef = useRef(null);

    const handleInfoChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setPlanData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setPlanData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
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

    const updateSchedule = (updatedSchedule) => {
        setPlanData((prev) => ({
            ...prev,
            schedule: updatedSchedule,
        }));
    };

    const updateExerciseLibrary = (updatedLibrary) => {
        setPlanData((prev) => ({
            ...prev,
            exerciseLibrary: updatedLibrary,
        }));
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
                message: "Training plan updated successfully!",
            });

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
        router.push("/trainer/dashboard/plans");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <TrainingPlanInfo
                        planData={planData}
                        handleChange={handleInfoChange}
                        handleImageChange={handleImageChange}
                        previewImage={previewImage}
                    />
                );
            case 1:
                return (
                    <SessionsSchedule
                        schedule={planData.schedule}
                        updateSchedule={updateSchedule}
                        exerciseLibrary={planData.exerciseLibrary}
                    />
                );
            case 2:
                return (
                    <ExerciseLibrary exerciseLibrary={planData.exerciseLibrary} updateExerciseLibrary={updateExerciseLibrary} />
                );
            default:
                return null;
        }
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;

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
                    <h1 className="ml-4 text-2xl font-bold text-white">Edit Training Plan</h1>
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
                    <div className="flex overflow-x-auto custom-scrollbar no-scrollbar">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center cursor-pointer px-4 py-2 mr-2 rounded-lg transition-all duration-300 ${
                                    currentStep === index
                                        ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                                        : "text-gray-400 hover:bg-[#222]"
                                }`}
                                onClick={() => setCurrentStep(index)}
                            >
                                <span className="mr-2 text-xl">{step.icon}</span>
                                <span className="whitespace-nowrap">{step.label}</span>
                                {index < STEPS.length - 1 && <ChevronRightIcon size={16} className="ml-4 text-gray-600" />}
                            </div>
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
                        {!isFirstStep && (
                            <Button variant="secondary" onClick={prevStep} leftIcon={<ChevronLeftIcon size={16} />}>
                                Previous
                            </Button>
                        )}
                        <div className="ml-auto">
                            {!isLastStep ? (
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
