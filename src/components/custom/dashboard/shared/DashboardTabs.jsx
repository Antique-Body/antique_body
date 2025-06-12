"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";

export const DashboardTabs = ({ activeTab, setActiveTab, tabs }) => {
  const tabsRef = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [hoverIndicatorStyle, setHoverIndicatorStyle] = useState(null);

  // Update indicator position when activeTab changes
  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeTabIndex >= 0 && tabsRef.current[activeTabIndex]) {
      const tabElement = tabsRef.current[activeTabIndex];
      setIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  const handleMouseEnter = (index) => {
    if (tabs[index].id !== activeTab) {
      const tabElement = tabsRef.current[index];
      setHoverIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverIndicatorStyle(null);
  };

  return (
    <div className="relative top-3 mb-8 flex overflow-x-auto pb-2 pt-3">
      {/* Active tab indicator */}
      <div
        className="absolute bottom-0 h-1 rounded-t-md bg-[#FF6B00] transition-all duration-300 ease-in-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Hover indicator */}
      {hoverIndicatorStyle && (
        <div
          className="absolute bottom-0 h-1 rounded-t-md bg-[#FF6B00]/30 transition-all duration-300 ease-in-out"
          style={{
            left: `${hoverIndicatorStyle.left}px`,
            width: `${hoverIndicatorStyle.width}px`,
          }}
        />
      )}

      {tabs.map((tab, index) => (
        <Button
          key={tab.id}
          ref={(el) => (tabsRef.current[index] = el)}
          className={`whitespace-nowrap px-6 py-3 mx-2 text-sm font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? "scale-105 transform text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800/40"
          } rounded-md first:ml-0 last:mr-0`}
          onClick={() => setActiveTab(tab.id)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          variant="ghost"
        >
          <span
            className={`transition-all duration-300 ${
              activeTab === tab.id ? "translate-y-[-2px] transform" : ""
            }`}
          >
            {tab.label}
            {tab.badgeCount > 0 && (
              <span
                className={`ml-2 inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-2 py-1 text-xs font-bold leading-none text-white ${
                  activeTab === tab.id ? "animate-pulse" : ""
                }`}
              >
                {tab.badgeCount}
              </span>
            )}
          </span>
        </Button>
      ))}
    </div>
  );
};

// AnimatedTabContent component for smooth tab transitions
export const AnimatedTabContent = ({ children, isActive }) => (
  <div
    className="relative transition-opacity duration-300"
    style={{
      opacity: isActive ? 1 : 0,
      visibility: isActive ? "visible" : "hidden",
      position: isActive ? "relative" : "absolute",
      width: "100%",
      zIndex: isActive ? 10 : 0,
      top: 0,
      left: 0,
    }}
  >
    {children}
  </div>
);

// AnimatedPageTransition for nested page transitions with the same animation
export const AnimatedPageTransition = ({ children, routeKey }) => {
  // Using the same animation as the tabs for consistency
  const pageVariants = {
    enter: {
      opacity: 0,
      y: -10,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      position: "absolute",
    },
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          initial="enter"
          animate="center"
          exit="exit"
          variants={pageVariants}
          transition={{
            y: { type: "tween", duration: 0.2 },
            opacity: { duration: 0.2 },
          }}
          style={{ width: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
