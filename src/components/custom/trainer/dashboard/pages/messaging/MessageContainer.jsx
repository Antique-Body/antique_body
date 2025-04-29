import { useState } from "react";
import { ChatHistory } from "./ChatHistory";
import { ConversationList } from "./ConversationList";
// Mock data for demonstration
const mockConversations = [
    {
        id: "1",
        name: "John Smith",
        avatar: "/assets/images/avatar-1.jpg",
        lastMessage: "Looking forward to our next session!",
        timestamp: "10:42 AM",
        isUnread: true,
        isOnline: true,
        lastSeen: "2 hours ago",
    },
    {
        id: "2",
        name: "Sarah Johnson",
        avatar: "/assets/images/avatar-2.jpg",
        lastMessage: "Thank you for the nutrition plan",
        timestamp: "Yesterday",
        isUnread: false,
        isOnline: false,
        lastSeen: "5 hours ago",
    },
    {
        id: "3",
        name: "Michael Thompson",
        avatar: "/assets/images/avatar-3.jpg",
        lastMessage: "Can we reschedule Thursday's appointment?",
        timestamp: "Monday",
        isUnread: true,
        isOnline: true,
        lastSeen: "1 hour ago",
    },
];

const mockMessages = [
    {
        id: "101",
        content: "Hey, how are you feeling after your last workout?",
        time: "10:30 AM",
        isMine: false,
    },
    {
        id: "102",
        content: "I'm feeling great! The new routine is really helping with my shoulder mobility.",
        time: "10:35 AM",
        isMine: true,
    },
    {
        id: "103",
        content: "That's fantastic to hear! Do you want to continue with the same intensity next week?",
        time: "10:40 AM",
        isMine: false,
    },
    {
        id: "104",
        content: "Yes, I think I'm ready. Looking forward to our next session!",
        time: "10:42 AM",
        isMine: true,
    },
];

export const MessageContainer = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = mockConversations.filter(conversation =>
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSelectConversation = conversation => {
        setSelectedConversation(conversation);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#333]">
            {/* Conversation sidebar */}
            <div className="w-1/3 border-r border-[#333]">
                <ConversationList
                    conversations={filteredConversations}
                    selectedConversationId={selectedConversation?.id}
                    onSelectConversation={handleSelectConversation}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            {/* Chat view */}
            <div className="w-2/3">
                <ChatHistory conversation={selectedConversation} messages={mockMessages} />
            </div>
        </div>
    );
};
