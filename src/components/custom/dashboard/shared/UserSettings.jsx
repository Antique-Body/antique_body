import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isClosing, setIsClosing] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileType]);

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Icon
                icon="eos-icons:loading"
                width={32}
                height={32}
                className="text-[#FF6B00]"
              />
            </motion.div>
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
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[rgba(255,107,0,0.1)]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Icon
                  icon="mdi:logout"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sign Out
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full border-[rgba(255,107,0,0.4)] text-gray-300 hover:text-white hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] transition-all duration-300 px-4 py-3 text-sm font-medium rounded-xl"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="orangeFilled"
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-4 py-3 text-sm font-semibold rounded-xl relative overflow-hidden"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Icon
                              icon="eos-icons:loading"
                              width={16}
                              height={16}
                            />
                          </motion.div>
                          Signing out...
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:logout" width={16} height={16} />
                          Sign Out
                        </>
                      )}
                    </div>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedTabContent>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{
            opacity: isClosing ? 0 : 1,
            scale: isClosing ? 0.9 : 1,
            y: isClosing ? 30 : 0,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl shadow-2xl w-full max-w-6xl h-[94vh] overflow-hidden border border-[rgba(255,107,0,0.15)] flex flex-col relative"
        >
          {/* Enhanced ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/5 via-transparent to-[#FF9A00]/3 pointer-events-none" />

          {/* Sophisticated animated border with pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF6B00]/20 via-transparent to-[#FF9A00]/20 opacity-50"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.001, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ padding: "1px" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl" />
          </motion.div>

          {/* Enhanced Header with sophisticated design */}
          <motion.div
            className="relative flex items-center justify-between p-6 sm:p-8 border-b border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.08)] via-[rgba(255,107,0,0.04)] to-transparent flex-shrink-0"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div
                className="p-3 sm:p-4 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl shadow-lg relative overflow-hidden"
                variants={fadeIn}
                whileHover={{
                  scale: 1.05,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                {/* Enhanced shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                  initial={{ opacity: 0, x: -100 }}
                  whileHover={{
                    opacity: [0, 1, 0],
                    x: ["-100%", "100%"],
                    transition: { duration: 0.6 },
                  }}
                />
                <Icon
                  icon="mdi:cog"
                  width={24}
                  height={24}
                  className="text-white relative z-10"
                />
              </motion.div>
              <div>
                <motion.h2
                  className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                  variants={fadeIn}
                >
                  Settings
                </motion.h2>
                <motion.p
                  className="text-sm sm:text-base text-gray-400 mt-2 hidden sm:block"
                  variants={fadeIn}
                >
                  Manage your account preferences and security settings
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                onClick={handleClose}
                className="p-3 hover:bg-[rgba(255,107,0,0.15)] rounded-2xl transition-all duration-300 group border border-transparent hover:border-[rgba(255,107,0,0.3)]"
              >
                <Icon
                  icon="mdi:close"
                  width={24}
                  height={24}
                  className="text-gray-400 group-hover:text-white transition-colors duration-300"
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mx-6 sm:mx-8 mt-4 p-4 sm:p-5 bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-500/30 rounded-2xl backdrop-blur-sm flex-shrink-0 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    className="p-2 bg-red-500/25 rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      icon="mdi:alert-circle"
                      width={20}
                      height={20}
                      className="text-red-400"
                    />
                  </motion.div>
                  <div>
                    <span className="text-red-400 font-semibold text-base">
                      Error
                    </span>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0 relative">
            {/* Enhanced Sidebar Navigation */}
            <SettingsSidebar
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Enhanced Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 relative">
              <div className="p-6 sm:p-8 lg:p-10">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="max-w-4xl"
                >
                  {/* Enhanced Section Header */}
                  <SettingsHeader
                    sections={sections}
                    activeSection={activeSection}
                  />

                  {/* Enhanced Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    {renderContent()}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <SettingsFooter
            sections={sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onClose={handleClose}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Enhanced Sidebar Component with sophisticated design
const SettingsSidebar = ({ sections, activeSection, setActiveSection }) => (
  <div className="w-full lg:w-80 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0f0f0f]/95 to-[#050505]/95 border-b lg:border-b-0 lg:border-r border-[rgba(255,107,0,0.12)] flex-shrink-0 relative">
    {/* Enhanced ambient glow with subtle animation */}
    <motion.div
      className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#FF6B00]/30 to-transparent"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Mobile: Enhanced Horizontal scroll */}
    <div className="lg:hidden p-5 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {sections.map((section, index) => (
          <SidebarButton
            key={section.id}
            section={section}
            index={index}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            isMobile
          />
        ))}
      </div>
    </div>

    {/* Desktop: Enhanced Vertical sidebar */}
    <div className="hidden lg:block p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon
              icon="mdi:tune"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
          Settings
        </h3>
      </motion.div>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <SidebarButton
            key={section.id}
            section={section}
            index={index}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Sidebar Button Component with sophisticated interactions
