import { ProgressBar } from "@/components/common";
import { MacroDistribution } from "@/components/custom/client/dashboard/tabs/nutrition/components";
import { useState } from "react";

export const NutritionHistory = ({ historyData, onClose }) => {
    const [view, setView] = useState("weekly"); // weekly, monthly

    // Generate days of the week
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Calculate daily averages
    const avgCalories = Math.round(historyData.reduce((sum, day) => sum + day.calories, 0) / historyData.length);
    const avgProtein = Math.round(historyData.reduce((sum, day) => sum + day.protein, 0) / historyData.length);
    const avgCarbs = Math.round(historyData.reduce((sum, day) => sum + day.carbs, 0) / historyData.length);
    const avgFat = Math.round(historyData.reduce((sum, day) => sum + day.fat, 0) / historyData.length);
    const avgWater = Math.round(historyData.reduce((sum, day) => sum + day.water, 0) / historyData.length);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 w-full max-w-4xl border border-[#222] shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Nutrition History</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
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
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 px-3 ${
                            view === "weekly" ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-300"
                        } rounded-l-lg`}
                        onClick={() => setView("weekly")}
                    >
                        Last 7 Days
                    </button>
                    <button
                        className={`flex-1 py-2 px-3 ${
                            view === "monthly" ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-300"
                        } rounded-r-lg`}
                        onClick={() => setView("monthly")}
                    >
                        Monthly View
                    </button>
                </div>

                {/* Weekly Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-4">Daily Averages</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Calories</span>
                                    <span className="text-white">{avgCalories} kcal</span>
                                </div>
                                <ProgressBar value={avgCalories} maxValue={2400} color="bg-orange-500" showValues={false} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Protein</span>
                                    <span className="text-white">{avgProtein}g</span>
                                </div>
                                <ProgressBar value={avgProtein} maxValue={150} color="bg-blue-500" showValues={false} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Carbs</span>
                                    <span className="text-white">{avgCarbs}g</span>
                                </div>
                                <ProgressBar value={avgCarbs} maxValue={200} color="bg-green-500" showValues={false} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Fat</span>
                                    <span className="text-white">{avgFat}g</span>
                                </div>
                                <ProgressBar value={avgFat} maxValue={80} color="bg-yellow-500" showValues={false} />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Water</span>
                                    <span className="text-white">{avgWater}ml</span>
                                </div>
                                <ProgressBar value={avgWater} maxValue={3000} color="bg-blue-500" showValues={false} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-4">Macro Distribution</h3>

                        <div className="mb-6">
                            <MacroDistribution protein={avgProtein * 4} carbs={avgCarbs * 4} fat={avgFat * 9} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-[rgba(20,20,20,0.5)] p-3 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Avg. Protein</p>
                                <p className="text-lg font-semibold">{avgProtein}g</p>
                                <p className="text-xs text-gray-400">{Math.round(avgProtein * 4)} kcal</p>
                            </div>

                            <div className="bg-[rgba(20,20,20,0.5)] p-3 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Avg. Carbs</p>
                                <p className="text-lg font-semibold">{avgCarbs}g</p>
                                <p className="text-xs text-gray-400">{Math.round(avgCarbs * 4)} kcal</p>
                            </div>

                            <div className="bg-[rgba(20,20,20,0.5)] p-3 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Avg. Fat</p>
                                <p className="text-lg font-semibold">{avgFat}g</p>
                                <p className="text-xs text-gray-400">{Math.round(avgFat * 9)} kcal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Breakdown */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                    <h3 className="font-medium mb-4">Daily Breakdown</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left p-2">Day</th>
                                    <th className="text-right p-2">Calories</th>
                                    <th className="text-right p-2">Protein</th>
                                    <th className="text-right p-2">Carbs</th>
                                    <th className="text-right p-2">Fat</th>
                                    <th className="text-right p-2">Water</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.map((day, i) => (
                                    <tr key={i} className="border-t border-[#444]">
                                        <td className="p-2">{days[i]}</td>
                                        <td className="text-right p-2">{day.calories} kcal</td>
                                        <td className="text-right p-2">{day.protein}g</td>
                                        <td className="text-right p-2">{day.carbs}g</td>
                                        <td className="text-right p-2">{day.fat}g</td>
                                        <td className="text-right p-2">{day.water}ml</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Calories Chart */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mt-6">
                    <h3 className="font-medium mb-4">Calories Intake</h3>

                    <div className="h-48 flex items-end justify-between">
                        {historyData.map((day, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                                <div className="relative w-full flex justify-center mb-2">
                                    <div
                                        className="w-10 bg-[#FF6B00] rounded-t-sm"
                                        style={{ height: `${(day.calories / 3000) * 100}%`, maxHeight: "90%", minHeight: "5%" }}
                                    ></div>
                                </div>
                                <span className="text-xs">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button onClick={onClose} className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF9A00]">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
