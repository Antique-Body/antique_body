"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { DatePicker } from "./DatePicker";
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
  prefixIcon, // New prop for icon prefix
  suffixIcon, // New prop for icon suffix
  multiple = false, // Add support for multiple file uploads
  maxFiles = 5, // Maximum number of files that can be uploaded
  showFilePreview = true, // Option to show file previews
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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
        ...(type === "file" && { accept, multiple }),
        ...(type === "checkbox" && { checked }),
        ...(type === "radio" && { checked }),
      };

  // Define background styles based on the backgroundStyle prop
  const getBgStyle = () => {
    switch (backgroundStyle) {
      case "transparent":
        return "bg-[rgba(15,15,15,0.8)]";
      case "darker":
        return "bg-[rgba(10,10,10,0.7)]";
      case "semi-transparent":
        return "bg-[rgba(26,26,26,0.9)]";
      default:
        return "bg-[rgba(26,26,26,0.95)]";
    }
  };

  // Determine padding based on size
  const getPadding = () => (size === "small" ? "p-2" : "p-2.5 sm:p-3");

  // Adjust padding if prefix or suffix icons are present
  const getInputPadding = () => {
    let padding = "";
    if (prefixIcon) padding += " pl-10";
    if (suffixIcon) padding += " pr-10";
    return padding;
  };

  // Base input class with conditional styling
  const inputClass = `w-full ${getPadding()} rounded-lg ${getBgStyle()} border ${
    error
      ? "border-red-500 focus:border-red-500"
      : "border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00]"
  } text-white focus:outline-none focus:ring-2 ${
    error ? "focus:ring-red-500/30" : "focus:ring-[#FF6B00]/30"
  } transition-all duration-200 backdrop-blur-sm ${getInputPadding()} ${className}`;

  // Handler to restrict input to only numbers (and optionally a single decimal point)
  const handleNumberKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }
    // Allow: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+V, Ctrl/cmd+X
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    ) {
      return;
    }
    // Allow one decimal point (if not already present)
    if (e.key === ".") {
      if (e.target.value.includes(".")) {
        e.preventDefault();
      }
      return;
    }
    // Block: e, +, - (forbids scientific notation and negative numbers)
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    // Allow only digits
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Consistent label component
  const LabelComponent = ({ htmlFor }) =>
    label && (
      <label className="block text-gray-300 mb-1.5 sm:mb-2" htmlFor={htmlFor}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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
    // Handle file selection
    const handleFileChange = (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // For single file upload when multiple is false
      if (!multiple) {
        const file = files[0];
        const error = validateFile(file);
        if (error) {
          // Handle error
          return;
        }
        setSelectedFiles([file]);
        if (onChange) onChange({ target: { name, value: file } });
        return;
      }

      // For multiple file upload
      const fileArray = Array.from(files).slice(0, maxFiles);
      setSelectedFiles(fileArray);
      if (onChange) onChange({ target: { name, value: fileArray } });
    };

    // Validate individual file
    const validateFile = (file) => {
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file.type;
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type;
          }
          if (type.includes("/*")) {
            const mainType = type.split("/")[0];
            return fileType.startsWith(mainType + "/");
          }
          return type === fileType;
        });

        if (!isAccepted) {
          return `File type not allowed. Accepted: ${accept}`;
        }
      }
      return null;
    };

    // Handle drag events
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    // Handle drop event
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (!multiple) {
          const file = e.dataTransfer.files[0];
          const error = validateFile(file);
          if (error) {
            // Handle error
            return;
          }
          setSelectedFiles([file]);
          if (onChange) onChange({ target: { name, value: file } });
        } else {
          const fileArray = Array.from(e.dataTransfer.files).slice(0, maxFiles);
          setSelectedFiles(fileArray);
          if (onChange) onChange({ target: { name, value: fileArray } });
        }
      }
    };

    // Remove a file from selection (for multiple uploads)
    const removeFile = (indexToRemove) => {
      const updatedFiles = selectedFiles.filter(
        (_, index) => index !== indexToRemove
      );
      setSelectedFiles(updatedFiles);
      if (onChange)
        onChange({
          target: {
            name,
            value: multiple ? updatedFiles : updatedFiles[0] || null,
          },
        });
    };

    // Get file icon based on mime type
    const getFileIcon = (file) => {
      if (file.type.startsWith("image/")) return "mdi:file-image";
      if (file.type.includes("pdf")) return "mdi:file-pdf";
      if (file.type.includes("word")) return "mdi:file-word";
      if (file.type.includes("excel") || file.type.includes("sheet"))
        return "mdi:file-excel";
      return "mdi:file-document";
    };

    // Format file size
    const formatFileSize = (size) => {
      if (size < 1024) return size + " B";
      else if (size < 1048576) return (size / 1024).toFixed(1) + " KB";
      else return (size / 1048576).toFixed(1) + " MB";
    };

    return (
      <div className={`mb-2.5 sm:mb-3 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}

        {/* Hidden file input */}
        <input
          {...inputProps}
          className="hidden"
          id={id || name}
          onChange={handleFileChange}
        />

        {/* Modern drag and drop file upload area */}
        <label
          htmlFor={id || name}
          className={`block w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ${
            dragActive
              ? "border-[#FF6B00] bg-[#FF6B00]/5"
              : "border-[#444] hover:border-[#FF6B00]/50 hover:bg-[#333]/30"
          } ${selectedFiles.length > 0 ? "p-3" : "p-6"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center mb-2">
                <Icon
                  icon="mdi:cloud-upload"
                  width={24}
                  height={24}
                  className="text-[#FF6B00]"
                />
              </div>
              <p className="text-white font-medium">
                Drag and drop {multiple ? "files" : "a file"} here
              </p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              {accept && (
                <p className="text-gray-500 text-xs mt-1">
                  Allowed formats: {accept}
                </p>
              )}
              {multiple && (
                <p className="text-gray-500 text-xs">Up to {maxFiles} files</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">
                  {multiple
                    ? `${selectedFiles.length} file(s) selected`
                    : "File selected"}
                </span>
                {selectedFiles.length > 0 && multiple && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-[#FF6B00] text-sm flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFiles([]);
                      if (onChange)
                        onChange({
                          target: { name, value: multiple ? [] : null },
                        });
                    }}
                  >
                    <Icon icon="mdi:refresh" width={16} height={16} />
                    Change all
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-[rgba(26,26,26,0.9)] backdrop-blur-sm rounded-lg p-2 border border-[rgba(255,107,0,0.2)] group hover:border-[rgba(255,107,0,0.4)] transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon={getFileIcon(file)}
                        width={20}
                        height={20}
                        className="text-[#FF6B00]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    {multiple && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="w-6 h-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon
                          icon="mdi:close"
                          width={14}
                          height={14}
                          className="text-red-400"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {multiple && selectedFiles.length < maxFiles && (
                <button
                  type="button"
                  className="mt-2 text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm flex items-center gap-1 self-start"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById(id || name).click();
                  }}
                >
                  <Icon icon="mdi:plus" width={16} height={16} />
                  Add more files
                </button>
              )}
            </div>
          )}
        </label>

        {/* Preview area for images if enabled */}
        {showFilePreview &&
          selectedFiles.some((file) => file.type.startsWith("image/")) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedFiles
                .filter((file) => file.type.startsWith("image/"))
                .map((file, idx) => (
                  <div key={`preview-${idx}`} className="relative group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                      className="w-20 h-20 object-cover rounded-lg border border-[#333]"
                      width={80}
                      height={80}
                    />
                    {multiple && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(selectedFiles.indexOf(file));
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon
                          icon="mdi:close"
                          width={12}
                          height={12}
                          className="text-white"
                        />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}

        {error && (
          <p className="mt-2 flex items-center text-sm text-red-500">
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
        className="absolute z-[200] w-full mt-1 bg-[rgba(26,26,26,0.95)] backdrop-blur-lg border border-[rgba(255,107,0,0.2)] rounded-lg shadow-xl"
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
            className="w-full p-2 bg-[rgba(51,51,51,0.9)] backdrop-blur-sm text-white rounded border border-[rgba(255,107,0,0.2)] focus:border-[#FF6B00] focus:outline-none transition-all duration-200"
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
                className={`px-4 py-2 cursor-pointer hover:bg-[rgba(255,107,0,0.1)] transition-colors duration-200 ${
                  value === option.value
                    ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                    : ""
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
      <div className={`mb-2.5 sm:mb-3 ${className}`}>
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
      <div className={`mb-2.5 sm:mb-3 ${className}`}>
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
                className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm text-white"
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
      <div className={`mb-2.5 sm:mb-3 ${className}`}>
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

  // If type is date, use our custom DatePicker
  if (type === "date") {
    return (
      <div className={`mb-2.5 sm:mb-3 ${className}`}>
        <LabelComponent htmlFor={id || name} />
        {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
        <DatePicker
          value={value}
          onChange={onChange}
          name={name}
          min={min}
          max={max}
          disabled={disabled}
        />
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
    <div className={`mb-3 sm:mb-4 ${className}`}>
      <LabelComponent htmlFor={id || name} />
      {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
      <div className="relative">
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {typeof prefixIcon === "string" ? (
              <Icon icon={prefixIcon} className="h-5 w-5 text-zinc-400" />
            ) : (
              prefixIcon
            )}
          </div>
        )}

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
          {...(type === "number" ? { onKeyDown: handleNumberKeyDown } : {})}
        />

        {suffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {typeof suffixIcon === "string" ? (
              <Icon icon={suffixIcon} className="h-5 w-5 text-zinc-400" />
            ) : (
              suffixIcon
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 flex items-center text-sm text-red-500">
          <ErrorIcon size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
