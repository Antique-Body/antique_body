"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo, createContext } from "react";

import { EffectBackground } from "@/components/background";
import { ClientProfileModal } from "@/components/custom/dashboard/client/components";
import { SidebarDashboard } from "@/components/custom/dashboard/shared";
import {
  getNavigationConfig,
  getBottomNavigationConfig,
  updateNavigationBadges,
} from "@/config/navigation";

// Context to provide badge refresh function
export const BadgeRefreshContext = createContext({
  refreshBadgeCounts: () => {},
});

export default function ClientDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: _session } = useSession();

  // Map pathname to tab ID
  const getActiveTabFromPath = (path) => {
    if (path.includes("/edit")) return "edit";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/trainwithcoach")) return "trainwithcoach";
    if (path.includes("/overview")) return "overview";
    if (path.includes("/upcoming-trainings")) return "upcoming-trainings";
    if (path.includes("/trainings")) return "trainings";
    if (path.includes("/progress")) return "progress";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/diet-tracker")) return "diet-tracker";
    if (path.includes("/health")) return "health";
    return "trainwithcoach"; // Default tab
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for badge counts
  const [badgeCounts, setBadgeCounts] = useState({
    trainwithcoach: 0,
    messages: 0,
  });

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  // Fetch client data
  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/client?mode=basic");
        if (res.ok) {
          const data = await res.json();
          setClientData(data);
        } else if (res.status === 401) {
          // Silently handle unauthorized errors - session might not be updated yet
        }
      } catch {
        setClientData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, []);

  // Fetch coaching request counts for badges
  useEffect(() => {
    let isMounted = true;

    async function fetchBadgeCounts() {
      // Don't fetch if component is unmounted or session is not ready
      if (!isMounted || !_session?.user) {
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch("/api/coaching-requests/count?role=client", {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!isMounted) return; // Check if component is still mounted

        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            setBadgeCounts((prev) => ({
              ...prev,
              trainwithcoach: data.data.trainwithcoach || 0,
            }));
          }
        } else if (res.status === 401) {
          // Silently handle unauthorized errors - session might not be updated yet
        }
      } catch (error) {
        if (!isMounted) return;

        // Only log non-abort errors
        if (error.name !== "AbortError") {
          console.error("Error fetching badge counts:", error);
        }

        // Reset badge counts on error to prevent stale data
        setBadgeCounts((prev) => ({
          ...prev,
          trainwithcoach: 0,
        }));
      }
    }

    // Initial fetch with delay to ensure session is ready
    const initialTimeout = setTimeout(() => {
      if (isMounted && _session?.user) {
        fetchBadgeCounts();
      }
    }, 1000);

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      if (isMounted && _session?.user) {
        fetchBadgeCounts();
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [_session]);

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
      case "diet-tracker":
        router.push("/client/dashboard/diet-tracker");
        break;
      case "health":
        router.push("/client/dashboard/health");
        break;
      case "edit":
        router.push("/client/dashboard/edit");
        break;
      case "settings":
        router.push("/client/dashboard/settings");
        break;
      // No need for logout case as it's handled in the SidebarDashboard component
      default:
        router.push("/client/dashboard/trainwithcoach");
    }
  };

  // Handle profile click to show detailed modal
  const handleProfileClick = () => {
    setShowDetailModal(true);
  };

  // Refresh client data after profile update
  const _refreshClientData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/client?mode=basic");
      if (res.ok) {
        const data = await res.json();
        setClientData(data);
      } else if (res.status === 401) {
        // Silently handle unauthorized errors - session might not be updated yet
      }
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error refreshing client data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get navigation items with updated badge counts
  const navigationItems = useMemo(() => {
    const baseNavigation = getNavigationConfig("client");
    return updateNavigationBadges(baseNavigation, badgeCounts);
  }, [badgeCounts]);

  // Get bottom navigation items
  const bottomNavigationItems = useMemo(
    () => getBottomNavigationConfig("client"),
    []
  );

  // Function to refresh badge counts (can be called from child components)
  const refreshBadgeCounts = async () => {
    // Don't fetch if session is not ready
    if (!_session?.user) {
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch("/api/coaching-requests/count?role=client", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBadgeCounts((prev) => ({
            ...prev,
            trainwithcoach: data.data.trainwithcoach || 0,
          }));
        }
      } else if (res.status === 401) {
        // Silently handle unauthorized errors - session might not be updated yet
      }
    } catch (error) {
      // Only log non-abort errors
      if (error.name !== "AbortError") {
        console.error("Error refreshing badge counts:", error);
      }

      // Reset badge counts on error to prevent stale data
      setBadgeCounts((prev) => ({
        ...prev,
        trainwithcoach: 0,
      }));
    }
  };

  return (
    <BadgeRefreshContext.Provider value={{ refreshBadgeCounts }}>
      <div className="min-h-screen text-white">
        <EffectBackground />

        {/* Sidebar */}
        <SidebarDashboard
          profileType="client"
          userData={clientData?.data}
          loading={loading}
          navigationItems={navigationItems}
          bottomNavigationItems={bottomNavigationItems}
          activeItem={activeTab}
          onNavigationChange={handleTabChange}
          onProfileClick={handleProfileClick}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
          }`}
        >
          <div className="relative z-10 min-h-screen">
            <div className="pt-16 lg:pt-6 px-4 lg:px-6">
              {/* Page Content */}
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </div>
        </div>

        {/* Profile Detail Modal */}
        <ClientProfileModal
          clientData={clientData?.data}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      </div>
    </BadgeRefreshContext.Provider>
  );
}
