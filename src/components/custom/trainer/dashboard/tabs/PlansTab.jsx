import React from "react";

export const PlansTab = ({ plans, handleCreatePlan }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Training Plans</h2>
            <div className="space-y-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:-translate-y-1"
                    >
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-1">{plan.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                            <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                <span className="text-gray-400 block mb-1">Duration</span>
                                <span className="font-medium">{plan.duration}</span>
                            </div>
                            <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                <span className="text-gray-400 block mb-1">Sessions/Week</span>
                                <span className="font-medium">{plan.sessionsPerWeek}</span>
                            </div>
                            <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                <span className="text-gray-400 block mb-1">Price/Session</span>
                                <span className="font-medium">${plan.price}</span>
                            </div>
                            <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                <span className="text-gray-400 block mb-1">Status</span>
                                <span className="font-medium">{plan.active ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    className="mt-4 bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00]"
                    onClick={handleCreatePlan}
                >
                    Create New Plan
                </button>
            </div>
        </div>
    );
};
