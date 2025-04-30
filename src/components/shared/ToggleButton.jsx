import React from "react";

/**
 * Toggle button component for multi-select options
 */
export const ToggleButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-3 py-2 text-sm transition-all ${
      active ? "bg-[#FF6B00] text-white" : "bg-[rgba(40,40,40,0.7)] text-gray-300 hover:bg-[rgba(60,60,60,0.7)]"
    }`}
  >
    {label}
  </button>
);

/**
 * Group of toggle buttons with a label
 */
export const ToggleButtonGroup = ({ label, description, options, selectedValues, onToggle, required }) => (
  <div className="mb-4">
    {label && <label className="mb-3 block text-gray-300">{label}</label>}
    {description && <p className="mb-3 text-sm text-gray-400">{description}</p>}

    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <ToggleButton
          key={index}
          label={option}
          active={selectedValues.includes(option)}
          onClick={() => onToggle(option)}
        />
      ))}
    </div>

    {required && selectedValues.length === 0 && (
      <p className="mt-2 text-sm text-red-400">Please select at least one option</p>
    )}
  </div>
);
