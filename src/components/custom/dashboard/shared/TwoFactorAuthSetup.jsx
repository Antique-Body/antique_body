import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";

export const TwoFactorAuthSetup = ({
  showQRCode,
  verificationCode,
  setVerificationCode,
  onVerify,
  loading = false,
}) => {
  if (!showQRCode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="p-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,107,0,0.2)]"
    >
      <h4 className="text-white font-medium mb-4">Setup Authenticator App</h4>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="text-center text-gray-800">
              <Icon icon="mdi:qrcode" className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">QR Code</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center">
            Scan this QR code with Google Authenticator, Authy, or similar app
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
              onClick={onVerify}
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
  );
};
