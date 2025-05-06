"use client";
import { useState } from "react";
import DeviceIntegration from "./DeviceIntegration";

// Custom CSS with keyframe animations
const animationStyles = {
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0.5,
      transform: "translateY(10px)"
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)"
    }
  },
  ".animate-fadeIn": {
    animation: "fadeIn 0.3s ease-out forwards"
  },
  ".scrollbar-hide": {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none"
    }
  }
};

const ProgressDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const progressData = {
    overview: {
      totalWorkouts: 48,
      totalVolume: 24600,
      totalTime: 3240, // in minutes
      averageIntensity: 85,
      caloriesBurned: 42500,
      restDays: 12,
    },
    recentAchievements: [
      {
        id: 1,
        title: "Volume Master",
        description: "Lifted over 25,000 kg total volume",
        date: "2024-03-20",
        icon: "🏋️‍♂️",
        progress: 98,
      },
      {
        id: 2,
        title: "Consistency King",
        description: "Completed 4 workouts per week for a month",
        date: "2024-03-15",
        icon: "👑",
        progress: 100,
      },
      {
        id: 3,
        title: "Strength Milestone",
        description: "Bench pressed 100kg",
        date: "2024-03-10",
        icon: "💪",
        progress: 100,
      },
    ],
    personalRecords: [
      {
        exercise: "Bench Press",
        weight: 100,
        date: "2024-03-10",
        progress: [80, 85, 90, 95, 100],
      },
      {
        exercise: "Squat",
        weight: 140,
        date: "2024-03-15",
        progress: [100, 110, 120, 130, 140],
      },
      {
        exercise: "Deadlift",
        weight: 160,
        date: "2024-03-18",
        progress: [120, 130, 140, 150, 160],
      },
    ],
    weeklyVolume: [
      { week: "Week 1", volume: 5200 },
      { week: "Week 2", volume: 5600 },
      { week: "Week 3", volume: 6100 },
      { week: "Week 4", volume: 5900 },
      { week: "Week 5", volume: 6300 },
    ],
    bodyMeasurements: {
      weight: [80, 79.5, 79, 78.8, 78.5],
      chest: [98, 99, 100, 101, 102],
      arms: [36, 36.5, 37, 37.2, 37.5],
      waist: [85, 84, 83.5, 83, 82.5],
      bodyFat: [18, 17.5, 17, 16.8, 16.5],
      muscleMass: [62, 62.3, 62.5, 62.8, 63.2],
    },
    nutrition: {
      weeklyCalories: [2200, 2350, 2100, 2400, 2150, 2300, 2250],
      macroDistribution: {
        protein: 35,
        carbs: 45,
        fats: 20
      },
      waterIntake: [2.2, 2.5, 2.3, 2.7, 2.4, 2.6, 2.5], // liters per day for the week
      supplements: [
        { name: "Protein", dosage: "25g", frequency: "Daily", timing: "Post-workout" },
        { name: "Creatine", dosage: "5g", frequency: "Daily", timing: "Morning" },
        { name: "BCAA", dosage: "10g", frequency: "Workout days", timing: "During workout" },
        { name: "Multivitamin", dosage: "1 tablet", frequency: "Daily", timing: "Morning" }
      ]
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "measurements", name: "Measurements", icon: "📏" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Workouts</h3>
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {progressData.overview.totalWorkouts}
                </p>
                <p className="text-sm text-gray-400">This month</p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Body Weight</h3>
                  <div className="w-8 h-8 rounded-full bg-[#3498db] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3498db"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {progressData.bodyMeasurements.weight[progressData.bodyMeasurements.weight.length-1]}kg
                </p>
                <p className="text-sm text-gray-400">
                  {progressData.bodyMeasurements.weight[0] > progressData.bodyMeasurements.weight[progressData.bodyMeasurements.weight.length-1] ? '↓' : '↑'} 
                  {Math.abs(progressData.bodyMeasurements.weight[0] - progressData.bodyMeasurements.weight[progressData.bodyMeasurements.weight.length-1]).toFixed(1)}kg
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Body Fat</h3>
                  <div className="w-8 h-8 rounded-full bg-[#2ecc71] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2ecc71"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {progressData.bodyMeasurements.bodyFat[progressData.bodyMeasurements.bodyFat.length-1]}%
                </p>
                <p className="text-sm text-gray-400">
                  {progressData.bodyMeasurements.bodyFat[0] > progressData.bodyMeasurements.bodyFat[progressData.bodyMeasurements.bodyFat.length-1] ? '↓' : '↑'} 
                  {Math.abs(progressData.bodyMeasurements.bodyFat[0] - progressData.bodyMeasurements.bodyFat[progressData.bodyMeasurements.bodyFat.length-1]).toFixed(1)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Muscle Mass</h3>
                  <div className="w-8 h-8 rounded-full bg-[#e74c3c] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#e74c3c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {progressData.bodyMeasurements.muscleMass[progressData.bodyMeasurements.muscleMass.length-1]}kg
                </p>
                <p className="text-sm text-gray-400">
                  {progressData.bodyMeasurements.muscleMass[0] < progressData.bodyMeasurements.muscleMass[progressData.bodyMeasurements.muscleMass.length-1] ? '↑' : '↓'} 
                  {Math.abs(progressData.bodyMeasurements.muscleMass[0] - progressData.bodyMeasurements.muscleMass[progressData.bodyMeasurements.muscleMass.length-1]).toFixed(1)}kg
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Calories</h3>
                  <div className="w-8 h-8 rounded-full bg-[#9b59b6] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9b59b6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">
                  {(progressData.overview.caloriesBurned / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-gray-400">This month</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Workout Streak</h3>
                  <div className="w-8 h-8 rounded-full bg-[#f39c12] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f39c12"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-gray-400">Current streak</p>
              </div>
            </div>

            {/* Weekly Volume Chart */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 mb-10">
              <h3 className="text-xl font-bold mb-6">Weekly Volume Progress</h3>
              <div className="h-64 flex items-end gap-4">
                {progressData.weeklyVolume.map((week, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-lg"
                      style={{
                        height: `${(week.volume / Math.max(...progressData.weeklyVolume.map((w) => w.volume))) * 100}%`,
                      }}></div>
                    <p className="mt-2 text-sm text-gray-400">{week.week}</p>
                    <p className="text-sm font-medium">
                      {week.volume.toLocaleString()}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Records */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 mb-10">
              <h3 className="text-xl font-bold mb-6">Personal Records</h3>
              <div className="space-y-6">
                {progressData.personalRecords.map((record, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{record.exercise}</h4>
                        <p className="text-sm text-gray-400">
                          Last PR: {record.date}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[#FF6B00]">
                        {record.weight}kg
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {record.progress.map((weight, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full bg-[#333]">
                          <div
                            className="h-full rounded-full bg-[#FF6B00]"
                            style={{
                              width: `${(weight / record.weight) * 100}%`,
                            }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 mb-10">
              <h3 className="text-xl font-bold mb-6">Recent Achievements</h3>
              <div className="space-y-4">
                {progressData.recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-xl border border-[#333]">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">
                        {achievement.description}
                      </p>
                      <div className="mt-2 h-1 bg-[#333] rounded-full">
                        <div
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ width: `${achievement.progress}%` }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case "measurements":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Body Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(progressData.bodyMeasurements).map(
                  ([measurement, values], index) => (
                    <div key={measurement} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium capitalize">{measurement}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">
                            {values[0]} {measurement === "weight" || measurement === "bodyFat" || measurement === "muscleMass" ? "kg" : "cm"}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="text-[#FF6B00] font-medium">
                            {values[values.length - 1]} {measurement === "weight" || measurement === "bodyFat" || measurement === "muscleMass" ? "kg" : "cm"}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-opacity-20 font-medium ml-2 
                            ${measurement === 'weight' || measurement === 'waist' || measurement === 'bodyFat' 
                              ? (values[0] > values[values.length - 1] ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500')
                              : (values[0] < values[values.length - 1] ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500')
                            }"
                          >
                            {(measurement === 'weight' || measurement === 'waist' || measurement === 'bodyFat' 
                              ? (values[0] > values[values.length - 1] 
                                ? '-' + (values[0] - values[values.length - 1]).toFixed(1) 
                                : '+' + (values[values.length - 1] - values[0]).toFixed(1))
                              : (values[0] < values[values.length - 1] 
                                ? '+' + (values[values.length - 1] - values[0]).toFixed(1) 
                                : '-' + (values[0] - values[values.length - 1]).toFixed(1))
                            )}
                            {measurement === "weight" || measurement === "bodyFat" || measurement === "muscleMass" ? "kg" : "cm"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#1A1A1A] rounded-xl p-4">
                        <div className="flex gap-2 mb-3">
                          {values.map((value, i) => (
                            <div
                              key={i}
                              className="flex-1 h-2 rounded-full bg-[#333]">
                              <div
                                className="h-full rounded-full bg-[#FF6B00]"
                                style={{
                                  width: `${
                                    measurement === 'weight' || measurement === 'waist' || measurement === 'bodyFat' 
                                      ? (1 - ((value - Math.min(...values)) / ((Math.max(...values) - Math.min(...values)) || 1))) * 100
                                      : ((value - Math.min(...values)) / ((Math.max(...values) - Math.min(...values)) || 1)) * 100
                                  }%`,
                                }}></div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Initial</span>
                          <span>Current</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Measurement Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] rounded-xl p-6">
                  <h4 className="text-lg font-medium mb-4">Body Composition</h4>
                  <div className="flex items-center justify-center h-44">
                    <div className="w-44 h-44 relative">
                      {/* Body Fat */}
                      <div className="absolute inset-0">
                        <div className="w-full h-full rounded-full border-[16px] border-[#FF6B00] opacity-60"></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-lg font-bold text-[#FF6B00]">{progressData.bodyMeasurements.bodyFat[progressData.bodyMeasurements.bodyFat.length-1]}%</span>
                          <span className="text-xs text-gray-400">Body Fat</span>
                        </div>
                      </div>
                      
                      {/* Muscle Mass */}
                      <div className="absolute inset-0 transform rotate-[162deg]">
                        <div className="w-full h-full rounded-full border-[16px] border-[#3498db] opacity-60"></div>
                        <div className="absolute inset-0 transform -rotate-[162deg] flex items-center justify-center flex-col">
                          <span className="text-lg font-bold text-[#3498db]">
                            {Math.round((progressData.bodyMeasurements.muscleMass[progressData.bodyMeasurements.muscleMass.length-1] / 
                              progressData.bodyMeasurements.weight[progressData.bodyMeasurements.weight.length-1]) * 100)}%
                          </span>
                          <span className="text-xs text-gray-400">Muscle Mass</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1A1A1A] rounded-xl p-6">
                  <h4 className="text-lg font-medium mb-4">Progress Summary</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Target Weight</span>
                        <span className="text-sm font-medium">75kg</span>
                      </div>
                      <div className="h-2 bg-[#333] rounded-full">
                        <div 
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, 100 - ((progressData.bodyMeasurements.weight[progressData.bodyMeasurements.weight.length-1] - 75) / (progressData.bodyMeasurements.weight[0] - 75) * 100)))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Target Body Fat</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="h-2 bg-[#333] rounded-full">
                        <div 
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, 100 - ((progressData.bodyMeasurements.bodyFat[progressData.bodyMeasurements.bodyFat.length-1] - 15) / (progressData.bodyMeasurements.bodyFat[0] - 15) * 100)))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Target Muscle Mass</span>
                        <span className="text-sm font-medium">65kg</span>
                      </div>
                      <div className="h-2 bg-[#333] rounded-full">
                        <div 
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, ((progressData.bodyMeasurements.muscleMass[progressData.bodyMeasurements.muscleMass.length-1] - progressData.bodyMeasurements.muscleMass[0]) / (65 - progressData.bodyMeasurements.muscleMass[0]) * 100)))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] rounded-3xl p-6 shadow-xl border border-[#222]">
      {/* Header with title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Progress Dashboard</h2>
        <p className="text-gray-400">Track your fitness journey and achievements</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg shadow-[#FF6B00]/20"
                : "bg-[#171717] text-gray-400 hover:bg-[#222] hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}>
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {renderContent()}
      </div>
      
      {/* Footer with last updated info */}
      <div className="mt-10 pt-4 border-t border-[#222] flex justify-between items-center text-sm text-gray-500">
        <p>Last updated: Today at 14:32</p>
        <button className="px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#222] transition-colors">
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default ProgressDashboard;
