export const DashboardTabs = ({ activeTab, setActiveTab, tabs }) => (
  <div className="sticky top-3 mb-6 flex overflow-x-auto bg-[#0a0a0a] pb-1 pt-3">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-all duration-300 ${
          activeTab === tab.id
            ? "border-[#FF6B00] text-white"
            : "border-transparent text-gray-400 hover:border-[#FF6B00]/30 hover:text-white"
        }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.label}
        {tab.badgeCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-2 py-1 text-xs font-bold leading-none text-white">
            {tab.badgeCount}
          </span>
        )}
      </button>
    ))}
  </div>
);
