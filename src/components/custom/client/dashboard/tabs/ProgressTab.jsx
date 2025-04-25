import React from "react";

export const ProgressTab = ({ userData }) => {
    return (
        <div className="space-y-6">
            {/* Current Stats */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Current Stats</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <p className="text-gray-400 text-xs mb-1">Height</p>
                        <p className="text-lg font-bold">{userData.stats.height} cm</p>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <p className="text-gray-400 text-xs mb-1">Current Weight</p>
                        <p className="text-lg font-bold">{userData.stats.weight} kg</p>
                        <p className="text-xs text-[#4CAF50]">-6kg from start</p>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <p className="text-gray-400 text-xs mb-1">BMI</p>
                        <p className="text-lg font-bold">{userData.stats.bmi}</p>
                        <p className="text-xs text-[#4CAF50]">Healthy range</p>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <p className="text-gray-400 text-xs mb-1">Body Fat</p>
                        <p className="text-lg font-bold">{userData.stats.bodyFat}%</p>
                        <p className="text-xs text-[#4CAF50]">-3% from start</p>
                    </div>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Progress History</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Weight Progression</h3>
                        <div className="h-64 relative">
                            {/* Simple weight chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-8 bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-t-sm transition-all duration-500 hover:w-10"
                                                style={{
                                                    height: `${((entry.weight - 70) / 10) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.weight} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Body Fat Progression</h3>
                        <div className="h-64 relative">
                            {/* Simple body fat chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-500 hover:w-10"
                                                style={{
                                                    height: `${(entry.bodyFat / 25) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.bodyFat}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-4 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                    Upload Progress Photo
                </button>
            </div>

            {/* Performance Metrics */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>

                <div className="space-y-4">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Squat Max</h3>
                            <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                +10kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">85kg</span>
                            <span className="text-gray-400 text-sm ml-2">previous: 75kg</span>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Bench Press Max</h3>
                            <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                +7.5kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">67.5kg</span>
                            <span className="text-gray-400 text-sm ml-2">previous: 60kg</span>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Deadlift Max</h3>
                            <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                +15kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">120kg</span>
                            <span className="text-gray-400 text-sm ml-2">previous: 105kg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
