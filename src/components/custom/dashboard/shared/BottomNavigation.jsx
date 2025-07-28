import { Icon } from "@iconify/react";

/**
 * Mobile-optimized bottom navigation component for settings and edit pages
 * Only appears on smaller screens (< 768px)
 * Always visible at the bottom of the screen
 */
export const BottomNavigation = ({
  sections = [],
  activeSection = "",
  onSectionChange = () => {},
}) => (
  // Only render on mobile/tablet
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-[rgba(255,107,0,0.1)] z-30">
    <div className="flex overflow-x-auto scrollbar-hide">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex flex-col items-center justify-center flex-1 min-w-[80px] p-3 transition-colors ${
            activeSection === section.id ? "text-[#FF6B00]" : "text-gray-400"
          }`}
        >
          <Icon
            icon={section.icon}
            width={24}
            height={24}
            className={
              activeSection === section.id ? "text-[#FF6B00]" : "text-gray-400"
            }
          />
          <span className="text-xs mt-1 truncate max-w-[80px]">
            {section.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);
