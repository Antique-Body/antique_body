"use client";

import { useState } from "react";

export default function MessagesPage() {
    const [newMessage, setNewMessage] = useState("");

    // Sample user data with messages
    const userData = {
        messages: [
            {
                id: 1,
                sender: "Alex Campbell",
                sender_image: "/trainers/trainer1.jpg",
                content: "Great progress this week! Let's discuss adjusting your program on our next call.",
                time: "Today, 2:30 PM",
                unread: true,
            },
            {
                id: 2,
                sender: "NutritionBot",
                sender_image: "/logo/logo-icon.png",
                content:
                    "Your nutrition log shows you're consistently under your protein goal. Consider adding protein-rich foods to your breakfast.",
                time: "Yesterday, 10:15 AM",
                unread: false,
            },
            {
                id: 3,
                sender: "Alex Campbell",
                sender_image: "/trainers/trainer1.jpg",
                content: "I've uploaded a new workout routine for next week. Check the training tab!",
                time: "Aug 15, 9:45 AM",
                unread: false,
            },
        ],
    };

    const handleSendMessage = e => {
        e.preventDefault();
        // In a real application, we would send the message to the server
        console.log("Sending message:", newMessage);
        setNewMessage("");
    };

    return (
        <div className="space-y-6">
            {/* Messages List */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-6">Messages</h2>

                <div className="space-y-4">
                    {userData.messages.map(message => (
                        <div
                            key={message.id}
                            className={`p-4 rounded-lg border ${
                                message.unread
                                    ? "bg-[rgba(255,107,0,0.05)] border-[rgba(255,107,0,0.2)]"
                                    : "bg-[rgba(30,30,30,0.5)] border-[#333]"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <img
                                    src={message.sender_image}
                                    alt={message.sender}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">{message.sender}</h3>
                                        <span className="text-xs text-gray-400">{message.time}</span>
                                    </div>
                                    <p className="text-gray-300 mt-1">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Send Message Form */}
            <form
                onSubmit={handleSendMessage}
                className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 backdrop-blur-lg border border-[#222] shadow-lg"
            >
                <h3 className="text-lg font-medium mb-4">Send Message</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows="4"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="w-full bg-[#222] border border-[#333] rounded-lg p-3 text-gray-200 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                            placeholder="Type your message here..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-lg font-medium hover:from-[#FF9A00] hover:to-[#FFB700] transition-all disabled:opacity-50"
                            disabled={!newMessage.trim()}
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
