"use client";

export const TextField = ({
  id,
  name,
  label,
  type = "text",
  register,
  rules = {},
  error,
  required = false,
  className = "",
  placeholder = "",
  subLabel = "",
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  showConstraints = false,
}) => {
  const inputProps = register 
    ? { ...register(name, rules) } 
    : { 
        id, 
        name, 
        value, 
        onChange,
        onBlur,
        type,
        placeholder,
        required,
        min,
        max,
        step
      };

  // Ensure password fields are properly masked
  if (type === "password") {
    inputProps.type = "password";
    inputProps.autoComplete = name === "password" ? "current-password" : "new-password";
  }

  const hasError = !!error;
  const inputClassName = `w-full p-3 bg-[#1a1a1a] border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
    hasError 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" 
      : "border-[#333] focus:border-[#FF7800] focus:ring-[#FF7800]/30"
  } text-white ${className}`;

  return (
<div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className="block text-gray-300 font-medium" htmlFor={id || name}>
            {label}
          </label>
        )}
        {showConstraints && (min !== undefined || max !== undefined) && (
          <span className="text-xs text-gray-400">
            {min !== undefined && max !== undefined 
              ? `${min} - ${max}` 
              : min !== undefined 
                ? `Min: ${min}` 
                : `Max: ${max}`}
          </span>
        )}
      </div>
      {subLabel && <p className="text-sm text-gray-400 mb-2">{subLabel}</p>}
      <input
        {...inputProps}
        className={inputClassName}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
