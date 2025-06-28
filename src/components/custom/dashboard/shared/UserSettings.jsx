import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { AnimatedTabContent } from "./DashboardTabs";

import { Button } from "@/components/common/Button";
// Client Settings
import {
  AccountSettings,
  LanguagePreferences,
  SecuritySettings,
} from "@/components/custom/dashboard/client/settings";
// Trainer Settings
import { SecuritySettings as TrainerSecuritySettings } from "@/components/custom/dashboard/shared/SecuritySettings";
import {
  AccountSettings as TrainerAccountSettings,
  LanguagePreferences as TrainerLanguagePreferences,
} from "@/components/custom/dashboard/trainer/settings";

export const UserSettings = ({
  profileType = "client",
  onClose,
  userData = {},
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settingsData, setSettingsData] = useState(userData);
  const [fetchingSettings, setFetchingSettings] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch settings data when component mounts for trainers
  useEffect(() => {
    const fetchSettingsData = async () => {
      if (profileType === "trainer") {
        setFetchingSettings(true);
        try {
          const res = await fetch("/api/users/trainer?mode=settings");
          if (res.ok) {
            const response = await res.json();
            if (response.success && response.data) {
              setSettingsData(response.data);
            } else {
              // If no settings exist, use default settings structure
              setSettingsData({
                notifications: true,
                emailNotifications: true,
                smsNotifications: false,
                autoAcceptBookings: false,
                requireDeposit: false,
                depositAmount: null,
                timezone: "UTC",
                workingHours: null,
                blackoutDates: null,
                ...userData, // Merge with any existing user data
              });
            }
          } else {
            console.error("Failed to fetch settings:", res.status);
            // Use userData as fallback
            setSettingsData(userData);
          }
        } catch (error) {
          console.error("Error fetching trainer settings:", error);
          // Continue with provided userData if settings fetch fails
          setSettingsData(userData);
        } finally {
          setFetchingSettings(false);
        }
      } else if (profileType === "client") {
        setFetchingSettings(true);
        try {
          const res = await fetch("/api/users/client?mode=settings");
          if (res.ok) {
            const response = await res.json();
            if (response.success && response.data) {
              setSettingsData(response.data);
            } else {
              // If no settings exist, use default settings structure
              setSettingsData({
                notifications: true,
                emailNotifications: true,
                smsNotifications: false,
                reminderTime: 24,
                privacyLevel: "public",
                shareProgress: true,
                timezone: "UTC",
                preferredLanguage: "en",
                measurementUnit: "metric",
                ...userData, // Merge with any existing user data
              });
            }
          } else {
            console.error("Failed to fetch settings:", res.status);
            // Use userData as fallback
            setSettingsData(userData);
          }
        } catch (error) {
          console.error("Error fetching client settings:", error);
          // Continue with provided userData if settings fetch fails
          setSettingsData(userData);
        } finally {
          setFetchingSettings(false);
        }
      } else {
        // For unknown profile types, just use the provided userData
        setSettingsData(userData);
      }
    };

    fetchSettingsData();
  }, [profileType, userData]);

  // Define sections for settings
  const sections = [
    {
      id: "account",
      label: "Account",
      icon: "mdi:account-cog",
      description: "Email, phone, and password settings",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "mdi:tune",
      description: "Language, theme, and notification settings",
    },
    {
      id: "security",
      label: "Security",
      icon: "mdi:shield-account",
      description: "Two-factor auth and session management",
    },
    {
      id: "logout",
      label: "Logout",
      icon: "mdi:logout",
      description: "Sign out of your account",
    },
  ];

  const handleSave = async (sectionData, section) => {
    setLoading(true);
    setError("");

    try {
      // Call the onSave callback with the updated data
      if (onSave) {
        await onSave({
          ...settingsData,
          ...sectionData,
          section: section,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/auth/login");
      onClose(); // Close the settings modal
    } catch (err) {
      setError(err.message || "Failed to logout");
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const renderContent = () => {
    const ClientAccountComponent = AccountSettings;
    const ClientLanguageComponent = LanguagePreferences;
    const ClientSecurityComponent = SecuritySettings;

    // Show loading state while fetching settings
    if (
      fetchingSettings &&
      (profileType === "trainer" || profileType === "client")
    ) {
      return (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[rgba(255,107,0,0.1)]">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Icon
              icon="eos-icons:loading"
              width={32}
              height={32}
              className="text-[#FF6B00] animate-spin"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Loading Settings
              </h3>
              <p className="text-gray-400 text-sm">
                Please wait while we fetch your settings...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <AnimatedTabContent
          isActive={activeSection === "account"}
          tabId="account"
        >
          {profileType === "trainer" ? (
            <TrainerAccountSettings
              userData={settingsData}
              onSave={(data) => handleSave(data, "account")}
            />
          ) : (
            <ClientAccountComponent
              userData={settingsData}
              onSave={(data) => handleSave(data, "account")}
            />
          )}
        </AnimatedTabContent>

        <AnimatedTabContent
          isActive={activeSection === "preferences"}
          tabId="preferences"
        >
          {profileType === "trainer" ? (
            <TrainerLanguagePreferences
              userData={settingsData}
              onSave={(data) => handleSave(data, "preferences")}
            />
          ) : (
            <ClientLanguageComponent
              userData={settingsData}
              onSave={(data) => handleSave(data, "preferences")}
            />
          )}
        </AnimatedTabContent>

        <AnimatedTabContent
          isActive={activeSection === "security"}
          tabId="security"
        >
          {profileType === "trainer" ? (
            <TrainerSecuritySettings
              userData={settingsData}
              onSave={(data) => handleSave(data, "security")}
            />
          ) : (
            <ClientSecurityComponent
              userData={settingsData}
              onSave={(data) => handleSave(data, "security")}
            />
          )}
        </AnimatedTabContent>

        <AnimatedTabContent
          isActive={activeSection === "logout"}
          tabId="logout"
        >
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-[rgba(255,107,0,0.1)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Icon
                  icon="mdi:logout"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sign Out</h3>
                <p className="text-gray-400 text-sm">
                  End your current session
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:information"
                    width={20}
                    height={20}
                    className="text-red-400 mt-0.5"
                  />
                  <div>
                    <p className="text-red-300 text-sm">
                      You are currently signed in as{" "}
                      <strong>
                        {session?.user?.name || session?.user?.email}
                      </strong>
                    </p>
                    <p className="text-red-400 text-xs mt-1">
                      Logging out will end your current session and redirect you
                      to the login page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("account")}
                  className="flex-1 border-[rgba(255,107,0,0.3)] text-gray-300 hover:text-white hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.1)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Icon
                        icon="eos-icons:loading"
                        width={16}
                        height={16}
                        className="mr-2 animate-spin"
                      />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="mdi:logout"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      Sign Out
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </AnimatedTabContent>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] sm:max-h-[95vh] overflow-hidden border border-[rgba(255,107,0,0.1)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-transparent flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-xl shadow-lg">
              <Icon
                icon="mdi:cog"
                width={20}
                height={20}
                className="text-white sm:w-6 sm:h-6"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 hidden sm:block">
                Manage your {profileType} account settings
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,107,0,0.1)] rounded-xl transition-all duration-200 group"
          >
            <Icon
              icon="mdi:close"
              width={20}
              height={20}
              className="text-gray-400 group-hover:text-white transition-colors sm:w-6 sm:h-6"
            />
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl backdrop-blur-sm flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-500/20 rounded-lg">
                <Icon
                  icon="mdi:alert-circle"
                  width={16}
                  height={16}
                  className="text-red-400 sm:w-5 sm:h-5"
                />
              </div>
              <div>
                <span className="text-red-400 font-semibold text-sm sm:text-base">
                  Error
                </span>
                <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-80 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-b lg:border-b-0 lg:border-r border-[rgba(255,107,0,0.1)] flex-shrink-0">
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden p-4 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      initial={false}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
                      }}
                      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors duration-150 whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg shadow-orange-500/20"
                          : "bg-[rgba(255,107,0,0.1)] text-gray-300 hover:text-white hover:bg-[rgba(255,107,0,0.2)]"
                      }`}
                    >
                      <Icon
                        icon={section.icon}
                        width={16}
                        height={16}
                        className={`transition-colors duration-150 ${
                          isActive ? "text-white" : "text-[#FF6B00]"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block p-6 h-full overflow-y-auto">
              <div className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Icon
                  icon="mdi:format-list-bulleted"
                  width={20}
                  height={20}
                  className="text-[#FF6B00]"
                />
                Settings Categories
              </div>
              <div className="space-y-2">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      initial={false}
                      animate={{
                        x: isActive ? 2 : 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        x: isActive ? 2 : 4,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-150 group relative ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg shadow-orange-500/20"
                          : "hover:bg-[rgba(255,107,0,0.05)] text-gray-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className={`p-2 rounded-lg transition-all duration-150 ${
                            isActive
                              ? "bg-white/20"
                              : "bg-[rgba(255,107,0,0.1)] group-hover:bg-[rgba(255,107,0,0.2)]"
                          }`}
                        >
                          <Icon
                            icon={section.icon}
                            width={20}
                            height={20}
                            className={`transition-colors duration-150 ${
                              isActive ? "text-white" : "text-[#FF6B00]"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium transition-colors duration-150 ${
                              isActive
                                ? "text-white"
                                : "text-gray-200 group-hover:text-white"
                            }`}
                          >
                            {section.label}
                          </h4>
                          <p
                            className={`text-sm mt-1 transition-colors duration-150 ${
                              isActive
                                ? "text-white/80"
                                : "text-gray-400 group-hover:text-gray-300"
                            }`}
                          >
                            {section.description}
                          </p>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="w-2 h-2 bg-white rounded-full mt-2 shadow-sm"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 sm:p-6 lg:p-8">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl"
              >
                {/* Section Header - Hidden on mobile to save space */}
                <div className="mb-6 lg:mb-8 hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
                      <Icon
                        icon={
                          sections.find((s) => s.id === activeSection)?.icon
                        }
                        width={20}
                        height={20}
                        className="text-white"
                      />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">
                      {sections.find((s) => s.id === activeSection)?.label}
                    </h3>
                  </div>
                  <p className="text-gray-400 ml-11 text-sm">
                    {sections.find((s) => s.id === activeSection)?.description}
                  </p>
                </div>

                {/* Content */}
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  {renderContent()}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.02)] to-transparent flex-shrink-0 gap-4 sm:gap-0">
          {/* Progress Dots */}
          <div className="flex items-center gap-2 order-2 sm:order-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] shadow-lg shadow-orange-500/30 scale-125"
                      : "bg-[#333] hover:bg-[#555]"
                  }`}
                  aria-label={`Go to ${section.label}`}
                />
              );
            })}
          </div>

          {/* Action Buttons */}
        </div>
      </motion.div>
    </div>
  );
};
