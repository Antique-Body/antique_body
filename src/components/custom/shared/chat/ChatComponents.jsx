import Image from "next/image";
import React from "react";

import { Button } from "@/components/common/Button";
import { ChatMessageIcon } from "@/components/common/Icons";
import { FormField } from "@/components/common/FormField";

export const ConversationItem = ({ conversation, isSelected, onClick }) => (
    <div
        className={`cursor-pointer border-b border-[#333] p-4 transition-colors hover:bg-[#1a1a1a] ${
            isSelected ? "bg-[#1a1a1a]" : ""
        }`}
        onClick={() => onClick(conversation)}
    >
        <div className="flex items-center">
            <div className="relative">
                <Image
                    src={conversation.avatar || "/assets/images/default-avatar.jpg"}
                    alt={conversation.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f0f] bg-green-500"></div>
                )}
            </div>

            {/* Contact info */}
            <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-100">{conversation.name}</h3>
                    <span className="text-xs text-gray-400">{conversation.timestamp || conversation.lastMessageTime}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="max-w-[150px] truncate text-sm text-gray-400">{conversation.lastMessage}</p>
                    {conversation.unread && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
                </div>
            </div>
        </div>
    </div>
);

export const ConversationList = ({ conversations = [], selectedConversationId, onSelectConversation }) => (
    <div className="flex h-full flex-col bg-[#0f0f0f]">
        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No conversations found</div>
            ) : (
                conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedConversationId === conversation.id}
                        onClick={onSelectConversation}
                    />
                ))
            )}
        </div>
    </div>
);

export const MessageBubble = ({ message }) => (
    <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
        <div
            className={`max-w-[80%] rounded-lg p-3 ${
                message.isMine ? "rounded-tr-none bg-orange-900/20 text-white" : "rounded-tl-none bg-[#222] text-white"
            }`}
        >
            <p>{message.content}</p>
            <div className={`mt-1 text-xs ${message.isMine ? "text-orange-300/70" : "text-gray-400"}`}>{message.time}</div>
        </div>
    </div>
);

export const ChatHeader = ({ conversation }) => (
    <div className="flex items-center border-b border-[#333] p-4">
        <div className="relative mr-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-[#333]">
                <Image
                    src={conversation.avatar || "/assets/images/default-avatar.jpg"}
                    alt={conversation.name}
                    width={40}
                    height={40}
                    className="object-cover"
                />
            </div>
            {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-[#0a0a0a] bg-green-400"></div>
            )}
        </div>
        <div>
            <h3 className="font-medium">{conversation.name}</h3>
            <p className="text-xs text-gray-400">
                {conversation.isOnline
                    ? "Online"
                    : "Last seen " + (conversation.lastSeen || conversation.lastActive || "recently")}
            </p>
        </div>
    </div>
);

export const MessageInput = ({ value, onChange, onSubmit, placeholder }) => (
    <form onSubmit={onSubmit} className="border-t border-[#333] p-4">
        <div className="flex items-end gap-2">
            <div className="flex-grow">
                <FormField type="text" placeholder={placeholder} value={value} onChange={onChange} background="dark" />
            </div>
            <Button type="submit" variant="orangeFilled" size="default" disabled={value.trim() === ""}>
                Send
            </Button>
        </div>
    </form>
);

export const EmptyChatState = ({ message }) => <div className="py-8 text-center text-gray-400">{message}</div>;

export const NoConversationSelected = () => (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
            <ChatMessageIcon className="text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No Conversation Selected</h3>
        <p className="max-w-md text-gray-400">Select a conversation from the list or start a new message to begin chatting.</p>
    </div>
);
