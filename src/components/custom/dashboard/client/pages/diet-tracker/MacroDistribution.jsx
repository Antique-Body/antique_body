export const MacroDistribution = ({
  protein,
  carbs,
  fat,
  size = "default",
}) => {
  // Calculate percentages
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? Math.round((protein / total) * 100) : 0;
  const carbsPercent = total > 0 ? Math.round((carbs / total) * 100) : 0;
  const fatPercent = total > 0 ? Math.round((fat / total) * 100) : 0;

  // Adjust percentage to ensure they sum to 100%
  const adjustedProteinPercent = proteinPercent;
  const adjustedCarbsPercent = carbsPercent;
  const adjustedFatPercent = 100 - proteinPercent - carbsPercent;

  // Set sizes based on size prop
  const isSmall = size === "small";
  const barHeight = isSmall ? "h-2.5" : "h-3.5";
  const valueSize = isSmall ? "text-lg" : "text-2xl";
  const labelSize = isSmall ? "text-xs" : "text-sm";
  const cardPadding = isSmall ? "p-3" : "p-4";
  const titleSize = isSmall ? "text-xs" : "text-sm";
  const percentSize = isSmall ? "text-sm" : "text-base";

  return (
    <div className="w-full">
      {/* Total calories display */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-baseline gap-1">
          <span className={`text-gray-400 ${labelSize}`}>Total</span>
          <span
            className={`font-bold text-white ${
              isSmall ? "text-xl" : "text-3xl"
            }`}
          >
            {Math.round(total)}
          </span>
          <span className={`text-gray-400 ${labelSize}`}>calories</span>
        </div>
      </div>

      {/* Progress bar with gradient transitions */}
      <div
        className={`relative ${barHeight} rounded-full overflow-hidden bg-[#111] shadow-inner w-full mb-5`}
      >
        {/* Protein section */}
        <div
          className="h-full absolute left-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
          style={{ width: `${adjustedProteinPercent}%` }}
        ></div>

        {/* Carbs section */}
        <div
          className="h-full absolute bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
          style={{
            left: `${adjustedProteinPercent}%`,
            width: `${adjustedCarbsPercent}%`,
          }}
        ></div>

        {/* Fat section */}
        <div
          className="h-full absolute bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
          style={{
            left: `${adjustedProteinPercent + adjustedCarbsPercent}%`,
            width: `${adjustedFatPercent}%`,
          }}
        ></div>
      </div>

      {/* Macro distribution legend */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 mr-1.5"></div>
          <span className={`${labelSize} text-gray-300`}>
            Protein {proteinPercent}%
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-600 to-green-400 mr-1.5"></div>
          <span className={`${labelSize} text-gray-300`}>
            Carbs {carbsPercent}%
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 mr-1.5"></div>
          <span className={`${labelSize} text-gray-300`}>
            Fat {fatPercent}%
          </span>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Protein Card */}
        <div
          className={`bg-[#0A1020]/70 rounded-lg ${cardPadding} border border-blue-900/30 hover:border-blue-700/30 transition-colors`}
        >
          <div className="flex flex-col items-center">
            {/* Title and percentage */}
            <div className="flex items-center mb-1">
              <span className={`${titleSize} font-medium text-blue-400`}>
                Protein
              </span>
            </div>

            {/* Value */}
            <span className={`${valueSize} font-bold text-white mb-0.5`}>
              {Math.round(protein)}
            </span>

            {/* Percentage badge */}
            <div className="bg-blue-500/10 rounded-full px-2 py-0.5">
              <span className={`${percentSize} text-blue-400 font-medium`}>
                {proteinPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Carbs Card */}
        <div
          className={`bg-[#0A1A10]/70 rounded-lg ${cardPadding} border border-green-900/30 hover:border-green-700/30 transition-colors`}
        >
          <div className="flex flex-col items-center">
            {/* Title and percentage */}
            <div className="flex items-center mb-1">
              <span className={`${titleSize} font-medium text-green-400`}>
                Carbs
              </span>
            </div>

            {/* Value */}
            <span className={`${valueSize} font-bold text-white mb-0.5`}>
              {Math.round(carbs)}
            </span>

            {/* Percentage badge */}
            <div className="bg-green-500/10 rounded-full px-2 py-0.5">
              <span className={`${percentSize} text-green-400 font-medium`}>
                {carbsPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Fat Card */}
        <div
          className={`bg-[#1A1505]/70 rounded-lg ${cardPadding} border border-yellow-900/30 hover:border-yellow-700/30 transition-colors`}
        >
          <div className="flex flex-col items-center">
            {/* Title and percentage */}
            <div className="flex items-center mb-1">
              <span className={`${titleSize} font-medium text-yellow-400`}>
                Fat
              </span>
            </div>

            {/* Value */}
            <span className={`${valueSize} font-bold text-white mb-0.5`}>
              {Math.round(fat)}
            </span>

            {/* Percentage badge */}
            <div className="bg-yellow-500/10 rounded-full px-2 py-0.5">
              <span className={`${percentSize} text-yellow-400 font-medium`}>
                {fatPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
