"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo, createContext } from "react";

import { FullScreenLoader } from "@/components";
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

// Move function outside of component
function getActiveTabFromPath(path) {
  if (path.includes("/newclients")) return "newClients";
  if (path.includes("/clients")) return "clients";
  if (path.includes("/upcoming-trainings")) return "upcomingTrainings";
  if (path.includes("/messages")) return "messages";
  if (path.includes("/plans")) return "plans";
  if (path.includes("/exercises")) return "exercises";
  if (path.includes("/meals")) return "meals";
  return "newClients"; // Default tab
}

// Context to provide badge refresh function
export const BadgeContext = createContext({ refreshBadgeCounts: () => {} });

export default function TrainerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: _session } = useSession();

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(pathname));
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  // State for badge counts
  const [badgeCounts, setBadgeCounts] = useState({
    newClients: 0,
    clients: 0,
    messages: 0,
  });

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(pathname));
  }, [pathname]);

  // Fetch trainer data
  useEffect(() => {
    async function fetchTrainer() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/trainer?mode=basic");
        if (res.ok) {
          const data = await res.json();
          setTrainerData(data);
        } else if (res.status === 401) {
          // Silently handle unauthorized errors - session might not be updated yet
        } else {
          setTrainerData(null);
        }
      } catch {
        setTrainerData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainer();
  }, []);

  // Fetch coaching request counts for badges
  useEffect(() => {
    async function fetchBadgeCounts() {
      try {
        const res = await fetch("/api/coaching-requests/count?role=trainer");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBadgeCounts((prev) => ({
              ...prev,
              newClients: data.data.newClients || 0,
              clients: data.data.clients || 0,
            }));
          }
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
      default:
        router.push("/trainer/dashboard/newclients");
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
  const handleProfileSave = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(true);
      const res = await fetch("/api/users/trainer?mode=basic");
      if (res.ok) {
        const data = await res.json();
        setTrainerData(data);
      } else if (res.status === 401) {
        // Silently handle unauthorized errors - session might not be updated yet
      }
      // Osvježi badge counts nakon save-a
      await refreshBadgeCounts();
      setShowEditModal(false);
      setShowSettingsModal(false);
      setShowDetailModal(false);
      setProfileSaveError("");
    } catch {
      // Minimalan error UI
      setProfileSaveError("Greška pri spremanju profila. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  // Get navigation items with updated badges
  const navigationItemsWithBadges = useMemo(() => {
    const navigation = getNavigationConfig("trainer");
    return updateNavigationBadges(navigation, badgeCounts);
  }, [badgeCounts]);

  // Function to refresh badge counts (can be called from child components)
  const refreshBadgeCounts = async () => {
    try {
      const res = await fetch("/api/coaching-requests/count?role=trainer");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBadgeCounts((prev) => ({
            ...prev,
            newClients: data.data.newClients || 0,
            clients: data.data.clients || 0,
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
    <BadgeContext.Provider value={{ refreshBadgeCounts }}>
      <div className="min-h-screen text-white">
        <EffectBackground />
        {/* Sidebar */}
        <SidebarDashboard
          profileType="trainer"
          userData={trainerData?.data || {}} // fallback
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
              <div className="max-w-7xl mx-auto">
                {loading && <FullScreenLoader text="Loading..." />}
                {!loading && !trainerData && (
                  <div className="text-center text-red-400 py-4">
                    Greška pri učitavanju podataka.
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
        {/* Profile Detail Modal */}
        <TrainerProfileModal
          trainerData={trainerData?.data || {}}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
        {/* Edit Profile Modal */}
        {showEditModal && trainerData && (
          <>
            <UserEditProfile
              profileType="trainer"
              userData={trainerData?.data || {}}
              onClose={() => setShowEditModal(false)}
              onSave={handleProfileSave}
            />
            {profileSaveError && (
              <div className="text-center text-red-400 py-2">
                {profileSaveError}
              </div>
            )}
          </>
        )}
        {/* Settings Modal */}
        {showSettingsModal && trainerData && (
          <>
            <UserSettings
              profileType="trainer"
              userData={trainerData?.data || {}}
              onClose={() => setShowSettingsModal(false)}
              onSave={handleProfileSave}
            />
            {profileSaveError && (
              <div className="text-center text-red-400 py-2">
                {profileSaveError}
              </div>
            )}
          </>
        )}
      </div>
    </BadgeContext.Provider>
  );
}
