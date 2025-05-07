export const MacroDistribution = ({ protein, carbs, fat, size = "default" }) => {
  // Calculate percentages
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? Math.round((protein / total) * 100) : 0;
  const carbsPercent = total > 0 ? Math.round((carbs / total) * 100) : 0;
  const fatPercent = total > 0 ? Math.round((fat / total) * 100) : 0;

  // Calorie values
  const proteinCal = Math.round(protein);
  const carbsCal = Math.round(carbs);
  const fatCal = Math.round(fat);
  const totalCal = proteinCal + carbsCal + fatCal;

  // Set height based on size prop
  const barHeight = size === "small" ? "h-4" : "h-7";
  const markerSize = size === "small" ? "h-2 w-2" : "h-3 w-3";
  const fontSize = size === "small" ? "text-xs" : "text-sm";
  const spacing = size === "small" ? "space-y-3" : "space-y-4";
  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={spacing}>
      {/* Macro distribution bar with improved styling */}
      <div className={`relative ${barHeight} rounded-xl overflow-hidden bg-[#111] shadow-inner border border-[#333]`}>
        {/* Protein section with gradient and animation */}
        <div
          className="h-full absolute left-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
          style={{ width: `${proteinPercent}%` }}
        >
          {/* Animated pulsing effect for protein */}
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse-slow"></div>
        </div>
        
        {/* Carbs section with gradient */}
        <div
          className="h-full absolute bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700"
          style={{ left: `${proteinPercent}%`, width: `${carbsPercent}%` }}
        >
          {/* Animated slow wave for carbs */}
          <div className="absolute inset-0 stripe-pattern opacity-20"></div>
        </div>
        
        {/* Fat section with gradient */}
        <div
          className="h-full absolute bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-700"
          style={{ left: `${proteinPercent + carbsPercent}%`, width: `${fatPercent}%` }}
        >
          {/* Animated slow shine for fat */}
          <div className="absolute inset-0 shine opacity-20"></div>
        </div>
        
        {/* Value markers on the bar - only show if bar segment is wide enough */}
        {proteinPercent > 15 && (
          <div className="absolute text-white font-bold text-xs top-1/2 transform -translate-y-1/2"
              style={{ left: `${proteinPercent / 2}%` }}>
            {proteinPercent}%
          </div>
        )}
        
        {carbsPercent > 15 && (
          <div className="absolute text-white font-bold text-xs top-1/2 transform -translate-y-1/2"
              style={{ left: `${proteinPercent + carbsPercent / 2}%` }}>
            {carbsPercent}%
          </div>
        )}
        
        {fatPercent > 15 && (
          <div className="absolute text-white font-bold text-xs top-1/2 transform -translate-y-1/2"
              style={{ left: `${proteinPercent + carbsPercent + fatPercent / 2}%` }}>
            {fatPercent}%
          </div>
        )}
      </div>

      {/* Legend with calorie values and percentages */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-[#1a1a1a] rounded-lg p-2 hover:bg-[#222] transition-all border border-transparent hover:border-blue-500/30">
          <div className="flex items-center mb-1">
            <div className={`${markerSize} rounded-full bg-gradient-to-r from-blue-600 to-blue-400 mr-1`}></div>
            <span className={`${fontSize} font-medium`}>Protein</span>
          </div>
          <div className="flex items-center">
            <svg className={`text-blue-500 ${iconSize}`} fill="currentColor" viewBox="0 0 256 256">
              <path d="M117.25,157.92a60,60,0,1,0-35.17-35.17ZM128,44a84,84,0,1,1-84,84A84.09,84.09,0,0,1,128,44Zm20,84A20,20,0,1,1,128,108,20,20,0,0,1,148,128Z"></path>
            </svg>
            <span className={`ml-1 ${fontSize} font-bold`}>{proteinCal}</span>
            <span className={`${fontSize} text-gray-400`}> cal</span>
          </div>
          <span className={`${fontSize} text-blue-500 font-bold`}>{proteinPercent}%</span>
        </div>
        
        <div className="flex flex-col items-center bg-[#1a1a1a] rounded-lg p-2 hover:bg-[#222] transition-all border border-transparent hover:border-green-500/30">
          <div className="flex items-center mb-1">
            <div className={`${markerSize} rounded-full bg-gradient-to-r from-green-600 to-green-400 mr-1`}></div>
            <span className={`${fontSize} font-medium`}>Carbs</span>
          </div>
          <div className="flex items-center">
            <svg className={`text-green-500 ${iconSize}`} fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,77.66l-48,48a8,8,0,0,1-11.32-11.32L206.63,78,78,206.63l36.34-36.35a8,8,0,0,1,11.32,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L66,206.63,194.63,78,158.34,41.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,77.66Z"></path>
            </svg>
            <span className={`ml-1 ${fontSize} font-bold`}>{carbsCal}</span>
            <span className={`${fontSize} text-gray-400`}> cal</span>
          </div>
          <span className={`${fontSize} text-green-500 font-bold`}>{carbsPercent}%</span>
        </div>
        
        <div className="flex flex-col items-center bg-[#1a1a1a] rounded-lg p-2 hover:bg-[#222] transition-all border border-transparent hover:border-yellow-500/30">
          <div className="flex items-center mb-1">
            <div className={`${markerSize} rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 mr-1`}></div>
            <span className={`${fontSize} font-medium`}>Fat</span>
          </div>
          <div className="flex items-center">
            <svg className={`text-yellow-500 ${iconSize}`} fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44Zm4,156a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4ZM76,168a8,8,0,0,1,8-8h88a8,8,0,0,1,0,16H84A8,8,0,0,1,76,168Zm0-40a8,8,0,0,1,8-8h88a8,8,0,0,1,0,16H84A8,8,0,0,1,76,128Zm0-40a8,8,0,0,1,8-8h88a8,8,0,0,1,0,16H84A8,8,0,0,1,76,88Z"></path>
            </svg>
            <span className={`ml-1 ${fontSize} font-bold`}>{fatCal}</span>
            <span className={`${fontSize} text-gray-400`}> cal</span>
          </div>
          <span className={`${fontSize} text-yellow-500 font-bold`}>{fatPercent}%</span>
        </div>
      </div>

      {/* Total calories display */}
      <div className="flex justify-center items-center">
        <div className="text-center bg-[#1a1a1a] rounded-full px-4 py-1 border border-[#333]">
          <span className="text-gray-400 text-xs mr-1">Total:</span>
          <span className="font-bold">{totalCal}</span>
          <span className="text-gray-400 text-xs ml-1">calories</span>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .stripe-pattern {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%
          );
          background-size: 20px 20px;
          animation: stripe-animate 30s linear infinite;
        }
        
        @keyframes stripe-animate {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 40px 40px;
          }
        }
        
        .shine {
          background: linear-gradient(
            to right, 
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: shine 4s infinite;
          background-size: 200% 100%;
        }
        
        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};
