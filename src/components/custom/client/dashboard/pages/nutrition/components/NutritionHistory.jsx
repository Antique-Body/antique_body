import { useState } from "react";

import { ProgressBar } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { MacroDistribution } from "@/components/custom/client/dashboard/pages/nutrition/components";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Nutrition History</h2>
          <Button variant="ghost" onClick={onClose} className="p-0 text-gray-400 hover:text-white">
            <CloseXIcon size={20} />
          </Button>
        </div>

        <div className="mb-6 flex">
          <Button
            className={`flex-1 rounded-l-lg rounded-r-none px-3 py-2 ${
              view === "weekly" ? "bg-[#FF6B00] text-white" : ""
            }`}
            variant={view === "weekly" ? "orangeFilled" : "secondary"}
            onClick={() => setView("weekly")}
          >
            Last 7 Days
          </Button>
          <Button
            className={`flex-1 rounded-l-none rounded-r-lg px-3 py-2 ${
              view === "monthly" ? "bg-[#FF6B00] text-white" : ""
            }`}
            variant={view === "monthly" ? "orangeFilled" : "secondary"}
            onClick={() => setView("monthly")}
          >
            Monthly View
          </Button>
        </div>

        {/* Weekly Summary */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-4 font-medium">Daily Averages</h3>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="text-white">{avgCalories} kcal</span>
                </div>
                <ProgressBar value={avgCalories} maxValue={2400} color="bg-orange-500" showValues={false} />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Protein</span>
                  <span className="text-white">{avgProtein}g</span>
                </div>
                <ProgressBar value={avgProtein} maxValue={150} color="bg-blue-500" showValues={false} />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Carbs</span>
                  <span className="text-white">{avgCarbs}g</span>
                </div>
                <ProgressBar value={avgCarbs} maxValue={200} color="bg-green-500" showValues={false} />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Fat</span>
                  <span className="text-white">{avgFat}g</span>
                </div>
                <ProgressBar value={avgFat} maxValue={80} color="bg-yellow-500" showValues={false} />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Water</span>
                  <span className="text-white">{avgWater}ml</span>
                </div>
                <ProgressBar value={avgWater} maxValue={3000} color="bg-blue-500" showValues={false} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-4 font-medium">Macro Distribution</h3>

            <div className="mb-6">
              <MacroDistribution protein={avgProtein * 4} carbs={avgCarbs * 4} fat={avgFat * 9} />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-3">
                <p className="mb-1 text-xs text-gray-400">Avg. Protein</p>
                <p className="text-lg font-semibold">{avgProtein}g</p>
                <p className="text-xs text-gray-400">{Math.round(avgProtein * 4)} kcal</p>
              </div>

              <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-3">
                <p className="mb-1 text-xs text-gray-400">Avg. Carbs</p>
                <p className="text-lg font-semibold">{avgCarbs}g</p>
                <p className="text-xs text-gray-400">{Math.round(avgCarbs * 4)} kcal</p>
              </div>

              <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-3">
                <p className="mb-1 text-xs text-gray-400">Avg. Fat</p>
                <p className="text-lg font-semibold">{avgFat}g</p>
                <p className="text-xs text-gray-400">{Math.round(avgFat * 9)} kcal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
          <h3 className="mb-4 font-medium">Daily Breakdown</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">Day</th>
                  <th className="p-2 text-right">Calories</th>
                  <th className="p-2 text-right">Protein</th>
                  <th className="p-2 text-right">Carbs</th>
                  <th className="p-2 text-right">Fat</th>
                  <th className="p-2 text-right">Water</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((day, i) => (
                  <tr key={i} className="border-t border-[#444]">
                    <td className="p-2">{days[i]}</td>
                    <td className="p-2 text-right">{day.calories} kcal</td>
                    <td className="p-2 text-right">{day.protein}g</td>
                    <td className="p-2 text-right">{day.carbs}g</td>
                    <td className="p-2 text-right">{day.fat}g</td>
                    <td className="p-2 text-right">{day.water}ml</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calories Chart */}
        <div className="mt-6 rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
          <h3 className="mb-4 font-medium">Calories Intake</h3>

          <div className="flex h-48 items-end justify-between">
            {historyData.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="relative mb-2 flex w-full justify-center">
                  <div
                    className="w-10 rounded-t-sm bg-[#FF6B00]"
                    style={{ height: `${(day.calories / 3000) * 100}%`, maxHeight: "90%", minHeight: "5%" }}
                  ></div>
                </div>
                <span className="text-xs">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button variant="orangeFilled" onClick={onClose} className="px-6 py-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
