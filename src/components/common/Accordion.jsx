"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Card } from "./Card";

export const Accordion = ({
  title,
  icon,
  iconColor,
  gradientFrom,
  bgColor = "rgba(0,0,0,0.05)",
  borderColor = "rgba(0,0,0,0.1)",
  shadowColor = "rgba(0,0,0,0.05)",
  children,
  defaultOpen = false,
  className = "",
  cardVariant,
  subtitle,
  headerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Define hover properties for Card based on colors
  const hoverProps = {
    hoverBorderColor: borderColor,
    hoverShadow: `0 15px 30px -10px ${shadowColor}`,
    hover: true,
  };

  return (
    <Card
      className={`w-full transition-all duration-300 ${className}`}
      bgGradientFrom={bgColor}
      bgGradientTo={bgColor}
      borderColor={borderColor}
      borderTop={false}
      padding="0"
      borderRadius="16px"
      variant={cardVariant || "glass"}
      width="100%"
      {...hoverProps}
    >
      <div className="w-full">
        <div
          className={`flex items-center justify-between p-4 cursor-pointer w-full ${headerClassName}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            borderBottom: isOpen ? `1px solid ${borderColor}` : "none",
            transition: "all 0.3s ease",
          }}
        >
          <div className="flex">
            <div className="flex items-center justify-between w-full">
              {icon && (
                <div
                  className="flex items-center justify-center mr-3 rounded-full p-2"
                  style={{
                    background: `rgba(${iconColor.replace(
                      /[^\d,]/g,
                      ""
                    )}, 0.15)`,
                    boxShadow: `0 0 15px rgba(${iconColor.replace(
                      /[^\d,]/g,
                      ""
                    )}, 0.2)`,
                  }}
                >
                  <Icon
                    icon={icon}
                    style={{ color: iconColor }}
                    width={24}
                    height={24}
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white flex items-center">
                  <span
                    className="bg-clip-text text-transparent text-lg"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${gradientFrom}, white)`,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {title}
                  </span>
                </h3>
                {subtitle && (
                  <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center rounded-full p-2 bg-[rgba(255,255,255,0.05)]"
            >
              <Icon
                icon="mdi:chevron-down"
                style={{ color: iconColor }}
                width={20}
                height={20}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden w-full"
            >
              <div>{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
