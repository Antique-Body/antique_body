"use client";
import { Icon } from "@iconify/react";

/**
 * A reusable banner component for displaying information in a stylized gradient box
 */
export const InfoBanner = ({
  icon = "mdi:information",
  title,
  subtitle,
  variant = "primary", // primary (orange), success (green), info (blue)
  className = "",
}) => {
  // Define styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          gradient: "from-green-500/10 to-green-500/5",
          border: "border-green-500/30",
          iconBg: "bg-green-500/20",
          iconColor: "text-green-400",
          titleColor: "text-green-400",
        };
      case "info":
        return {
          gradient: "from-blue-500/10 to-blue-500/5",
          border: "border-blue-500/30",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          titleColor: "text-blue-400",
        };
      case "primary":
      default:
        return {
          gradient: "from-[#FF6B00]/10 to-[#FF6B00]/5",
          border: "border-[#FF6B00]/30",
          iconBg: "bg-[#FF6B00]/20",
          iconColor: "text-[#FF6B00]",
          titleColor: "text-[#FF6B00]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`p-4 bg-gradient-to-r ${styles.gradient} border ${styles.border} rounded-lg ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center`}
        >
          <Icon
            icon={icon}
            width={20}
            height={20}
            className={styles.iconColor}
          />
        </div>
        <div>
          {title && (
            <p className={`text-sm font-medium ${styles.titleColor}`}>
              {title}
            </p>
          )}
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};
