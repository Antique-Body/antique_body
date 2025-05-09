"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FormField } from "@/components/common/FormField";
import { NutritionPlanIcon, PlanManagementIcon, TrainingPlanIcon, UsersIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { CreatePlanCard, PlanCard, TabsComponent } from "@/components/custom/trainer/dashboard/pages/plans/components";

const MOCK_NUTRITION_PLANS = [
    {
        id: 1,
        title: "Weight Loss Nutrition",
        description:
            "Balanced nutrition plan focused on gradual weight loss with sufficient protein intake and moderate carbs.",
        image: "https://cdn.squats.in/kc_articles/16571113701456e93e41b1330b0dc.png",
        createdAt: "2023-10-15",
        planType: "nutrition",
        duration: "8 weeks",
        clientCount: 24,
        editUrl: "/trainer/dashboard/plans/nutrition/1",
    },
    {
        id: 2,
        title: "Muscle Gain Diet",
        description: "High protein nutrition plan designed for clients focused on muscle building with strategic carb timing.",
        image: "https://www.jefit.com/wp/wp-content/uploads/2021/12/healthy-food-high-protein-scaled.jpg",
        createdAt: "2023-11-20",
        planType: "nutrition",
        duration: "12 weeks",
        clientCount: 18,
        editUrl: "/trainer/dashboard/plans/nutrition/2",
    },
    {
        id: 3,
        title: "Mediterranean Diet Plan",
        description: "A balanced nutrition plan based on the Mediterranean diet principles for overall health improvement.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSWDAepuRv2LXa-Gekvn8nfG59pkg3RD8MaIt8hN9Nfvr-S5SSEqMPeQVFxQ1bNvRubQo&usqp=CAU",
        createdAt: "2024-01-05",
        planType: "nutrition",
        duration: "8 weeks",
        clientCount: 12,
        editUrl: "/trainer/dashboard/plans/nutrition/3",
    },
];

const MOCK_TRAINING_PLANS = [
    {
        id: 4,
        title: "Beginner Strength Program",
        description: "Full body strength program for beginners with progressive overload and proper technique focus.",
        image: "https://cdn.gymaholic.co/articles/best-workout-plans-for-women/woman.jpg",
        price: 99,
        createdAt: "2023-09-10",
        planType: "training",
        duration: "6 weeks",
        clientCount: 32,
        editUrl: "/trainer/dashboard/plans/training/4",
    },
    {
        id: 5,
        title: "HIIT Cardio Challenge",
        description: "High intensity interval training program designed to boost cardiovascular fitness and burn fat.",
        image: "https://media.istockphoto.com/id/1332405544/photo/asian-indian-mid-adult-macho-man-practicing-battle-rope-in-gym.jpg?s=612x612&w=0&k=20&c=pYcFTEk8u8TSfbyui90HPCAjctjvenjHnHT6rNy1-qA=",
        price: 89,
        createdAt: "2023-10-05",
        planType: "training",
        duration: "4 weeks",
        clientCount: 28,
        editUrl: "/trainer/dashboard/plans/training/5",
    },
    {
        id: 6,
        title: "Advanced Strength Training",
        description: "A comprehensive plan designed for building strength and muscle mass with compound exercises.",
        image: "https://wallpapers.com/images/hd/man-picking-up-a-fitness-barbell-vdiphsb8pi2ktc5c.jpg",
        price: 129,
        createdAt: "2024-02-20",
        planType: "training",
        duration: "10 weeks",
        clientCount: 15,
        editUrl: "/trainer/dashboard/plans/training/6",
    },
];

const PlanManagementPage = () => {
    // Initialize with "training" as the default active tab
    const [activeTab, setActiveTab] = useState("training");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredNutritionPlans, setFilteredNutritionPlans] = useState([]);
    const [filteredTrainingPlans, setFilteredTrainingPlans] = useState([]);

    useEffect(() => {
        // Apply search filter to nutrition plans
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            setFilteredNutritionPlans(
                MOCK_NUTRITION_PLANS.filter(
                    (plan) => plan.title.toLowerCase().includes(query) || plan.description.toLowerCase().includes(query)
                )
            );
            setFilteredTrainingPlans(
                MOCK_TRAINING_PLANS.filter(
                    (plan) => plan.title.toLowerCase().includes(query) || plan.description.toLowerCase().includes(query)
                )
            );
        } else {
            setFilteredNutritionPlans(MOCK_NUTRITION_PLANS);
            setFilteredTrainingPlans(MOCK_TRAINING_PLANS);
        }
    }, [searchQuery]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#111111]">
            <main className="py-6 sm:py-8 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Header with page title and search field in one row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <PlanManagementIcon className="text-[#FF6B00] w-6 h-6" />
                        Plan Management
                    </h1>

                    {/* Search field using FormField component */}
                    <div className="w-full sm:w-64 md:w-80">
                        <FormField
                            name="search"
                            type="text"
                            placeholder="Search plans..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            backgroundStyle="semi-transparent"
                            size="small"
                            className="mb-0"
                        />
                    </div>
                </div>

                {/* Prominent Create Plan Section at the top */}
                <div className="mb-6 sm:mb-8 bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-xl border border-[#333] p-4 sm:p-6 shadow-xl backdrop-blur-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className=" w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9500] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+</span>
                        </span>
                        Create a New Plan
                    </h2>

                    {/* Tab selector - Moved to top for better visibility */}
                    <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Create Plan Card - Now directly below tabs with more height and improved layout */}
                    <div className="mt-4 sm:mt-6">
                        <CreatePlanCard type={activeTab} />
                    </div>
                </div>

                {/* Dashboard quick stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    <Card
                        variant="dark"
                        width="100%"
                        className="p-4 border border-[#333] hover:border-[#444] transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
                                <PlanManagementIcon className="text-[#FF6B00] transform scale-100" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Total Plans</p>
                                <p className="text-lg font-semibold text-white">
                                    {MOCK_NUTRITION_PLANS.length + MOCK_TRAINING_PLANS.length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        variant="dark"
                        width="100%"
                        className="p-4 border border-[#333] hover:border-[#444] transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
                                {activeTab === "nutrition" ? (
                                    <NutritionPlanIcon size={16} className="text-[#FF6B00] scale-125" />
                                ) : (
                                    <TrainingPlanIcon size={16} className="text-[#FF6B00] scale-125" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">
                                    {activeTab === "nutrition" ? "Nutrition Plans" : "Training Plans"}
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {activeTab === "nutrition" ? filteredNutritionPlans.length : filteredTrainingPlans.length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        variant="dark"
                        width="100%"
                        className="p-4 border border-[#333] hover:border-[#444] transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
                                <UsersIcon size={16} className="text-[#FF6B00] scale-125" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Active Clients</p>
                                <p className="text-lg font-semibold text-white">{activeTab === "nutrition" ? "54" : "75"}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content sections that switch based on tab */}
                <AnimatePresence mode="wait">
                    {activeTab === "nutrition" ? (
                        <motion.div
                            key="nutrition"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <NutritionPlanIcon size={18} className="text-[#FF6B00]" />
                                Your Nutrition Plans
                            </h2>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredNutritionPlans.map((plan, index) => (
                                    <PlanCard key={plan.id} index={index} {...plan} />
                                ))}

                                {filteredNutritionPlans.length === 0 && (
                                    <div className="col-span-full bg-[#1A1A1A] rounded-lg border border-[#333] p-4 sm:p-6 text-center">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-[#222] flex items-center justify-center">
                                            <NutritionPlanIcon size={20} className="text-gray-400 sm:scale-110" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                                            No nutrition plans found
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {searchQuery
                                                ? `No plans match your search for "${searchQuery}"`
                                                : "You haven't created any nutrition plans yet"}
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="px-3 py-1.5 bg-[#333] text-white text-sm rounded-md hover:bg-[#444]"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="training"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <TrainingPlanIcon size={18} className="text-[#FF6B00]" />
                                Your Training Plans
                            </h2>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredTrainingPlans.map((plan, index) => (
                                    <PlanCard key={plan.id} index={index} {...plan} />
                                ))}

                                {filteredTrainingPlans.length === 0 && (
                                    <div className="col-span-full bg-[#1A1A1A] rounded-lg border border-[#333] p-4 sm:p-6 text-center">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full bg-[#222] flex items-center justify-center">
                                            <TrainingPlanIcon size={20} className="text-gray-400 sm:scale-110" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                                            No training plans found
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {searchQuery
                                                ? `No plans match your search for "${searchQuery}"`
                                                : "You haven't created any training plans yet"}
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="px-3 py-1.5 bg-[#333] text-white text-sm rounded-md hover:bg-[#444]"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PlanManagementPage;
