import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const AccountSettings = ({ userData, onSave }) => {
  const [formData, setFormData] = useState({
    email: userData.email || "",
    phone: userData.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [verification, setVerification] = useState({
    email: {
      isVerified: userData.emailVerified || false,
      isVerifying: false,
      code: "",
      showCodeInput: false,
      originalEmail: userData.email || "",
    },
    phone: {
      isVerified: userData.phoneVerified || false,
      isVerifying: false,
      code: "",
      showCodeInput: false,
      originalPhone: userData.phone || "",
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
      const response = await fetch(`/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          value,
          userId: userData.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
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
          userId: userData.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {emailChanged && (
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
                  <input
                    type="text"
                    value={verification.email.code}
                    onChange={(e) =>
                      handleVerificationCodeChange("email", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-[rgba(255,107,0,0.2)] rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00]"
                    placeholder="Enter verification code"
                    maxLength={6}
                  />
                  {errors.emailCode && (
                    <p className="text-red-400 text-sm">{errors.emailCode}</p>
                  )}
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

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
                  <input
                    type="text"
                    value={verification.phone.code}
                    onChange={(e) =>
                      handleVerificationCodeChange("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-[rgba(255,107,0,0.2)] rounded-lg text-white text-sm focus:outline-none focus:border-[#FF6B00]"
                    placeholder="Enter SMS code"
                    maxLength={6}
                  />
                  {errors.phoneCode && (
                    <p className="text-red-400 text-sm">{errors.phoneCode}</p>
                  )}
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
      <Card variant="darkStrong" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon icon="mdi:lock" className="text-white w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Change Password</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.currentPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              }`}
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.newPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              }`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              }`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
