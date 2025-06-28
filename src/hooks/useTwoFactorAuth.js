import { useState } from "react";

export const useTwoFactorAuth = () => {
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const enable2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call to generate QR code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowQRCode(true);
      return {
        success: true,
        message: "Scan the QR code with your authenticator app",
      };
    } catch (error) {
      console.error("Failed to enable 2FA:", error);
      return { success: false, message: "Failed to enable 2FA" };
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      return { success: false, message: "Please enter a valid 6-digit code" };
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const backupCodes = [
        "ABC123DEF456",
        "GHI789JKL012",
        "MNO345PQR678",
        "STU901VWX234",
        "YZA567BCD890",
      ];

      setShowQRCode(false);
      setVerificationCode("");

      return {
        success: true,
        message: "Two-factor authentication enabled successfully!",
        backupCodes,
      };
    } catch (error) {
      console.error("Failed to verify 2FA:", error);
      return { success: false, message: "Failed to verify 2FA" };
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        message: "Two-factor authentication disabled",
      };
    } catch (error) {
      console.error("Failed to disable 2FA:", error);
      return { success: false, message: "Failed to disable 2FA" };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    showQRCode,
    verificationCode,
    setVerificationCode,
    enable2FA,
    verify2FA,
    disable2FA,
  };
};
