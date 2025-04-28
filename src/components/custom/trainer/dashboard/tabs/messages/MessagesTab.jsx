import React from "react";

export const MessagesTab = ({ messages, handleViewClient }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:-translate-y-1 ${
                            message.unread ? "border-[#FF6B00]" : ""
                        }`}
                    >
                        <h3 className="text-lg font-bold">{message.from}</h3>
                        <p className="text-gray-400 text-sm mb-1">{message.time}</p>
                        <p className="text-gray-300 text-sm">{message.content}</p>
                        <button
                            className="mt-2 bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00]"
                            onClick={() => handleViewClient(message)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
