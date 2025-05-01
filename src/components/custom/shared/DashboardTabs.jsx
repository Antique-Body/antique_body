import { useRef, useEffect, useState } from "react";

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
    <div className="relative sticky top-3 mb-6 flex overflow-x-auto bg-[#0a0a0a] pb-1 pt-3">
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
