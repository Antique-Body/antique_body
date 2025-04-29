"use client";

import { Button } from "@/components/common/Button";
import { CloseXIcon, SendIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";
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

                <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
                    <CloseXIcon size={24} />
                </Button>

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
                            <FormField
                                label="Subject"
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                                placeholder="Enter subject..."
                            />
                        </div>

                        {/* Message content */}
                        <div className="mb-5">
                            <FormField
                                label="Message"
                                type="textarea"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                placeholder="Type your message here..."
                                rows={5}
                                className="resize-none"
                            />
                        </div>

                        {/* Quick templates */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Quick Templates</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setMessage("Great work on your recent progress! Keep up the good work.")}
                                    className="text-left text-sm"
                                >
                                    Positive Feedback
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setMessage(
                                            "I've updated your training program for next week. Take a look when you have a chance.",
                                        )
                                    }
                                    className="text-left text-sm"
                                >
                                    Program Update
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setMessage(
                                            "Don't forget to log your nutrition and training data this week. It's important for tracking your progress.",
                                        )
                                    }
                                    className="text-left text-sm"
                                >
                                    Tracking Reminder
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setMessage(
                                            "Following up on our session yesterday. How are you feeling today? Any soreness or issues to report?",
                                        )
                                    }
                                    className="text-left text-sm"
                                >
                                    Session Follow-up
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="modalCancel" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="orangeFilled" leftIcon={<SendIcon size={16} />}>
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
