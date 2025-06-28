import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Card } from "@/components/common/Card";

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

const TIME_ZONES = [
  { id: "UTC", name: "UTC (Coordinated Universal Time)" },
  { id: "Europe/Zagreb", name: "Zagreb (CET/CEST)" },
  { id: "Europe/London", name: "London (GMT/BST)" },
  { id: "Europe/Paris", name: "Paris (CET/CEST)" },
  { id: "America/New_York", name: "New York (EST/EDT)" },
  { id: "America/Los_Angeles", name: "Los Angeles (PST/PDT)" },
];

export const LanguagePreferences = ({ userData, onSave }) => {
  const [settings, setSettings] = useState({
    language: userData.language || "en",
    currency: userData.currency || "USD",
    timeZone: userData.timeZone || "Europe/Zagreb",
    notifications: {
      email: userData.notifications?.email ?? true,
      push: userData.notifications?.push ?? true,
      sms: userData.notifications?.sms ?? false,
      marketing: userData.notifications?.marketing ?? false,
      workoutReminders: userData.notifications?.workoutReminders ?? true,
      progressUpdates: userData.notifications?.progressUpdates ?? true,
    },
    privacy: {
      profileVisibility: userData.privacy?.profileVisibility || "public",
      showOnlineStatus: userData.privacy?.showOnlineStatus ?? true,
      allowMessages: userData.privacy?.allowMessages ?? true,
      shareProgressWithTrainer:
        userData.privacy?.shareProgressWithTrainer ?? true,
    },
    preferences: {
      measurementSystem: userData.preferences?.measurementSystem || "metric",
      workoutDifficulty:
        userData.preferences?.workoutDifficulty || "intermediate",
      autoSaveWorkouts: userData.preferences?.autoSaveWorkouts ?? true,
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]:
        typeof prev[category] === "object"
          ? { ...prev[category], [key]: value }
          : value,
    }));
  };

  // Auto-save changes
  useEffect(() => {
    if (onSave) {
      onSave(settings);
    }
  }, [settings, onSave]);

  return (
    <div className="space-y-6">
      {/* Success Message */}

      {/* Language Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:translate" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Language & Region</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Display Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    handleSettingChange("language", null, lang.code)
                  }
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                    settings.language === lang.code
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg"
                      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) =>
                handleSettingChange("currency", null, e.target.value)
              }
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              {CURRENCIES.map((currency) => (
                <option
                  key={currency.code}
                  value={currency.code}
                  className="bg-[#1a1a1a]"
                >
                  {currency.symbol} {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Zone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Time Zone
            </label>
            <select
              value={settings.timeZone}
              onChange={(e) =>
                handleSettingChange("timeZone", null, e.target.value)
              }
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              {TIME_ZONES.map((tz) => (
                <option key={tz.id} value={tz.id} className="bg-[#1a1a1a]">
                  {tz.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Client Preferences */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:tune" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Training Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Measurement System
            </label>
            <select
              value={settings.preferences.measurementSystem}
              onChange={(e) =>
                handleSettingChange(
                  "preferences",
                  "measurementSystem",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              <option value="metric" className="bg-[#1a1a1a]">
                Metric (kg, cm)
              </option>
              <option value="imperial" className="bg-[#1a1a1a]">
                Imperial (lbs, inches)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Workout Difficulty
            </label>
            <select
              value={settings.preferences.workoutDifficulty}
              onChange={(e) =>
                handleSettingChange(
                  "preferences",
                  "workoutDifficulty",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              <option value="beginner" className="bg-[#1a1a1a]">
                Beginner
              </option>
              <option value="intermediate" className="bg-[#1a1a1a]">
                Intermediate
              </option>
              <option value="advanced" className="bg-[#1a1a1a]">
                Advanced
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:content-save-auto"
                className="text-[#FF6B00] w-5 h-5"
              />
              <div>
                <span className="text-white font-medium">
                  Auto-Save Workouts
                </span>
                <p className="text-gray-400 text-sm">
                  Automatically save workout progress
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "preferences",
                  "autoSaveWorkouts",
                  !settings.preferences.autoSaveWorkouts
                )
              }
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                settings.preferences.autoSaveWorkouts
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  settings.preferences.autoSaveWorkouts ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:bell" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", icon: "mdi:email" },
            { key: "push", label: "Push Notifications", icon: "mdi:bell-ring" },
            {
              key: "sms",
              label: "SMS Notifications",
              icon: "mdi:message-text",
            },
            {
              key: "workoutReminders",
              label: "Workout Reminders",
              icon: "mdi:alarm",
            },
            {
              key: "progressUpdates",
              label: "Progress Updates",
              icon: "mdi:chart-line",
            },
            {
              key: "marketing",
              label: "Marketing Communications",
              icon: "mdi:bullhorn",
            },
          ].map((notification) => (
            <div
              key={notification.key}
              className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={notification.icon}
                  className="text-[#FF6B00] w-5 h-5"
                />
                <span className="text-white font-medium">
                  {notification.label}
                </span>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "notifications",
                    notification.key,
                    !settings.notifications[notification.key]
                  )
                }
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.notifications[notification.key]
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.notifications[notification.key]
                      ? "left-7"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:shield-account" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Privacy</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) =>
                handleSettingChange(
                  "privacy",
                  "profileVisibility",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              <option value="public" className="bg-[#1a1a1a]">
                Public
              </option>
              <option value="private" className="bg-[#1a1a1a]">
                Private
              </option>
              <option value="friends" className="bg-[#1a1a1a]">
                Friends Only
              </option>
            </select>
          </div>

          {[
            {
              key: "showOnlineStatus",
              label: "Show Online Status",
              icon: "mdi:circle",
            },
            {
              key: "allowMessages",
              label: "Allow Direct Messages",
              icon: "mdi:message",
            },
            {
              key: "shareProgressWithTrainer",
              label: "Share Progress with Trainer",
              icon: "mdi:share-variant",
            },
          ].map((privacy) => (
            <div
              key={privacy.key}
              className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon icon={privacy.icon} className="text-[#FF6B00] w-5 h-5" />
                <span className="text-white font-medium">{privacy.label}</span>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "privacy",
                    privacy.key,
                    !settings.privacy[privacy.key]
                  )
                }
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.privacy[privacy.key]
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.privacy[privacy.key] ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
