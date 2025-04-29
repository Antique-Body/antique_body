import { ErrorIcon } from "../common/Icons";

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
    showConstraints = false,
    rows = 4,
    disabled = false,
    register, // For react-hook-form integration
    rules = {}, // For react-hook-form validation rules
    checked,
}) => {
    // Handle react-hook-form props
    const inputProps = register
        ? { ...register(name, rules) }
        : {
              id: id || name,
              name,
              value,
              onChange,
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
    const getPadding = () => {
        return size === "small" ? "p-2" : "p-3";
    };

    // Base input class with conditional styling
    const inputClass = `w-full ${getPadding()} rounded-lg ${getBgStyle()} border ${
        error ? "border-red-500 focus:border-red-500" : "border-[#333] focus:border-[#FF6B00]"
    } text-white focus:outline-none focus:ring-2 ${
        error ? "focus:ring-red-500/30" : "focus:ring-[#FF6B00]/30"
    } transition ${className}`;

    // Checkbox styling
    if (type === "checkbox") {
        return (
            <input
                {...inputProps}
                className={`text-[#FF6B00] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#FF6B00] focus:ring-opacity-25 ${className}`}
            />
        );
    }

    // Special case for file inputs that should be directly rendered (used in ProfileImageUpload)
    if (type === "file" && className && className.includes("hidden-file-input")) {
        return <input {...inputProps} className={className} />;
    }

    if (type === "file") {
        return (
            <div className={`mb-4 ${className}`}>
                {label && (
                    <label className="block text-gray-300 mb-2" htmlFor={id || name}>
                        {label}
                    </label>
                )}
                {subLabel && <p className="text-sm text-gray-400 mb-2">{subLabel}</p>}
                <input {...inputProps} className="hidden" id={id || name} />
                <label
                    htmlFor={id || name}
                    className="cursor-pointer py-2 px-4 bg-[#333] hover:bg-[#444] transition-colors rounded-lg inline-block"
                >
                    Choose File
                </label>
                {error && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                        <ErrorIcon size={16} className="mr-1" />
                        {error}
                    </p>
                )}
            </div>
        );
    }

    if (type === "select") {
        return (
            <div className={`mb-4 ${className}`}>
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <label className="block text-gray-300" htmlFor={id || name}>
                            {label}
                        </label>
                    )}
                </div>
                {subLabel && <p className="text-sm text-gray-400 mb-2">{subLabel}</p>}
                <select {...inputProps} className={inputClass}>
                    <option value="">{placeholder || "Select an option"}</option>
                    {options.map((option, index) => (
                        <option key={index} value={typeof option === "object" ? option.value : option}>
                            {typeof option === "object" ? option.label : option}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
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
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <label className="block text-gray-300" htmlFor={id || name}>
                            {label}
                        </label>
                    )}
                </div>
                {subLabel && <p className="text-sm text-gray-400 mb-2">{subLabel}</p>}
                <textarea {...inputProps} className={inputClass} rows={rows}></textarea>
                {error && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                        <ErrorIcon size={16} className="mr-1" />
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex justify-between items-center mb-2">
                {label && (
                    <label className="block text-gray-300" htmlFor={id || name}>
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
            <input {...inputProps} className={inputClass} />
            {error && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                    <ErrorIcon size={16} className="mr-1" />
                    {error}
                </p>
            )}
        </div>
    );
};
