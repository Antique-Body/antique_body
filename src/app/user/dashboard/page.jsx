"use client";
import Background from "@/components/background";
import { BrandLogo } from "@components/custom";
import { useSession } from "next-auth/react";
import { useState } from "react";
import NutritionDashboard from "./components/NutritionDashboard";
import ProgressDashboard from "./components/ProgressDashboard";
import SettingsDashboard from "./components/SettingsDashboard";
import WorkoutDashboard from "./components/WorkoutDashboard";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("workout");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
      <Background />

      <div className="max-w-7xl mx-auto px-5 py-5 relative z-20 min-h-screen flex flex-col">
        <header className="pt-6 w-full flex justify-between items-center">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-[#333] flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#FF6B00] flex items-center justify-center text-lg font-semibold">
                  {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mt-8 mb-6">
          <h1 className="text-4xl font-bold">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
          <p className="text-gray-400 mt-2">Track your fitness journey and achieve your goals</p>
        </div>

        <div className="mb-8">
          <div className="border-b border-[#333] flex overflow-x-auto">
            <button 
              className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeTab === "workout" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("workout")}
            >
              Workout
            </button>
            <button 
              className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeTab === "nutrition" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("nutrition")}
            >
              Nutrition
            </button>
            <button 
              className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeTab === "progress" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("progress")}
            >
              Progress
            </button>
            <button 
              className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeTab === "settings" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "workout" && <WorkoutDashboard />}
          {activeTab === "nutrition" && <NutritionDashboard />}
          {activeTab === "progress" && <ProgressDashboard />}
          {activeTab === "settings" && <SettingsDashboard />}
        </div>
      </div>
    </div>
  );
}
