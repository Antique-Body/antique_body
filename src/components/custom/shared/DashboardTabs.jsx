import React from "react";

export const DashboardTabs = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="flex overflow-x-auto pb-1 mb-6 sticky top-3 z-30 bg-[#0a0a0a] pt-3">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                            ? "border-[#FF6B00] text-white"
                            : "border-transparent text-gray-400 hover:text-white hover:border-[#FF6B00]/30"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                    {tab.badgeCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#FF6B00] rounded-full">
                            {tab.badgeCount}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
