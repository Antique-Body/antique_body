"use client";
import { useState } from "react";
import DeviceIntegration from "./DeviceIntegration";

const ProgressDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const progressData = {
    overview: {
      totalWorkouts: 48,
      totalVolume: 24600,
      totalTime: 3240, // in minutes
      averageIntensity: 85,
    },
    recentAchievements: [
      {
        id: 1,
        title: "Volume Master",
        description: "Lifted over 25,000 kg total volume",
        date: "2024-03-20",
        icon: "🏋️‍♂️",
        progress: 98
      },
      {
        id: 2,
        title: "Consistency King",
        description: "Completed 4 workouts per week for a month",
        date: "2024-03-15",
        icon: "👑",
        progress: 100
      },
      {
        id: 3,
        title: "Strength Milestone",
        description: "Bench pressed 100kg",
        date: "2024-03-10",
        icon: "💪",
        progress: 100
      }
    ],
    personalRecords: [
      {
        exercise: "Bench Press",
        weight: 100,
        date: "2024-03-10",
        progress: [80, 85, 90, 95, 100]
      },
      {
        exercise: "Squat",
        weight: 140,
        date: "2024-03-15",
        progress: [100, 110, 120, 130, 140]
      },
      {
        exercise: "Deadlift",
        weight: 160,
        date: "2024-03-18",
        progress: [120, 130, 140, 150, 160]
      }
    ],
    weeklyVolume: [
      { week: "Week 1", volume: 5200 },
      { week: "Week 2", volume: 5600 },
      { week: "Week 3", volume: 6100 },
      { week: "Week 4", volume: 5900 },
      { week: "Week 5", volume: 6300 }
    ],
    bodyMeasurements: {
      weight: [80, 79.5, 79, 78.8, 78.5],
      chest: [98, 99, 100, 101, 102],
      arms: [36, 36.5, 37, 37.2, 37.5],
      waist: [85, 84, 83.5, 83, 82.5]
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'health', name: 'Health Data' },
    { id: 'measurements', name: 'Measurements' },
    { id: 'devices', name: 'Connected Devices' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <DeviceIntegration />;
      case 'overview':
        return (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Total Workouts</h3>
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">{progressData.overview.totalWorkouts}</p>
                <p className="text-sm text-gray-400">Sessions completed</p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Total Volume</h3>
                  <div className="w-8 h-8 rounded-full bg-[#3498db] bg-opacity-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">{progressData.overview.totalVolume.toLocaleString()}kg</p>
                <p className="text-sm text-gray-400">Total weight lifted</p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Total Time</h3>
                  <div className="w-8 h-8 rounded-full bg-[#2ecc71] bg-opacity-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">{Math.floor(progressData.overview.totalTime / 60)}h</p>
                <p className="text-sm text-gray-400">Time training</p>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Avg Intensity</h3>
                  <div className="w-8 h-8 rounded-full bg-[#e74c3c] bg-opacity-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold">{progressData.overview.averageIntensity}%</p>
                <p className="text-sm text-gray-400">Average workout intensity</p>
              </div>
            </div>

            {/* Weekly Volume Chart */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 mb-10">
              <h3 className="text-xl font-bold mb-6">Weekly Volume Progress</h3>
              <div className="h-64 flex items-end gap-4">
                {progressData.weeklyVolume.map((week, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-lg"
                      style={{ 
                        height: `${(week.volume / Math.max(...progressData.weeklyVolume.map(w => w.volume))) * 100}%`
                      }}
                    ></div>
                    <p className="mt-2 text-sm text-gray-400">{week.week}</p>
                    <p className="text-sm font-medium">{week.volume.toLocaleString()}kg</p>
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
                        <p className="text-sm text-gray-400">Last PR: {record.date}</p>
                      </div>
                      <p className="text-2xl font-bold text-[#FF6B00]">{record.weight}kg</p>
                    </div>
                    <div className="flex gap-2">
                      {record.progress.map((weight, i) => (
                        <div 
                          key={i}
                          className="flex-1 h-1 rounded-full bg-[#333]"
                        >
                          <div 
                            className="h-full rounded-full bg-[#FF6B00]"
                            style={{ width: `${(weight / record.weight) * 100}%` }}
                          ></div>
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
                    className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-xl border border-[#333]"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                      <div className="mt-2 h-1 bg-[#333] rounded-full">
                        <div 
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'measurements':
        return (
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Body Measurements</h3>
            <div className="space-y-6">
              {Object.entries(progressData.bodyMeasurements).map(([measurement, values]) => (
                <div key={measurement} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium capitalize">{measurement}</h4>
                    <p className="text-[#FF6B00] font-medium">
                      {values[values.length - 1]} {measurement === 'weight' ? 'kg' : 'cm'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {values.map((value, i) => (
                      <div 
                        key={i}
                        className="flex-1 h-1 rounded-full bg-[#333]"
                      >
                        <div 
                          className="h-full rounded-full bg-[#FF6B00]"
                          style={{ 
                            width: `${(value / Math.max(...values)) * 100}%`
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#FF6B00] text-white'
                : 'bg-[#222] text-gray-400 hover:bg-[#333]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ProgressDashboard; 