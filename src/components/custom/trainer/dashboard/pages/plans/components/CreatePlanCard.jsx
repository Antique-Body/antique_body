"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { CreatePlusBadgeIcon, NutritionPlanIcon, TrainingPlanIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const CreatePlanCard = ({ type, index = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isNutrition = type === "nutrition";
    const url = isNutrition ? "/trainer/dashboard/plans/nutrition/create" : "/trainer/dashboard/plans/training/create";

    // Configuration for each plan type
    const config = {
        nutrition: {
            title: "Create Nutrition Plan",
            description: "Design personalized meal plans, set macros, and provide dietary guidance for your clients.",
            gradientFrom: "#FF6B00",
            gradientTo: "#FF9500",
            image: "/images/plans/nutrition/create-nutrition.svg",
            features: ["Customizable meal templates", "Nutrition tracking", "Recipe suggestions"],
            icon: <NutritionPlanIcon />,
            plusIcon: <CreatePlusBadgeIcon />,
        },
        training: {
            title: "Create Training Plan",
            description: "Design workout routines, set sessions, and build comprehensive training programs.",
            gradientFrom: "#FF6B00",
            gradientTo: "#FF3A00",
            image: "https://myindianthings.com/cdn/shop/products/Gym_Yoga_wallpapers-compressed-page-010_90cb5bf1-be16-4734-b985-969ac1b2f1d7_800x.jpg?v=1658401564",
            features: ["Progressive workout templates", "Exercise library access", "Schedule customization"],
            icon: <TrainingPlanIcon />,
            plusIcon: <CreatePlusBadgeIcon />,
        },
    };

    const planConfig = isNutrition ? config.nutrition : config.training;

    // Enhanced 3D animation variants
    const cardVariants = {
        initial: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            rotateX: 10,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.1,
            },
        },
        hover: {
            scale: 1.02,
            rotateX: 5,
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    // Floating particles animation for background
    const particleVariants = {
        animate: (i) => ({
            y: [0, -15, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.2, 1],
            transition: {
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
            },
        }),
    };

    // Plus icon animation
    const plusIconVariants = {
        animate: {
            rotate: [0, 180],
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
            },
        },
    };

    return (
        <motion.div
            className="h-full w-full"
            style={{ perspective: "1000px" }}
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={cardVariants}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={url} className="h-full block">
                <Card
                    variant="createPlanCard"
                    className="h-full relative overflow-hidden border border-[#333] rounded-xl transform-gpu transition-all duration-500 hover:border-transparent"
                >
                    {/* Glass morphism effect - more visible in non-hover state */}
                    <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#191919]/90 to-[#202020]/80 z-0"></div>

                    {/* Gradient background - visible in both states */}
                    <div
                        className="absolute inset-0 z-5 opacity-15"
                        style={{
                            background: `linear-gradient(135deg, ${planConfig.gradientFrom}33 0%, transparent 100%)`,
                        }}
                    ></div>

                    {/* Hover gradients & effects */}
                    <motion.div
                        className="absolute inset-0 opacity-0 z-10"
                        animate={{ opacity: isHovered ? 0.15 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            background: `radial-gradient(circle at center, ${planConfig.gradientFrom}, transparent 70%)`,
                        }}
                    />

                    {/* Animated border glow */}
                    <motion.div
                        className="absolute inset-0 rounded-xl z-0 opacity-0"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            background: `linear-gradient(90deg, transparent, ${planConfig.gradientFrom}40, transparent)`,
                            backgroundSize: "200% 100%",
                            animation: isHovered ? "shimmer 2s infinite" : "none",
                        }}
                    />

                    {/* Always visible soft border glow */}
                    <div
                        className="absolute inset-0 rounded-xl border-2 border-opacity-10 z-5"
                        style={{
                            borderColor: planConfig.gradientFrom,
                            boxShadow: `inset 0 0 20px ${planConfig.gradientFrom}22`,
                        }}
                    ></div>

                    {/* Corner badge - always visible */}
                    <div className="absolute top-0 right-0 z-30 hidden md:block">
                        <div
                            className="w-16 h-16 flex items-center justify-center transform rotate-45 translate-x-8 -translate-y-8"
                            style={{
                                background: `linear-gradient(135deg, ${planConfig.gradientFrom}, ${planConfig.gradientTo})`,
                            }}
                        >
                            <div className="transform -rotate-45 text-white">{planConfig.plusIcon}</div>
                        </div>
                    </div>

                    {/* Mobile-friendly badge */}
                    <div className="absolute top-4 right-4 z-30 md:hidden">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, ${planConfig.gradientFrom}, ${planConfig.gradientTo})`,
                            }}
                        >
                            <div className="text-white scale-75">{planConfig.plusIcon}</div>
                        </div>
                    </div>

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={particleVariants}
                            animate="animate"
                            className="absolute rounded-full z-10"
                            style={{
                                background: `radial-gradient(circle, ${planConfig.gradientFrom}40, transparent)`,
                                width: `${10 + i * 5}px`,
                                height: `${10 + i * 5}px`,
                                left: `${10 + i * 15}%`,
                                top: `${20 + i * 10}%`,
                                opacity: isHovered ? 0.6 : 0.2,
                                filter: "blur(2px)",
                                transition: "opacity 0.5s ease",
                            }}
                        />
                    ))}

                    <div className="relative flex flex-col h-full z-20">
                        {/* Header section */}
                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Animated icon container - improved for non-hover state */}
                            <motion.div
                                className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full relative"
                                style={{
                                    background: `linear-gradient(135deg, ${planConfig.gradientFrom}, ${planConfig.gradientTo})`,
                                    boxShadow: `0 10px 25px -5px ${planConfig.gradientFrom}66`,
                                }}
                                animate={{
                                    scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
                                    rotate: isHovered ? [0, 5, 0, -5, 0] : [0, 2, 0, -2, 0],
                                }}
                                transition={{
                                    duration: isHovered ? 2 : 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <div className="scale-75 sm:scale-100">{planConfig.icon}</div>

                                {/* Pulsing ring effect - lighter in non-hover */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: `2px solid ${planConfig.gradientFrom}`,
                                    }}
                                    animate={{
                                        opacity: isHovered ? [0.7, 0] : [0.4, 0.1],
                                        scale: isHovered ? [1, 1.5] : [1, 1.3],
                                    }}
                                    transition={{
                                        duration: isHovered ? 1.5 : 2.5,
                                        repeat: Infinity,
                                    }}
                                />
                            </motion.div>

                            <div>
                                <motion.h3
                                    className="text-lg sm:text-xl font-bold mb-1 text-white flex items-center"
                                    animate={{ color: isHovered ? planConfig.gradientFrom : "#fff" }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        textShadow: `0 0 10px ${planConfig.gradientFrom}33`,
                                    }}
                                >
                                    {planConfig.title}
                                    <motion.span
                                        className="ml-2 text-[#FF6B00] flex items-center justify-center"
                                        variants={plusIconVariants}
                                        animate="animate"
                                    >
                                        {planConfig.plusIcon}
                                    </motion.span>
                                </motion.h3>
                                <p className="text-gray-300 text-xs sm:text-sm leading-tight">{planConfig.description}</p>
                            </div>
                        </div>

                        {/* Features section with reveal animation */}
                        <motion.div
                            className="px-4 sm:px-6 py-2 sm:py-4 flex-grow"
                            animate={isHovered ? { opacity: 1, height: "auto" } : { opacity: 0.85, height: "auto" }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-2 sm:space-y-3">
                                {planConfig.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: isHovered ? 1 : i < 2 ? 0.8 : 0.5, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * i }}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: planConfig.gradientFrom }}
                                        />
                                        <p className="text-xs sm:text-sm text-gray-300">{feature}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Action button - improved for non-hover */}
                        <div className="p-4 sm:p-6 pt-2 sm:pt-3">
                            <motion.div
                                className="py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center text-xs sm:text-sm font-medium relative overflow-hidden"
                                style={{
                                    background: isHovered
                                        ? `linear-gradient(135deg, ${planConfig.gradientFrom}, ${planConfig.gradientTo})`
                                        : `linear-gradient(135deg, ${planConfig.gradientFrom}80, ${planConfig.gradientTo}80)`,
                                    color: "white",
                                    boxShadow: isHovered
                                        ? `0 10px 25px -5px ${planConfig.gradientFrom}66`
                                        : `0 5px 15px -5px ${planConfig.gradientFrom}44`,
                                }}
                                animate={{
                                    y: isHovered ? 0 : [0, -2, 0],
                                    scale: isHovered ? 1 : [1, 1.02, 1],
                                }}
                                transition={{
                                    y: { repeat: isHovered ? 0 : Infinity, duration: 2 },
                                    scale: { repeat: isHovered ? 0 : Infinity, duration: 2 },
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <span className="whitespace-nowrap">
                                        {isHovered ? "Start Creating Now" : "Create New Plan"}
                                    </span>
                                    {!isHovered && (
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            →
                                        </motion.span>
                                    )}
                                </span>

                                {/* Animated ripple effect on hover */}
                                {isHovered ? (
                                    <motion.div
                                        className="absolute inset-0 z-0"
                                        initial={{ scale: 0, x: "-50%", y: "-50%", opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        style={{
                                            background: `radial-gradient(circle, ${planConfig.gradientFrom}80 0%, transparent 50%)`,
                                            top: "50%",
                                            left: "50%",
                                            width: "100%",
                                            height: "100%",
                                            transformOrigin: "center",
                                        }}
                                    />
                                ) : (
                                    <motion.div
                                        className="absolute inset-0 z-0"
                                        animate={{
                                            opacity: [0.2, 0.4, 0.2],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            background: `linear-gradient(to right, transparent, ${planConfig.gradientFrom}40, transparent)`,
                                            backgroundSize: "200% 100%",
                                        }}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </Link>

            {/* CSS for shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </motion.div>
    );
};
