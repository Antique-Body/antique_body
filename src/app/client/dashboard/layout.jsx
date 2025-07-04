"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";

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
  const handleProfileSave = async (profileData) => {
    try {
      // Update the client data
      setClientData((prev) => ({
        ...prev,
        data: { ...prev.data, ...profileData },
      }));
      setShowEditModal(false);
      return { success: true };
    } catch (error) {
      console.error("Error saving profile:", error);
      return { success: false, error: error.message };
    }
  };

  // Get navigation items with updated badge counts
  const navigationItems = useMemo(() => {
    const baseNavigation = getNavigationConfig("client");
    const badges = {
      messages: 2, // Placeholder - would come from real data
    };
    return updateNavigationBadges(baseNavigation, badges);
  }, []);

  return (
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
  );
}
