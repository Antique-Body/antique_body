"use client";
import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

/**
 * A reusable banner component for displaying information in a stylized gradient box
 */
export const InfoBanner = ({
  icon = "mdi:information",
  title,
  subtitle,
  variant = "primary", // primary (orange), success (green), info (blue)
  className = "",
  buttonText,
  onButtonClick,
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
          buttonVariant:
            "bg-[rgba(74,222,128,0.2)] border border-[rgba(74,222,128,0.3)] text-green-400 hover:bg-[rgba(74,222,128,0.3)]",
        };
      case "info":
        return {
          gradient: "from-blue-500/10 to-blue-500/5",
          border: "border-blue-500/30",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          titleColor: "text-blue-400",
          buttonVariant:
            "bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.3)] text-blue-400 hover:bg-[rgba(59,130,246,0.3)]",
        };
      case "primary":
      default:
        return {
          gradient: "from-[#FF6B00]/10 to-[#FF6B00]/5",
          border: "border-[#FF6B00]/30",
          iconBg: "bg-[#FF6B00]/20",
          iconColor: "text-[#FF6B00]",
          titleColor: "text-[#FF6B00]",
          buttonVariant: "outlineOrange",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`relative p-4 bg-gradient-to-r ${styles.gradient} border ${styles.border} rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Icon
              icon={icon}
              width={20}
              height={20}
              className={styles.iconColor}
            />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <p className={`text-sm font-medium ${styles.titleColor}`}>
                {title}
              </p>
            )}
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>

        {buttonText && onButtonClick && (
          <div className="flex-shrink-0">
            <Button
              variant={variant === "primary" ? "outlineOrange" : "custom"}
              className={variant !== "primary" ? styles.buttonVariant : ""}
              size="small"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
