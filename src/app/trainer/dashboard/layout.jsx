"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardTabs } from "@/components/custom";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";
import { BackgroundShapes } from "@/components/custom/shared";
import { TrainerProfile } from "@/components/custom/trainer/dashboard/components";

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
    if (path.includes("/exercises")) return "exercises";
    return "newClients"; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));

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
      case "exercises":
        router.push("/trainer/dashboard/exercises");
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
    { id: "sessions", label: "Sessions" },
    { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
    { id: "plans", label: "Plans" },
    { id: "exercises", label: "Exercises" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <BackgroundShapes />

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-6">
        <div className="mb-8 flex items-center justify-center">
          <AntiqueBodyLogo />
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
