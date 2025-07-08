"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import React, { createContext, useContext } from "react";

import { EffectBackground } from "@/components/background";
import { ClientProfileModal } from "@/components/custom/dashboard/client/components";
import {
  SidebarDashboard,
  UserEditProfile,
  UserSettings,
} from "@/components/custom/dashboard/shared";
import {
  getNavigationConfig,
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
    async function fetchBadgeCounts() {
      try {
        const res = await fetch("/api/coaching-requests/count?role=client");
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
        console.error("Error fetching badge counts:", error);
      }
    }

    fetchBadgeCounts();

    // Set up polling for real-time updates
    const interval = setInterval(fetchBadgeCounts, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

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

  // Handle profile click to show detailed modal
  const handleProfileClick = () => {
    setShowDetailModal(true);
  };

  // Handle edit click
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // Handle settings click
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  // Handle profile save
  const handleProfileSave = async (_profileData) => {
    try {
      // Add a small delay to ensure session is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Refresh the client data from the server to get the latest information
      setLoading(true);
      const res = await fetch("/api/users/client?mode=basic");
      if (res.ok) {
        const data = await res.json();
        setClientData(data);
      } else if (res.status === 401) {
        // Silently handle unauthorized errors - session might not be updated yet
      }
      setShowEditModal(false);
      return { success: true };
    } catch (error) {
      console.error("Error saving profile:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get navigation items with updated badge counts
  const navigationItems = useMemo(() => {
    const baseNavigation = getNavigationConfig("client");
    return updateNavigationBadges(baseNavigation, badgeCounts);
  }, [badgeCounts]);

  // Function to refresh badge counts (can be called from child components)
  const refreshBadgeCounts = async () => {
    try {
      const res = await fetch("/api/coaching-requests/count?role=client");
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
      console.error("Error refreshing badge counts:", error);
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
          activeItem={activeTab}
          onNavigationChange={handleTabChange}
          onProfileClick={handleProfileClick}
          onEditClick={handleEditClick}
          onSettingsClick={handleSettingsClick}
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

        {/* Edit Profile Modal */}
        {showEditModal && (
          <UserEditProfile
            profileType="client"
            userData={clientData?.data}
            onClose={() => setShowEditModal(false)}
            onSave={handleProfileSave}
          />
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <UserSettings
            profileType="client"
            userData={clientData?.data}
            onClose={() => setShowSettingsModal(false)}
            onSave={handleProfileSave}
          />
        )}
      </div>
    </BadgeRefreshContext.Provider>
  );
}
