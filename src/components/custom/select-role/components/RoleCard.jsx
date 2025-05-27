"use client";

import Image from "next/image";
import { useState } from "react";

export function RoleCard({ role, config, isSelected, onClick, loading, t }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
                relative rounded-2xl overflow-hidden cursor-pointer h-full
                transition-all duration-300
                ${
                  isSelected
                    ? "ring-2 ring-" +
                      role +
                      "-500 shadow-lg shadow-" +
                      role +
                      "-500/30"
                    : "ring-1 ring-white/5 hover:ring-white/20"
                }
                bg-gradient-to-b from-[#111111] to-[#0A0A0A]
            `}
      onClick={() => !loading && onClick(role)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Frosted glass effect at the top */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent z-10 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={config.background}
          alt={t(config.title)}
          fill
          className="object-cover opacity-50"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
          priority
        />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>

        {/* Accent colored gradient for selected state */}
        {isSelected && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10`}
          ></div>
        )}
      </div>

      {/* Corner accent */}
      <div
        className={`
                    absolute -top-24 -right-24 w-48 h-48 
                    bg-gradient-to-br ${config.gradient}
                    rotate-45 opacity-20 transition-all duration-500
                    ${isHovered || isSelected ? "translate-y-8 translate-x-8" : "translate-y-4 translate-x-4"}
                    z-10
                `}
      ></div>

      {/* Selection indicator - clean border and diagonal ribbon effect */}
      {isSelected && (
        <>
          {/* Left border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 z-20"></div>

          {/* Top-left corner badge */}
          <div className="absolute top-0 left-0 h-16 w-16 overflow-hidden z-20">
            <div
              className={`absolute -top-8 -left-8 h-16 w-16 bg-gradient-to-br ${config.gradient} rotate-45 shadow-md shadow-${role}-500/30`}
            ></div>
            <div className="absolute top-[14px] left-[14px]">
              <span className="mdi mdi-check text-white text-sm"></span>
            </div>
          </div>

          {/* Bottom pulse accent */}
          <div
            className={`
                        absolute bottom-0 left-0 right-0 h-0.5 
                        bg-gradient-to-r ${config.gradient} opacity-80 z-20
                    `}
          ></div>
        </>
      )}

      {/* Glow effect when selected */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-5`}
          ></div>
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Role icon */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`
                            w-14 h-14 rounded-full flex items-center justify-center 
                            bg-gradient-to-br ${config.gradient} 
                            shadow-lg shadow-${role}-500/20
                        `}
          >
            <i className={`${config.icon} text-2xl text-white`}></i>
          </div>

          {/* Feature chips */}
          <div className="flex gap-1.5 ml-auto">
            {config.features.slice(0, 2).map((feature, idx) => (
              <div
                key={idx}
                className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
              >
                <span
                  className={`mdi ${feature.icon} text-sm`}
                  style={{ color: config.color }}
                ></span>
                <span className="truncate max-w-[80px]">
                  {t(feature.text).split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Role title */}
        <h3
          className="text-2xl font-bold mb-2 leading-tight"
          style={{
            color: isSelected ? config.secondaryColor : "#ffffff",
            textShadow: isSelected ? `0 0 10px ${config.color}30` : "none",
          }}
        >
          {t(config.title)}
        </h3>

        {/* Description text */}
        <p className="text-gray-300 mb-5 text-sm leading-relaxed line-clamp-3">
          {t(config.description)}
        </p>

        {/* Features list */}
        <div className="space-y-3 mb-5 flex-grow">
          {config.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-gray-300 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/5"
            >
              <div
                className={`
                                w-8 h-8 rounded-full flex items-center justify-center 
                                bg-${role}-500/10 text-${role}-500
                            `}
              >
                <span className={`mdi ${feature.icon} text-base`}></span>
              </div>
              <span className="text-xs sm:text-sm">{t(feature.text)}</span>
            </div>
          ))}
        </div>

        {/* Select button */}
        <div className="mt-auto pt-3">
          <button
            className={`
                            w-full relative group overflow-hidden
                            py-3 px-4 rounded-lg 
                            ${
                              isSelected
                                ? `bg-gradient-to-r ${config.gradient} text-white`
                                : "bg-white/5 text-white border border-white/10 hover:border-white/20"
                            } 
                            text-sm font-medium transition-all 
                            flex items-center justify-center gap-2
                            hover:translate-y-[-2px]
                        `}
            onClick={(e) => {
              e.stopPropagation();
              if (!loading) onClick(role);
            }}
          >
            {/* Button highlight effect */}
            <div
              className={`
                            absolute inset-0 -translate-x-full group-hover:translate-x-0 
                            bg-gradient-to-r ${config.gradient} opacity-10
                            transition-transform duration-700 ease-in-out
                            ${isSelected ? "translate-x-0" : ""}
                        `}
            ></div>

            <span>
              {isSelected
                ? t("role.selection.selected")
                : t("role.selection.select_role")}
            </span>
            {isSelected ? (
              <span className="mdi mdi-check-circle text-lg"></span>
            ) : (
              <span className="mdi mdi-arrow-right text-lg"></span>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
              <div
                className={`absolute inset-0 rounded-full border-2 border-t-${role}-500 border-r-transparent border-b-transparent border-l-transparent animate-spin`}
              ></div>
            </div>
            <p className="text-white text-sm font-medium">
              {t("common.loading")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
