"use client";

import { useState } from "react";

export const MessageClientModal = ({ client, onClose, onSend }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("general");

    const handleSubmit = e => {
        e.preventDefault();

        // Format data for API
        const messageData = {
            clientId: client.id,
            clientName: client.name,
            subject,
            message,
            messageType,
            timestamp: new Date().toISOString(),
        };

        onSend(messageData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#121212] border border-[#333] rounded-xl w-full max-w-2xl overflow-hidden relative animate-fade-in">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7800] to-[#FF9A00]"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
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

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-1">Message {client?.name}</h2>
                    <p className="text-gray-400 mb-4">Send a message or update about training, nutrition, or progress</p>

                    <form onSubmit={handleSubmit}>
                        {/* Message type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Message Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div
                                    onClick={() => setMessageType("general")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        messageType === "general"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    General
                                </div>
                                <div
                                    onClick={() => setMessageType("training")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        messageType === "training"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Training
                                </div>
                                <div
                                    onClick={() => setMessageType("nutrition")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        messageType === "nutrition"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Nutrition
                                </div>
                                <div
                                    onClick={() => setMessageType("progress")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        messageType === "progress"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Progress
                                </div>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                                placeholder="Enter subject..."
                            />
                        </div>

                        {/* Message content */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white h-32 resize-none"
                                placeholder="Type your message here..."
                            ></textarea>
                        </div>

                        {/* Quick templates */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Quick Templates</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMessage("Great work on your recent progress! Keep up the good work.")}
                                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-left text-sm text-gray-300 hover:border-[#555] transition-colors"
                                >
                                    Positive Feedback
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "I've updated your training program for next week. Take a look when you have a chance.",
                                        )
                                    }
                                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-left text-sm text-gray-300 hover:border-[#555] transition-colors"
                                >
                                    Program Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "Don't forget to log your nutrition and training data this week. It's important for tracking your progress.",
                                        )
                                    }
                                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-left text-sm text-gray-300 hover:border-[#555] transition-colors"
                                >
                                    Tracking Reminder
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "Following up on our session yesterday. How are you feeling today? Any soreness or issues to report?",
                                        )
                                    }
                                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-left text-sm text-gray-300 hover:border-[#555] transition-colors"
                                >
                                    Session Follow-up
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-[#444] rounded-lg text-gray-300 hover:bg-[#333] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF9A00] transition-colors flex items-center gap-2"
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
                                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"></path>
                                </svg>
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
