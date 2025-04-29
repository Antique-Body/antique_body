"use client";
import { useState } from "react";

const MessagesPage = () => {
    // Sample data
    const messages = [
        {
            id: 1,
            from: "John Doe",
            clientId: 1,
            content: "Hi Alex, can we move Saturday's session to 11am instead of 10am?",
            time: "Today, 10:23",
            unread: true,
        },
        {
            id: 2,
            from: "Sarah Williams",
            clientId: 2,
            content: "My knee felt much better after our last session! The exercises are helping.",
            time: "Yesterday, 15:42",
            unread: true,
        },
        {
            id: 3,
            from: "Mike Chen",
            clientId: 3,
            content: "I've updated my food diary for the week. Can you check it before our next session?",
            time: "Apr 5, 14:30",
            unread: false,
        },
    ];

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");

    const handleSelectMessage = message => {
        setSelectedMessage(message);
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;

        // In a real app, this would send the message to an API
        alert(`Reply sent to ${selectedMessage.from}: ${replyText}`);
        setReplyText("");
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Messages</h2>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Message list */}
                <div className="lg:w-2/5">
                    <div className="space-y-3">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                onClick={() => handleSelectMessage(message)}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                                    selectedMessage && selectedMessage.id === message.id
                                        ? "bg-[rgba(255,107,0,0.2)] border border-[#FF6B00]"
                                        : "bg-[rgba(30,30,30,0.8)] border border-[#333] hover:border-[#FF6B00]/50"
                                } ${message.unread ? "relative" : ""}`}
                            >
                                {message.unread && (
                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                                )}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium">{message.from}</h3>
                                    <span className="text-xs text-gray-400">{message.time}</span>
                                </div>
                                <p className="text-sm mt-1 text-gray-300 line-clamp-2">{message.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message detail */}
                <div className="lg:w-3/5 bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg p-4 h-[500px] flex flex-col">
                    {selectedMessage ? (
                        <>
                            <div className="border-b border-[#333] pb-3 mb-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">{selectedMessage.from}</h3>
                                    <span className="text-xs text-gray-400">{selectedMessage.time}</span>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto mb-4">
                                <div className="bg-[rgba(40,40,40,0.7)] p-3 rounded-lg inline-block max-w-[80%]">
                                    <p>{selectedMessage.content}</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder="Type your reply..."
                                        className="flex-grow bg-[rgba(40,40,40,0.7)] border border-[#444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!replyText.trim()}
                                        className="bg-[#FF6B00] text-white p-2 rounded-lg transition-all duration-300 hover:bg-[#FF9A00] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">Select a message to view</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
