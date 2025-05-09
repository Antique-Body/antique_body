import { Icon } from '@iconify/react';

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
  showIcon = true,
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / maxValue) * 100))
  );

  // Extract color from gradient for icon and percentage
  const getColorFromGradient = (gradient) => {
    const match = gradient.match(/from-\[(.*?)\]/);
    return match ? match[1] : "#FF7800";
  };

  const iconColor = getColorFromGradient(gradientFrom);

  return (
    <div className={`w-full ${className}`}>
      {(showValues || showPercentage || label) && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {showIcon && (
              <Icon 
                icon="mdi:progress-check" 
                className={`text-[${iconColor}]`}
                width="16" 
                height="16" 
              />
            )}
            {label && <span className="text-xs text-[#aaa] font-medium">{label}</span>}
            {showValues && (
              <span className="text-xs text-white ml-1 font-medium">
                {valuePrefix}
                {value}
                {valueSuffix} / {valuePrefix}
                {maxValue}
                {valueSuffix}
              </span>
            )}
          </div>

          {showPercentage && (
            <span className={`text-xs font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={`${height} w-full ${bgColor} rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-500 ease-out rounded-full`}
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 10px ${getColorFromGradient(gradientFrom)}40`
          }}></div>
      </div>
    </div>
  );
};
