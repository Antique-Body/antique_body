"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { Card } from "@/components/common/Card";

/**
 * Modern form section component with elegant card design
 * Clean content with beautiful container styling
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
    <Card variant="formSection" className={className}>
      <div className="p-6 sm:p-8 w-full">
        {/* Modern section header */}
        {(title || description) && (
          <div
            className={`mb-6 ${collapsible ? "cursor-pointer" : ""}`}
            onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
          >
            {/* Title with optional subtle icon */}
            {title && (
              <div className="flex items-center gap-3 mb-3">
                {icon && (
                  <div className="w-1 h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full"></div>
                )}
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  {title}
                </h3>
                {collapsible && (
                  <Icon
                    icon="mdi:chevron-down"
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ml-auto ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            collapsible && !isExpanded
              ? "max-h-0 overflow-hidden opacity-0"
              : "max-h-none opacity-100"
          }`}
        >
          <div className="space-y-4 sm:space-y-5">{children}</div>
        </div>
      </div>
    </Card>
  );
};
