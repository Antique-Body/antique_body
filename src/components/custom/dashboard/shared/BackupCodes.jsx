import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const BackupCodes = ({ codes = [] }) => {
  if (!codes.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="p-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,107,0,0.2)]"
    >
      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
        <Icon icon="mdi:key-variant" className="text-[#FF6B00] w-5 h-5" />
        Backup Recovery Codes
      </h4>
      <p className="text-gray-400 text-sm mb-4">
        Save these codes in a secure place. You can use them to access your
        account if you lose your authenticator device.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {codes.map((code, index) => (
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
          <Icon icon="mdi:alert" className="text-yellow-400 w-5 h-5" />
          <span className="text-yellow-400 font-medium text-sm">
            Each backup code can only be used once. Generate new codes if you've
            used them.
          </span>
        </div>
      </div>
    </motion.div>
  );
};
