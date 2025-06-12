import { Icon } from "@iconify/react";
import React from "react";

export const StatCard = ({
  label,
  value,
  subtext,
  icon,
  variant = "default",
}) => {
  // Define variant-based styles
  const variantStyles = {
    default: {
      bg: "bg-gradient-to-br from-gray-800/60 to-gray-900/80",
      border: "border-gray-700/50",
      iconBg: "bg-gray-700/30",
      iconColor: "text-white",
      labelColor: "text-gray-400",
      valueColor: "text-white",
      subtextColor: "text-gray-300",
    },
    primary: {
      bg: "bg-gradient-to-br from-[#00B4FF]/10 to-[#00B4FF]/5",
      border: "border-[#00B4FF]/20",
      iconBg: "bg-[#00B4FF]/20",
      iconColor: "text-[#00B4FF]",
      labelColor: "text-gray-400",
      valueColor: "text-white",
      subtextColor: "text-[#00B4FF]",
    },
    orange: {
      bg: "bg-gradient-to-br from-[#FF6B00]/10 to-[#FF6B00]/5",
      border: "border-[#FF6B00]/20",
      iconBg: "bg-[#FF6B00]/20",
      iconColor: "text-[#FF6B00]",
      labelColor: "text-gray-400",
      valueColor: "text-white",
      subtextColor: "text-[#FF6B00]",
    },
    purple: {
      bg: "bg-gradient-to-br from-[#9747FF]/10 to-[#9747FF]/5",
      border: "border-[#9747FF]/20",
      iconBg: "bg-[#9747FF]/20",
      iconColor: "text-[#9747FF]",
      labelColor: "text-gray-400",
      valueColor: "text-white",
      subtextColor: "text-[#9747FF]",
    },
    success: {
      bg: "bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/5",
      border: "border-[#4CAF50]/20",
      iconBg: "bg-[#4CAF50]/20",
      iconColor: "text-[#4CAF50]",
      labelColor: "text-gray-400",
      valueColor: "text-white",
      subtextColor: "text-[#4CAF50]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`relative flex flex-col p-4 rounded-xl backdrop-blur-sm border ${styles.border} ${styles.bg} transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02] group`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`text-xs font-medium ${styles.labelColor}`}>{label}</p>
        {icon && (
          <div
            className={`w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}
          >
            <Icon icon={icon} className={`text-lg ${styles.iconColor}`} />
          </div>
        )}
      </div>
      <p className={`text-xl font-bold ${styles.valueColor}`}>{value}</p>
      {subtext && (
        <div className="mt-1">
          {typeof subtext === "string" ? (
            <p className={`text-xs ${styles.subtextColor}`}>{subtext}</p>
          ) : (
            subtext
          )}
        </div>
      )}

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};
