"use client";

import { memo, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../..";

import {
  AdminIcon,
  ClientIcon,
  GreekPatternBorder,
  TrainerIcon,
  UserIcon,
} from "@/components/common/Icons";

const roleIcons = {
  trainer: TrainerIcon,
  client: ClientIcon,
  user: UserIcon,
  admin: AdminIcon,
};

// Create a shared height state
let maxHeight = 0;

export const RoleCardCompact = memo(
  ({
    role,
    isSelected,
    onClick,
    title,
    description,
    loading,
    cardProps = {},
  }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const Icon = roleIcons[role];

    useEffect(() => {
      if (cardRef.current) {
        const height = cardRef.current.offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
        // Update all cards to match the max height
        const allCards = document.querySelectorAll(".role-card");
        allCards.forEach((card) => {
          card.style.height = `${maxHeight}px`;
        });
      }
    }, [title, description, loading, isSelected, isHovered]);

    const getRoleTranslation = (role) => {
      const roleKey = role.toLowerCase();

      return t(`role.${roleKey}.label`);
    };

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

    if (!Icon) {
      console.error(`No icon found for role: ${role}`);
      return null;
    }

    // Custom gradient backgrounds
    const getBackgroundGradient = () => {
      if (isSelected) {
        return {
          from: "#ff7800",
          to: "#ff9500",
        };
      } else {
        return {
          from: "#1a1a1a",
          to: "#0f0f0f",
        };
      }
    };

    const bg = getBackgroundGradient();

    // Custom border style
    const getBorderStyle = () => {
      if (isSelected) {
        return "#ff7800";
      } else if (isHovered) {
        return "#ff7800";
      } else {
        return "#333333";
      }
    };

    // Custom shadow effects
    const getShadowEffect = () => {
      if (isSelected) {
        return "0 8px 25px rgba(255, 120, 0, 0.4)";
      } else if (isHovered) {
        return "0 8px 20px rgba(255, 120, 0, 0.2)";
      } else {
        return "0 5px 15px rgba(0, 0, 0, 0.3)";
      }
    };

    return (
      <div
        ref={cardRef}
        className={`transition-all duration-300 role-card h-full ${isHovered ? "scale-105" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          cursor: loading ? "wait" : "pointer",
          willChange: "transform, opacity",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <Card
          width="100%"
          maxWidth="none"
          padding="24px"
          borderRadius="15px"
          bgGradientFrom={bg.from}
          bgGradientTo={bg.to}
          borderColor={getBorderStyle()}
          shadow={getShadowEffect()}
          className={`relative h-full flex flex-col ${isSelected ? "ring-4 ring-orange-300 ring-opacity-40" : ""}`}
          borderTop={false}
          topBorderColor={false}
          {...cardProps}
        >
          <GreekPatternBorder isVisible={isSelected || isHovered} />

          <div className="flex flex-col items-center relative z-10 flex-grow">
            <div
              className={`relative transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`}
            >
              <Icon
                className={`h-20 w-20 ${loading ? "animate-pulse" : ""} ${
                  isSelected ? "text-white" : "text-orange-500"
                }`}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <h3
              className={`mt-4 text-2xl font-bold spartacus-font tracking-wide ${
                isSelected ? "text-white" : "text-orange-500"
              }`}
            >
              {title}
            </h3>

            <p
              className={`mt-3 text-sm text-center max-w-xs ${
                isSelected ? "text-white" : "text-gray-300"
              }`}
            >
              {description}
            </p>

            <span
              className={`mt-auto inline-block px-4 py-2 rounded-md text-base font-bold capitalize tracking-wider transition-all duration-300 ${
                isSelected
                  ? "bg-orange-400 bg-opacity-30 text-white shadow-inner border border-orange-300 border-opacity-40 backdrop-blur-sm"
                  : "bg-gradient-to-r from-zinc-800 to-zinc-900 text-orange-400 border border-orange-500 border-opacity-40 hover:border-orange-400 hover:text-orange-300"
              } ${isHovered ? "scale-105" : ""}`}
            >
              {getRoleTranslation(role)}
            </span>
          </div>

          {isSelected && (
            <div className="absolute inset-0 bg-orange-500 opacity-10 blur-lg -z-10"></div>
          )}

          <GreekPatternBorder
            position="bottom"
            isVisible={isSelected || isHovered}
          />
        </Card>
      </div>
    );
  }
);
