import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const SecuritySettings = ({ userData, onSave }) => {
  const [settings, setSettings] = useState({
    twoFactorAuth: {
      enabled: userData.twoFactorAuth?.enabled || false,
      method: userData.twoFactorAuth?.method || "app",
      backupCodes: userData.twoFactorAuth?.backupCodes || [],
    },
    loginAlerts: userData.loginAlerts ?? true,
    sessionTimeout: userData.sessionTimeout || 30,
    allowedDevices: userData.allowedDevices || [],
    // Client-specific security settings
    biometricLogin: userData.biometricLogin ?? false,
    passwordlessLogin: userData.passwordlessLogin ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeSessions] = useState([
    {
      id: 1,
      device: "iPhone 13 Pro",
      browser: "Antique Body App",
      location: "Zagreb, Croatia",
      ip: "192.168.1.100",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: 2,
      device: "MacBook Pro",
      browser: "Chrome",
      location: "Zagreb, Croatia",
      ip: "192.168.1.101",
      lastActive: "1 hour ago",
      current: false,
    },
  ]);

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

  const enable2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call to generate QR code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowQRCode(true);
      setSuccess("Scan the QR code with your authenticator app");
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setSuccess("");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSettings((prev) => ({
        ...prev,
        twoFactorAuth: {
          ...prev.twoFactorAuth,
          enabled: true,
          backupCodes: [
            "ABC123DEF456",
            "GHI789JKL012",
            "MNO345PQR678",
            "STU901VWX234",
            "YZA567BCD890",
          ],
        },
      }));

      setShowQRCode(false);
      setVerificationCode("");
      setSuccess("Two-factor authentication enabled successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to verify 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSettings((prev) => ({
        ...prev,
        twoFactorAuth: {
          ...prev.twoFactorAuth,
          enabled: false,
          backupCodes: [],
        },
      }));
      setSuccess("Two-factor authentication disabled");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to disable 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

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
                onClick={
                  settings.twoFactorAuth.enabled ? disable2FA : enable2FA
                }
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
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,107,0,0.2)]"
            >
              <h4 className="text-white font-medium mb-4">
                Setup Authenticator App
              </h4>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <div className="text-center text-gray-800">
                      <Icon
                        icon="mdi:qrcode"
                        className="w-16 h-16 mx-auto mb-2"
                      />
                      <p className="text-sm">QR Code</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Scan this QR code with Google Authenticator, Authy, or
                    similar app
                  </p>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enter verification code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
                      />
                    </div>
                    <Button
                      onClick={verify2FA}
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium"
                    >
                      {loading ? (
                        <>
                          <Icon
                            icon="eos-icons:loading"
                            className="w-4 h-4 mr-2 animate-spin"
                          />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Enable"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Backup Codes */}
          {settings.twoFactorAuth.enabled &&
            settings.twoFactorAuth.backupCodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,107,0,0.2)]"
              >
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Icon
                    icon="mdi:key-variant"
                    className="text-[#FF6B00] w-5 h-5"
                  />
                  Backup Recovery Codes
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Save these codes in a secure place. You can use them to access
                  your account if you lose your authenticator device.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {settings.twoFactorAuth.backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[#0a0a0a] rounded-lg font-mono text-center text-white"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:alert"
                      className="text-yellow-400 w-5 h-5"
                    />
                    <span className="text-yellow-400 font-medium text-sm">
                      Each backup code can only be used once. Generate new codes
                      if you've used them.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
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
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:bell-alert" className="text-[#FF6B00] w-5 h-5" />
              <div>
                <span className="text-white font-medium">Login Alerts</span>
                <p className="text-gray-400 text-sm">
                  Get notified of new login attempts
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleSettingChange("loginAlerts", null, !settings.loginAlerts)
              }
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                settings.loginAlerts
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  settings.loginAlerts ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="mdi:timer" className="text-[#FF6B00] w-5 h-5" />
              <span className="text-white font-medium">Session Timeout</span>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) =>
                handleSettingChange(
                  "sessionTimeout",
                  null,
                  parseInt(e.target.value)
                )
              }
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(255,107,0,0.2)] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300"
            >
              <option value={15} className="bg-[#0a0a0a]">
                15 minutes
              </option>
              <option value={30} className="bg-[#0a0a0a]">
                30 minutes
              </option>
              <option value={60} className="bg-[#0a0a0a]">
                1 hour
              </option>
              <option value={240} className="bg-[#0a0a0a]">
                4 hours
              </option>
              <option value={480} className="bg-[#0a0a0a]">
                8 hours
              </option>
              <option value={-1} className="bg-[#0a0a0a]">
                Never
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* Biometric Authentication - Client Only */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:fingerprint" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Biometric Authentication
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:fingerprint" className="text-[#FF6B00] w-5 h-5" />
              <div>
                <span className="text-white font-medium">
                  Fingerprint/Face ID Login
                </span>
                <p className="text-gray-400 text-sm">
                  Use biometric authentication for quick access
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "biometricLogin",
                  null,
                  !settings.biometricLogin
                )
              }
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                settings.biometricLogin
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  settings.biometricLogin ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:key-variant" className="text-[#FF6B00] w-5 h-5" />
              <div>
                <span className="text-white font-medium">
                  Passwordless Login
                </span>
                <p className="text-gray-400 text-sm">
                  Use email/SMS verification instead of password
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "passwordlessLogin",
                  null,
                  !settings.passwordlessLogin
                )
              }
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                settings.passwordlessLogin
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                  settings.passwordlessLogin ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Simplified Session Management for Clients */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
              <Icon icon="mdi:devices" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Active Sessions</h3>
          </div>
          <Button
            onClick={() => {
              setSuccess("All other sessions terminated");
              setTimeout(() => setSuccess(""), 3000);
            }}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
          >
            Sign Out Other Devices
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="p-4 bg-[#1a1a1a] rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon={
                      session.device.includes("iPhone")
                        ? "mdi:cellphone"
                        : "mdi:laptop"
                    }
                    className="text-[#FF6B00] w-6 h-6"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {session.device}
                      </span>
                      {session.current && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {session.browser} • {session.location}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Last active: {session.lastActive}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
