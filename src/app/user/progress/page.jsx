"use client";

import { useState } from "react";

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const progressData = {
    totalWorkouts: 24,
    totalVolume: 15600,
    totalCalories: 7200,
    streak: 7,
    achievements: [
      { name: "First Workout", date: "2024-03-01", icon: "🎯" },
      { name: "5 Workout Streak", date: "2024-03-05", icon: "🔥" },
      { name: "1000kg Total Volume", date: "2024-03-10", icon: "💪" },
      { name: "Perfect Week", date: "2024-03-15", icon: "⭐" }
    ],
    recentWorkouts: [
      { name: "Upper Body Push", date: "2024-03-20", volume: 1200, exercises: 6 },
      { name: "Lower Body", date: "2024-03-18", volume: 1500, exercises: 5 },
      { name: "Full Body", date: "2024-03-15", volume: 1800, exercises: 8 }
    ],
    personalRecords: [
      { exercise: "Bench Press", weight: 100, date: "2024-03-20" },
      { exercise: "Squat", weight: 140, date: "2024-03-18" },
      { exercise: "Deadlift", weight: 160, date: "2024-03-15" }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-sm z-30 border-b border-neutral-800">
        <div className="max-w-[550px] mx-auto p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 400 400">
                <defs>
                  <linearGradient
                    id="orangeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#FF7800", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#FF9A00", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <g transform="translate(200, 200) scale(0.8)">
                  <path
                    d="M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z
                         M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0
                         C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z"
                    fill="url(#orangeGradient)"
                  />
                  <circle
                    cx="-40"
                    cy="-5"
                    r="10"
                    fill="#000"
                    stroke="#FF7800"
                    strokeWidth="1"
                  />
                </g>
              </svg>
              <h2 className="text-lg font-bold">
                ANTIC <span className="text-orange-500">BODY</span>
              </h2>
            </div>
            <button
              onClick={() => window.location.href = '/user/dashboard'}
              className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-orange-900/30"
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
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[550px] mx-auto p-5 pb-32">
        {/* Progress Overview */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800">
              <div className="text-sm text-gray-400 mb-1">Total Workouts</div>
              <div className="text-2xl font-bold">{progressData.totalWorkouts}</div>
            </div>
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800">
              <div className="text-sm text-gray-400 mb-1">Total Volume</div>
              <div className="text-2xl font-bold">{progressData.totalVolume} kg</div>
            </div>
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800">
              <div className="text-sm text-gray-400 mb-1">Calories Burned</div>
              <div className="text-2xl font-bold">{progressData.totalCalories} kcal</div>
            </div>
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800">
              <div className="text-sm text-gray-400 mb-1">Current Streak</div>
              <div className="text-2xl font-bold">{progressData.streak} days</div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800 mb-8">
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="h-40 flex items-end gap-2">
              {[65, 75, 60, 80, 85, 70, 90].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {progressData.achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-gray-400">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Records */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Personal Records</h3>
            <div className="space-y-3">
              {progressData.personalRecords.map((record, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{record.exercise}</h4>
                      <p className="text-sm text-gray-400">{record.date}</p>
                    </div>
                    <div className="text-xl font-bold text-orange-500">
                      {record.weight} kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Workouts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
            <div className="space-y-3">
              {progressData.recentWorkouts.map((workout, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 border border-neutral-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-gray-400">{workout.date}</p>
                    </div>
                    <div className="text-orange-500 font-medium">
                      {workout.volume} kg
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <div>{workout.exercises} exercises</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 