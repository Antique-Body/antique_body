"use client";

import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";
import {
  AccountSettings,
  LanguagePreferences,
  SecuritySettings,
} from "@/components/custom/dashboard/client/settings";
import { BottomNavigation } from "@/components/custom/dashboard/shared";

// Settings sections configuration
const SETTINGS_SECTIONS = [
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
];

export default function ClientSettingsPage() {
  const { data: _session, update: updateSession } = useSession();
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settingsData, setSettingsData] = useState({});
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const contentRef = useRef(null);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Fetch settings data when component mounts
  useEffect(() => {
    const fetchSettingsData = async () => {
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
            });
          }
        } else {
          console.error("Failed to fetch settings:", res.status);
          setError("Failed to load settings. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching client settings:", error);
        setError("An error occurred while loading settings.");
      } finally {
        setFetchingSettings(false);
      }
    };

    fetchSettingsData();
  }, []);

  // Check if the current section has a save function
  useEffect(() => {
    setShowSaveButton(activeSection !== "logout");
  }, [activeSection]);

  const handleSave = async (sectionData, _section) => {
    setLoading(true);
    setError("");

    try {
      // Merge the section data with the existing settings data
      const updatedData = {
        ...settingsData,
        ...sectionData,
      };

      // Send the updated data to the API
      const res = await fetch("/api/users/client", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: updatedData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      // Update the local state with the new settings
      setSettingsData(updatedData);

      // Update the session to reflect the changes
      await updateSession();

      // Show success message
      // This could be implemented with a toast notification
    } catch (err) {
      setError(err.message || "Failed to save settings");
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  // Scroll to section content when changing sections on mobile
  useEffect(() => {
    if (contentRef.current && window.innerWidth < 768) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  const renderContent = () => {
    // Show loading state while fetching settings
    if (fetchingSettings) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin">
            <Icon
              icon="eos-icons:loading"
              width={32}
              height={32}
              className="text-[#FF6B00]"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Loading Settings
            </h3>
            <p className="text-gray-400 text-sm">
              Please wait while we fetch your settings...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {activeSection === "account" && (
          <AccountSettings
            userData={settingsData}
            onSave={(data) => handleSave(data, "account")}
          />
        )}

        {activeSection === "preferences" && (
          <LanguagePreferences
            userData={settingsData}
            onSave={(data) => handleSave(data, "preferences")}
          />
        )}

        {activeSection === "security" && (
          <SecuritySettings
            userData={settingsData}
            onSave={(data) => handleSave(data, "security")}
          />
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-5">
      {/* Header with Save Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          {showSaveButton && (
            <Button
              variant="orangeFilled"
              onClick={() => {
                // Find the form and submit it
                const form = document.querySelector("form");
                if (form) {
                  form.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
                } else {
                  // If no form is found, try to find a save button and click it
                  const saveButton = document.querySelector(
                    'button[type="submit"]'
                  );
                  if (saveButton) {
                    saveButton.click();
                  }
                }
              }}
              disabled={loading}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white py-2 px-6 rounded-full shadow-md whitespace-nowrap"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin">
                      <Icon icon="eos-icons:loading" width={16} height={16} />
                    </div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" width={16} height={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </div>
            </Button>
          )}
        </div>
        <p className="text-zinc-400">
          Manage your account preferences and security options
        </p>
      </div>

      <div>
        {/* Error Banner */}
        {error && (
          <InfoBanner
            icon="mdi:alert-circle"
            title="Error"
            subtitle={error}
            variant="primary"
            className="mb-4 mt-2"
          />
        )}

        {/* Desktop tabs - hidden on mobile */}
        <div className="hidden md:flex overflow-x-auto gap-1 mb-6 pb-1 scrollbar-hide border-b border-[rgba(255,255,255,0.1)]">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 transition-all ${
                activeSection === section.id
                  ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                  : "text-gray-400"
              }`}
            >
              <Icon icon={section.icon} width={18} height={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef} className="pb-20">
          {renderContent()}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation
          sections={SETTINGS_SECTIONS}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
    </div>
  );
}
