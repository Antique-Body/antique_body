import React, { useState } from "react";

export const MessagesTab = ({ userData }) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        // Here you would add the message to the conversation
        // and send it to the backend
        console.log("Sending message:", newMessage);
        setNewMessage("");
    };

    return (
        <div className="space-y-6">
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg flex flex-col h-[70vh]">
                <h2 className="text-xl font-bold mb-4">Messages with Coach {userData.coach}</h2>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {userData.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-4 rounded-lg max-w-[80%] ${
                                message.from === "You"
                                    ? "bg-[rgba(255,107,0,0.15)] ml-auto border border-[rgba(255,107,0,0.3)]"
                                    : "bg-[rgba(30,30,30,0.8)] border border-[#333]"
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-bold">{message.from}</p>
                                <p className="text-xs text-gray-400">{message.time}</p>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.unread && message.from === "Coach Alex" && (
                                <div className="mt-1 text-xs text-[#FF6B00]">New</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="mt-auto">
                    <div className="flex items-center border border-[#333] rounded-lg overflow-hidden bg-[rgba(30,30,30,0.8)]">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent p-3 outline-none text-white"
                        />
                        <button
                            type="submit"
                            className="bg-[#FF6B00] text-white p-3 min-w-16 flex items-center justify-center hover:bg-[#FF9A00] transition-colors"
                            disabled={!newMessage.trim()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