const SidebarButton = ({
  section,
  index,
  isActive,
  onClick,
  isMobile = false,
}) => (
  <motion.button
    initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{
      delay: index * (isMobile ? 0.05 : 0.1),
      duration: 0.4,
      ease: "easeOut",
    }}
    onClick={onClick}
    whileHover={{
      scale: isMobile ? 1.02 : 1.03,
      x: isMobile ? 0 : 8,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.98 }}
    className={`${
      isMobile
        ? "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 whitespace-nowrap relative overflow-hidden"
        : "w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden"
    } ${
      isActive
        ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-xl shadow-orange-500/25 border border-orange-400/30"
        : isMobile
        ? "bg-[rgba(255,107,0,0.08)] text-gray-300 hover:text-white hover:bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.2)] hover:border-[rgba(255,107,0,0.4)]"
        : "hover:bg-[rgba(255,107,0,0.08)] text-gray-300 hover:text-white border border-transparent hover:border-[rgba(255,107,0,0.2)]"
    }`}
  >
    {/* Enhanced background glow effect for active state */}
    {isActive && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )}

    {isMobile ? (
      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          className={`p-2 rounded-xl transition-all duration-300 ${
            isActive ? "bg-white/20 shadow-lg" : "bg-[rgba(255,107,0,0.15)]"
          }`}
          whileHover={{
            rotate: 5,
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <Icon
            icon={section.icon}
            width={18}
            height={18}
            className={isActive ? "text-white" : "text-[#FF6B00]"}
          />
        </motion.div>
        <span className="text-sm font-semibold">{section.label}</span>
      </div>
    ) : (
      <div className="flex items-start gap-4 relative z-10">
        <motion.div
          className={`p-3 rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-white/20 shadow-lg"
              : "bg-[rgba(255,107,0,0.12)] group-hover:bg-[rgba(255,107,0,0.2)]"
          }`}
          whileHover={{
            rotate: 5,
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <Icon
            icon={section.icon}
            width={22}
            height={22}
            className={isActive ? "text-white" : "text-[#FF6B00]"}
          />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-lg transition-colors duration-300 ${
              isActive ? "text-white" : "text-gray-200 group-hover:text-white"
            }`}
          >
            {section.label}
          </h4>
          <p
            className={`text-sm mt-1 transition-colors duration-300 leading-relaxed ${
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
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-3 h-3 bg-white rounded-full shadow-lg mt-2"
          />
        )}
      </div>
    )}
  </motion.button>
);

// Enhanced Section Header Component with sophisticated animations
const SettingsHeader = ({ sections, activeSection }) => {
  const currentSection = sections.find((s) => s.id === activeSection);
  if (!currentSection) return null;

  return (
    <motion.div
      className="mb-8 lg:mb-10 hidden sm:block"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-3">
        <motion.div
          className="p-3 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl shadow-lg relative overflow-hidden"
          whileHover={{
            scale: 1.05,
            rotate: 5,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          {/* Enhanced shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
            initial={{ opacity: 0, x: -100 }}
            whileHover={{
              opacity: [0, 1, 0],
              x: ["-100%", "100%"],
              transition: { duration: 0.6 },
            }}
          />
          <Icon
            icon={currentSection.icon}
            width={24}
            height={24}
            className="text-white relative z-10"
          />
        </motion.div>
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white">
            {currentSection.label}
          </h3>
          {/* Enhanced gradient accent line */}
          <motion.div
            className="h-1 w-12 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full mt-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />
        </div>
      </div>
      <p className="text-gray-400 ml-16 text-base leading-relaxed">
        {currentSection.description}
      </p>
    </motion.div>
  );
};

// Enhanced Footer Component with sophisticated design
const SettingsFooter = ({
  sections,
  activeSection,
  setActiveSection,
  onClose,
}) => (
  <motion.div
    className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 border-t border-[rgba(255,107,0,0.12)] bg-gradient-to-r from-[rgba(255,107,0,0.05)] via-transparent to-[rgba(255,107,0,0.03)] flex-shrink-0 gap-6 sm:gap-0 relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    {/* Enhanced ambient glow */}
    <motion.div
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/40 to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Enhanced Progress Dots */}
    <div className="flex items-center gap-3 order-2 sm:order-1">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isCompleted =
          sections.findIndex((s) => s.id === activeSection) > index;
        return (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] shadow-lg shadow-orange-500/40 scale-125"
                : isCompleted
                ? "bg-[#FF6B00]/70 hover:bg-[#FF6B00]/90 shadow-md"
                : "bg-[#333] hover:bg-[#555] hover:scale-110"
            }`}
            aria-label={`Go to ${section.label}`}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] opacity-50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        );
      })}
    </div>

    {/* Enhanced Close Button */}
    <div className="order-1 sm:order-2">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[rgba(255,107,0,0.4)] text-gray-300 hover:text-white hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] transition-all duration-300 px-6 py-3 text-base font-medium rounded-xl"
        >
          <Icon icon="mdi:close" width={18} height={18} className="mr-2" />
          Close Settings
        </Button>
      </motion.div>
    </div>
  </motion.div>
);
