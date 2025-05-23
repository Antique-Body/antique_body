"use client";

import { ThemeContext } from "@/app/utils/themeConfig";
import { Button } from "@/components/common/Button";
import {
  AdminIcon,
  ClientIcon,
  TrainerIcon,
  UserIcon,
} from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

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
    const { theme } = useContext(ThemeContext);

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

    return (
      <div
        ref={cardRef}
        className={`transition-all duration-500 role-card h-full ${
          isHovered ? "scale-105" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          cursor: loading ? "wait" : "pointer",
          willChange: "transform, box-shadow, opacity",
          borderRadius: theme.design.borderRadius,
          overflow: "hidden",
          transition: `all 0.5s ${theme.design.animation}`,
          transform: isHovered ? "translateY(-8px)" : "",
          boxShadow: isHovered
            ? `0 20px 40px ${
                isSelected ? theme.colors.accent : theme.colors.primary
              }40`
            : "none",
        }}
      >
        <Card
          variant={isSelected ? "premium" : "dark"}
          className={`relative h-full flex flex-col ${
            isSelected
              ? `ring-2 ring-[${theme.colors.accent}] ring-opacity-50`
              : ""
          }`}
          borderTop={isSelected}
          hover={false} // We're handling hover states at the wrapper level
          elevation={isSelected ? "lg" : "md"}
          {...cardProps}
        >
          {/* Animated background gradient */}
          <div
            className="absolute inset-0 opacity-10 z-0 overflow-hidden"
            style={{
              background: isSelected
                ? `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`
                : `linear-gradient(135deg, ${theme.colors.primary}80, ${theme.colors.secondary}80)`,
              opacity: isHovered ? 0.2 : 0.1,
              transition: `opacity 0.5s ${theme.design.animation}`,
              borderRadius: theme.design.borderRadius,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${
                  isHovered ? "60% 30%" : "50% 50%"
                }, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                transition: `all 0.5s ${theme.design.animation}`,
              }}
            />
          </div>

          <div className="flex flex-col items-center relative z-10 flex-grow p-6">
            <div
              className={`relative transition-transform duration-500 mb-5 ${
                isHovered ? "scale-110 translate-y-2" : ""
              }`}
              style={{
                transition: `all 0.5s ${theme.design.animation}`,
                filter: isHovered
                  ? `drop-shadow(0 8px 16px ${
                      isSelected ? theme.colors.accent : theme.colors.primary
                    }50)`
                  : "",
              }}
            >
              <div className="relative">
                <Icon
                  className={`h-24 w-24 ${loading ? "animate-pulse" : ""}`}
                  style={{
                    color: isSelected
                      ? theme.colors.accent
                      : theme.colors.primary,
                    transition: `all 0.5s ${theme.design.animation}`,
                    filter: isHovered ? "brightness(1.2)" : "",
                  }}
                />

                {/* Icon shine effect on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${
                        isSelected ? theme.colors.accent : theme.colors.primary
                      }00 0%, ${
                        isSelected ? theme.colors.accent : theme.colors.primary
                      }30 50%, ${
                        isSelected ? theme.colors.accent : theme.colors.primary
                      }00 100%)`,
                      animation: "shine 2s infinite",
                    }}
                  />
                )}
              </div>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-8 h-8 border-3 rounded-full animate-spin"
                    style={{
                      borderColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.primary,
                      borderTopColor: "transparent",
                    }}
                  ></div>
                </div>
              )}
            </div>

            <h3
              className="mt-3 text-2xl font-bold spartacus-font tracking-wide"
              style={{
                color: isSelected ? theme.colors.accent : theme.colors.primary,
                transition: `all 0.3s ${theme.design.animation}`,
                textShadow: isHovered
                  ? `0 2px 4px ${
                      isSelected ? theme.colors.accent : theme.colors.primary
                    }30`
                  : "none",
              }}
            >
              {title}
            </h3>

            <p
              className="mt-3 text-sm text-center max-w-xs"
              style={{
                color: isSelected
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary,
                transition: `all 0.3s ${theme.design.animation}`,
                opacity: isHovered ? 1 : 0.9,
              }}
            >
              {description}
            </p>

            <div className="mt-auto pt-6">
              <Button
                variant={isSelected ? "accent" : "primary"}
                size="default"
                style={{
                  transition: `all 0.5s ${theme.design.animation}`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  boxShadow: isHovered
                    ? `0 8px 16px ${
                        isSelected ? theme.colors.accent : theme.colors.primary
                      }40`
                    : `0 4px 8px ${
                        isSelected ? theme.colors.accent : theme.colors.primary
                      }20`,
                }}
              >
                {getRoleTranslation(role)}
              </Button>
            </div>
          </div>

          {isSelected && (
            <div
              className="absolute inset-0 blur-lg -z-10"
              style={{
                backgroundColor: theme.colors.accent,
                opacity: 0.15,
              }}
            ></div>
          )}
        </Card>
      </div>
    );
  }
);

RoleCardCompact.displayName = "RoleCardCompact";
