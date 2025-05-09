import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    DollarIcon,
    InfoIcon,
    NutritionPlanIcon,
    TrainingPlanIcon,
    UsersIcon,
} from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

export const PlanPreviewModal = ({ plan, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!plan) return null;

    const { title, description, image, createdAt, planType, duration, clientCount = 0, price } = plan;

    const isNutrition = planType === "nutrition";
    const PlanIcon = isNutrition ? NutritionPlanIcon : TrainingPlanIcon;

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Example data for detailed tabs (in a real app, this would come from the plan object)
    const mockDetails = {
        overview: {
            summary:
                "This comprehensive plan is designed to help clients achieve their specific goals through a structured approach tailored to individual needs.",
            keyFeatures: [
                "Personalized approach for each client",
                "Progressive adjustments based on progress",
                "Weekly check-ins and progress tracking",
                "Comprehensive tracking tools and resources",
            ],
            targetAudience: isNutrition
                ? "Clients looking to improve their nutrition habits, manage weight, or enhance performance through diet."
                : "Clients seeking to improve strength, endurance, mobility, or sport-specific performance.",
        },
        schedule: {
            weeks: isNutrition
                ? ["Week 1-2: Baseline establishment", "Week 3-4: Habit formation", "Week 5-8: Progressive implementation"]
                : ["Week 1-2: Foundation building", "Week 3-4: Volume progression", "Week 5-6: Intensity focus"],
            frequency: isNutrition ? "Daily meal plans" : "4-5 sessions per week",
            adaptability: "Highly customizable based on client progress and feedback",
        },
        clients: {
            activeCount: clientCount,
            successRate: "87%",
            averageRating: 4.7,
            testimonial: {
                text: "This plan transformed my approach and helped me achieve results I didn't think were possible.",
                author: "Alex T., Client",
            },
        },
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "schedule", label: "Schedule & Timeline" },
        { id: "clients", label: "Client Stats" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="large" footerButtons={false}>
            <div className="flex flex-col -mt-6 -mx-4 sm:-mx-5">
                {/* Banner image with gradient overlay */}
                <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                    {image && (
                        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]"></div>

                    {/* Plan type badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${
                                isNutrition ? "bg-green-900/80 text-green-100" : "bg-blue-900/80 text-blue-100"
                            }`}
                        >
                            <PlanIcon size={16} />
                            {isNutrition ? "Nutrition Plan" : "Training Plan"}
                        </span>
                    </div>

                    {/* Price tag */}
                    {price && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-[#FF6B00] text-white">
                                <DollarIcon size={14} className="mr-1" />${price}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content container */}
                <div className="px-4 sm:px-5">
                    {/* Title and metadata section */}
                    <div className="mt-6 mb-6">
                        <div className="flex justify-between mb-4 items-start gap-4 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>

                            {/* Moved client assignments button here for better visibility */}
                            <Button
                                variant="orangeFilled"
                                className="whitespace-nowrap"
                                onClick={() => {
                                    /* Handle navigation to client assignments */
                                }}
                            >
                                <UsersIcon size={16} className="mr-2" />
                                View Client Assignments
                            </Button>
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base mb-4">{description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <CalendarIcon size={16} className="text-[#FF6B00]" />
                                <span>Created: {formattedDate}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-300">
                                <ClockIcon size={16} className="text-[#FF6B00]" />
                                <span>Duration: {duration}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-300">
                                <UsersIcon size={16} className="text-[#FF6B00]" />
                                <span>{clientCount} active clients</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="border-b border-[#333] mb-6">
                        <div className="flex space-x-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 relative text-sm font-medium transition-colors ${
                                        activeTab === tab.id ? "text-[#FF6B00]" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="mb-6">
                        {/* Overview tab */}
                        {activeTab === "overview" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Plan Summary</h3>
                                    <p className="text-gray-300">{mockDetails.overview.summary}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {mockDetails.overview.keyFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CheckCircleIcon size={18} className="text-[#FF6B00] mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Ideal For</h3>
                                    <p className="text-gray-300">{mockDetails.overview.targetAudience}</p>
                                </div>

                                <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                    <div className="flex items-start gap-3">
                                        <InfoIcon size={20} className="text-[#FF6B00] mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Plan Insights</h4>
                                            <p className="text-sm text-gray-300">
                                                This plan has been assigned to {clientCount} clients with an average success
                                                rate of {mockDetails.clients.successRate}. Consider promoting this plan more if
                                                it continues to perform well.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Schedule tab */}
                        {activeTab === "schedule" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Timeline Structure</h3>
                                    <div className="space-y-4">
                                        {mockDetails.schedule.weeks.map((week, index) => (
                                            <div key={index} className="relative pl-8">
                                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-[#FF6B00]">{index + 1}</span>
                                                </div>
                                                {index !== mockDetails.schedule.weeks.length - 1 && (
                                                    <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]"></div>
                                                )}
                                                <div>
                                                    <h4 className="text-white font-medium">{week}</h4>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {isNutrition
                                                            ? "Focus on building consistent eating patterns and introducing key nutritional concepts."
                                                            : "Gradually increase intensity and volume while maintaining proper form and technique."}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3">Recommended Frequency</h3>
                                        <p className="text-gray-300">{mockDetails.schedule.frequency}</p>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3">Adaptability</h3>
                                        <p className="text-gray-300">{mockDetails.schedule.adaptability}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Clients tab */}
                        {activeTab === "clients" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <UsersIcon size={24} className="text-[#FF6B00] mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white mb-1">{clientCount}</div>
                                        <div className="text-sm text-gray-400">Active Clients</div>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <div className="text-[#FF6B00] mx-auto mb-2 text-2xl">%</div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {mockDetails.clients.successRate}
                                        </div>
                                        <div className="text-sm text-gray-400">Success Rate</div>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <div className="flex justify-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-lg ${i < Math.floor(mockDetails.clients.averageRating) ? "text-[#FF6B00]" : "text-gray-600"}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {mockDetails.clients.averageRating}
                                        </div>
                                        <div className="text-sm text-gray-400">Average Rating</div>
                                    </div>
                                </div>

                                <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
                                    <h3 className="text-lg font-semibold text-white mb-4">Client Testimonial</h3>
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 text-4xl text-[#FF6B00]/20">"</div>
                                        <blockquote className="pl-8 pr-8 relative z-10">
                                            <p className="text-gray-300 italic mb-3">{mockDetails.clients.testimonial.text}</p>
                                            <footer className="text-sm text-gray-400">
                                                — {mockDetails.clients.testimonial.author}
                                            </footer>
                                        </blockquote>
                                        <div className="absolute right-4 bottom-0 text-4xl text-[#FF6B00]/20">"</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
