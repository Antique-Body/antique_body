"use client";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { ErrorIcon } from "./Icons";

/**
 * Reusable form field component with consistent styling
 * Supports various input types including text, number, email, password, file, select, and textarea
 */
export const FormField = ({
  label,
  name,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  options = [],
  min,
  max,
  step,
  className = "",
  backgroundStyle = "default", // Options: default, transparent, darker
  size = "default", // Options: default, small
  error,
  subLabel,
  accept,
  rows = 4,
  disabled = false,
  register, // For react-hook-form integration
  rules = {}, // For react-hook-form validation rules
  checked,
  showShortCode = true,
  asyncSearch,
  onSelectOption,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Fix: useEffect must not be called conditionally
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle react-hook-form props
  const inputProps = register
    ? { ...register(name, rules), type, placeholder }
    : {
        id: id || name,
        name,
        value: value !== undefined ? value : "",
        onChange: onChange || (() => {}),
        onBlur,
        type,
        placeholder,
        required,
        min,
        max,
        step,
        disabled,
        ...(type === "file" && { accept }),
        ...(type === "checkbox" && { checked }),
        ...(type === "radio" && { checked }),
      };

  // Define background styles based on the backgroundStyle prop
  const getBgStyle = () => {
    switch (backgroundStyle) {
      case "transparent":
        return "bg-[rgba(20,20,20,0.8)]";
      case "darker":
        return "bg-[rgba(20,20,20,0.5)]";
      case "semi-transparent":
        return "bg-[rgba(30,30,30,0.8)]";
      default:
        return "bg-[#1a1a1a]";
    }
  };

  // Determine padding based on size
  const getPadding = () => (size === "small" ? "p-2" : "p-3");

  // Base input class with conditional styling
  const inputClass = `w-full ${getPadding()} rounded-lg ${getBgStyle()} border ${
    error
      ? "border-red-500 focus:border-red-500"
      : "border-[#333] focus:border-[#FF6B00]"
  } text-white focus:outline-none focus:ring-2 ${
    error ? "focus:ring-red-500/30" : "focus:ring-[#FF6B00]/30"
  } transition ${className}`;

  // Consistent label component
  const LabelComponent = ({ htmlFor }) =>
    label && (
      <label className="block text-gray-300 mb-2" htmlFor={htmlFor}>
        {label}
      </label>
    );

  // Checkbox styling
  if (type === "checkbox") {
    return (
      <label
        htmlFor={id || name}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <div className="relative">
          <input {...inputProps} className="absolute opacity-0 w-0 h-0" />
          <div
            className={`w-4 h-4 rounded border ${
              checked
                ? "bg-[#FF6B00] border-[#FF6B00]"
                : "bg-[#1a1a1a] border-[#444]"
            } transition-colors flex items-center justify-center`}
          >
            {checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        <span className={`text-gray-200 ${className}`}>{label}</span>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </label>
    );
  }

  // Radio button styling
  if (type === "radio") {
    return (
      <label
        htmlFor={id || name}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <div className="relative">
          <input {...inputProps} className="absolute opacity-0 w-0 h-0" />
          <div
            className={`w-4 h-4 rounded-full border ${
              checked ? "border-[#FF6B00]" : "border-[#444]"
            } bg-[#1a1a1a] transition-colors flex items-center justify-center`}
          >
            {checked && (
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
            )}
          </div>
        </div>
        <span className={`text-gray-200 ${className}`}>{label}</span>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </label>
    );
  }

  // Special case for file inputs that should be directly rendered (used in ProfileImageUpload)
  if (type === "file" && className && className.includes("hidden-file-input")) {
    return <input {...inputProps} className={className} />;
  }

  if (type === "file") {
    return (
      <div className={`mb-4 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
        <input {...inputProps} className="hidden" id={id || name} />
        <label
          htmlFor={id || name}
          className="inline-block cursor-pointer rounded-lg bg-[#333] px-4 py-2 transition-colors hover:bg-[#444]"
        >
          Choose File
        </label>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  if (type === "searchableSelect") {
    const safeOptions = Array.isArray(options) ? options : [];
    const safeAsyncOptions = Array.isArray(asyncOptions) ? asyncOptions : [];
    const selectedOption =
      (asyncSearch
        ? safeAsyncOptions.find((opt) => opt.value === value)
        : safeOptions.find((opt) => opt.value === value)) ||
      (value ? { value, label: value } : null);
    const filteredOptions = asyncSearch
      ? safeAsyncOptions
      : safeOptions.filter((option) => {
          if (
            typeof option.label !== "string" ||
            typeof searchTerm !== "string"
          )
            return false;
          try {
            return option.label
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } catch {
            return false;
          }
        });

    const handleSearch = async (e) => {
      setSearchTerm(e.target.value);
      if (asyncSearch && e.target.value.length >= 2) {
        setLoading(true);
        const results = await asyncSearch(e.target.value);
        setAsyncOptions(results);
        setLoading(false);
      }
    };

    const dropdown = (
      <div
        className="absolute z-[200] w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg"
        style={{
          position: "absolute",
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
        }}
      >
        <div className="p-2">
          <input
            type="text"
            className="w-full p-2 bg-[#333] text-white rounded border border-[#444] focus:border-[#FF6B00] focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-2 text-gray-400">Loading...</div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-[#333] ${
                  value === option.value ? "bg-[#333]" : ""
                }`}
                onClick={() => {
                  if (onSelectOption) onSelectOption(option);
                  if (onChange)
                    onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="text-white truncate">{option.label}</div>
                {showShortCode && option.shortCode && (
                  <div className="text-sm text-gray-400 truncate">
                    {option.shortCode}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">No options found</div>
          )}
        </div>
      </div>
    );

    return (
      <div className={`mb-4 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
        <div className="relative">
          <div
            ref={inputRef}
            className={`${inputClass} cursor-pointer flex items-center justify-between`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-white truncate flex-1 mr-2">
              {selectedOption
                ? selectedOption.label
                : placeholder || "Select an option"}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isOpen && typeof window !== "undefined"
            ? createPortal(dropdown, document.body)
            : null}
        </div>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  if (type === "select") {
    // Standard select
    return (
      <div className={`mb-4 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
        <div className="relative">
          <select
            {...inputProps}
            className={`${inputClass} appearance-none pr-10 cursor-pointer`}
            {...props}
          >
            {options.map((option, index) => (
              <option
                key={index}
                value={typeof option === "object" ? option.value : option}
                className="bg-[#1a1a1a] text-white"
              >
                {typeof option === "object" ? option.label : option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon
              icon="mdi:chevron-down"
              width={20}
              height={20}
              className="text-gray-400 transition-colors group-hover:text-[#FF6B00]"
            />
          </div>
        </div>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`mb-4 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
        <textarea {...inputProps} className={inputClass} rows={rows}></textarea>
        {error && (
          <p className="mt-1 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <LabelComponent htmlFor={id || name} />
      {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
      <input
        {...inputProps}
        className={inputClass}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
          if (inputProps.onChange) {
            inputProps.onChange(e);
          }
        }}
      />
      {error && (
        <p className="mt-1 flex items-center text-sm text-red-500">
          <ErrorIcon size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
