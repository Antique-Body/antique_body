"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

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
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-zinc-800/50 
        bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40
        backdrop-blur-sm shadow-lg shadow-black/20
        transition-all duration-300 hover:border-zinc-700/50
        ${className}
      `}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/3 via-transparent to-transparent pointer-events-none" />

      {/* Main content container */}
      <div className="relative z-10 p-6 sm:p-8">
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

      {/* Subtle bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent" />
    </div>
  );
};
