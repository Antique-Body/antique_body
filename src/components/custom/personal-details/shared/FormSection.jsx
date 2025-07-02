"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

/**
 * Mobile-first form section component without nested cards
 * Provides clean, simple styling optimized for small screens
 */
export const FormSection = ({
  title,
  description,
  children,
  className = "",
  icon = null,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`mb-6 ${className}`}>
      {/* Section Header */}
      {(title || icon) && (
        <div
          className={`mb-4 ${collapsible ? "cursor-pointer" : ""}`}
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                <div className="text-[#FF6B00]">
                  {typeof icon === "string" ? (
                    <Icon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    icon
                  )}
                </div>
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {title}
                </h3>
              )}
            </div>
            {collapsible && (
              <Icon
                icon="mdi:chevron-down"
                className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
          {description && (
            <p className="text-sm text-zinc-400 leading-relaxed pl-11 sm:pl-13">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Section Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          collapsible && !isExpanded
            ? "max-h-0 overflow-hidden opacity-0"
            : "max-h-none opacity-100"
        }`}
      >
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
