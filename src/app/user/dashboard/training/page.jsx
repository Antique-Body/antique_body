"use client";
import { useState } from "react";

import AnticBodyWorkout from "../components/AnticBodyWorkout";
import WorkoutPlans from "../components/WorkoutPlans";

export default function TrainingPage() {
    const [selectedView, setSelectedView] = useState("plans");

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => setSelectedView("plans")}
                    className={`px-4 py-2 rounded-lg transition ${
                        selectedView === "plans"
                            ? "bg-[#FF6B00] text-white"
                            : "bg-[#222] text-gray-300 hover:bg-[#333]"
                    }`}>
                    Workout Plans
                </button>
                <button
                    onClick={() => setSelectedView("custom")}
                    className={`px-4 py-2 rounded-lg transition ${
                        selectedView === "custom"
                            ? "bg-[#FF6B00] text-white"
                            : "bg-[#222] text-gray-300 hover:bg-[#333]"
                    }`}>
                    Create Custom Workout
                </button>
            </div>

            {selectedView === "plans" ? <WorkoutPlans /> : <AnticBodyWorkout />}
        </div>
    );
} 