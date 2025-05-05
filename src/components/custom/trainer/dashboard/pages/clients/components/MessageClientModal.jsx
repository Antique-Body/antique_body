"use client";

import { useState } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

export const MessageClientModal = ({ client, onClose, onSend, isOpen }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("general");

    const handleSubmit = (e) => {
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Message ${client?.name}`}
            message="Send a message or update about training, nutrition, or progress"
            primaryButtonText="Send Message"
            primaryButtonAction={handleSubmit}
            primaryButtonDisabled={!subject || !message}
        >
            <form onSubmit={handleSubmit}>
                {/* Message type */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-300">Message Type</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div
                            onClick={() => setMessageType("general")}
                            className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                                messageType === "general"
                                    ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                                    : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                            }`}
                        >
                            General
                        </div>
                        <div
                            onClick={() => setMessageType("training")}
                            className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                                messageType === "training"
                                    ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                                    : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                            }`}
                        >
                            Training
                        </div>
                        <div
                            onClick={() => setMessageType("nutrition")}
                            className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                                messageType === "nutrition"
                                    ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                                    : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                            }`}
                        >
                            Nutrition
                        </div>
                        <div
                            onClick={() => setMessageType("progress")}
                            className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                                messageType === "progress"
                                    ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                                    : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
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
                        onChange={(e) => setSubject(e.target.value)}
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
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Type your message here..."
                        rows={5}
                        className="resize-none"
                    />
                </div>

                {/* Quick templates */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-300">Quick Templates</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                                    "I've updated your training program for next week. Take a look when you have a chance."
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
                                    "Don't forget to log your nutrition and training data this week. It's important for tracking your progress."
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
                                    "Following up on our session yesterday. How are you feeling today? Any soreness or issues to report?"
                                )
                            }
                            className="text-left text-sm"
                        >
                            Session Follow-up
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
