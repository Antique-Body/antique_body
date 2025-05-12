import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";

import { healthColors } from "../data/mockHealthData";

import { HealthCircle, MetricCard } from "./HealthCircle";

import { Card } from "@/components/custom/Card";

export const HealthOverview = ({ healthData, selectedDay }) => {
    const getSelectedDayData = () => {
        if (!healthData || !healthData.length) return null;
        return healthData.find((day) => day.date === selectedDay) || healthData[0];
    };

    const dayData = getSelectedDayData();
    if (!dayData) return null;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: { staggerChildren: 0.1 },
                },
            }}
        >
            {/* Sleep Details */}
            <motion.div variants={fadeInUp} className="flex">
                <Card
                    variant="darkStrong"
                    hover
                    maxWidth="none"
                    width="100%"
                    className="p-5 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-[#BF5AF2]/30 transition-all duration-300 flex flex-col"
                >
                    <div className="flex flex-col items-center h-full">
                        <div className="flex items-center mb-4 w-full">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full bg-[#BF5AF2]/10 mr-2"
                            >
                                <Icon icon="heroicons:moon" className="text-[#BF5AF2] text-xl" />
                            </motion.div>
                            <h3 className="text-lg font-medium">Sleep</h3>
                        </div>

                        <div className="flex items-center justify-center w-full mb-4 flex-1">
                            <motion.div
                                className="text-4xl font-bold text-white flex flex-col items-center"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                            >
                                <span>{dayData.sleep.hours}h</span>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-base font-normal text-gray-400 mt-1"
                                >
                                    Sleep duration
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="w-full bg-gray-900/80 rounded-xl p-4 backdrop-blur-sm mt-auto">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <motion.div
                                    className="text-center p-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Deep</div>
                                    <div className="text-lg font-semibold text-[#BF5AF2]">{dayData.sleep.deep}%</div>
                                </motion.div>
                                <motion.div
                                    className="text-center p-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">REM</div>
                                    <div className="text-lg font-semibold text-[#5E5CE6]">{dayData.sleep.rem}%</div>
                                </motion.div>
                                <motion.div
                                    className="text-center p-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Light</div>
                                    <div className="text-lg font-semibold text-[#8E8DFF]">{dayData.sleep.light}%</div>
                                </motion.div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-400">Efficiency</span>
                                <span className="text-sm font-medium">{dayData.sleep.efficiency}%</span>
                            </div>
                            <motion.div
                                className="w-full h-2 bg-gray-800 rounded-full mt-1 overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-[#5E5CE6] to-[#BF5AF2]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dayData.sleep.efficiency}%` }}
                                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                                ></motion.div>
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Recovery Details */}
            <motion.div variants={fadeInUp} className="flex">
                <Card
                    variant="darkStrong"
                    hover
                    maxWidth="none"
                    width="100%"
                    className="p-5 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-[#32CD32]/30 transition-all duration-300 flex flex-col"
                >
                    <div className="flex flex-col items-center h-full">
                        <div className="flex items-center mb-4 w-full">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full bg-[#32CD32]/10 mr-2"
                            >
                                <Icon icon="heroicons:heart" className="text-[#32CD32] text-xl" />
                            </motion.div>
                            <h3 className="text-lg font-medium">Recovery</h3>
                        </div>

                        <div className="flex items-center justify-center w-full mb-4 flex-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <HealthCircle
                                    value={dayData.wellness.recoveryScore}
                                    gradientColors={healthColors.recovery}
                                    size={110}
                                    strokeWidth={10}
                                />
                            </motion.div>
                        </div>

                        <div className="w-full bg-gray-900/80 rounded-xl p-4 backdrop-blur-sm mt-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="bg-gray-800/60 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Resting HR</div>
                                    <div className="text-lg font-semibold">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                        >
                                            {dayData.heartRate.resting} bpm
                                        </motion.span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-gray-800/60 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Heart Rate</div>
                                    <div className="flex items-end">
                                        <span className="text-lg font-semibold mr-2">{dayData.heartRate.average}</span>
                                        <span className="text-xs text-gray-400">avg</span>
                                        <span className="mx-1 text-gray-600">|</span>
                                        <span className="text-lg font-semibold text-[#FF5A5A] mr-1">
                                            {dayData.heartRate.max}
                                        </span>
                                        <span className="text-xs text-gray-400">max</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Strain Details */}
            <motion.div variants={fadeInUp} className="flex">
                <Card
                    variant="darkStrong"
                    hover
                    maxWidth="none"
                    width="100%"
                    className="p-5 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-[#FF9500]/30 transition-all duration-300 flex flex-col"
                >
                    <div className="flex flex-col items-center h-full">
                        <div className="flex items-center mb-4 w-full">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full bg-[#FF9500]/10 mr-2"
                            >
                                <Icon icon="heroicons:bolt" className="text-[#FF9500] text-xl" />
                            </motion.div>
                            <h3 className="text-lg font-medium">Strain</h3>
                        </div>

                        <div className="flex items-center justify-center w-full mb-4 flex-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <HealthCircle
                                    value={dayData.wellness.strain}
                                    gradientColors={healthColors.strain}
                                    size={110}
                                    strokeWidth={10}
                                />
                            </motion.div>
                        </div>

                        <div className="w-full bg-gray-900/80 rounded-xl p-4 backdrop-blur-sm mt-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="bg-gray-800/60 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Stress Level</div>
                                    <div className="text-lg font-semibold">{dayData.wellness.stressLevel}%</div>
                                </motion.div>
                                <motion.div
                                    className="bg-gray-800/60 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ y: -3 }}
                                >
                                    <div className="text-sm text-gray-400">Readiness</div>
                                    <div className="text-lg font-semibold">{dayData.wellness.readiness}%</div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Main Health Metrics Card */}
            <motion.div variants={fadeInUp} className="col-span-1 md:col-span-3">
                <Card
                    variant="darkStrong"
                    hover
                    maxWidth="none"
                    width="100%"
                    className="p-5 shadow-lg border border-gray-800/50 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300"
                >
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-medium flex items-center">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
                                    className="mr-2 bg-blue-500/10 p-2 rounded-full"
                                >
                                    <Icon icon="heroicons:chart-bar" className="text-blue-400 text-lg" />
                                </motion.div>
                                Health Metrics
                            </h2>
                            <motion.button
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.97 }}
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center bg-blue-500/10 px-3 py-1.5 rounded-full"
                            >
                                <span>View detailed metrics</span>
                                <Icon icon="heroicons:arrow-right" className="ml-1" />
                            </motion.button>
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between items-center">
                            {/* Daily Stats */}
                            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <MetricCard
                                        title="Steps"
                                        value={dayData.steps.toLocaleString()}
                                        icon="tabler:shoe"
                                        gradientColors={healthColors.activity}
                                    />
                                </motion.div>
                                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <MetricCard
                                        title="Calories"
                                        value={`${dayData.caloriesBurned} kcal`}
                                        icon="heroicons:fire"
                                        gradientColors={healthColors.strain}
                                    />
                                </motion.div>
                                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <MetricCard
                                        title="Active Time"
                                        value={`${dayData.activeMinutes} min`}
                                        icon="heroicons:clock"
                                        gradientColors={healthColors.sleep}
                                    />
                                </motion.div>
                                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <MetricCard
                                        title="Distance"
                                        value={`${dayData.distance} km`}
                                        icon="heroicons:map"
                                        gradientColors={healthColors.recovery}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};
