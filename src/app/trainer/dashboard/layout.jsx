"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";

import { EffectBackground } from "@/components/background";
import {
  SidebarDashboard,
  UserEditProfile,
  UserSettings,
} from "@/components/custom/dashboard/shared";
import { TrainerProfileModal } from "@/components/custom/dashboard/trainer/components";
import {
  getNavigationConfig,
  updateNavigationBadges,
} from "@/config/navigation";

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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for message badge count
  const [messageBadgeCount, setMessageBadgeCount] = useState(0);

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    async function fetchTrainer() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/trainer?mode=basic");
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

  // useEffect(() => {
  //   async function fetchUnreadMessages() {
  //     try {
  //       const res = await fetch("/api/messages/unread-count");
  //       const data = await res.json();
  //       setMessageBadgeCount(data.unreadCount || 0);
  //     } catch {
  //       setMessageBadgeCount(0);
  //     }
  //   }
  //   fetchUnreadMessages();
  // }, []);

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
      // Update the trainer data
      setTrainerData((prev) => ({
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
    const baseNavigation = getNavigationConfig("trainer");
    return baseNavigation;
  }, []);

  // Update navigation items with real badge count
  const navigationItemsWithBadges = useMemo(
    () =>
      updateNavigationBadges(navigationItems, {
        messages: messageBadgeCount,
      }),
    [navigationItems, messageBadgeCount]
  );

  return (
    <div className="min-h-screen text-white">
      <EffectBackground />

      {/* Sidebar */}
      <SidebarDashboard
        profileType="trainer"
        userData={trainerData?.data}
        loading={loading}
        navigationItems={navigationItemsWithBadges}
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
      <TrainerProfileModal
        trainerData={trainerData?.data}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <UserEditProfile
          profileType="trainer"
          userData={trainerData?.data}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <UserSettings
          profileType="trainer"
          userData={trainerData?.data}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}
