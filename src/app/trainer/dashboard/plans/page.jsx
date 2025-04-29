"use client";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/shared/FormField";
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

    const durationOptions = [
        { value: "", label: "All Durations" },
        { value: "8", label: "8 weeks" },
        { value: "10", label: "10 weeks" },
        { value: "12", label: "12 weeks" },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold mb-4 md:mb-0">Training Plans</h2>

                <Button variant="orangeFilled" leftIcon={<span className="text-xl">+</span>}>
                    Create New Plan
                </Button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <FormField
                        type="text"
                        placeholder="Search plans..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="mb-0"
                    />
                </div>
                <FormField
                    type="select"
                    value={filterDuration}
                    onChange={e => setFilterDuration(e.target.value)}
                    options={durationOptions}
                    className="mb-0 min-w-[150px]"
                />
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
                                <Button
                                    variant="ghostOrange"
                                    onClick={() => toggleExpand(plan.id)}
                                    className="text-sm mt-4 p-0"
                                >
                                    {expandedPlanId === plan.id ? "Hide Details" : "Show Details"}
                                </Button>

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
                                    <Button variant="secondary" size="small" className="flex-1">
                                        Edit
                                    </Button>
                                    <Button variant="orangeFilled" size="small" className="flex-1">
                                        Assign
                                    </Button>
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
