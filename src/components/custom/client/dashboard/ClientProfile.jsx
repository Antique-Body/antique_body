import React from "react";
import { StatCard } from "@/components/shared";
export const ClientProfile = ({ userData }) => {
    return (
        <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-3xl overflow-hidden relative transition-transform duration-300 hover:scale-105">
                <span className="text-4xl">
                    {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </span>
            </div>

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                <p className="text-[#FF6B00] font-medium mb-4">
                    Plan: {userData.planName} • Coach: {userData.coach}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Program Progress</span>
                        <span>{Math.round((userData.progress.completed / userData.progress.total) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                            style={{ width: `${(userData.progress.completed / userData.progress.total) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Next milestone: {userData.progress.nextMilestone}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <StatCard label="Next Session" value="Apr 12" subtext="10:00 AM" />

                    <StatCard
                        label="Current Weight"
                        value={`${userData.stats.weight} kg`}
                        subtext={<span className="text-[#4CAF50]">-2kg from start</span>}
                    />

                    <StatCard
                        label="Body Fat"
                        value={`${userData.stats.bodyFat}%`}
                        subtext={<span className="text-[#4CAF50]">-2.5% from start</span>}
                    />

                    <StatCard label="Daily Calories" value={userData.stats.calorieGoal} subtext="Target intake" />
                </div>
            </div>
        </div>
    );
};
