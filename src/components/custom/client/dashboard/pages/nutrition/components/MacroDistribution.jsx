export const MacroDistribution = ({ protein, carbs, fat }) => {
  // Calculate percentages
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? Math.round((protein / total) * 100) : 0;
  const carbsPercent = total > 0 ? Math.round((carbs / total) * 100) : 0;
  const fatPercent = total > 0 ? Math.round((fat / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 h-6 overflow-hidden rounded-lg bg-[#1a1a1a]">
        <div className="flex h-full">
          <div className="h-full bg-blue-500" style={{ width: `${proteinPercent}%` }}></div>
          <div className="h-full bg-green-500" style={{ width: `${carbsPercent}%` }}></div>
          <div className="h-full bg-yellow-500" style={{ width: `${fatPercent}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
          <span>Protein {proteinPercent}%</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-green-500"></div>
          <span>Carbs {carbsPercent}%</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-yellow-500"></div>
          <span>Fat {fatPercent}%</span>
        </div>
      </div>
    </div>
  );
};
