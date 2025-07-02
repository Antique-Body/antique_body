import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormField } from "@/components/common/FormField";

export const AccountSettings = ({ userData, onSave }) => {
  const [formData, setFormData] = useState({
    email: userData?.user?.email || "",
    phone: userData?.user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check if user has Google OAuth account
  const hasGoogleProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "google"
  );

  const hasFacebookProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "facebook"
  );

  const hasPhoneProvider = userData?.user?.accounts?.some(
    (account) => account.provider === "phone"
  );

  const hasOAuthProvider = hasGoogleProvider || hasFacebookProvider;

  const [verification, setVerification] = useState({
    email: {
      isVerified: Boolean(userData?.user?.emailVerified),
      isVerifying: false,
      code: "",
      showCodeInput: false,
      originalEmail: userData?.user?.email || "",
    },
    phone: {
      isVerified: Boolean(userData?.user?.phoneVerified),
      isVerifying: false,
      code: "",
      showCodeInput: false,
      originalPhone: userData?.user?.phone || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Check if email or phone has changed and needs verification
  useEffect(() => {
    const emailChanged = formData.email !== verification.email.originalEmail;
    const phoneChanged = formData.phone !== verification.phone.originalPhone;

    if (emailChanged && verification.email.isVerified) {
      setVerification((prev) => ({
        ...prev,
        email: { ...prev.email, isVerified: false, showCodeInput: false },
      }));
    }

    if (phoneChanged && verification.phone.isVerified) {
      setVerification((prev) => ({
        ...prev,
        phone: { ...prev.phone, isVerified: false, showCodeInput: false },
      }));
    }
  }, [
    formData.email,
    formData.phone,
    verification.email.originalEmail,
    verification.phone.originalPhone,
    verification.email.isVerified,
    verification.phone.isVerified,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVerificationCodeChange = (type, value) => {
    setVerification((prev) => ({
      ...prev,
      [type]: { ...prev[type], code: value },
    }));
  };

  const sendVerificationCode = async (type) => {
    const value = type === "email" ? formData.email : formData.phone;

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [type]: `${type === "email" ? "Email" : "Phone number"} is required`,
      }));
      return;
    }

    setVerification((prev) => ({
      ...prev,
      [type]: { ...prev[type], isVerifying: true },
    }));

    try {
      // API call to send verification code
      const response = await fetch(`/api/auth/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type]: value,
          mode: "update",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setVerification((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isVerifying: false,
          showCodeInput: true,
        },
      }));

      setSuccess(
        `Verification code sent to your ${type === "email" ? "email" : "phone"}`
      );
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      setVerification((prev) => ({
        ...prev,
        [type]: { ...prev[type], isVerifying: false },
      }));
      setErrors((prev) => ({
        ...prev,
        [type]: error.message || "Failed to send verification code",
      }));
    }
  };

  const verifyCode = async (type) => {
    if (!verification[type].code) {
      setErrors((prev) => ({
        ...prev,
        [`${type}Code`]: "Please enter verification code",
      }));
      return;
    }

    setLoading(true);
    try {
      // API call to verify code
      const response = await fetch(`/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          code: verification[type].code,
          value: type === "email" ? formData.email : formData.phone,
          userId: userData?.user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setVerification((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isVerified: true,
          showCodeInput: false,
          code: "",
          [`original${type === "email" ? "Email" : "Phone"}`]: formData[type],
        },
      }));

      setSuccess(
        `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully!`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [`${type}Code`]: error.message || "Invalid verification code",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Call parent onSave when data changes
  useEffect(() => {
    if (onSave) {
      onSave({
        ...formData,
        emailVerified: verification.email.isVerified,
        phoneVerified: verification.phone.isVerified,
      });
    }
  }, [
    formData,
    verification.email.isVerified,
    verification.phone.isVerified,
    onSave,
  ]);

  const emailChanged = formData.email !== verification.email.originalEmail;
  const phoneChanged = formData.phone !== verification.phone.originalPhone;

  const handleSave = async () => {
    setErrors({});
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }
    if (
      userData?.user?.hasPassword &&
      formData.newPassword &&
      !formData.currentPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is required to change your password",
      }));
      return;
    }
    if (emailChanged && !verification.email.isVerified) {
      setErrors((prev) => ({ ...prev, email: "Please verify your new email" }));
      return;
    }
    if (phoneChanged && !verification.phone.isVerified) {
      setErrors((prev) => ({ ...prev, phone: "Please verify your new phone" }));
      return;
    }
    setLoading(true);
    try {
      let phone = formData.phone;
      if (phone && !phone.startsWith("+")) {
        phone = "+" + phone.replace(/[^\d]/g, "");
      }
      const payload = {
        email: formData.email,
        phone,
        emailVerified: verification.email.isVerified,
        phoneVerified: verification.phone.isVerified,
        ...(formData.newPassword
          ? {
              newPassword: formData.newPassword,
              ...(userData?.user?.hasPassword
                ? { currentPassword: formData.currentPassword }
                : {}),
            }
          : {}),
      };
      const res = await fetch("/api/users/trainer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.success === false)
        throw new Error(data.error || "Failed to update profile");
      if (
        formData.email !== userData?.user?.email ||
        (formData.newPassword && formData.newPassword.length > 0)
      ) {
        setSuccess("Account updated! Please log in again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/auth/login" });
        }, 2000);
        setLoading(false);
        return;
      }
      setSuccess("Account updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      if (
        error.message &&
        error.message.toLowerCase().includes("current password is incorrect")
      ) {
        setErrors((prev) => ({ ...prev, currentPassword: error.message }));
      } else {
        setErrors((prev) => ({ ...prev, general: error.message }));
      }
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
          className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl backdrop-blur-sm mb-4"
        >
          <div className="flex items-center gap-3">
            <Icon icon="mdi:check-circle" className="text-green-400 w-5 h-5" />
            <span className="text-green-400 font-medium">{success}</span>
          </div>
        </motion.div>
      )}

      {/* Account Summary */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:account-circle" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Account Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={formData.email ? "mdi:email-check" : "mdi:email-off"}
                  className={`w-5 h-5 ${
                    formData.email ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400 text-xs">
                    {hasOAuthProvider
                      ? "OAuth"
                      : formData.email
                      ? "Set"
                      : "Not Set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verification.email.isVerified && formData.email && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {formData.email && !verification.email.isVerified && (
                  <Icon
                    icon="mdi:alert-circle"
                    className="text-orange-400 w-4 h-4"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Phone Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={formData.phone ? "mdi:phone-check" : "mdi:phone-off"}
                  className={`w-5 h-5 ${
                    formData.phone ? "text-green-400" : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-gray-400 text-xs">
                    {formData.phone ? "Set" : "Not Set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verification.phone.isVerified && formData.phone && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {formData.phone && !verification.phone.isVerified && (
                  <Icon
                    icon="mdi:alert-circle"
                    className="text-orange-400 w-4 h-4"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Password Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={
                    userData?.user?.hasPassword
                      ? "mdi:key-check"
                      : "mdi:key-off"
                  }
                  className={`w-5 h-5 ${
                    userData?.user?.password
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Password</h4>
                  <p className="text-gray-400 text-xs">
                    {hasOAuthProvider
                      ? "OAuth"
                      : userData?.user?.password
                      ? "Set"
                      : "Not Set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {userData?.user?.password && !hasOAuthProvider && (
                  <Icon
                    icon="mdi:verified"
                    className="text-green-400 w-4 h-4"
                  />
                )}
                {!userData?.user?.password && !hasOAuthProvider && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* General Error */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Icon icon="mdi:alert-circle" className="text-red-400 w-5 h-5" />
            <span className="text-red-400 font-medium">{errors.general}</span>
          </div>
        </motion.div>
      )}

      {/* Google Account Info */}
      {hasGoogleProvider && (
        <Card variant="darkStrong" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Icon icon="mdi:google" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Google Account</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Icon icon="mdi:check-circle" className="text-blue-400 w-4 h-4" />
              <span className="text-blue-400 text-sm font-medium">
                Connected
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                className="text-blue-400 w-5 h-5 mt-0.5"
              />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">
                  Account Management
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Your account is connected to Google. Your email address is
                  managed through your Google account.
                </p>
                <p className="text-gray-400 text-xs">
                  To change your email or password, please visit your Google
                  account settings.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Facebook Account Info */}
      {hasFacebookProvider && (
        <Card variant="darkStrong" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Icon icon="mdi:facebook" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Facebook Account</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Icon icon="mdi:check-circle" className="text-blue-400 w-4 h-4" />
              <span className="text-blue-400 text-sm font-medium">
                Connected
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                className="text-blue-400 w-5 h-5 mt-0.5"
              />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">
                  Account Management
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Your account is connected to Facebook. Your email address is
                  managed through your Facebook account.
                </p>
                <p className="text-gray-400 text-xs">
                  To change your email or password, please visit your Facebook
                  account settings.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Phone Account Info */}
      {hasPhoneProvider && (
        <Card variant="darkStrong" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Icon icon="mdi:phone" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Phone Login Account
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <Icon
                icon="mdi:check-circle"
                className="text-green-400 w-4 h-4"
              />
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                className="text-green-400 w-5 h-5 mt-0.5"
              />
              <div>
                <h4 className="text-green-400 font-medium mb-1">
                  Phone Registration
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  You registered using your phone number:{" "}
                  <strong>
                    {userData?.user?.phone
                      ? `****${userData.user.phone.slice(-3)}`
                      : "Not available"}
                  </strong>
                </p>

                {!userData?.user?.email && (
                  <p className="text-blue-400 text-xs">
                    💡 Consider adding an email address for easier account
                    management
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Email Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:email" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Email Settings</h3>
          {verification.email.isVerified && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <Icon
                icon="mdi:check-circle"
                className="text-green-400 w-4 h-4"
              />
              <span className="text-green-400 text-sm font-medium">
                Verified
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <FormField
            type="email"
            label="Email Address"
            name="email"
            subLabel={
              hasOAuthProvider
                ? "Managed by your OAuth provider"
                : hasPhoneProvider && !userData?.user?.email
                ? "Add email for account recovery and alternative login"
                : "Your primary email address"
            }
            value={formData.email}
            onChange={handleInputChange}
            prefixIcon="mdi:email"
            backgroundStyle="darker"
            disabled={hasOAuthProvider}
            placeholder={
              hasPhoneProvider && !userData?.user?.email
                ? "Enter your email address"
                : "your.email@example.com"
            }
            error={errors.email}
            className={hasOAuthProvider ? "opacity-50" : ""}
          />

          {emailChanged && !hasOAuthProvider && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:alert" className="text-orange-400 w-4 h-4" />
                <span className="text-orange-400 text-sm font-medium">
                  Email verification required
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                You've changed your email address. Please verify it to continue.
              </p>

              {!verification.email.showCodeInput ? (
                <Button
                  onClick={() => sendVerificationCode("email")}
                  disabled={verification.email.isVerifying}
                  className="bg-[#FF6B00] hover:bg-[#FF5500] text-white px-4 py-2 rounded-lg text-sm"
                >
                  {verification.email.isVerifying ? (
                    <>
                      <Icon
                        icon="eos-icons:loading"
                        className="w-4 h-4 mr-2 animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <FormField
                    type="text"
                    value={verification.email.code}
                    onChange={(e) =>
                      handleVerificationCodeChange("email", e.target.value)
                    }
                    placeholder="Enter verification code"
                    maxLength={6}
                    prefixIcon="mdi:key"
                    backgroundStyle="darker"
                    error={errors.emailCode}
                    className="mb-0"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => verifyCode("email")}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
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
                        <>
                          <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => sendVerificationCode("email")}
                      disabled={verification.email.isVerifying}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Phone Settings */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:phone" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Phone Settings</h3>
          {verification.phone.isVerified && formData.phone && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <Icon
                icon="mdi:check-circle"
                className="text-green-400 w-4 h-4"
              />
              <span className="text-green-400 text-sm font-medium">
                Verified
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <FormField
            type="tel"
            name="phone"
            label="Phone Number (Optional)"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number (e.g., +1234567890)"
            error={errors.phone}
            prefixIcon="mdi:phone"
            backgroundStyle="darker"
            subLabel={
              !formData.phone
                ? "Add your phone number for SMS verification and account recovery."
                : undefined
            }
          />

          {phoneChanged && formData.phone && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:alert" className="text-orange-400 w-4 h-4" />
                <span className="text-orange-400 text-sm font-medium">
                  Phone verification required
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                You've changed your phone number. Please verify it to continue.
              </p>

              {!verification.phone.showCodeInput ? (
                <Button
                  onClick={() => sendVerificationCode("phone")}
                  disabled={verification.phone.isVerifying}
                  className="bg-[#FF6B00] hover:bg-[#FF5500] text-white px-4 py-2 rounded-lg text-sm"
                >
                  {verification.phone.isVerifying ? (
                    <>
                      <Icon
                        icon="eos-icons:loading"
                        className="w-4 h-4 mr-2 animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
                      Send SMS Code
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <FormField
                    type="text"
                    value={verification.phone.code}
                    onChange={(e) =>
                      handleVerificationCodeChange("phone", e.target.value)
                    }
                    placeholder="Enter SMS code"
                    maxLength={6}
                    prefixIcon="mdi:message-text"
                    backgroundStyle="darker"
                    error={errors.phoneCode}
                    className="mb-0"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => verifyCode("phone")}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
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
                        <>
                          <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => sendVerificationCode("phone")}
                      disabled={verification.phone.isVerifying}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Password Settings */}
      {!hasOAuthProvider && (
        <Card variant="darkStrong" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
              <Icon icon="mdi:key" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Password Settings</h3>
            {userData?.user?.hasPassword && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-400 w-4 h-4"
                />
                <span className="text-green-400 text-sm font-medium">Set</span>
              </div>
            )}
          </div>
          {!userData?.user?.hasPassword && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:information"
                  className="text-blue-400 w-5 h-5 mt-0.5"
                />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">
                    Add Password for Direct Login
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Set up a password to enable direct login to your account
                    without requiring verification codes.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {/* Ako user ima password, traži current password */}
            {userData?.user?.hasPassword && (
              <FormField
                type="password"
                name="currentPassword"
                label="Current Password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                error={errors.currentPassword}
                required
              />
            )}
            <FormField
              type="password"
              name="newPassword"
              label="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              error={errors.newPassword}
              required
            />
            <FormField
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
              required
            />
          </div>
        </Card>
      )}

      {/* Account Summary */}
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <Icon icon="mdi:account-details" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Account Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Status */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={
                    verification.email.isVerified
                      ? "mdi:email-check"
                      : "mdi:email-alert"
                  }
                  className={`w-5 h-5 ${
                    verification.email.isVerified
                      ? "text-green-400"
                      : "text-orange-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400 text-sm">
                    {hasOAuthProvider
                      ? "OAuth Account"
                      : formData.email || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {verification.email.isVerified ? (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    {hasOAuthProvider ? "OAuth" : "Unverified"}
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
                  icon={
                    formData.phone
                      ? verification.phone.isVerified
                        ? "mdi:phone-check"
                        : "mdi:phone-alert"
                      : "mdi:phone-off"
                  }
                  className={`w-5 h-5 ${
                    formData.phone
                      ? verification.phone.isVerified
                        ? "text-green-400"
                        : "text-orange-400"
                      : "text-gray-400"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <p className="text-gray-400 text-sm">
                    {formData.phone || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {formData.phone ? (
                  verification.phone.isVerified ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      Unverified
                    </span>
                  )
                ) : (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                    Optional
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="p-4 bg-[#1a1a1a] rounded-xl md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon
                  icon={
                    hasGoogleProvider
                      ? "mdi:google"
                      : hasFacebookProvider
                      ? "mdi:facebook"
                      : hasPhoneProvider
                      ? "mdi:phone"
                      : "mdi:account-key"
                  }
                  className={`w-5 h-5 ${
                    hasOAuthProvider
                      ? "text-blue-400"
                      : hasPhoneProvider
                      ? "text-green-400"
                      : "text-[#FF6B00]"
                  }`}
                />
                <div>
                  <h4 className="text-white font-medium">Account Type</h4>
                  <p className="text-gray-400 text-sm">
                    {hasGoogleProvider
                      ? "Google OAuth Account - Secure login with Google"
                      : hasFacebookProvider
                      ? "Facebook OAuth Account - Secure login with Facebook"
                      : hasPhoneProvider
                      ? "Phone Login Account - Login with phone number"
                      : "Standard Account - Email and password login"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    hasOAuthProvider
                      ? "bg-blue-500/20 text-blue-400"
                      : hasPhoneProvider
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[#FF6B00]/20 text-[#FF6B00]"
                  }`}
                >
                  {hasOAuthProvider
                    ? "OAuth"
                    : hasPhoneProvider
                    ? "Phone"
                    : "Standard"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          disabled={
            loading ||
            (emailChanged && !verification.email.isVerified) ||
            (phoneChanged && !verification.phone.isVerified) ||
            (formData.newPassword &&
              formData.newPassword !== formData.confirmPassword)
          }
          className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white font-medium px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 !h-12"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
