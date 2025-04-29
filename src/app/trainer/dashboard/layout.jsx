"use client";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";
import { BackgroundShapes, DashboardTabs } from "@/components/custom/shared";
import { ClientModal, CreatePlanModal, TrainerProfile } from "@/components/custom/trainer/dashboard/components";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainerDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    // Map pathname to tab ID
    const getActiveTabFromPath = path => {
        if (path.includes("/newclients")) return "newClients";
        if (path.includes("/clients")) return "clients";
        if (path.includes("/sessions")) return "sessions";
        if (path.includes("/messages")) return "messages";
        if (path.includes("/plans")) return "plans";
        return "newClients"; // Default tab
    };

    const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));
    const [showClientModal, setShowClientModal] = useState(false);
    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    // Update active tab when pathname changes
    useEffect(() => {
        setActiveTab(getActiveTabFromPath(pathname));
    }, [pathname]);

    // Navigate to appropriate route when tab changes
    const handleTabChange = tabId => {
        setActiveTab(tabId);

        // Navigate to corresponding route
        switch (tabId) {
            case "newClients":
                router.push("/trainer/dashboard/newclients");
                break;
            case "clients":
                router.push("/trainer/dashboard/clients");
                break;
            case "sessions":
                router.push("/trainer/dashboard/sessions");
                break;
            case "messages":
                router.push("/trainer/dashboard/messages");
                break;
            case "plans":
                router.push("/trainer/dashboard/plans");
                break;
            default:
                router.push("/trainer/dashboard/newclients");
        }
    };

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
    const unreadMessagesCount = 2; // Placeholder value
    const tabsConfig = [
        { id: "newClients", label: "New Clients" },
        { id: "clients", label: "Clients" },
        { id: "sessions", label: "Sessions" },
        { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
        { id: "plans", label: "Plans" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <BackgroundShapes />

            <div className="max-w-screen-xl mx-auto px-4 py-6 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <AntiqueBodyLogo />
                    <div className="flex items-center gap-4">
                        <button className="bg-[rgba(30,30,30,0.8)] text-white p-2 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </button>
                        <button className="bg-[rgba(30,30,30,0.8)] text-white p-2 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Trainer profile section (top) */}
                    <TrainerProfile trainerData={trainerData} />

                    {/* Tabs and main content section */}
                    <div>
                        <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} tabs={tabsConfig} />

                        {/* Render the nested page content */}
                        <div className="mt-6">{children}</div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showClientModal && selectedClient && (
                <ClientModal client={selectedClient} onClose={() => setShowClientModal(false)} />
            )}

            {showCreatePlanModal && <CreatePlanModal onClose={closeCreatePlanModal} />}
        </div>
    );
}
