import { useState, useEffect } from "react";

export const useSecuritySettings = (userData, onSave) => {
  const [settings, setSettings] = useState({
    twoFactorAuth: {
      enabled: userData.twoFactorAuth?.enabled || false,
      method: userData.twoFactorAuth?.method || "app",
      backupCodes: userData.twoFactorAuth?.backupCodes || [],
    },
    loginAlerts: userData.loginAlerts ?? true,
    sessionTimeout: userData.sessionTimeout || 30,
    allowedDevices: userData.allowedDevices || [],
    // Trainer-specific security settings
    clientDataAccess: userData.clientDataAccess ?? true,
    professionalVerification: userData.professionalVerification ?? false,
    workspaceSecure: userData.workspaceSecure ?? true,
    clientSessionLogs: userData.clientSessionLogs ?? true,
    dataRetentionPeriod: userData.dataRetentionPeriod || 365,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]:
        typeof prev[category] === "object"
          ? { ...prev[category], [key]: value }
          : value,
    }));
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSessionTermination = (sessionId) => {
    showSuccess(
      `Session ${sessionId ? `#${sessionId}` : ""} terminated successfully`
    );
  };

  const handleTerminateAllSessions = () => {
    showSuccess("All other sessions terminated");
  };

  // Auto-save changes
  useEffect(() => {
    if (onSave) {
      onSave(settings);
    }
  }, [settings, onSave]);

  return {
    settings,
    loading,
    success,
    setLoading,
    handleSettingChange,
    showSuccess,
    handleSessionTermination,
    handleTerminateAllSessions,
  };
};
