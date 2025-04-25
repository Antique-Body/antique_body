import React from "react";

export const NutritionTab = ({ userData }) => {
    return (
        <div className="space-y-6">
            {/* Nutrition Overview */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Nutrition Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Daily Calories Target</h3>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-2xl font-bold">{userData.stats.calorieGoal} cal</p>
                            <div className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                Daily Goal
                            </div>
                        </div>
                        <div className="h-2 bg-[#444] rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                                style={{ width: "65%" }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-400">1,560 consumed</p>
                            <p className="text-gray-400">840 remaining</p>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Macronutrient Targets</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <p>Protein</p>
                                    <p>
                                        <span className="text-gray-300">112g</span> of {userData.stats.proteinGoal}g
                                    </p>
                                </div>
                                <div className="h-2 bg-[#444] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <p>Carbs</p>
                                    <p>
                                        <span className="text-gray-300">150g</span> of {userData.stats.carbsGoal}g
                                    </p>
                                </div>
                                <div className="h-2 bg-[#444] rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <p>Fat</p>
                                    <p>
                                        <span className="text-gray-300">40g</span> of {userData.stats.fatGoal}g
                                    </p>
                                </div>
                                <div className="h-2 bg-[#444] rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "50%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-[#FF6B00] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#FF9A00] flex items-center justify-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Food Item
                </button>
            </div>

            {/* Today's Food Log */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Today's Food Log</h2>

                <div className="space-y-4">
                    {/* Breakfast */}
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Breakfast</h3>
                            <span className="text-sm text-gray-400">420 kcal</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg">
                                <div>
                                    <p className="font-medium">Oatmeal with Berries</p>
                                    <p className="text-xs text-gray-400">1 cup (240g)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">320 kcal</p>
                                    <p className="text-xs text-gray-400">P: 15g | C: 40g | F: 8g</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg">
                                <div>
                                    <p className="font-medium">Black Coffee</p>
                                    <p className="text-xs text-gray-400">1 cup (240ml)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">5 kcal</p>
                                    <p className="text-xs text-gray-400">P: 0g | C: 0g | F: 0g</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lunch */}
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Lunch</h3>
                            <span className="text-sm text-gray-400">650 kcal</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg">
                                <div>
                                    <p className="font-medium">Grilled Chicken Salad</p>
                                    <p className="text-xs text-gray-400">1 serving (350g)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">450 kcal</p>
                                    <p className="text-xs text-gray-400">P: 40g | C: 20g | F: 20g</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg">
                                <div>
                                    <p className="font-medium">Whole Grain Bread</p>
                                    <p className="text-xs text-gray-400">2 slices (80g)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">200 kcal</p>
                                    <p className="text-xs text-gray-400">P: 8g | C: 36g | F: 2g</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add More Meals */}
                    <button className="w-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)] flex items-center justify-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Another Meal
                    </button>
                </div>
            </div>

            {/* Water Intake Tracker */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Water Intake</h2>

                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                    <div className="flex justify-between mb-2">
                        <p className="font-medium">Today's Intake</p>
                        <p className="font-medium text-blue-400">1.5 / 3.0 L</p>
                    </div>

                    <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{ width: "50%" }}
                        ></div>
                    </div>

                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5, 6].map((glass) => (
                            <button
                                key={glass}
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    glass <= 3 ? "bg-blue-500 text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2L8 7H16L12 2z"></path>
                                    <path d="M8 7V21h8V7"></path>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <button className="w-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                    View Nutrition History
                </button>
            </div>
        </div>
    );
};
