import { PerformanceIcon, StrengthIcon, RecoveryIcon, NutritionIcon } from "@/components/common/Icons";

export const AreasOfExpertise = ({ trainerData, updateExpertiseLevel }) => (
  <div className="space-y-6 border-t border-[#333] pt-8">
    <h2 className="text-xl font-semibold text-[#FF6B00]">Areas of Expertise</h2>

    <div className="mb-6 space-y-4">
      {trainerData.expertise.map((item, index) => (
        <div key={index}>
          <div className="mb-1 flex justify-between">
            <span className="text-gray-300">{item.area}</span>
            <span className="text-[#FF6B00]">{item.level}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#333]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                style={{ width: `${item.level}%` }}
              ></div>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={item.level}
              onChange={e => updateExpertiseLevel(index, e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      ))}
    </div>

    <h3 className="mb-3 text-lg font-medium">Specialization Details</h3>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
        <div className="mb-2 flex items-center">
          <PerformanceIcon size={18} className="mr-2 text-[#FF6B00]" />
          <h4 className="text-md font-semibold text-[#FF6B00]">Sports Performance</h4>
        </div>
        <ul className="space-y-1 text-gray-300">
          <li>• Sport-specific functional movement patterns</li>
          <li>• Speed and agility development</li>
          <li>• Power and explosiveness training</li>
          <li>• Competition preparation cycles</li>
        </ul>
      </div>

      <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
        <div className="mb-2 flex items-center">
          <StrengthIcon size={18} className="mr-2 text-[#FF6B00]" />
          <h4 className="text-md font-semibold text-[#FF6B00]">Strength & Conditioning</h4>
        </div>
        <ul className="space-y-1 text-gray-300">
          <li>• Compound movement optimization</li>
          <li>• Progressive overload programming</li>
          <li>• Muscular endurance development</li>
          <li>• Functional strength training</li>
        </ul>
      </div>

      <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
        <div className="mb-2 flex items-center">
          <RecoveryIcon size={18} className="mr-2 text-[#FF6B00]" />
          <h4 className="text-md font-semibold text-[#FF6B00]">Recovery & Mobility</h4>
        </div>
        <ul className="space-y-1 text-gray-300">
          <li>• Active recovery protocols</li>
          <li>• Joint mobility enhancement</li>
          <li>• Myofascial release techniques</li>
          <li>• Sleep optimization strategies</li>
        </ul>
      </div>

      <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
        <div className="mb-2 flex items-center">
          <NutritionIcon size={18} className="mr-2 text-[#FF6B00]" />
          <h4 className="text-md font-semibold text-[#FF6B00]">Nutrition Planning</h4>
        </div>
        <ul className="space-y-1 text-gray-300">
          <li>• Macronutrient calculation</li>
          <li>• Performance nutrition timing</li>
          <li>• Hydration strategies</li>
          <li>• Supplementation guidance</li>
        </ul>
      </div>
    </div>
  </div>
);
