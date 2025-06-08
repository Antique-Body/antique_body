"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EffectBackground } from "@/components/background";
import { BrandLogo } from "@/components/common/BrandLogo";
import { DashboardTabs } from "@/components/custom/dashboard/shared/DashboardTabs";
import { TrainerProfile } from "@/components/custom/dashboard/trainer/components";
import { InfoBanner } from "@/components/custom/personal-details/shared/InfoBanner";

export default function TrainerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: _session } = useSession();

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
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    async function fetchTrainer() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/trainer");
        const data = await res.json();
        setTrainerData(data);
      } catch {
        setTrainerData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainer();
  }, []);

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

  const handleVerifyClick = () => {
    router.push("/trainer/edit-profile");
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
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-1/3" />
              <div className="h-6 bg-gray-700 rounded w-1/2" />
              <div className="h-32 bg-gray-800 rounded" />
            </div>
          ) : (
            <TrainerProfile trainerData={trainerData.trainerProfile} />
          )}

          {/* Verification banner */}
          <div className="mb-2 relative">
            <InfoBanner
              icon="mdi:shield-check"
              title="Boost Your Visibility"
              subtitle="Complete your profile to stand out and attract more clients. Verified trainers are more likely to be chosen."
              variant="primary"
              className="pr-36"
            />
            <button
              onClick={handleVerifyClick}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF6B00]/90 transition-colors"
            >
              Complete Profile
            </button>
          </div>

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
