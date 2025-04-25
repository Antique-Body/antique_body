import React, { useState } from "react";

const CreatePlanModal = ({ closeCreatePlanModal }) => {
    const [planName, setPlanName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [sessionsPerWeek, setSessionsPerWeek] = useState(2);
    const [price, setPrice] = useState("");
    const [sessions, setSessions] = useState(["", "", "", "", ""]);

    const handleSessionChange = (index, value) => {
        const newSessions = [...sessions];
        newSessions[index] = value;
        setSessions(newSessions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle plan creation logic here

        // Then close the modal
        closeCreatePlanModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold">Create New Training Plan</h3>

                    <button
                        onClick={closeCreatePlanModal}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-gray-300 text-sm block mb-2">Plan Name</label>
                        <input
                            type="text"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                            placeholder="E.g., Weight Loss, Marathon Prep, Strength Building..."
                            required
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm block mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                            rows="3"
                            placeholder="Describe the plan, its objectives, and target audience..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-gray-300 text-sm block mb-2">Duration</label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                                placeholder="E.g., 8 weeks, 3 months..."
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-300 text-sm block mb-2">Sessions per Week</label>
                            <select
                                value={sessionsPerWeek}
                                onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                                required
                            >
                                <option value={1}>1 session</option>
                                <option value={2}>2 sessions</option>
                                <option value={3}>3 sessions</option>
                                <option value={4}>4 sessions</option>
                                <option value={5}>5 sessions</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-300 text-sm block mb-2">Price per Session ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                                placeholder="E.g., 75"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm block mb-2">Session Components</label>
                        <p className="text-gray-400 text-xs mb-3">
                            List the key components or milestones included in this training plan
                        </p>

                        <div className="space-y-3">
                            {sessions.map((session, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={session}
                                    onChange={(e) => handleSessionChange(index, e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg p-3 text-white"
                                    placeholder={`Session component ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closeCreatePlanModal}
                            className="py-2 px-4 border border-[#333] text-gray-300 rounded-lg transition-all duration-300 hover:bg-[#222]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-[#FF6B00] text-white rounded-lg transition-all duration-300 hover:bg-[#FF9A00]"
                        >
                            Create Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlanModal;
