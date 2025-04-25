"use client";
import { useState } from "react";
import React from "react";
import { ClientProfile } from "@/components/custom/client/dashboard";
import {
    OverviewTab,
    TrainingsTab,
    ProgramTab,
    ProgressTab,
    MessagesTab,
    NutritionTab,
} from "@/components/custom/client/dashboard/tabs";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { DashboardTabs } from "@/components/custom/shared";
import { BackgroundShapes } from "@/components/custom/shared";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";
const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedTrainingId, setExpandedTrainingId] = useState(null);

    // Sample user data
    const userData = {
        name: "Jamie Smith",
        coach: "Alex Miller",
        planName: "Strength Building",
        planStart: "Mar 15, 2025",
        planEnd: "Jun 15, 2025",
        progress: {
            completed: 12,
            total: 36,
            nextMilestone: "Deadlift 100kg",
        },
        stats: {
            height: 175, // cm
            weight: 72, // kg
            bmi: 23.5,
            bodyFat: 18, // percentage
            calorieGoal: 2400,
            proteinGoal: 160, // g
            carbsGoal: 250, // g
            fatGoal: 80, // g
        },
        progress_history: [
            { date: "Apr 1, 2025", weight: 74, bodyFat: 19 },
            { date: "Mar 15, 2025", weight: 75, bodyFat: 19.5 },
            { date: "Mar 1, 2025", weight: 76, bodyFat: 20 },
            { date: "Feb 15, 2025", weight: 77, bodyFat: 20.5 },
            { date: "Feb 1, 2025", weight: 78, bodyFat: 21 },
        ],
        upcoming_trainings: [
            {
                id: 1,
                date: "Apr 12, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                location: "City Fitness Center",
                focus: "Lower body power & mobility",
                notes: "Bring resistance bands",
            },
            {
                id: 2,
                date: "Apr 15, 2025",
                time: "14:00 - 15:00",
                type: "In-person",
                location: "City Fitness Center",
                focus: "Upper body strength",
                notes: "Focus on bench press technique",
            },
            {
                id: 3,
                date: "Apr 18, 2025",
                time: "18:30 - 19:30",
                type: "Virtual",
                location: "Zoom",
                focus: "HIIT workout & nutrition review",
                notes: "Update food diary before session",
            },
        ],
        past_trainings: [
            {
                id: 4,
                date: "Apr 8, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                focus: "Full body workout",
                feedback: "Good form on squats, need to work on shoulder mobility",
            },
            {
                id: 5,
                date: "Apr 5, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                focus: "Core stability & conditioning",
                feedback: "Excellent effort on planks, improved endurance",
            },
        ],
        workout_plan: {
            monday: {
                focus: "Lower Body",
                exercises: [
                    { name: "Squats", sets: 4, reps: "8-10", weight: "60kg" },
                    { name: "Deadlifts", sets: 3, reps: "6-8", weight: "80kg" },
                    { name: "Leg Press", sets: 3, reps: "10-12", weight: "120kg" },
                    { name: "Walking Lunges", sets: 3, reps: "12 each leg", weight: "10kg dumbbells" },
                    { name: "Calf Raises", sets: 4, reps: "15-20", weight: "Body weight" },
                ],
            },
            wednesday: {
                focus: "Upper Body",
                exercises: [
                    { name: "Bench Press", sets: 4, reps: "8-10", weight: "55kg" },
                    { name: "Pull-ups", sets: 3, reps: "6-8", weight: "Body weight" },
                    { name: "Shoulder Press", sets: 3, reps: "8-10", weight: "35kg" },
                    { name: "Bent-over Rows", sets: 3, reps: "10-12", weight: "40kg" },
                    { name: "Tricep Dips", sets: 3, reps: "10-12", weight: "Body weight" },
                ],
            },
            friday: {
                focus: "Full Body & HIIT",
                exercises: [
                    { name: "Clean and Press", sets: 4, reps: "6-8", weight: "40kg" },
                    { name: "KB Swings", sets: 3, reps: "15", weight: "20kg" },
                    { name: "Box Jumps", sets: 3, reps: "10", weight: "Body weight" },
                    { name: "Battle Ropes", sets: 4, reps: "30 seconds", weight: "N/A" },
                    { name: "Burpees", sets: 3, reps: "15", weight: "Body weight" },
                ],
            },
        },
        messages: [
            {
                id: 1,
                from: "Coach Alex",
                content:
                    "Great work yesterday! Your squat form is improving a lot. Let's focus on increasing the weight next session.",
                time: "Yesterday, 15:42",
                unread: true,
            },
            {
                id: 2,
                from: "You",
                content: "Thanks! My legs are definitely feeling it today. Should I do any recovery exercises?",
                time: "Yesterday, 16:30",
                unread: false,
            },
            {
                id: 3,
                from: "Coach Alex",
                content:
                    "Yes, try some light stretching and maybe 10 minutes on the stationary bike. Also, don't forget to log your protein intake!",
                time: "Yesterday, 17:05",
                unread: true,
            },
        ],
    };

    // Function to toggle expanded training details
    const toggleExpandTraining = (id) => {
        if (expandedTrainingId === id) {
            setExpandedTrainingId(null);
        } else {
            setExpandedTrainingId(id);
        }
    };

    // Get unread messages count
    const unreadMessagesCount = userData.messages.filter((m) => m.unread && m.from === "Coach Alex").length;

    // Define tabs configuration
    const tabsConfig = [
        { id: "overview", label: "Overview" },
        { id: "trainings", label: "My Trainings" },
        { id: "program", label: "My Program" },
        { id: "progress", label: "Progress" },
        { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
        { id: "nutrition", label: "Nutrition" },
    ];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden relative">
            {/* Background Shapes */}
            <BackgroundShapes />

            <div className="w-full max-w-6xl mx-auto px-4 relative z-20">
                {/* Header */}
                <AntiqueBodyLogo />
                {/* Client Profile Summary */}
                <ClientProfile userData={userData} />

                {/* Tab Navigation */}
                <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabsConfig} />

                {/* Content based on active tab */}
                <div className="pb-20">
                    {activeTab === "overview" && <OverviewTab userData={userData} />}
                    {activeTab === "trainings" && (
                        <TrainingsTab
                            userData={userData}
                            expandedTrainingId={expandedTrainingId}
                            toggleExpandTraining={toggleExpandTraining}
                        />
                    )}
                    {activeTab === "program" && <ProgramTab userData={userData} />}
                    {activeTab === "progress" && <ProgressTab userData={userData} />}
                    {activeTab === "messages" && <MessagesTab userData={userData} />}
                    {activeTab === "nutrition" && <NutritionTab userData={userData} />}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
