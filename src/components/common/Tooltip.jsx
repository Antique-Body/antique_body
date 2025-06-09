"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const Tooltip = ({
  children,
  content,
  position = "top",
  className = "",
  width = "max-w-xs",
  delay = 0, // Delay before showing tooltip (ms)
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  // Handle positioning
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position === "top" ? -5 : position === "bottom" ? 5 : 0,
      x: position === "left" ? -5 : position === "right" ? 5 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  // Handle showing the tooltip with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  // Handle hiding the tooltip
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsMounted(false);
    };
  }, []);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      {children}
      <AnimatePresence>
        {isVisible && isMounted && (
          <motion.div
            className={`absolute z-50 ${positions[position]}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative">
              <div
                className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 text-white text-xs font-medium rounded-lg py-2 px-3 shadow-xl ${width}`}
              >
                {typeof content === "string" ? (
                  <div className="text-gray-100">{content}</div>
                ) : (
                  content
                )}
              </div>

              {/* Arrows */}
              {position === "top" && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900/95 border-r border-b border-gray-700/50" />
              )}
              {position === "bottom" && (
                <div className="absolute left-1/2 bottom-full -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900/95 border-l border-t border-gray-700/50" />
              )}
              {position === "left" && (
                <div className="absolute top-1/2 left-full -translate-y-1/2 h-2 w-2 rotate-45 bg-gray-900/95 border-t border-r border-gray-700/50" />
              )}
              {position === "right" && (
                <div className="absolute top-1/2 right-full -translate-y-1/2 h-2 w-2 rotate-45 bg-gray-900/95 border-b border-l border-gray-700/50" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
