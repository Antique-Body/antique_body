export const ProgressBar = ({
    // Common properties
    className = "",
    height = "h-2",
    bgColor = "bg-[#333]",

    // Value properties (supporting both naming patterns)
    value,
    maxValue,
    current,
    goal,
    max,

    // Labels and formatting
    label,
    unit = "",
    valuePrefix = "",
    valueSuffix = "",
    showPercentage = true,
    showValues = true,

    // Color properties
    color,
    gradientFrom = "from-[#FF7800]",
    gradientTo = "to-[#FF9A00]",
}) => {
    // Handle both naming conventions (value/maxValue and current/goal)
    const currentValue = value !== undefined ? value : current;
    const targetValue = maxValue !== undefined ? maxValue : max !== undefined ? max : goal;

    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, Math.round((currentValue / targetValue) * 100)));

    // Determine color class for the progress bar
    const colorClass = color ? `${color} rounded-full` : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`;

    return (
        <div className={`w-full ${className}`}>
            {(showValues || showPercentage || label) && (
                <div className="flex justify-between items-center mb-1">
                    <div className="flex gap-2">
                        {label && <span className="text-sm font-medium">{label}</span>}
                        {showValues && (
                            <span className="text-sm font-medium">
                                {valuePrefix}
                                {currentValue}
                                {valueSuffix || unit} / {valuePrefix}
                                {targetValue}
                                {valueSuffix || unit}
                            </span>
                        )}
                    </div>

                    {showPercentage && <span className="text-xs text-[#aaa]">{percentage}%</span>}
                </div>
            )}
            <div className={`${height} w-full ${bgColor} rounded-full overflow-hidden`}>
                <div
                    className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
