import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormField } from "@/components/common/FormField";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { ActiveSessions } from "@/components/custom/dashboard/shared/ActiveSessions";
import { BackupCodes } from "@/components/custom/dashboard/shared/BackupCodes";
import { TwoFactorAuthSetup } from "@/components/custom/dashboard/shared/TwoFactorAuthSetup";
import {
  SESSION_TIMEOUT_OPTIONS,
  DATA_RETENTION_OPTIONS,
  SECURITY_SETTINGS_CONFIG,
} from "@/constants/securityOptions";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import { useTwoFactorAuth } from "@/hooks/useTwoFactorAuth";

export const SecuritySettings = ({ userData, onSave }) => {
  const {
    settings,
    loading: settingsLoading,
    success,
    handleSettingChange,
    showSuccess,
    handleSessionTermination,
    handleTerminateAllSessions,
  } = useSecuritySettings(userData, onSave);

  const {
    loading: twoFALoading,
    showQRCode,
    verificationCode,
    setVerificationCode,
    enable2FA,
    verify2FA,
    disable2FA,
  } = useTwoFactorAuth();

  // Mock active sessions data
  const [activeSessions] = useState([
    {
      id: 1,
      device: "MacBook Pro",
      browser: "Chrome",
      location: "Zagreb, Croatia",
      ip: "192.168.1.100",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: 2,
      device: "iPad Pro",
      browser: "Safari",
      location: "Zagreb, Croatia",
      ip: "192.168.1.101",
      lastActive: "30 minutes ago",
      current: false,
    },
    {
      id: 3,
      device: "Windows PC",
      browser: "Edge",
      location: "Split, Croatia",
      ip: "10.0.0.50",
      lastActive: "2 days ago",
      current: false,
    },
  ]);

  const handle2FAToggle = async () => {
    if (settings.twoFactorAuth.enabled) {
      const result = await disable2FA();
      if (result.success) {
        handleSettingChange("twoFactorAuth", "enabled", false);
        handleSettingChange("twoFactorAuth", "backupCodes", []);
        showSuccess(result.message);
      }
    } else {
      const result = await enable2FA();
      if (result.success) {
        showSuccess(result.message);
      }
    }
  };

  const handleVerify2FA = async () => {
    const result = await verify2FA();
    if (result.success) {
      handleSettingChange("twoFactorAuth", "enabled", true);
      handleSettingChange("twoFactorAuth", "backupCodes", result.backupCodes);
      showSuccess(result.message);
    }
  };

  const loading = settingsLoading || twoFALoading;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Icon icon="mdi:check-circle" className="text-green-400 w-5 h-5" />
            <span className="text-green-400 font-medium">{success}</span>
          </div>
        </motion.div>
      )}

      {/* Two-Factor Authentication */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:shield-key" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Two-Factor Authentication
          </h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:security" className="text-[#FF6B00] w-6 h-6" />
              <div>
                <h4 className="text-white font-medium">Enable 2FA</h4>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {settings.twoFactorAuth.enabled ? (
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-green-400 w-5 h-5"
                  />
                  <span className="text-green-400 font-medium">Enabled</span>
                </div>
              ) : (
                <span className="text-gray-400">Disabled</span>
              )}
              <Button
                onClick={handle2FAToggle}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  settings.twoFactorAuth.enabled
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white"
                }`}
              >
                {settings.twoFactorAuth.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>

          {/* QR Code Setup */}
          <TwoFactorAuthSetup
            showQRCode={showQRCode}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            onVerify={handleVerify2FA}
            loading={loading}
          />

          {/* Backup Codes */}
          <BackupCodes codes={settings.twoFactorAuth.backupCodes} />
        </div>
      </Card>

      {/* Login & Session Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:login" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Login & Sessions</h3>
        </div>

        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.loginAlerts}
            onToggle={() =>
              handleSettingChange("loginAlerts", null, !settings.loginAlerts)
            }
            icon={SECURITY_SETTINGS_CONFIG.loginAlerts.icon}
            title={SECURITY_SETTINGS_CONFIG.loginAlerts.title}
            description={SECURITY_SETTINGS_CONFIG.loginAlerts.description}
          />

          <FormField
            type="select"
            label="Session Timeout"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleSettingChange(
                "sessionTimeout",
                null,
                parseInt(e.target.value)
              )
            }
            options={SESSION_TIMEOUT_OPTIONS}
            prefixIcon="mdi:timer"
            backgroundStyle="darker"
          />
        </div>
      </Card>

      {/* Professional Data Management - Trainer Only */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:account-group" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Client Data Management
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(SECURITY_SETTINGS_CONFIG)
            .filter(([key]) =>
              [
                "clientDataAccess",
                "professionalVerification",
                "workspaceSecure",
                "clientSessionLogs",
              ].includes(key)
            )
            .map(([key, config]) => (
              <ToggleSwitch
                key={key}
                enabled={settings[key]}
                onToggle={() => handleSettingChange(key, null, !settings[key])}
                icon={config.icon}
                title={config.title}
                description={config.description}
              />
            ))}

          <FormField
            type="select"
            label="Data Retention Period"
            value={settings.dataRetentionPeriod}
            onChange={(e) =>
              handleSettingChange(
                "dataRetentionPeriod",
                null,
                parseInt(e.target.value)
              )
            }
            options={DATA_RETENTION_OPTIONS}
            prefixIcon="mdi:database-clock"
            backgroundStyle="darker"
            subLabel="How long to keep client data after account deletion"
          />
        </div>
      </Card>

      {/* Active Sessions */}
      <ActiveSessions
        sessions={activeSessions}
        onTerminateSession={handleSessionTermination}
        onTerminateAll={handleTerminateAllSessions}
        loading={loading}
      />
    </div>
  );
};
