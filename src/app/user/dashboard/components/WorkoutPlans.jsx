"use client";
import { useState } from "react";

import TrainingPlanModal from "./TrainingPlanModal";

const WorkoutPlans = ({ trainingTypes, onShowMuscleGroups }) => {
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
    setShowTrainingModal(true);
  };

  const handleCloseModal = () => {
    setShowTrainingModal(false);
  };

  const getIconPath = (iconName) => {
    switch (iconName) {
      case "lightning":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "zap":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "dumbbell":
        return (
          <path d="M6 5H4a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5H4v8h2v-8zm12-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8zm-6-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8z" />
        );
      case "activity":
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case "flame":
        return (
          <path d="M12 2c1 3 2 5 2 7 0 2.236-1.765 4-4 4s-4-1.764-4-4c0-2 1-4 2-7 1 3 2 5 2 7 0 1.105.893 2 2 2s2-.895 2-2c0-2-1-4-2-7zm0 18c3.314 0 6-2 6-6 0-3.355-2.984-6.584-6-12-3.016 5.418-6 8.646-6 12 0 4 2.686 6 6 6z" />
        );
      case "award":
        return (
          <path d="M12 15c5 0 9-4 9-9h-4.5L15 3.5 12 1 9 3.5 7.5 6H3c0 5 4 9 9 9zm0 0v8m-4-4h8" />
        );
      case "crown":
        return <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />;
      case "repeat":
        return <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />;
      case "move":
        return <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />;
      case "target":
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </>
        );
      case "sunrise":
        return (
          <>
            <path d="M17 18a5 5 0 00-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF6B00] to-orange-400 bg-clip-text text-transparent">Choose Your Training Method</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Training Type Card */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#131313] to-[#0a0a0a] border border-[#333] hover:border-[#FF6B00] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#FF6B00]/10 transform hover:-translate-y-2">
          <div className="h-3 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9248]"></div>
          <div className="p-8">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#FF6B00]/20 to-[#FF8533]/10 shadow-lg shadow-[#FF6B00]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <path d="M2 10h20"></path>
                  <path d="M8 4v4"></path>
                  <path d="M16 4v4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Training Types</h3>
                <p className="text-gray-400">
                  Choose from various training programs designed to meet your specific
                  fitness goals
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {trainingTypes.map((training) => (
                <div
                  key={training.id}
                  className="p-4 rounded-xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#101010] hover:from-[#222] hover:to-[#151515] transition-all duration-300 cursor-pointer hover:border-[#444] hover:shadow-lg hover:shadow-[#FF6B00]/5 transform hover:-translate-y-1"
                  onClick={() => handleSelectTraining(training)}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${training.color}40, ${training.color}20)`,
                      boxShadow: `0 4px 12px -2px ${training.color}30`,
                    }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={training.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      {getIconPath(training.icon)}
                    </svg>
                  </div>
                  <h4 className="font-medium text-white mb-1">{training.name}</h4>
                  <p className="text-xs text-gray-400">{training.summary}</p>
                  
                  <div className="mt-3 h-1 w-full bg-[#333] overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: '60%',
                        background: `linear-gradient(90deg, ${training.color}70, ${training.color}40)` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {/* Strength Training */}
              <div
                className="p-4 rounded-xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#101010] hover:from-[#222] hover:to-[#151515] transition-all duration-300 cursor-pointer hover:border-[#444] hover:shadow-lg hover:shadow-[#FF6B00]/5 transform hover:-translate-y-1"
                onClick={() => handleSelectTraining({
                  id: "strength",
                  name: "Strength Training",
                  summary: "Build muscle and increase power",
                  color: "#e74c3c",
                  icon: "dumbbell"
                })}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #e74c3c40, #e74c3c20)",
                    boxShadow: "0 4px 12px -2px #e74c3c30",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e74c3c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    {getIconPath("dumbbell")}
                  </svg>
                </div>
                <h4 className="font-medium text-white mb-1">Strength Training</h4>
                <p className="text-xs text-gray-400">Build muscle and increase power</p>
                
                <div className="mt-3 h-1 w-full bg-[#333] overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: '60%',
                      background: "linear-gradient(90deg, #e74c3c70, #e74c3c40)" 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* HIIT */}
              <div
                className="p-4 rounded-xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#101010] hover:from-[#222] hover:to-[#151515] transition-all duration-300 cursor-pointer hover:border-[#444] hover:shadow-lg hover:shadow-[#FF6B00]/5 transform hover:-translate-y-1"
                onClick={() => handleSelectTraining({
                  id: "hiit",
                  name: "HIIT",
                  summary: "High intensity interval training",
                  color: "#2ecc71",
                  icon: "zap"
                })}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #2ecc7140, #2ecc7120)",
                    boxShadow: "0 4px 12px -2px #2ecc7130",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    {getIconPath("zap")}
                  </svg>
                </div>
                <h4 className="font-medium text-white mb-1">HIIT</h4>
                <p className="text-xs text-gray-400">High intensity interval training</p>
                
                <div className="mt-3 h-1 w-full bg-[#333] overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: '60%',
                      background: "linear-gradient(90deg, #2ecc7170, #2ecc7140)" 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Yoga & Flexibility */}
              <div
                className="p-4 rounded-xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#101010] hover:from-[#222] hover:to-[#151515] transition-all duration-300 cursor-pointer hover:border-[#444] hover:shadow-lg hover:shadow-[#FF6B00]/5 transform hover:-translate-y-1"
                onClick={() => handleSelectTraining({
                  id: "yoga",
                  name: "Yoga & Flexibility",
                  summary: "Improve mobility and mindfulness",
                  color: "#9b59b6",
                  icon: "sunrise"
                })}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #9b59b640, #9b59b620)",
                    boxShadow: "0 4px 12px -2px #9b59b630",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b59b6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    {getIconPath("sunrise")}
                  </svg>
                </div>
                <h4 className="font-medium text-white mb-1">Yoga & Flexibility</h4>
                <p className="text-xs text-gray-400">Improve mobility and mindfulness</p>
                
                <div className="mt-3 h-1 w-full bg-[#333] overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: '60%',
                      background: "linear-gradient(90deg, #9b59b670, #9b59b640)" 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Cardio & Endurance */}
              <div
                className="p-4 rounded-xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#101010] hover:from-[#222] hover:to-[#151515] transition-all duration-300 cursor-pointer hover:border-[#444] hover:shadow-lg hover:shadow-[#FF6B00]/5 transform hover:-translate-y-1"
                onClick={() => handleSelectTraining({
                  id: "cardio",
                  name: "Cardio & Endurance",
                  summary: "Boost stamina and heart health",
                  color: "#3498db",
                  icon: "activity"
                })}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #3498db40, #3498db20)",
                    boxShadow: "0 4px 12px -2px #3498db30",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3498db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    {getIconPath("activity")}
                  </svg>
                </div>
                <h4 className="font-medium text-white mb-1">Cardio & Endurance</h4>
                <p className="text-xs text-gray-400">Boost stamina and heart health</p>
                
                <div className="mt-3 h-1 w-full bg-[#333] overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: '60%',
                      background: "linear-gradient(90deg, #3498db70, #3498db40)" 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <button className="w-full px-6 py-3.5 bg-gradient-to-r from-[#1A1A1A] to-[#222] border border-[#333] rounded-xl font-medium transition-all duration-300 hover:bg-[#222] hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              Browse All Training Types
            </button>
          </div>
        </div>

        {/* Card 2: Muscle Group Card */}
        <div
          className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#131313] to-[#0a0a0a] border border-[#333] hover:border-[#3498db] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#3498db]/10 transform hover:-translate-y-2 cursor-pointer"
          onClick={onShowMuscleGroups}>
          <div className="h-3 w-full bg-gradient-to-r from-[#3498db] to-[#48abf9]"></div>
          <div className="p-8">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#3498db]/20 to-[#5dade2]/10 shadow-lg shadow-[#3498db]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M6.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
                  <path d="M2.5 7.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
                  <path d="M17.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
                  <path d="M13.5 7.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
                  <path d="M6.5 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
                  <path d="M2.5 18.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
                  <path d="M17.5 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
                  <path d="M13.5 18.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Muscle Groups</h3>
                <p className="text-gray-400">
                  Target specific muscle groups with specialized exercises and
                  workouts
                </p>
              </div>
            </div>

            {/* Body Preview Illustration - Redesigned */}
            <div className="flex justify-center mb-2">
              <div className="relative w-full max-w-[440px] h-[380px] bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-xl p-6 border border-[#333] shadow-inner overflow-hidden mb-6">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-[10%] left-[20%] w-80 h-80 rounded-full bg-[#3498db] filter blur-3xl"></div>
                  <div className="absolute bottom-[10%] right-[20%] w-80 h-80 rounded-full bg-[#e74c3c] filter blur-3xl"></div>
                </div>
                
                {/* Enhanced Body Outline */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10">
                  <path
                    d="M100 12C89 12 80 20 80 30C80 40 89 48 100 48C111 48 120 40 120 30C120 20 111 12 100 12Z"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M85 48C85 48 60 55 55 100C50 145 50 188 55 195C60 202 75 202 75 195C75 188 80 120 80 120"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M115 48C115 48 140 55 145 100C150 145 150 188 145 195C140 202 125 202 125 195C125 188 120 120 120 120"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M85 60C85 60 80 95 90 105C100 115 100 125 100 140"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M115 60C115 60 120 95 110 105C100 115 100 125 100 140"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M90 140C90 140 85 185 85 195C85 205 90 225 100 225C110 225 115 205 115 195C115 185 110 140 110 140"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                </svg>

                {/* Enhanced Muscle Group Highlights */}
                <div className="absolute top-[14%] left-[50%] transform -translate-x-1/2 w-20 h-20 rounded-full bg-[#3498db]/10 border border-[#3498db]/40 backdrop-blur-sm cursor-pointer hover:bg-[#3498db]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#3498db]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Shoulders</span>
                  <div className="absolute inset-0 rounded-full bg-[#3498db]/10 animate-ping opacity-30"></div>
                </div>

                <div className="absolute top-[35%] left-[50%] transform -translate-x-1/2 w-22 h-22 rounded-full bg-[#e74c3c]/10 border border-[#e74c3c]/40 backdrop-blur-sm cursor-pointer hover:bg-[#e74c3c]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#e74c3c]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Chest</span>
                  <div className="absolute inset-0 rounded-full bg-[#e74c3c]/10 animate-ping opacity-30 animation-delay-300"></div>
                </div>

                <div className="absolute top-[42%] left-[26%] w-18 h-18 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/40 backdrop-blur-sm cursor-pointer hover:bg-[#2ecc71]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#2ecc71]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Biceps</span>
                  <div className="absolute inset-0 rounded-full bg-[#2ecc71]/10 animate-ping opacity-30 animation-delay-600"></div>
                </div>

                <div className="absolute top-[42%] right-[26%] w-18 h-18 rounded-full bg-[#2ecc71]/10 border border-[#2ecc71]/40 backdrop-blur-sm cursor-pointer hover:bg-[#2ecc71]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#2ecc71]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Triceps</span>
                  <div className="absolute inset-0 rounded-full bg-[#2ecc71]/10 animate-ping opacity-30 animation-delay-900"></div>
                </div>

                <div className="absolute top-[55%] left-[50%] transform -translate-x-1/2 w-20 h-20 rounded-full bg-[#f1c40f]/10 border border-[#f1c40f]/40 backdrop-blur-sm cursor-pointer hover:bg-[#f1c40f]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#f1c40f]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Abs</span>
                  <div className="absolute inset-0 rounded-full bg-[#f1c40f]/10 animate-ping opacity-30 animation-delay-1200"></div>
                </div>

                <div className="absolute bottom-[15%] left-[50%] transform -translate-x-1/2 w-22 h-22 rounded-full bg-[#9b59b6]/10 border border-[#9b59b6]/40 backdrop-blur-sm cursor-pointer hover:bg-[#9b59b6]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#9b59b6]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Legs</span>
                  <div className="absolute inset-0 rounded-full bg-[#9b59b6]/10 animate-ping opacity-30 animation-delay-1500"></div>
                </div>
                
                <div className="absolute bottom-[55%] left-[20%] w-18 h-18 rounded-full bg-[#fd79a8]/10 border border-[#fd79a8]/40 backdrop-blur-sm cursor-pointer hover:bg-[#fd79a8]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#fd79a8]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Back</span>
                  <div className="absolute inset-0 rounded-full bg-[#fd79a8]/10 animate-ping opacity-30 animation-delay-1800"></div>
                </div>
                
                <div className="absolute bottom-[55%] right-[20%] w-18 h-18 rounded-full bg-[#00b894]/10 border border-[#00b894]/40 backdrop-blur-sm cursor-pointer hover:bg-[#00b894]/30 transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-lg shadow-[#00b894]/20 group">
                  <span className="text-white drop-shadow-md group-hover:scale-110 transition-transform">Core</span>
                  <div className="absolute inset-0 rounded-full bg-[#00b894]/10 animate-ping opacity-30 animation-delay-2100"></div>
                </div>
              </div>
            </div>

            <button
              className="w-full mt-1 px-6 py-3.5 bg-gradient-to-r from-[#1A1A1A] to-[#222] border border-[#333] rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#3498db]/10 hover:to-[#5dade2]/10 hover:border-[#3498db] hover:shadow-lg hover:shadow-[#3498db]/10 flex items-center justify-center gap-2 group"
              onClick={onShowMuscleGroups}>
              <span className="group-hover:translate-x-1 transition-transform">Explore Muscle Groups</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Training Plan Modal */}
      {showTrainingModal && selectedTraining && (
        <TrainingPlanModal
          training={selectedTraining}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WorkoutPlans;
