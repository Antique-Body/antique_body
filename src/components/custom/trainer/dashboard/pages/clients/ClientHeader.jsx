"use client";

import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components";
import { useState } from "react";
import { MessageClientModal } from "./MessageClientModal";
export const ClientHeader = ({ client }) => {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Handle sending a message
    const handleSendMessage = messageData => {
        // In a real app, this would send the message to an API
        console.log("Sending message:", messageData);
        // You could also add a notification/toast here
    };

    // Handle scheduling a session
    const handleScheduleSession = sessionData => {
        // In a real app, this would send the session to an API
        console.log("Scheduling session:", sessionData);
        // You could also add a notification/toast here
    };

    // Format client type and sport for display
    const getClientTypeLabel = () => {
        let label = client.type.charAt(0).toUpperCase() + client.type.slice(1);
        if (client.sport) {
            label += ` (${client.sport.charAt(0).toUpperCase() + client.sport.slice(1)})`;
        }
        return label;
    };

    return (
        <>
            <div className="relative bg-[rgba(20,20,20,0.95)] rounded-xl border border-[#333] p-6 backdrop-blur-sm mb-6">
                {/* Greek pattern top border */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        {/* Client avatar/initials */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-xl">
                            {client.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">{client.name}</h1>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-3 py-1 rounded-full bg-green-900 text-green-200 text-xs">
                                    {client.status}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[rgba(255,107,0,0.2)] text-[#FF6B00] text-xs">
                                    {client.plan}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-200 text-xs">
                                    {getClientTypeLabel()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="px-4 py-2 bg-[rgba(30,30,30,0.8)] text-white rounded-lg border border-[#444] hover:border-[#FF6B00] transition-all duration-300 flex items-center gap-2"
                        >
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
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Message
                        </button>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF8800] transition-all duration-300 flex items-center gap-2"
                        >
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
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Schedule Session
                        </button>
                    </div>
                </div>

                {/* Client summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
                    <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-lg border border-[#333]">
                        <div className="text-xs text-gray-400 mb-1">Goal</div>
                        <div className="font-medium">{client.goal}</div>
                    </div>
                    <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-lg border border-[#333]">
                        <div className="text-xs text-gray-400 mb-1">Client Since</div>
                        <div className="font-medium">{client.joinDate}</div>
                    </div>
                    <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-lg border border-[#333]">
                        <div className="text-xs text-gray-400 mb-1">Next Session</div>
                        <div className="font-medium">{client.nextSession}</div>
                    </div>
                    <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-lg border border-[#333]">
                        <div className="text-xs text-gray-400 mb-1">Total Sessions</div>
                        <div className="font-medium">{client.progress?.length || 0}</div>
                    </div>
                </div>
            </div>

            {/* Message modal */}
            {showMessageModal && (
                <MessageClientModal client={client} onClose={() => setShowMessageModal(false)} onSend={handleSendMessage} />
            )}

            {/* Schedule session modal */}
            {showScheduleModal && (
                <ScheduleSessionModal
                    client={client}
                    onClose={() => setShowScheduleModal(false)}
                    onSchedule={handleScheduleSession}
                />
            )}
        </>
    );
};
