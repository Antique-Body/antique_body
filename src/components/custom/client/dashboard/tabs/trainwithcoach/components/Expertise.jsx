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
            <h3 className="text-lg font-semibold mb-4 text-white">Areas of Expertise</h3>

            <div className="space-y-4 mb-6">
                {expertise.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-300">{item.area}</span>
                            <span className="text-[#FF6B00]">{item.level}%</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                                style={{ width: `${item.level}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-semibold mb-3 text-white">Specialization Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-2 text-[#FF6B00]">Sports Performance</h4>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Sport-specific functional movement patterns</li>
                        <li>• Speed and agility development</li>
                        <li>• Power and explosiveness training</li>
                        <li>• Competition preparation cycles</li>
                    </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-2 text-[#FF6B00]">Strength & Conditioning</h4>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Compound movement optimization</li>
                        <li>• Progressive overload programming</li>
                        <li>• Muscular endurance development</li>
                        <li>• Functional strength training</li>
                    </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-2 text-[#FF6B00]">Recovery & Mobility</h4>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Active recovery protocols</li>
                        <li>• Joint mobility enhancement</li>
                        <li>• Myofascial release techniques</li>
                        <li>• Sleep optimization strategies</li>
                    </ul>
                </div>

                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-2 text-[#FF6B00]">Nutrition Planning</h4>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Macronutrient calculation</li>
                        <li>• Performance nutrition timing</li>
                        <li>• Hydration strategies</li>
                        <li>• Supplementation guidance</li>
                    </ul>
                </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">Education & Certifications</h3>
            <ul className="space-y-3">
                <li className="flex">
                    <div className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                    </div>
                    <div>
                        <h5 className="font-medium text-white">BSc in Sports Science</h5>
                        <p className="text-sm text-gray-400">University of Athletic Excellence, 2018</p>
                    </div>
                </li>

                {trainer?.certifications.map((cert, index) => (
                    <li key={index} className="flex">
                        <div className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] p-2 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                            </svg>
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
