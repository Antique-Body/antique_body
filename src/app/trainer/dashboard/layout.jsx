"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EffectBackground } from "@/components/background";
import { DashboardTabs } from "@/components/custom";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { TrainerProfile } from "@/components/custom/trainer/dashboard/components";
export default function TrainerDashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    // Map pathname to tab ID
    const getActiveTabFromPath = (path) => {
        if (path.includes("/newclients")) return "newClients";
        if (path.includes("/clients")) return "clients";
        if (path.includes("/upcoming-trainings")) return "upcomingTrainings";
        if (path.includes("/messages")) return "messages";
        if (path.includes("/plans")) return "plans";
        if (path.includes("/exercises")) return "exercises";
        if (path.includes("/meals")) return "meals";
        return "newClients"; // Default tab
    };

    const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));

    // Update active tab when pathname changes
    useEffect(() => {
        setActiveTab(getActiveTabFromPath(pathname));
    }, [pathname]);

    // Navigate to appropriate route when tab changes
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);

        // Navigate to corresponding route
        switch (tabId) {
            case "newClients":
                router.push("/trainer/dashboard/newclients");
                break;
            case "clients":
                router.push("/trainer/dashboard/clients");
                break;
            case "upcomingTrainings":
                router.push("/trainer/dashboard/upcoming-trainings");
                break;
            case "messages":
                router.push("/trainer/dashboard/messages");
                break;
            case "plans":
                router.push("/trainer/dashboard/plans");
                break;
            case "exercises":
                router.push("/trainer/dashboard/exercises");
                break;
            case "meals":
                router.push("/trainer/dashboard/meals");
                break;
        }
    };

    // Sample data for the trainer dashboard
    const trainerData = {
        name: session?.user?.name || "Loading...",
        specialty: "Football Conditioning Specialist",
        avatarContent:
            session?.user?.image || "https://ai-previews.123rf.com/ai-txt2img/600nwm/74143221-4fc9-47bd-a919-0c6d55da9cc5.jpg",
        certifications: ["UEFA A License", "NSCA CSCS"],
        experience: "8 years",
        rating: 4.8,
        clients: [
            { id: 1, name: "John Doe", status: "active" },
            { id: 2, name: "Jane Smith", status: "inactive" },
            { id: 3, name: "Mike Johnson", status: "active" },
        ],
        totalSessions: 563,
        totalEarnings: 12450,
        upcomingSessions: 8,
    };

    // Get the count of unread messages
    const unreadMessagesCount = 2; // Placeholder value
    const tabsConfig = [
        { id: "newClients", label: "New Clients" },
        { id: "clients", label: "Clients" },
        { id: "upcomingTrainings", label: "Upcoming Trainings" },
        { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
        { id: "plans", label: "Plans" },
        { id: "exercises", label: "Exercises" },
        { id: "meals", label: "Meals" },
    ];

    return (
        <div className="min-h-screen  text-white">
            <EffectBackground />
            <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-6">
                <div className="mb-8 flex items-center justify-center">
                    <BrandLogo />
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
        </div>
    );
}
