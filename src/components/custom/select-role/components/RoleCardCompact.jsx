"use client";

import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// Default placeholder images with better quality images specific to each role
export const DEFAULT_BACKGROUNDS = {
    trainer:
        "https://blog.nasm.org/hubfs/top%205%20reasons%20to%20become%20a%20personal%20trainer%20header%20blog%20updated.jpg",
    client: "https://goat-fitness.com/wp-content/uploads/2022/01/shutterstock_1822207589.jpg",
    user: "https://img.freepik.com/premium-photo/fitness-bodybuilding-background_136595-22918.jpg",
    admin: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
};

// Role-specific icons and colors
const ROLE_CONFIGS = {
    trainer: {
        mainIcon: "mdi mdi-dumbbell",
        featureIcons: {
            clients: "mdi mdi-account-group",
            programs: "mdi mdi-clipboard-list",
            tracking: "mdi mdi-chart-line",
        },
        color: "orange",
        gradient: "from-orange-500 to-orange-600",
    },
    client: {
        mainIcon: "mdi mdi-account-heart",
        featureIcons: {
            guidance: "mdi mdi-compass",
            workouts: "mdi mdi-calendar-fitness",
            progress: "mdi mdi-trending-up",
        },
        color: "blue",
        gradient: "from-blue-500 to-blue-600",
    },
    user: {
        mainIcon: "mdi mdi-account-cog",
        featureIcons: {
            workouts: "mdi mdi-run",
            ai: "mdi mdi-robot",
            goals: "mdi mdi-target",
        },
        color: "green",
        gradient: "from-green-500 to-green-600",
    },
    admin: {
        mainIcon: "mdi mdi-shield-account",
        featureIcons: {
            manage: "mdi mdi-cog",
            users: "mdi mdi-account-multiple",
            analytics: "mdi mdi-chart-box",
        },
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
    },
};

export const RoleCardCompact = memo(({ role, isSelected, onClick, title, description, loading }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get role-specific configuration
    const roleConfig = ROLE_CONFIGS[role] || ROLE_CONFIGS.user;

    // Background image
    const backgroundImage = imageError
        ? "https://evofitness.at/wp-content/uploads/2023/02/EVO-2025-PP-FEBRUARY_Banner_12-1200x675.jpg"
        : DEFAULT_BACKGROUNDS[role] || DEFAULT_BACKGROUNDS.user;

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const handleClick = useCallback(() => {
        if (!loading) {
            onClick();
        }
    }, [loading, onClick]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const getRoleTranslation = (role) => {
        const roleKey = role.toLowerCase();
        return t(`role.${roleKey}.label`);
    };

    return (
        <div
            className={`
        group
        relative w-full h-full overflow-hidden 
        transition-all duration-400 ease-out
        ${isHovered ? "scale-[1.01]" : ""}
        ${isSelected ? "ring-2 ring-offset-2 ring-offset-black" : ""}
        ${loading ? "cursor-wait opacity-80" : "cursor-pointer"}
        rounded-xl
      `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Background image */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <Image
                    src={backgroundImage}
                    alt={t(`role.${role}.label`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-700 ${isHovered ? "scale-105 blur-[1px]" : "scale-100"}`}
                    onError={handleImageError}
                    priority
                />

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10"></div>

                {/* Interactive overlay */}
                <div
                    className={`
            absolute inset-0 z-10 transition-all duration-400
            ${isSelected ? `bg-${roleConfig.color}-900/20` : isHovered ? "bg-black/40" : "bg-black/30"}
          `}
                ></div>
            </div>

            {/* Corner accent - Dynamic colored corner tab animation */}
            <div
                className={`
          absolute -top-16 -right-16 w-32 h-32 
          bg-gradient-to-br ${roleConfig.gradient}
          rotate-45 transition-all duration-400
          ${isSelected || isHovered ? "translate-y-6 translate-x-6" : "translate-y-2 translate-x-2"}
          z-20
        `}
            ></div>

            {/* Bottom line/bar with dynamic color */}
            <div
                className={`
          absolute bottom-0 left-0 right-0 h-0.5
          bg-gradient-to-r ${roleConfig.gradient}
          transform transition-transform duration-400 ease-in-out
          ${isSelected || isHovered ? "translate-y-0" : "translate-y-full"}
          z-20
        `}
            ></div>

            {/* Content container */}
            <div className="relative z-30 flex flex-col justify-between h-full p-4 text-center">
                {/* Role icon and title */}
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-${roleConfig.color}-500`}
                    >
                        <i className={`${roleConfig.mainIcon} text-2xl`}></i>
                    </div>

                    {/* Feature badges */}
                    <div className="flex gap-2">
                        {Object.entries(roleConfig.featureIcons).map(([key, icon], index) => (
                            <div
                                key={key}
                                className={`
                  w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm 
                  flex items-center justify-center
                  transform transition-all duration-300
                  ${isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
                `}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <i className={`${icon} text-lg text-${roleConfig.color}-500`}></i>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Title and description */}
                <div className="space-y-1.5 mt-1">
                    <h3 className="text-lg md:text-xl font-bold spartacus-font tracking-wide text-white drop-shadow-md line-clamp-1">
                        {t(title)}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-200 mx-auto max-w-xs opacity-90 line-clamp-2">
                        {t(description)}
                    </p>
                </div>

                {/* Role banner/badge */}
                <div className="mt-auto mb-1">
                    <div
                        className={`
              inline-flex items-center gap-2 px-5 py-2 rounded-md
              font-bold text-sm tracking-wide uppercase
              transform transition-all duration-400
              ${
                  isSelected
                      ? `bg-${roleConfig.color}-500 text-white shadow-md shadow-${roleConfig.color}-500/20`
                      : "bg-white/10 text-white backdrop-blur-sm border border-white/20"
              }
              ${isHovered ? "scale-105" : ""}
            `}
                    >
                        <i className={`${roleConfig.mainIcon} text-lg`}></i>
                        {getRoleTranslation(role)}
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className={`w-8 h-8 border-2 border-${roleConfig.color}-500 border-t-transparent rounded-full animate-spin`}
                        ></div>
                        <span className="text-sm font-medium text-white">{t("common.loading")}</span>
                    </div>
                </div>
            )}

            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-3 left-3 z-40">
                    <div
                        className={`h-4 w-4 rounded-full bg-${roleConfig.color}-500 flex items-center justify-center animate-pulse`}
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                    </div>
                </div>
            )}
        </div>
    );
});

RoleCardCompact.displayName = "RoleCardCompact";

// Add CSS animations to globals.css
// .animate-ping-slow {
//   animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
// }
// .animate-ping-slower {
//   animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
// }
