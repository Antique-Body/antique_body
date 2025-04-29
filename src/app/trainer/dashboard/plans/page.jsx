"use client";
import { useState } from "react";

const PlansPage = () => {
    // Sample data
    const plans = [
        {
            id: 1,
            name: "Pro Athlete",
            description:
                "High-performance program for competitive athletes focusing on sport-specific training, recovery, and performance optimization.",
            duration: "12 weeks",
            sessionsPerWeek: 3,
            price: 80,
            sessions: [
                "Performance assessment & baseline",
                "Sport-specific technique work",
                "Strength & power development",
                "Speed & agility training",
                "Recovery protocols & injury prevention",
            ],
            active: true,
        },
        {
            id: 2,
            name: "Fat Loss",
            description:
                "Comprehensive program combining HIIT, strength training, and nutrition guidance for optimal fat loss while preserving muscle.",
            duration: "8 weeks",
            sessionsPerWeek: 2,
            price: 65,
            sessions: [
                "Initial body composition analysis",
                "Customized nutrition planning",
                "Progressive resistance training",
                "High-intensity interval sessions",
                "Weekly measurements & progress tracking",
            ],
            active: true,
        },
        {
            id: 3,
            name: "Recovery",
            description:
                "Post-injury or post-surgery rehabilitation program designed to restore function, mobility, and strength safely.",
            duration: "10 weeks",
            sessionsPerWeek: 2,
            price: 70,
            sessions: [
                "Functional movement assessment",
                "Progressive mobility work",
                "Corrective exercises",
                "Gradual strength rebuilding",
                "Return-to-activity protocols",
            ],
            active: true,
        },
        {
            id: 4,
            name: "Strength Building",
            description: "Focused strength development program using progressive overload principles and compound movements.",
            duration: "12 weeks",
            sessionsPerWeek: 3,
            price: 75,
            sessions: [
                "Strength assessment & goal setting",
                "Compound movement technique",
                "Progressive overload programming",
                "Nutrition for muscle development",
                "Recovery optimization",
            ],
            active: true,
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [expandedPlanId, setExpandedPlanId] = useState(null);
    const [filterDuration, setFilterDuration] = useState("");

    // Filter and search functionality
    const filteredPlans = plans.filter(plan => {
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDuration = filterDuration ? plan.duration.includes(filterDuration) : true;
        return matchesSearch && matchesDuration;
    });

    const toggleExpand = planId => {
        setExpandedPlanId(expandedPlanId === planId ? null : planId);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold mb-4 md:mb-0">Training Plans</h2>

                <button className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00]">
                    + Create New Plan
                </button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search plans..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                </div>
                <select
                    value={filterDuration}
                    onChange={e => setFilterDuration(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Durations</option>
                    <option value="8">8 weeks</option>
                    <option value="10">10 weeks</option>
                    <option value="12">12 weeks</option>
                </select>
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.length === 0 ? (
                    <div className="text-center py-8 col-span-full">
                        <p className="text-gray-400">No plans match your filters</p>
                    </div>
                ) : (
                    filteredPlans.map(plan => (
                        <div
                            key={plan.id}
                            className="bg-[rgba(30,30,30,0.8)] rounded-xl border border-[#333] overflow-hidden transition-all duration-300 hover:border-[#FF6B00] flex flex-col"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                                    <div className="flex items-center space-x-1">
                                        <span
                                            className={`w-3 h-3 rounded-full ${plan.active ? "bg-green-500" : "bg-gray-500"}`}
                                        ></span>
                                        <span className="text-xs text-gray-400">{plan.active ? "Active" : "Inactive"}</span>
                                    </div>
                                </div>

                                <p className="text-sm mt-2 text-gray-300 line-clamp-2">{plan.description}</p>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Duration</p>
                                        <p className="text-sm">{plan.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Sessions/Week</p>
                                        <p className="text-sm">{plan.sessionsPerWeek}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Price per Session</p>
                                        <p className="text-sm">${plan.price}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plan sessions */}
                            <div className="mt-auto p-4 pt-0">
                                <button
                                    onClick={() => toggleExpand(plan.id)}
                                    className="text-sm text-[#FF6B00] hover:text-[#FF9A00] transition-all duration-300 flex items-center mt-4"
                                >
                                    {expandedPlanId === plan.id ? "Hide Details" : "Show Details"}
                                </button>

                                {expandedPlanId === plan.id && (
                                    <div className="mt-3 border-t border-[#333] pt-3">
                                        <p className="text-sm text-gray-400 mb-2">Sessions:</p>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {plan.sessions.map((session, index) => (
                                                <li key={index}>{session}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex space-x-2 mt-4">
                                    <button className="bg-[rgba(40,40,40,0.7)] text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 hover:bg-[rgba(60,60,60,0.7)] flex-1">
                                        Edit
                                    </button>
                                    <button className="bg-[#FF6B00] text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 hover:bg-[#FF9A00] flex-1">
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlansPage;
