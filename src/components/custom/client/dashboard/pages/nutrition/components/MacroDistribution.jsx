export const MacroDistribution = ({ protein, carbs, fat }) => {
    // Calculate percentages
    const total = protein + carbs + fat;
    const proteinPercent = total > 0 ? Math.round((protein / total) * 100) : 0;
    const carbsPercent = total > 0 ? Math.round((carbs / total) * 100) : 0;
    const fatPercent = total > 0 ? Math.round((fat / total) * 100) : 0;

    return (
        <div>
            <div className="h-6 bg-[#1a1a1a] rounded-lg overflow-hidden mb-2">
                <div className="h-full flex">
                    <div className="bg-blue-500 h-full" style={{ width: `${proteinPercent}%` }}></div>
                    <div className="bg-green-500 h-full" style={{ width: `${carbsPercent}%` }}></div>
                    <div className="bg-yellow-500 h-full" style={{ width: `${fatPercent}%` }}></div>
                </div>
            </div>

            <div className="flex justify-between text-sm">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span>Protein {proteinPercent}%</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>Carbs {carbsPercent}%</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Fat {fatPercent}%</span>
                </div>
            </div>
        </div>
    );
};
