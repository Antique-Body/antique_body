import {
  CertificateIcon,
  EducationIcon,
  NutritionIcon,
  PerformanceIcon,
  RecoveryIcon,
  StrengthIcon,
} from "@/components/common/Icons";

export const Expertise = ({ trainer }) => {
  // Expertise areas with proficiency levels
  const expertise = [
    { area: "Strength Training", level: 90 },
    { area: "Sport-specific Conditioning", level: 95 },
    { area: "Nutrition Planning", level: 85 },
    { area: "Injury Prevention", level: 80 },
    { area: "Recovery Protocols", level: 90 },
  ];

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">Areas of Expertise</h3>

      <div className="mb-6 space-y-4">
        {expertise.map((item, index) => (
          <div key={index}>
            <div className="mb-1 flex justify-between">
              <span className="text-gray-300">{item.area}</span>
              <span className="text-[#FF6B00]">{item.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#333]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                style={{ width: `${item.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">Specialization Details</h3>

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

      <h3 className="mb-3 mt-6 text-lg font-semibold text-white">Education & Certifications</h3>
      <ul className="space-y-3">
        <li className="flex">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] p-2 text-[#FF6B00]">
            <EducationIcon size={16} />
          </div>
          <div>
            <h5 className="font-medium text-white">BSc in Sports Science</h5>
            <p className="text-sm text-gray-400">University of Athletic Excellence, 2018</p>
          </div>
        </li>

        {trainer?.certifications.map((cert, index) => (
          <li key={index} className="flex">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] p-2 text-[#FF6B00]">
              <CertificateIcon size={16} />
            </div>
            <div>
              <h5 className="font-medium text-white">{cert}</h5>
              <p className="text-sm text-gray-400">Valid through 2026</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
