"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Card } from "@/components/custom/Card";
import { ActivityBreakdown } from "@/components/custom/client/dashboard/pages/health/components/ActivityBreakdown";
import { DateControl, WeekdayControl } from "@/components/custom/client/dashboard/pages/health/components/DateControl";
import { HealthOverview } from "@/components/custom/client/dashboard/pages/health/components/HealthOverview";
import { HealthScore } from "@/components/custom/client/dashboard/pages/health/components/HealthScore";
import {
    mockHealthData,
    mockActivityBreakdown,
    mockWeeklyStats,
    mockHealthScore,
} from "@/components/custom/client/dashboard/pages/health/data/mockHealthData";

export default function HealthPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [healthData, setHealthData] = useState(null);
    const [activityBreakdown, setActivityBreakdown] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [healthScore, setHealthScore] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [viewRange, setViewRange] = useState("day");
    const [isLoading, setIsLoading] = useState(true);

    // Load mock data instead of generating random data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Use mock data
            setHealthData(mockHealthData);
            setActivityBreakdown(mockActivityBreakdown);
            setWeeklyStats(mockWeeklyStats);
            setHealthScore(mockHealthScore);
            setIsLoading(false);
        };

        loadData();
    }, []);

    // Handle date selection
    const handleDateChange = (date, range) => {
        setSelectedDate(typeof date === "string" ? date : date.toISOString().split("T")[0]);
        if (range) setViewRange(range);
    };

    // Handle day selection from the weekday selector
    const handleDaySelect = (date) => {
        setSelectedDate(date.toISOString().split("T")[0]);
        setViewRange("day");
    };

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
        exit: { opacity: 0 },
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <motion.div
            className="min-h-screen p-5 md:p-6 bg-[#121212] bg-gradient-to-b from-[#121212] to-[#1a1a1a]"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <div className="max-w-7xl mx-auto space-y-5 md:space-y-6">
                {/* Header Section */}
                <motion.div variants={itemVariants}>
                    <Card
                        variant="darkStrong"
                        width="100%"
                        maxWidth="none"
                        className="p-5 md:p-6 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4 shadow-md"
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Icon icon="heroicons:heart" className="text-white text-xl" />
                                </motion.div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
                                    <p className="text-gray-400 mt-1">Track your activity and wellness metrics</p>
                                </div>
                            </div>
                            <div className="flex space-x-1 bg-gray-900/80 p-1 rounded-full shadow-md w-full md:w-auto backdrop-blur-sm">
                                {["overview", "activity", "recovery", "sleep", "nutrition"].map((tab) => (
                                    <motion.button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                            activeTab === tab
                                                ? "bg-blue-500 text-white font-medium shadow-inner"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        }`}
                                        whileHover={{ scale: activeTab !== tab ? 1.05 : 1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="flex items-center">
                                            <Icon
                                                icon={
                                                    tab === "overview"
                                                        ? "heroicons:chart-bar"
                                                        : tab === "activity"
                                                          ? "heroicons:bolt"
                                                          : tab === "recovery"
                                                            ? "heroicons:heart"
                                                            : tab === "sleep"
                                                              ? "heroicons:moon"
                                                              : "heroicons:beaker"
                                                }
                                                className="mr-1.5"
                                            />
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Date Selection Section */}
                <motion.div variants={itemVariants}>
                    <Card
                        variant="darkStrong"
                        width="100%"
                        maxWidth="none"
                        className="p-5 md:p-6 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300"
                    >
                        <DateControl selectedDate={selectedDate} onDateChange={handleDateChange} activeRange={viewRange} />

                        <WeekdayControl selectedDay={selectedDate} onSelectDay={handleDaySelect} />
                    </Card>
                </motion.div>

                {isLoading ? (
                    // Loading State
                    <motion.div
                        variants={itemVariants}
                        animate={{
                            opacity: [0.5, 1, 0.5],
                            transition: { repeat: Infinity, duration: 2 },
                        }}
                    >
                        <Card
                            variant="darkStrong"
                            width="100%"
                            maxWidth="none"
                            className="p-10 shadow-lg border border-gray-800/50 backdrop-blur-sm"
                        >
                            <div className="flex flex-col items-center justify-center py-10">
                                <motion.div
                                    className="w-16 h-16 border-4 border-t-[#5D5FEF] border-r-[#30D158] border-b-[#FF2D55] border-l-[#FF9F0A] rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                                <p className="mt-6 text-gray-400">Loading your health data...</p>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    // Main Content
                    <>
                        {activeTab === "overview" && (
                            <>
                                {/* Health Overview Section */}
                                <motion.div variants={itemVariants} initial="initial" animate="animate">
                                    <HealthOverview healthData={healthData} selectedDay={selectedDate} />
                                </motion.div>

                                {/* Health Score */}
                                <motion.div variants={itemVariants}>
                                    <HealthScore healthScore={healthScore} />
                                </motion.div>

                                {/* Activity Breakdown */}
                                <motion.div variants={itemVariants}>
                                    <ActivityBreakdown activities={activityBreakdown} weekStats={weeklyStats} />
                                </motion.div>

                                {/* Today's Summary */}
                                <motion.div variants={itemVariants}>
                                    <Card
                                        variant="darkStrong"
                                        hover
                                        maxWidth="none"
                                        width="100%"
                                        className="p-5 md:p-6 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300 mt-6"
                                    >
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-lg font-semibold flex items-center">
                                                <motion.div
                                                    className="mr-2 bg-blue-500/10 p-2 rounded-full"
                                                    initial={{ rotate: 0 }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
                                                >
                                                    <Icon icon="heroicons:document-text" className="text-blue-400 text-lg" />
                                                </motion.div>
                                                Today's Summary
                                            </h3>
                                            <motion.button
                                                className="flex items-center text-sm bg-gray-900 hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Icon icon="heroicons:arrow-path" className="mr-2 text-blue-400" />
                                                Refresh
                                            </motion.button>
                                        </div>

                                        <motion.div
                                            className="bg-gray-900/80 rounded-xl p-5 backdrop-blur-sm"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex items-start">
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4"
                                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                                >
                                                    <Icon icon="heroicons:sparkles" className="text-blue-400 text-2xl" />
                                                </motion.div>
                                                <div>
                                                    <h4 className="font-medium text-lg mb-3">Daily Health Summary</h4>
                                                    <p className="text-sm text-gray-300 leading-relaxed">
                                                        You've taken{" "}
                                                        {healthData
                                                            .find((day) => day.date === selectedDate)
                                                            ?.steps.toLocaleString()}{" "}
                                                        steps today, which is{" "}
                                                        {healthData.find((day) => day.date === selectedDate)?.steps > 7500
                                                            ? "above"
                                                            : "below"}{" "}
                                                        your daily average. Your sleep quality was{" "}
                                                        {healthScore.components.sleep > 75 ? "good" : "fair"} with{" "}
                                                        {healthData.find((day) => day.date === selectedDate)?.sleep.hours} hours
                                                        of rest. Your recovery score is{" "}
                                                        {
                                                            healthData.find((day) => day.date === selectedDate)?.wellness
                                                                .recoveryScore
                                                        }
                                                        %, which suggests you're{" "}
                                                        {healthData.find((day) => day.date === selectedDate)?.wellness
                                                            .recoveryScore > 70
                                                            ? "well rested"
                                                            : "may need more rest"}
                                                        .
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <motion.div
                                                    className="bg-gray-800/70 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors border border-gray-700/30"
                                                    whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(255, 149, 0, 0.2)" }}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-full bg-[#FF9500]/20 flex items-center justify-center mr-3"
                                                        whileHover={{ rotate: 15 }}
                                                    >
                                                        <Icon icon="heroicons:bolt" className="text-[#FF9500] text-xl" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="text-xs text-gray-400">Calories Burned</div>
                                                        <div className="font-semibold text-lg">
                                                            {
                                                                healthData.find((day) => day.date === selectedDate)
                                                                    ?.caloriesBurned
                                                            }{" "}
                                                            cal
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    className="bg-gray-800/70 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors border border-gray-700/30"
                                                    whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(48, 209, 88, 0.2)" }}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-full bg-[#30D158]/20 flex items-center justify-center mr-3"
                                                        whileHover={{ rotate: 15 }}
                                                    >
                                                        <Icon icon="heroicons:map" className="text-[#30D158] text-xl" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="text-xs text-gray-400">Distance</div>
                                                        <div className="font-semibold text-lg">
                                                            {healthData.find((day) => day.date === selectedDate)?.distance} km
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    className="bg-gray-800/70 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-colors border border-gray-700/30"
                                                    whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(94, 92, 230, 0.2)" }}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-full bg-[#5E5CE6]/20 flex items-center justify-center mr-3"
                                                        whileHover={{ rotate: 15 }}
                                                    >
                                                        <Icon icon="heroicons:clock" className="text-[#5E5CE6] text-xl" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="text-xs text-gray-400">Active Minutes</div>
                                                        <div className="font-semibold text-lg">
                                                            {healthData.find((day) => day.date === selectedDate)?.activeMinutes}{" "}
                                                            min
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </Card>
                                </motion.div>
                            </>
                        )}

                        {/* Note: You can implement other tabs like activity, recovery, sleep, nutrition similarly */}
                        {activeTab !== "overview" && (
                            <motion.div variants={itemVariants}>
                                <Card
                                    variant="darkStrong"
                                    width="100%"
                                    maxWidth="none"
                                    className="p-10 shadow-lg border border-gray-800/50 backdrop-blur-sm"
                                >
                                    <div className="text-center py-10">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <h3 className="text-xl font-semibold mb-4">
                                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
                                            </h3>
                                            <p className="text-gray-400 mb-6">
                                                Detailed {activeTab} metrics will be displayed here
                                            </p>
                                            <motion.button
                                                className="px-6 py-3 bg-gradient-to-r from-[#5D5FEF] to-[#30D158] hover:from-[#5D5FEF]/90 hover:to-[#30D158]/90 transition-colors rounded-xl text-white font-medium shadow-lg"
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: "0 10px 25px -5px rgba(93, 95, 239, 0.4)",
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
