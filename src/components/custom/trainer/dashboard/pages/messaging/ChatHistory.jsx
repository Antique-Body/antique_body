import { Button } from "@/components/common/Button";
import { MessageIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared/FormField";
import React from "react";

export const ChatHistory = ({ conversation, messages }) => {
    const [reply, setReply] = React.useState("");

    if (!conversation) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mb-4">
                    <MessageIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
                <p className="text-gray-400 max-w-md">
                    Select a conversation from the list or start a new message to begin chatting.
                </p>
            </div>
        );
    }

    const handleSendMessage = e => {
        e.preventDefault();
        if (reply.trim() === "") return;
        // Send message logic would go here
        setReply("");
    };

    return (
        <div className="h-full flex flex-col">
            {/* Chat header */}
            <div className="flex items-center p-4 border-b border-[#333]">
                <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-[#333] overflow-hidden">
                        <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                    </div>
                    {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-[#0a0a0a]"></div>
                    )}
                </div>
                <div>
                    <h3 className="font-medium">{conversation.name}</h3>
                    <p className="text-xs text-gray-400">
                        {conversation.isOnline ? "Online" : "Last seen " + conversation.lastSeen}
                    </p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map(message => (
                        <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.isMine
                                        ? "bg-orange-900/20 text-white rounded-tr-none"
                                        : "bg-[#222] text-white rounded-tl-none"
                                }`}
                            >
                                <p>{message.content}</p>
                                <div className={`text-xs mt-1 ${message.isMine ? "text-orange-300/70" : "text-gray-400"}`}>
                                    {message.time}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">Start the conversation with {conversation.name}</div>
                )}
            </div>

            {/* Reply form */}
            <form onSubmit={handleSendMessage} className="border-t border-[#333] p-4">
                <div className="flex items-end gap-2">
                    <div className="flex-grow">
                        <FormField
                            type="text"
                            placeholder={`Message ${conversation.name}...`}
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            background="dark"
                        />
                    </div>
                    <Button type="submit" variant="orangeFilled" size="default" disabled={reply.trim() === ""}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
};
