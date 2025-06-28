import { Icon } from "@iconify/react";

export const ToggleSwitch = ({
  enabled,
  onToggle,
  icon,
  title,
  description,
  disabled = false,
  className = "",
}) => (
  <div
    className={`flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl ${className}`}
  >
    <div className="flex items-center gap-3">
      <Icon icon={icon} className="text-[#FF6B00] w-5 h-5" />
      <div>
        <span className="text-white font-medium">{title}</span>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        enabled ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]" : "bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
          enabled ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);
