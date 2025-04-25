"use client";

import { useState } from "react";
import React from "react";
import { TrainerProfile } from "@/components/custom/trainer/dashboard";

import { BackgroundShapes } from "@/components/custom/shared";
import { NewClientsTab, MessagesTab, PlansTab } from "@/components/custom/trainer/dashboard/tabs";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";
import { DashboardTabs } from "@/components/custom/shared";
const TrainerDashboard = () => {
    const [activeTab, setActiveTab] = useState("clients");
    const [showClientModal, setShowClientModal] = useState(false);
    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [filterGoalType, setFilterGoalType] = useState("");
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    // Sample data for the trainer dashboard
    const trainerData = {
        name: "Alex Miller",
        specialty: "Football Conditioning Specialist",
        certifications: ["UEFA A License", "NSCA CSCS"],
        experience: "8 years",
        rating: 4.8,
        totalSessions: 563,
        totalEarnings: 12450,
        upcomingSessions: 8,
        clients: [
            {
                id: 1,
                name: "John Doe",
                status: "active",
                plan: "Pro Athlete",
                goal: "Strength & Conditioning",
                joinDate: "Jan 15, 2025",
                nextSession: "Apr 12, 2025",
            },
            {
                id: 2,
                name: "Sarah Williams",
                status: "active",
                plan: "Recovery",
                goal: "Rehabilitation",
                joinDate: "Feb 3, 2025",
                nextSession: "Apr 10, 2025",
            },
            {
                id: 3,
                name: "Mike Chen",
                status: "paused",
                plan: "Fat Loss",
                goal: "Weight Management",
                joinDate: "Dec 20, 2024",
                nextSession: "Apr 9, 2025",
            },
        ],
        sessions: [
            {
                id: 1,
                clientName: "John Doe",
                clientId: 1,
                date: "Apr 12, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                location: "City Fitness Center",
                status: "confirmed",
                paid: true,
                focus: "Lower body power & mobility",
                notes: "Bring resistance bands",
            },
            {
                id: 2,
                clientName: "Sarah Williams",
                clientId: 2,
                date: "Apr 10, 2025",
                time: "14:00 - 15:00",
                type: "In-person",
                location: "Rehab Center",
                status: "confirmed",
                paid: true,
                focus: "Knee rehabilitation exercises",
                notes: "Foam roller needed",
            },
            {
                id: 3,
                clientName: "Mike Chen",
                clientId: 3,
                date: "Apr 9, 2025",
                time: "18:30 - 19:30",
                type: "Virtual",
                location: "Zoom",
                status: "confirmed",
                paid: false,
                focus: "HIIT workout & nutrition review",
                notes: "Check food diary before session",
            },
            {
                id: 4,
                clientName: "New Client",
                clientId: null,
                date: "Apr 11, 2025",
                time: "09:00 - 10:00",
                type: "In-person",
                location: "City Fitness Center",
                status: "pending",
                paid: false,
                focus: "Initial assessment",
                notes: "First session - evaluation and goal setting",
            },
        ],
        messages: [
            {
                id: 1,
                from: "John Doe",
                clientId: 1,
                content: "Hi Alex, can we move Saturday's session to 11am instead of 10am?",
                time: "Today, 10:23",
                unread: true,
            },
            {
                id: 2,
                from: "Sarah Williams",
                clientId: 2,
                content: "My knee felt much better after our last session! The exercises are helping.",
                time: "Yesterday, 15:42",
                unread: true,
            },
            {
                id: 3,
                from: "Mike Chen",
                clientId: 3,
                content: "I've updated my food diary for the week. Can you check it before our next session?",
                time: "Apr 5, 14:30",
                unread: false,
            },
        ],
        plans: [
            {
                id: 1,
                name: "Pro Athlete",
                description:
                    "High-performance program for competitive athletes focusing on sport-specific training, recovery, and performance optimization.",
                duration: "12 weeks",
                sessionsPerWeek: 3,
                price: 80,
                sessions: [
                    "Performance assessment & baseline",
                    "Sport-specific technique work",
                    "Strength & power development",
                    "Speed & agility training",
                    "Recovery protocols & injury prevention",
                ],
                active: true,
            },
            {
                id: 2,
                name: "Fat Loss",
                description:
                    "Comprehensive program combining HIIT, strength training, and nutrition guidance for optimal fat loss while preserving muscle.",
                duration: "8 weeks",
                sessionsPerWeek: 2,
                price: 65,
                sessions: [
                    "Initial body composition analysis",
                    "Customized nutrition planning",
                    "Progressive resistance training",
                    "High-intensity interval sessions",
                    "Weekly measurements & progress tracking",
                ],
                active: true,
            },
            {
                id: 3,
                name: "Recovery",
                description:
                    "Post-injury or post-surgery rehabilitation program designed to restore function, mobility, and strength safely.",
                duration: "10 weeks",
                sessionsPerWeek: 2,
                price: 70,
                sessions: [
                    "Functional movement assessment",
                    "Progressive mobility work",
                    "Corrective exercises",
                    "Gradual strength rebuilding",
                    "Return-to-activity protocols",
                ],
                active: true,
            },
            {
                id: 4,
                name: "Strength Building",
                description:
                    "Focused strength development program using progressive overload principles and compound movements.",
                duration: "12 weeks",
                sessionsPerWeek: 3,
                price: 75,
                sessions: [
                    "Strength assessment & goal setting",
                    "Compound movement technique",
                    "Progressive overload programming",
                    "Nutrition for muscle development",
                    "Recovery optimization",
                ],
                active: true,
            },
        ],
    };

    // Handle viewing client details
    const handleViewClient = (client) => {
        setSelectedClient(client);
        setShowClientModal(true);
    };

    // Handle viewing session details
    const handleViewSession = (session) => {
        setSelectedSession(session);
        setShowSessionModal(true);
    };

    // Function to close the session modal
    const closeSessionModal = () => {
        setShowSessionModal(false);
        setSelectedSession(null);
    };

    // Function to open create plan modal
    const handleCreatePlan = () => {
        setShowCreatePlanModal(true);
    };

    // Function to close the create plan modal
    const closeCreatePlanModal = () => {
        setShowCreatePlanModal(false);
    };

    // Get the count of unread messages
    const unreadMessagesCount = trainerData.messages.filter((m) => m.unread).length;
    const tabsConfig = [
        { id: "clients", label: "Clients" },
        { id: "sessions", label: "Sessions" },
        { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
        { id: "plans", label: "Plans" },
    ];
    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden relative">
            {/* Background Shapes */}
            <BackgroundShapes />

            <div className="w-full max-w-6xl mx-auto px-4 relative z-20">
                {/* Header */}
                <AntiqueBodyLogo />

                {/* Trainer Profile Summary */}
                <TrainerProfile trainerData={trainerData} />

                {/* Tab Navigation */}
                <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabsConfig} />

                {/* Content based on active tab */}
                <div className="pb-20">
                    {/* New Clients Tab */}
                    {activeTab === "newClients" && <NewClientsTab />}

                    {/* Clients Tab */}
                    {activeTab === "clients" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Clients</h2>
                            {/* Clients tab content would go here */}
                        </div>
                    )}

                    {/* Sessions Tab */}
                    {activeTab === "sessions" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Sessions</h2>
                            {/* Sessions tab content would go here */}
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === "messages" && (
                        <MessagesTab messages={trainerData.messages} handleViewClient={handleViewClient} />
                    )}

                    {/* Plans Tab */}
                    {activeTab === "plans" && <PlansTab plans={trainerData.plans} handleCreatePlan={handleCreatePlan} />}
                </div>
            </div>

            {/* Modals */}
            {showClientModal && <ClientModal client={selectedClient} setShowClientModal={setShowClientModal} />}

            {showSessionModal && <SessionModal session={selectedSession} closeSessionModal={closeSessionModal} />}

            {showCreatePlanModal && <CreatePlanModal closeCreatePlanModal={closeCreatePlanModal} />}
        </div>
    );
};

export default TrainerDashboard;
