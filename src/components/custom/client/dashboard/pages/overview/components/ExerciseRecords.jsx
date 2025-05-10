import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { ExerciseCard } from "./ExerciseCard";

import { Button } from "@/components/common/Button";

export const ExerciseRecords = ({ categories, exerciseImages, onAddRecord, onAddNewRecord }) => {
    const [activeCategory, setActiveCategory] = useState(categories[0]?.name || "");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
        >
            {/* Header with glassomorphic effect */}
            <div className="relative bg-gradient-to-r from-[#1a1a1a]/90 to-[#222]/90 backdrop-blur-lg rounded-xl p-6 mb-6 border border-[#333] shadow-lg overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#FF6B00]/10 blur-[60px]"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#FF6B00]/5 blur-[60px]"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-[rgba(255,107,0,0.15)] mr-4 flex items-center justify-center">
                            <Icon icon="mdi:weight-lifter" className="w-6 h-6 text-[#FF6B00]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Exercise Records
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Track your progress and see your personal bests</p>
                        </div>
                    </div>

                    <Button
                        variant="orangeGradient"
                        size="md"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md shadow-[#FF6B00]/20"
                        onClick={onAddNewRecord}
                    >
                        <Icon icon="mdi:plus" className="w-5 h-5" />
                        Add New Record
                    </Button>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="mb-6 flex flex-wrap gap-2 md:gap-4">
                {categories.map((category) => (
                    <motion.button
                        key={category.name}
                        onClick={() => setActiveCategory(category.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                            activeCategory === category.name
                                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-md shadow-[#FF6B00]/20"
                                : "bg-[#222] text-gray-300 hover:bg-[#2a2a2a]"
                        }`}
                    >
                        {category.name}
                    </motion.button>
                ))}
            </div>

            {/* Exercise Cards Grid with Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories
                            .find((cat) => cat.name === activeCategory)
                            ?.exercises.map((exercise) => (
                                <motion.div
                                    key={exercise.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ExerciseCard
                                        exercise={exercise}
                                        exerciseImage={exerciseImages[exercise.name]}
                                        onAddRecord={onAddRecord}
                                    />
                                </motion.div>
                            ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Empty state if no exercises in category */}
            {categories.find((cat) => cat.name === activeCategory)?.exercises.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-[#1a1a1a] rounded-xl border border-[#333]">
                    <Icon icon="mdi:dumbbell" className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No exercises yet</h3>
                    <p className="text-gray-400 text-center mb-6">
                        Start tracking your progress by adding your first exercise.
                    </p>
                    <Button variant="outlineOrange" size="sm" onClick={onAddNewRecord} className="flex items-center gap-2">
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        Add Exercise
                    </Button>
                </div>
            )}
        </motion.div>
    );
};
