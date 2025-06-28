import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormField } from "@/components/common/FormField";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { ActiveSessions } from "@/components/custom/dashboard/shared/ActiveSessions";
import {
  SESSION_TIMEOUT_OPTIONS,
  SECURITY_SETTINGS_CONFIG,
} from "@/constants/securityOptions";

// Helper functions
const formatPhoneDisplay = (phone) => {
  if (!phone) return "Not set";
  if (phone.length <= 3) return phone;
  const hidden = "*".repeat(phone.length - 3);
  const lastThree = phone.slice(-3);
  return `${hidden}${lastThree}`;
};

const formatEmailDisplay = (email) => {
  if (!email) return "Not set";
  const [username, domain] = email.split("@");
  if (username.length <= 2) return email;
  const hiddenUsername = username.slice(0, 2) + "*".repeat(username.length - 2);
  return `${hiddenUsername}@${domain}`;
};

export const SecuritySettings = ({ userData, onSave }) => {
  const [settings, setSettings] = useState({
    twoFactorAuth: {
      enabled: userData.user?.twoFactorAuth?.enabled || false,
      method: userData.user?.twoFactorAuth?.method || "app",
      backupCodes: userData.user?.twoFactorAuth?.backupCodes || [],
    },
    loginAlerts: userData.user?.loginAlerts ?? true,
    sessionTimeout: userData.user?.sessionTimeout || 30,
    allowedDevices: userData.user?.allowedDevices || [],
    // Client-specific security settings
    biometricLogin: userData.user?.biometricLogin ?? false,
    passwordlessLogin: userData.user?.passwordlessLogin ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Check if user has OAuth provider accounts (Google, Facebook, etc.)
  const hasGoogleProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "google"
  );

  const hasFacebookProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "facebook"
  );

  const hasOAuthProvider = hasGoogleProvider || hasFacebookProvider;

  // Check if user uses email credentials (not OAuth)
  const hasEmailCredentials =
    userData?.user?.email &&
    (!userData?.user?.accounts?.length ||
      userData?.user?.accounts?.some(
        (account) => account.provider === "credentials"
      )) &&
    !hasOAuthProvider;

  // Check if user uses phone for login
  const hasPhoneProvider =
    userData?.user?.phone &&
    (!userData?.user?.accounts?.length ||
      userData?.user?.accounts?.some(
        (account) => account.provider === "phone"
      )) &&
    !hasOAuthProvider;

  // Analyze user account state
  const hasCredentialsProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "credentials"
  );

  const hasEmail = Boolean(userData?.user?.email);
  const hasPhone = Boolean(userData?.user?.phone);
  const hasPassword = Boolean(userData?.user?.password);

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

      {/* Account Overview */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:account-circle" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Account Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={hasEmail ? "mdi:email-check" : "mdi:email-off"}
                  className={`w-5 h-5 ${
                    hasEmail ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Email Address</h4>
                  <p className="text-gray-400 text-sm">
                    {hasGoogleProvider
                      ? "Google Account"
                      : hasFacebookProvider
                      ? "Facebook Account"
                      : hasPhoneProvider && !hasEmail
                      ? "Not set - Add for easier login"
                      : formatEmailDisplay(userData?.user?.email)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasEmail && userData?.user?.emailVerified && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {!hasEmail && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    Not Set
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Phone Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={hasPhone ? "mdi:phone-check" : "mdi:phone-off"}
                  className={`w-5 h-5 ${
                    hasPhone ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Phone Number</h4>
                  <p className="text-gray-400 text-sm">
                    {hasPhoneProvider && hasPhone
                      ? `Phone Login: ${formatPhoneDisplay(
                          userData?.user?.phone
                        )}`
                      : formatPhoneDisplay(userData?.user?.phone)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasPhone && userData?.user?.phoneVerified && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {!hasPhone && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    Not Set
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Password Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={hasPassword ? "mdi:key-check" : "mdi:key-off"}
                  className={`w-5 h-5 ${
                    hasPassword ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Password</h4>
                  <p className="text-gray-400 text-sm">
                    {hasGoogleProvider
                      ? "Managed by Google"
                      : hasFacebookProvider
                      ? "Managed by Facebook"
                      : hasPhoneProvider
                      ? "Not required for phone login"
                      : hasPassword
                      ? "Set"
                      : "Not Set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasPassword && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {!hasPassword && !hasOAuthProvider && !hasPhoneProvider && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Login Method */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={
                    hasGoogleProvider
                      ? "mdi:google"
                      : hasFacebookProvider
                      ? "mdi:facebook"
                      : hasCredentialsProvider
                      ? "mdi:account-key"
                      : "mdi:phone"
                  }
                  className="text-[#FF6B00] w-5 h-5"
                />
                <div>
                  <h4 className="text-white font-medium">Login Method</h4>
                  <p className="text-gray-400 text-sm">
                    {hasGoogleProvider
                      ? "Google OAuth"
                      : hasFacebookProvider
                      ? "Facebook OAuth"
                      : hasCredentialsProvider
                      ? "Email & Password"
                      : hasPhoneProvider
                      ? "Phone Number"
                      : "Not configured"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {!hasPassword && !hasOAuthProvider && !hasPhoneProvider && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:alert" className="text-red-400 w-5 h-5" />
              <div>
                <h4 className="text-red-400 font-medium">Action Required</h4>
                <p className="text-gray-400 text-sm">
                  Set up a password to enable direct login to your account
                  without relying on external verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phone Provider Recommendation */}
        {hasPhoneProvider && !hasEmail && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:lightbulb" className="text-blue-400 w-5 h-5" />
              <div>
                <h4 className="text-blue-400 font-medium">
                  Enhance Your Account
                </h4>
                <p className="text-gray-400 text-sm">
                  Add an email address for account recovery and alternative
                  login options. This provides additional security and
                  convenience.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

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

      {/* Login Credentials */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:account-key" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Login Credentials</h3>
        </div>

        <div className="space-y-4">
          {/* Email Section */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:email" className="text-[#FF6B00] w-5 h-5" />
                <div>
                  <h4 className="text-white font-medium">Email Address</h4>
                  <p className="text-gray-400 text-sm">
                    {hasGoogleProvider
                      ? `Google: ${formatEmailDisplay(userData?.user?.email)}`
                      : hasEmailCredentials
                      ? `Current: ${formatEmailDisplay(userData?.user?.email)}`
                      : "Not set - Add email for easier login"}
                  </p>
                  {hasEmailCredentials && !userData?.user?.emailVerified && (
                    <p className="text-orange-400 text-xs mt-1">
                      ⚠️ Email not verified
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {hasEmailCredentials && !userData?.user?.emailVerified && (
                  <Button
                    variant="outline"
                    size="small"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    Verify Email
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Phone Section */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone" className="text-[#FF6B00] w-5 h-5" />
                <div>
                  <h4 className="text-white font-medium">Phone Number</h4>
                  <p className="text-gray-400 text-sm">
                    {hasPhoneProvider
                      ? `Current: ${formatPhoneDisplay(userData?.user?.phone)}`
                      : "Not set - Add phone for SMS verification"}
                  </p>
                  {hasPhoneProvider && !userData?.user?.phoneVerified && (
                    <p className="text-orange-400 text-xs mt-1">
                      ⚠️ Phone not verified
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {hasPhoneProvider && !userData?.user?.phoneVerified && (
                  <Button
                    variant="outline"
                    size="small"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    Verify Phone
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          {!hasGoogleProvider && !hasFacebookProvider && (
            <div className="p-4 bg-[#1a1a1a] rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:key" className="text-[#FF6B00] w-5 h-5" />
                  <div>
                    <h4 className="text-white font-medium">Password</h4>
                    <p className="text-gray-400 text-sm">
                      {hasEmailCredentials || hasPhoneProvider
                        ? "Password is set - enables direct login"
                        : "Not set - required for direct login access"}
                    </p>
                    {hasEmailCredentials ||
                      (hasPhoneProvider && (
                        <p className="text-green-400 text-xs mt-1">
                          💡 Add password to login directly without verification
                          codes
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {hasEmailCredentials ||
                    (hasPhoneProvider && (
                      <Button
                        variant="outline"
                        size="small"
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                      >
                        Add Password
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Google Account Info */}
          {hasGoogleProvider && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:google" className="text-blue-400 w-5 h-5" />
                <div>
                  <h4 className="text-blue-400 font-medium">
                    Google OAuth Account
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Your account is managed by Google. Email and password
                    changes must be done through your Google account settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Facebook Account Info */}
          {hasFacebookProvider && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:facebook" className="text-blue-400 w-5 h-5" />
                <div>
                  <h4 className="text-blue-400 font-medium">
                    Facebook OAuth Account
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Your account is managed by Facebook. Email and password
                    changes must be done through your Facebook account settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phone Account Info */}
          {hasPhoneProvider && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone" className="text-green-400 w-5 h-5" />
                <div>
                  <h4 className="text-green-400 font-medium">
                    Phone Login Account
                  </h4>
                  <p className="text-gray-400 text-sm">
                    You registered using your phone number:{" "}
                    {formatPhoneDisplay(userData?.user?.phone)}. You can add an
                    email address for alternative login options.
                  </p>
                  {!hasEmail && (
                    <p className="text-blue-400 text-xs mt-2">
                      💡 Consider adding an email address for account recovery
                      and easier login
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Completion Status */}
          {(!hasEmailCredentials ||
            !hasPhoneProvider ||
            (!hasOAuthProvider &&
              !hasEmailCredentials &&
              !hasPhoneProvider)) && (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:account-plus"
                  className="text-purple-400 w-5 h-5 mt-0.5"
                />
                <div>
                  <h4 className="text-purple-400 font-medium">
                    Complete Your Account Setup
                  </h4>
                  <p className="text-gray-400 text-sm mb-2">
                    Add missing credentials for better security and login
                    options:
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    {!hasEmailCredentials && (
                      <li>• Add email for account recovery</li>
                    )}
                    {!hasPhoneProvider && (
                      <li>• Add phone for SMS verification</li>
                    )}
                    {!hasOAuthProvider &&
                      !hasEmailCredentials &&
                      !hasPhoneProvider && (
                        <li>• Add password for direct login</li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
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

      {/* Privacy & Data Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:shield-account" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Privacy & Data</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(SECURITY_SETTINGS_CONFIG)
            .filter(([key]) =>
              [
                "dataSharing",
                "profileVisibility",
                "progressSharing",
                "trainerCommunication",
                "marketingEmails",
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
        </div>
      </Card>

      {/* Active Sessions */}
      <ActiveSessions
        sessions={activeSessions}
        onTerminateSession={() => {
          setSuccess("Session terminated");
          setTimeout(() => setSuccess(""), 3000);
        }}
        onTerminateAll={() => {
          setSuccess("All sessions terminated");
          setTimeout(() => setSuccess(""), 3000);
        }}
        loading={loading}
      />
    </div>
  );
};
