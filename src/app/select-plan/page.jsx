"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import {
    BackgroundElements,
    ComparisonTable,
    DurationToggle,
    FAQ,
    PricingCard,
} from "@/components/custom/select-plan/components";
import { clientPricingPlans, trainerPricingPlans, userPricingPlans } from "@/components/custom/select-plan/pricingPlans";

// Main pricing section component
export default function PricingSection() {
    const router = useRouter();
    const [duration, setDuration] = useState("monthly");
    const [isVisible, setIsVisible] = useState({
        title: false,
        cards: false,
        faq: false,
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [pricingPlans, setPricingPlans] = useState([]);

    // Fetch session and set appropriate pricing plans
    useEffect(() => {
        const fetchSessionAndSetPlans = async () => {
            try {
                const response = await fetch("/api/auth/session");
                const session = await response.json();

                if (session?.user?.role) {
                    switch (session.user.role) {
                        case "client":
                            setPricingPlans(clientPricingPlans);
                            break;
                        case "trainer":
                            setPricingPlans(trainerPricingPlans);
                            break;
                        case "user":
                            setPricingPlans(userPricingPlans);
                            break;
                        default:
                            setPricingPlans(userPricingPlans);
                    }
                } else {
                    setPricingPlans(userPricingPlans);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
                setPricingPlans(userPricingPlans);
            }
        };

        fetchSessionAndSetPlans();
    }, []);

    // Handle mouse position for parallax effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Handle scroll animations
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;

            if (position > 100) {
                setIsVisible((prev) => ({ ...prev, title: true }));
            }

            if (position > 300) {
                setIsVisible((prev) => ({ ...prev, cards: true }));
            }

            if (position > 700) {
                setIsVisible((prev) => ({ ...prev, faq: true }));
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Trigger initial animations
        setTimeout(() => {
            setIsVisible((prev) => ({ ...prev, title: true }));
            setTimeout(() => {
                setIsVisible((prev) => ({ ...prev, cards: true }));
                setTimeout(() => {
                    setIsVisible((prev) => ({ ...prev, faq: true }));
                }, 600);
            }, 400);
        }, 300);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handlePlanSelect = async (_plan) => {
        try {
            const response = await fetch("/api/auth/session");
            const session = await response.json();

            if (session?.user?.role) {
                router.push(`/${session.user.role}/dashboard`);
            } else {
                // Fallback if role is not available
                router.push("/select-role");
            }
        } catch (error) {
            console.error("Error fetching session:", error);
            router.push("/select-role");
        }
    };

    return (
        <div className="min-h-screen w-full relative bg-black flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .hide-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .hide-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 107, 0, 0.2);
                    border-radius: 10px;
                }
                .hide-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 107, 0, 0.4);
                }

                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }

                .floating-element {
                    animation: float 6s ease-in-out infinite;
                    transition: transform 0.2s ease-out;
                }

                .floating-element-slow {
                    animation: float 8s ease-in-out infinite;
                    transition: transform 0.3s ease-out;
                }

                .floating-element-fast {
                    animation: float 4s ease-in-out infinite;
                    transition: transform 0.15s ease-out;
                }

                .glow-hover {
                    transition:
                        box-shadow 0.3s ease-out,
                        transform 0.3s ease-out;
                }

                .glow-hover:hover {
                    box-shadow: 0 0 15px rgba(255, 107, 0, 0.3);
                    transform: translateY(-3px);
                }
            `}</style>

            {/* Background elements */}
            <BackgroundElements />

            {/* Header section */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="relative">
                    {/* Animated decorative elements with mouse parallax effect */}
                    <motion.div
                        className="absolute -top-5 left-10 w-24 h-24 opacity-20"
                        animate={{
                            x: mousePosition.x * 0.01,
                            y: mousePosition.y * 0.01,
                        }}
                        transition={{ type: "spring", stiffness: 50, damping: 30 }}
                    >
                        <motion.div
                            className="w-full h-full rounded-full border border-[rgba(255,107,0,0.3)] floating-element-slow glow-hover"
                            whileHover={{
                                scale: 1.1,
                                borderColor: "rgba(255,107,0,0.5)",
                                boxShadow: "0 0 15px rgba(255, 107, 0, 0.2)",
                            }}
                        />
                    </motion.div>

                    <motion.div
                        className="absolute top-20 right-10 w-16 h-16 opacity-30"
                        animate={{
                            x: mousePosition.x * -0.008,
                            y: mousePosition.y * -0.008,
                        }}
                        transition={{ type: "spring", stiffness: 50, damping: 30 }}
                    >
                        <motion.div
                            className="w-full h-full rounded-full border border-[rgba(255,107,0,0.2)] floating-element glow-hover"
                            whileHover={{
                                scale: 1.1,
                                borderColor: "rgba(255,107,0,0.4)",
                                boxShadow: "0 0 15px rgba(255, 107, 0, 0.2)",
                            }}
                        />
                    </motion.div>

                    {/* Title with enhanced gradient and animations */}
                    <motion.div
                        className="text-center mb-12 relative z-10"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: isVisible.title ? 1 : 0, y: isVisible.title ? 0 : -40 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-block relative">
                            <motion.h2
                                className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-xl"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <span className="text-white">Choose Your </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] relative">
                                    Plan
                                    <motion.div
                                        className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full opacity-70"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1, delay: 1 }}
                                    />
                                </span>
                            </motion.h2>

                            {/* Subtle glow behind the heading */}
                            <div className="absolute -inset-10 bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-[rgba(255,154,0,0.05)] rounded-full blur-3xl -z-10"></div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl"
                        >
                            Select the perfect plan that fits your needs. Upgrade or downgrade anytime.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Pricing toggle with enhanced animation */}
                <motion.div
                    className="flex justify-center mb-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isVisible.title ? 1 : 0, scale: isVisible.title ? 1 : 0.8 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <DurationToggle duration={duration} setDuration={setDuration} />
                </motion.div>

                {/* Pricing cards with staggered animation */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: isVisible.cards ? 1 : 0, y: isVisible.cards ? 0 : 40 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <AnimatePresence>
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 * index }}
                            >
                                <PricingCard
                                    name={plan.name}
                                    price={plan.price}
                                    features={plan.features}
                                    popular={plan.popular}
                                    onClick={() => handlePlanSelect(plan)}
                                    duration={duration}
                                    description={plan.description}
                                    btnText={plan.btnText}
                                    storage={plan.storage}
                                    users={plan.users}
                                    support={plan.support}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Decorative divider */}
                <motion.div
                    className="w-full max-w-4xl mx-auto flex items-center justify-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible.faq ? 0.7 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-1/4 h-[1px] bg-gradient-to-r from-transparent to-[rgba(255,107,0,0.3)]"></div>
                    <div className="mx-4">
                        <div className="w-4 h-4 rounded-full bg-[rgba(255,107,0,0.2)] relative">
                            <motion.div
                                className="absolute inset-0 rounded-full bg-[rgba(255,107,0,0.3)]"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </div>
                    </div>
                    <div className="w-1/4 h-[1px] bg-gradient-to-l from-transparent to-[rgba(255,107,0,0.3)]"></div>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible.faq ? 1 : 0, y: isVisible.faq ? 0 : 30 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                    <ComparisonTable />
                </motion.div>

                {/* FAQ Section with enhanced animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible.faq ? 1 : 0, y: isVisible.faq ? 0 : 30 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                    <FAQ />
                </motion.div>
            </div>

            {/* Additional visual enhancements */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-70 z-10"
                animate={{
                    y: [0, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            >
                <motion.div
                    className="w-20 h-[2px] bg-gradient-to-r from-[#FF6B00] to-transparent rounded-full"
                    animate={{
                        width: [80, 95, 80],
                        opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                />
                <motion.div
                    className="w-10 h-[2px] bg-gradient-to-r from-[#FF9A00] to-transparent rounded-full"
                    animate={{
                        width: [40, 50, 40],
                        opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", delay: 0.2 }}
                />
                <motion.div
                    className="w-6 h-[2px] bg-gradient-to-r from-[#FFC400] to-transparent rounded-full"
                    animate={{
                        width: [24, 30, 24],
                        opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: 0.4 }}
                />
            </motion.div>

            {/* Enhanced floating decorative elements with mouse interaction */}
            <motion.div
                className="absolute top-40 right-20 w-24 h-24 border border-[rgba(255,107,0,0.2)] rounded-full opacity-20 floating-element-slow"
                animate={{
                    x: mousePosition.x * 0.015,
                    y: mousePosition.y * 0.015,
                }}
                whileHover={{ scale: 1.2, borderColor: "rgba(255,107,0,0.4)" }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />

            <motion.div
                className="absolute bottom-40 left-20 w-16 h-16 border border-[rgba(255,107,0,0.15)] rounded-full opacity-15 floating-element"
                animate={{
                    x: mousePosition.x * -0.01,
                    y: mousePosition.y * -0.01,
                }}
                whileHover={{ scale: 1.2, borderColor: "rgba(255,107,0,0.3)" }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />

            <motion.div
                className="absolute top-1/4 left-1/4 w-12 h-12 border border-[rgba(255,154,0,0.1)] rounded-full opacity-10 floating-element-fast"
                animate={{
                    x: mousePosition.x * 0.008,
                    y: mousePosition.y * 0.008,
                }}
                whileHover={{ scale: 1.2, borderColor: "rgba(255,154,0,0.3)" }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />

            <motion.div
                className="absolute bottom-1/4 right-1/4 w-10 h-10 border border-[rgba(255,154,0,0.12)] rounded-full opacity-15 floating-element"
                animate={{
                    x: mousePosition.x * -0.012,
                    y: mousePosition.y * -0.012,
                }}
                whileHover={{ scale: 1.2, borderColor: "rgba(255,154,0,0.3)" }}
                transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />

            {/* Decorative radial gradients with animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[rgba(255,107,0,0.03)] to-transparent opacity-30 pointer-events-none"
                animate={{
                    opacity: [0.2, 0.3, 0.2],
                    backgroundPosition: ["0% 0%", "2% 2%", "0% 0%"],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            />

            <motion.div
                className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-[rgba(255,107,0,0.03)] to-transparent opacity-30 pointer-events-none"
                animate={{
                    opacity: [0.2, 0.3, 0.2],
                    backgroundPosition: ["0% 0%", "2% 2%", "0% 0%"],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
            />
        </div>
    );
}
