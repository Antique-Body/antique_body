"use client";

import { Button } from "@/components/common/Button";

export default function ProgressPage() {
  // Sample user data
  const userData = {
    name: "Jamie Smith",
    stats: {
      height: 175, // cm
      weight: 72, // kg
      bmi: 23.5,
      bodyFat: 18, // percentage
    },
    progress_history: [
      { date: "Apr 1, 2025", weight: 74, bodyFat: 19 },
      { date: "Mar 15, 2025", weight: 75, bodyFat: 19.5 },
      { date: "Mar 1, 2025", weight: 76, bodyFat: 20 },
      { date: "Feb 15, 2025", weight: 77, bodyFat: 20.5 },
      { date: "Feb 1, 2025", weight: 78, bodyFat: 21 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Current Stats */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Current Stats</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <p className="mb-1 text-xs text-gray-400">Height</p>
            <p className="text-lg font-bold">{userData.stats.height} cm</p>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <p className="mb-1 text-xs text-gray-400">Current Weight</p>
            <p className="text-lg font-bold">{userData.stats.weight} kg</p>
            <p className="text-xs text-[#4CAF50]">-6kg from start</p>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <p className="mb-1 text-xs text-gray-400">BMI</p>
            <p className="text-lg font-bold">{userData.stats.bmi}</p>
            <p className="text-xs text-[#4CAF50]">Healthy range</p>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <p className="mb-1 text-xs text-gray-400">Body Fat</p>
            <p className="text-lg font-bold">{userData.stats.bodyFat}%</p>
            <p className="text-xs text-[#4CAF50]">-3% from start</p>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Progress History</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-3 font-medium">Weight Progression</h3>
            <div className="relative h-64">
              {/* Simple weight chart - in real app, use a charting library */}
              <div className="absolute inset-0 flex items-end">
                {userData.progress_history.map((entry, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center">
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-8 rounded-t-sm bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] transition-all duration-500 hover:w-10"
                        style={{
                          height: `${((entry.weight - 70) / 10) * 100}%`,
                          minHeight: "10%",
                          maxHeight: "100%",
                        }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                    <p className="text-xs font-medium">{entry.weight} kg</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-3 font-medium">Body Fat Progression</h3>
            <div className="relative h-64">
              {/* Simple body fat chart - in real app, use a charting library */}
              <div className="absolute inset-0 flex items-end">
                {userData.progress_history.map((entry, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center">
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-8 rounded-t-sm bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500 hover:w-10"
                        style={{
                          height: `${(entry.bodyFat / 25) * 100}%`,
                          minHeight: "10%",
                          maxHeight: "100%",
                        }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                    <p className="text-xs font-medium">{entry.bodyFat}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button variant="orangeOutline" className="mt-4 w-full">
          Upload Progress Photo
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Performance Metrics</h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Squat Max</h3>
              <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                +10kg
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="font-bold">85kg</span>
              <span className="ml-2 text-sm text-gray-400">previous: 75kg</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Bench Press Max</h3>
              <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                +7.5kg
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="font-bold">67.5kg</span>
              <span className="ml-2 text-sm text-gray-400">previous: 60kg</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Deadlift Max</h3>
              <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                +15kg
              </span>
            </div>
            <div className="flex items-center text-lg">
              <span className="font-bold">120kg</span>
              <span className="ml-2 text-sm text-gray-400">previous: 105kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
