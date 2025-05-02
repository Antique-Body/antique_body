"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const DashboardTabs = ({ activeTab, setActiveTab, tabs }) => {
  const tabsRef = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Update indicator position when activeTab changes
  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeTabIndex >= 0 && tabsRef.current[activeTabIndex]) {
      const tabElement = tabsRef.current[activeTabIndex];
      setIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative top-3 mb-6 flex overflow-x-auto bg-[#0a0a0a] pb-1 pt-3">
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-[#FF6B00] transition-all duration-300 ease-in-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={el => (tabsRef.current[index] = el)}
          className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? "scale-105 transform border-transparent text-white"
              : "border-transparent text-gray-400 hover:border-[#FF6B00]/30 hover:text-white"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className={`transition-all duration-300 ${activeTab === tab.id ? "translate-y-[-2px] transform" : ""}`}>
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
        </button>
      ))}
    </div>
  );
};

// AnimatedTabContent component for smooth tab transitions
export const AnimatedTabContent = ({ children, isActive, tabId, animateOpacity = false }) => {

  return (
    <div 
      className="relative transition-opacity duration-300"
      style={{ 
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        position: isActive ? 'relative' : 'absolute',
        width: '100%',
        zIndex: isActive ? 10 : 0,
        top: 0,
        left: 0
      }}
    >
      {children}
    </div>
  );
};

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
