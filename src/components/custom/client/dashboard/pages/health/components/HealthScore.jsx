import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";

import { HealthCircle } from "./HealthCircle";

import { Card } from "@/components/custom/Card";

export const HealthScore = ({ healthScore }) => {
    if (!healthScore) return null;

    // Health score insights based on component scores
    const getInsights = () => {
        const insights = [];

        if (healthScore.components.activity < 70) {
            insights.push({
                type: "activity",
                message: "Try to be more active today",
                icon: "heroicons:bolt",
                color: "#30D158",
            });
        }

        if (healthScore.components.sleep < 70) {
            insights.push({
                type: "sleep",
                message: "Improve your sleep quality",
                icon: "heroicons:moon",
                color: "#5E5CE6",
            });
        }

        if (healthScore.components.recovery < 70) {
            insights.push({
                type: "recovery",
                message: "Take time to rest today",
                icon: "heroicons:heart",
                color: "#32CD32",
            });
        }

        if (healthScore.components.nutrition < 70) {
            insights.push({
                type: "nutrition",
                message: "Focus on balanced nutrition",
                icon: "heroicons:beaker",
                color: "#FF9500",
            });
        }

        // If all scores are good, give a positive message
        if (insights.length === 0) {
            insights.push({
                type: "overall",
                message: "Great job! Keep it up",
                icon: "heroicons:sparkles",
                color: "#30D158",
            });
        }

        return insights;
    };

    const insights = getInsights();

    const getScoreLabel = (score) => {
        if (score >= 90) return "Excellent";
        if (score >= 80) return "Very Good";
        if (score >= 70) return "Good";
        if (score >= 60) return "Fair";
        return "Needs Improvement";
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: { staggerChildren: 0.1 },
                },
            }}
        >
            <Card
                variant="darkStrong"
                hover
                maxWidth="none"
                width="100%"
                className="p-6 shadow-lg border border-gray-800/50 mt-6 backdrop-blur-sm hover:border-green-500/20 transition-all duration-300"
            >
                <motion.h2 className="text-xl font-semibold mb-5 flex items-center" variants={fadeInUp}>
                    <motion.div
                        className="mr-2 bg-green-500/10 p-2 rounded-full"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
                    >
                        <Icon icon="heroicons:chart-bar-square" className="text-green-400 text-lg" />
                    </motion.div>
                    Your Health Score
                </motion.h2>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <motion.div className="flex-shrink-0 flex flex-col items-center" variants={fadeInUp}>
                        <HealthCircle
                            value={healthScore.overall}
                            size={160}
                            strokeWidth={12}
                            gradientColors={["#4CD964", "#32CD32"]}
                            label={getScoreLabel(healthScore.overall)}
                        />
                        <p className="text-sm text-gray-400 mt-4 text-center max-w-xs">
                            Based on your activity, sleep, recovery, and nutrition
                        </p>
                    </motion.div>

                    <div className="flex-1 space-y-4">
                        {/* Activity Score */}
                        <motion.div
                            className="bg-gray-900/80 rounded-xl p-4 shadow-sm backdrop-blur-sm hover:bg-gray-900 transition-all duration-300"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <div className="flex items-center mb-2">
                                <motion.div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: "rgba(48, 209, 88, 0.15)" }}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(48, 209, 88, 0.25)" }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Icon icon="heroicons:bolt" className="text-[#30D158] text-lg" />
                                </motion.div>
                                <span className="font-medium">Activity</span>
                                <span className="ml-auto font-semibold">{healthScore.components.activity}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-[#30D158]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${healthScore.components.activity}%` }}
                                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                ></motion.div>
                            </div>
                        </motion.div>

                        {/* Sleep Score */}
                        <motion.div
                            className="bg-gray-900/80 rounded-xl p-4 shadow-sm backdrop-blur-sm hover:bg-gray-900 transition-all duration-300"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <div className="flex items-center mb-2">
                                <motion.div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: "rgba(94, 92, 230, 0.15)" }}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(94, 92, 230, 0.25)" }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Icon icon="heroicons:moon" className="text-[#5E5CE6] text-lg" />
                                </motion.div>
                                <span className="font-medium">Sleep</span>
                                <span className="ml-auto font-semibold">{healthScore.components.sleep}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-[#5E5CE6]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${healthScore.components.sleep}%` }}
                                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                                ></motion.div>
                            </div>
                        </motion.div>

                        {/* Recovery Score */}
                        <motion.div
                            className="bg-gray-900/80 rounded-xl p-4 shadow-sm backdrop-blur-sm hover:bg-gray-900 transition-all duration-300"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <div className="flex items-center mb-2">
                                <motion.div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: "rgba(50, 205, 50, 0.15)" }}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(50, 205, 50, 0.25)" }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Icon icon="heroicons:heart" className="text-[#32CD32] text-lg" />
                                </motion.div>
                                <span className="font-medium">Recovery</span>
                                <span className="ml-auto font-semibold">{healthScore.components.recovery}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-[#32CD32]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${healthScore.components.recovery}%` }}
                                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                                ></motion.div>
                            </div>
                        </motion.div>

                        {/* Nutrition Score */}
                        <motion.div
                            className="bg-gray-900/80 rounded-xl p-4 shadow-sm backdrop-blur-sm hover:bg-gray-900 transition-all duration-300"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02, x: 5 }}
                        >
                            <div className="flex items-center mb-2">
                                <motion.div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: "rgba(255, 149, 0, 0.15)" }}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 149, 0, 0.25)" }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Icon icon="heroicons:beaker" className="text-[#FF9500] text-lg" />
                                </motion.div>
                                <span className="font-medium">Nutrition</span>
                                <span className="ml-auto font-semibold">{healthScore.components.nutrition}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-[#FF9500]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${healthScore.components.nutrition}%` }}
                                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                ></motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Health Insights Section */}
                <motion.div className="bg-gray-900/80 rounded-xl p-5 mt-6 backdrop-blur-sm" variants={fadeInUp}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="text-yellow-400 mr-2"
                        >
                            <Icon icon="heroicons:light-bulb" />
                        </motion.div>
                        Insights & Recommendations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {insights.map((insight, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/70 rounded-xl p-4 flex items-center hover:bg-gray-700 transition-all duration-300 border border-gray-700/30"
                                variants={fadeInUp}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: `0 0 15px ${insight.color}30`,
                                }}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                    style={{ backgroundColor: `${insight.color}20` }}
                                    whileHover={{
                                        rotate: 10,
                                        backgroundColor: `${insight.color}30`,
                                    }}
                                >
                                    <Icon icon={insight.icon} className="text-xl" style={{ color: insight.color }} />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{insight.message}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Card>
        </motion.div>
    );
};
