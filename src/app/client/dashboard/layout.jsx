"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EffectBackground } from "@/components/background";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ClientProfile } from "@/components/custom/dashboard/client/components";
import { DashboardTabs } from "@/components/custom/dashboard/shared/DashboardTabs";

export default function ClientDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: _session } = useSession();

  // Map pathname to tab ID
  const getActiveTabFromPath = (path) => {
    if (path.includes("/profile")) return "profile";
    if (path.includes("/upcoming-trainings")) return "upcomingTrainings";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/plans")) return "plans";
    if (path.includes("/exercises")) return "exercises";
    if (path.includes("/meals")) return "meals";
    return "profile"; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/client");
        const data = await res.json();
        setClientData(data);
      } catch {
        setClientData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, []);

  // Navigate to appropriate route when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Navigate to corresponding route
    switch (tabId) {
      case "profile":
        router.push("/client/dashboard/profile");
        break;
      case "upcomingTrainings":
        router.push("/client/dashboard/upcoming-trainings");
        break;
      case "messages":
        router.push("/client/dashboard/messages");
        break;
      case "plans":
        router.push("/client/dashboard/plans");
        break;
      case "exercises":
        router.push("/client/dashboard/exercises");
        break;
      case "meals":
        router.push("/client/dashboard/meals");
        break;
    }
  };

  // Get the count of unread messages
  const unreadMessagesCount = 2; // Placeholder value
  const tabsConfig = [
    { id: "yourCoach", label: "Your Coach" },
    { id: "upcomingTrainings", label: "Upcoming Trainings" },
    { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
    { id: "plans", label: "Plans" },
    { id: "exercises", label: "Exercises" },
    { id: "meals", label: "Meals" },
  ];

  // Helper for displaying client info
  const renderClientProfile = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3" />
          <div className="h-6 bg-gray-700 rounded w-1/2" />
          <div className="h-32 bg-gray-800 rounded" />
        </div>
      );
    }
    if (!clientData || clientData.error) {
      return <div className="text-red-400">Failed to load profile.</div>;
    }
    // Mapaj podatke iz clientData u userData format koji ClientProfile očekuje
    const userData = {
      name: `${clientData.firstName} ${clientData.lastName}`,
      avatarContent: clientData.profileImage || "/avatar-placeholder.png",
      planName: clientData.planName || "N/A", // prilagodi ako imaš plan podatke
      coach: clientData.coachName || "N/A", // prilagodi ako imaš coach podatke
      progress: clientData.progress || null, // prilagodi ako imaš progress podatke
      stats: {
        weight: clientData.weight || 0,
        bodyFat: clientData.bodyFat || 0,
        calorieGoal: clientData.calorieGoal || 0,
      },
    };
    return <ClientProfile userData={userData} />;
  };

  return (
    <div className="min-h-screen  text-white">
      <EffectBackground />
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-6">
        <div className="mb-8 flex items-center justify-center">
          <BrandLogo />
        </div>
        <div className="flex flex-col gap-6">
          {/* Client profile section (top) */}
          {renderClientProfile()}
          {/* Tabs and main content section */}
          <div>
            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              tabs={tabsConfig}
            />
            {/* Render the nested page content */}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
