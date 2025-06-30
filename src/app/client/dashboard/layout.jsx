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
    if (path.includes("/trainwithcoach")) return "trainwithcoach";
    if (path.includes("/overview")) return "overview";
    if (path.includes("/upcoming-trainings")) return "upcoming-trainings";
    if (path.includes("/trainings")) return "trainings";
    if (path.includes("/progress")) return "progress";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/nutrition")) return "nutrition";
    if (path.includes("/health")) return "health";
    return "trainwithcoach"; // Default tab
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
        const res = await fetch("/api/users/client?mode=basic");
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

  // Function to refresh client data
  const refreshClientData = async () => {
    try {
      const res = await fetch("/api/users/client?mode=basic");
      const data = await res.json();
      setClientData(data);
    } catch (error) {
      console.error("Error refreshing client data:", error);
    }
  };

  // Navigate to appropriate route when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case "trainwithcoach":
        router.push("/client/dashboard/trainwithcoach");
        break;
      case "overview":
        router.push("/client/dashboard/overview");
        break;
      case "upcoming-trainings":
        router.push("/client/dashboard/upcoming-trainings");
        break;
      case "trainings":
        router.push("/client/dashboard/trainings");
        break;
      case "progress":
        router.push("/client/dashboard/progress");
        break;
      case "messages":
        router.push("/client/dashboard/messages");
        break;
      case "nutrition":
        router.push("/client/dashboard/nutrition");
        break;
      case "health":
        router.push("/client/dashboard/health");
        break;
      default:
        router.push("/client/dashboard/trainwithcoach");
    }
  };

  // Get the count of unread messages
  const unreadMessagesCount = 2; // Placeholder value
  const tabsConfig = [
    { id: "trainwithcoach", label: "Train with Coach" },
    { id: "overview", label: "Overview" },
    {
      id: "upcoming-trainings",
      label: "Upcoming Trainings",
    },
    { id: "trainings", label: "Trainings" },
    { id: "progress", label: "Progress" },
    { id: "messages", label: "Messages", badgeCount: unreadMessagesCount },
    { id: "nutrition", label: "Nutrition" },
    { id: "health", label: "Health" },
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
    if (!clientData || clientData.error || !clientData.success) {
      return <div className="text-red-400">Failed to load profile.</div>;
    }
    return (
      <ClientProfile
        userData={clientData.data}
        onProfileUpdate={refreshClientData}
      />
    );
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
