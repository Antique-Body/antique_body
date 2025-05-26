export const ProgressBar = ({
  value,
  maxValue,
  showPercentage = true,
  showValues = true,
  label,
  height = "h-2",
  gradientFrom = "from-[#FF7800]",
  gradientTo = "to-[#FF9A00]",
  bgColor = "bg-[#1a1a1a]",
  valuePrefix = "",
  valueSuffix = "",
  className = "",
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / maxValue) * 100)),
  );

  return (
    <div className={`w-full ${className}`}>
      {(showValues || showPercentage || label) && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            {label && <span className="text-xs text-[#aaa]">{label}</span>}
            {showValues && (
              <span className="text-xs text-[#aaa]">
                {valuePrefix}
                {value}
                {valueSuffix} / {valuePrefix}
                {maxValue}
                {valueSuffix}
              </span>
            )}
          </div>

          {showPercentage && (
            <span className="text-xs text-[#aaa]">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={`${height} w-full ${bgColor} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
