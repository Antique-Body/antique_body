import React from "react";

export const ClientModal = ({ client, setShowClientModal }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                            {client?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{client?.name}</h3>
                            <p className="text-gray-400 text-sm">{client?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowClientModal(false)}
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

                {/* Content will be filled based on the selected client */}
                <div className="space-y-6">
                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg">
                        <h4 className="text-lg font-medium mb-3">Personal Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Age</p>
                                <p>{client?.age || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Height</p>
                                <p>{client?.height || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Weight</p>
                                <p>{client?.weight || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Experience</p>
                                <p>{client?.experience || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Member Since</p>
                                <p>{client?.joinDate || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className={client?.status === "active" ? "text-green-500" : "text-yellow-500"}>
                                    {client?.status || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg">
                        <h4 className="text-lg font-medium mb-3">Training Plan</h4>
                        <p className="text-[#FF6B00] font-medium">{client?.plan || "No plan assigned"}</p>
                        <p className="mt-2 text-sm">{client?.planDescription || ""}</p>

                        <div className="mt-4 flex justify-end">
                            <button className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00]">
                                Change Plan
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg">
                        <h4 className="text-lg font-medium mb-3">Session History</h4>
                        {client?.sessions?.length > 0 ? (
                            <div className="space-y-3">
                                {client.sessions.map((session, index) => (
                                    <div key={index} className="p-3 bg-[rgba(40,40,40,0.7)] rounded-lg">
                                        <div className="flex justify-between">
                                            <p className="font-medium">{session.date}</p>
                                            <p className="text-sm text-gray-400">{session.duration}</p>
                                        </div>
                                        <p className="text-sm mt-1">{session.focus}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No sessions recorded</p>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button className="py-2 px-4 border border-[#FF6B00] text-[#FF6B00] rounded-lg transition-all duration-300 hover:bg-[rgba(255,107,0,0.1)]">
                            Send Message
                        </button>
                        <button className="py-2 px-4 bg-[#FF6B00] text-white rounded-lg transition-all duration-300 hover:bg-[#FF9A00]">
                            Schedule Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
