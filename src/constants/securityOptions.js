export const SESSION_TIMEOUT_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 240, label: "4 hours" },
  { value: 480, label: "8 hours" },
  { value: -1, label: "Never" },
];

export const DATA_RETENTION_OPTIONS = [
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 180, label: "6 months" },
  { value: 365, label: "1 year" },
  { value: 730, label: "2 years" },
  { value: 1095, label: "3 years" },
  { value: -1, label: "Indefinitely" },
];

export const SECURITY_SETTINGS_CONFIG = {
  twoFactorAuth: {
    icon: "mdi:shield-key",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
  },
  loginAlerts: {
    icon: "mdi:bell-alert",
    title: "Login Alerts",
    description: "Get notified of new login attempts",
  },
  clientDataAccess: {
    icon: "mdi:database-lock",
    title: "Secure Client Data Access",
    description: "Enable advanced encryption for client data",
  },
  professionalVerification: {
    icon: "mdi:certificate",
    title: "Professional Verification",
    description: "Verify professional credentials and certifications",
  },
  workspaceSecure: {
    icon: "mdi:shield-lock",
    title: "Secure Workspace",
    description: "Enhanced security for training sessions and data",
  },
  clientSessionLogs: {
    icon: "mdi:history",
    title: "Client Session Logs",
    description: "Keep detailed logs of client training sessions",
  },
};
