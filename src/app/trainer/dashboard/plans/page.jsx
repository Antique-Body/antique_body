"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FormField } from "@/components/common/FormField";
import { NutritionPlanIcon, PlanManagementIcon, TrainingPlanIcon, UsersIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { CreatePlanCard, PlanCard, TabsComponent } from "@/components/custom/trainer/dashboard/pages/plans/components";
import { mockTrainingPlans, mockNutritionPlans } from "@/components/custom/trainer/dashboard/pages/plans/data";

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
                mockNutritionPlans.filter(
                    (plan) => plan.title.toLowerCase().includes(query) || plan.description.toLowerCase().includes(query)
                )
            );
            setFilteredTrainingPlans(
                mockTrainingPlans.filter(
                    (plan) => plan.title.toLowerCase().includes(query) || plan.description.toLowerCase().includes(query)
                )
            );
        } else {
            setFilteredNutritionPlans(mockNutritionPlans);
            setFilteredTrainingPlans(mockTrainingPlans);
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
                                    {mockNutritionPlans.length + mockTrainingPlans.length}
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
                                <p className="text-lg font-semibold text-white">
                                    {activeTab === "nutrition"
                                        ? filteredNutritionPlans.reduce((total, plan) => total + (plan.clientCount || 0), 0)
                                        : filteredTrainingPlans.reduce((total, plan) => total + (plan.clientCount || 0), 0)}
                                </p>
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
