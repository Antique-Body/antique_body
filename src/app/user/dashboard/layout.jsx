"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EffectBackground } from "@/components/background";
import { DashboardTabs } from "@/components/custom";
import { BrandLogo } from "@/components/custom/BrandLogo";

export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Map pathname to tab ID
  const getActiveTabFromPath = (path) => {
    if (path.includes("/overview")) return "overview";
    if (path.includes("/workout")) return "workout";
    if (path.includes("/progress")) return "progress";
    if (path.includes("/nutrition")) return "nutrition";
    if (path.includes("/health")) return "health";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/training-setup")) return "workout"; // Redirect training-setup to workout
    return "overview"; // Default tab
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
      case "overview":
        router.push("/user/dashboard/overview");
        break;
      case "workout":
        router.push("/user/dashboard/workout");
        break;
      case "progress":
        router.push("/user/dashboard/progress");
        break;
      case "nutrition":
        router.push("/user/dashboard/nutrition");
        break;
      case "health":
        router.push("/user/dashboard/health");
        break;
      case "settings":
        router.push("/user/dashboard/settings");
        break;
      default:
        router.push("/user/dashboard/overview");
    }
  };

  // Define tabs configuration
  const tabsConfig = [
    { id: "overview", label: "Overview" },
    { id: "workout", label: "Workout" },
    { id: "progress", label: "Progress" },
    { id: "nutrition", label: "Nutrition" },
    { id: "health", label: "Health" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen  text-white">
      <EffectBackground />
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-6">
        <div className="mb-8 flex items-center justify-center">
          <BrandLogo />
        </div>

        <div className="flex flex-col gap-6">
          {/* User profile section (top) */}
          <div className="rounded-xl bg-gradient-to-r from-[#111] to-[#222] p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* User avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-[#333]">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#FF6B00] flex items-center justify-center text-2xl font-semibold">
                    {session?.user?.name
                      ? session.user.name[0].toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {session?.user?.name || "Welcome back!"}
                </h2>
                <p className="text-gray-400 mb-4">
                  Track your fitness journey and achieve your goals
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="font-semibold">Strength Training</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400">Workouts Completed</p>
                    <p className="font-semibold">12 / 30</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400">Current Weight</p>
                    <p className="font-semibold">75 kg</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400">Body Fat</p>
                    <p className="font-semibold">18%</p>
                  </div>
                </div>
              </div>
            </div>
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
