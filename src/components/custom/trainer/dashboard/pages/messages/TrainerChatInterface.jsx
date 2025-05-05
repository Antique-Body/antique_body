import React, { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
    ConversationList,
    MessageBubble,
    ChatHeader,
    MessageInput,
    EmptyChatState,
    NoConversationSelected,
} from "@/components/custom/shared/chat/ChatComponents";
import { FormField } from "@/components/common/FormField";

// Trainer chat mock data
const trainerMockData = {
    conversations: [
        {
            id: "1",
            name: "John Andrews",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            lastMessage: "Thanks for the new program! I'll start it tomorrow.",
            lastMessageTime: "Today, 1:15 PM",
            unread: true,
            isOnline: false,
            lastActive: "30 minutes ago",
            role: "client",
            plan: "Premium",
            goalType: "Muscle Gain",
        },
        {
            id: "2",
            name: "Sarah Miller",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            lastMessage: "I've completed all my workouts this week!",
            lastMessageTime: "Yesterday",
            unread: true,
            isOnline: true,
            lastActive: "Just now",
            role: "client",
            plan: "Standard",
            goalType: "Weight Loss",
        },
        {
            id: "3",
            name: "Admin Team",
            //give me something more like admin team
            avatar: "https://ui-avatars.com/api/?name=Admin+Team&background=0D8ABC&color=fff",
            lastMessage: "We've added 3 new clients to your roster.",
            lastMessageTime: "3 days ago",
            unread: false,
            isOnline: false,
            lastActive: "1 day ago",
            role: "admin",
        },
        {
            id: "4",
            name: "Michael Thompson",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
            lastMessage: "When should I schedule my next assessment?",
            lastMessageTime: "1 week ago",
            unread: false,
            isOnline: false,
            lastActive: "3 hours ago",
            role: "client",
            plan: "Premium",
            goalType: "General Fitness",
        },
    ],
    messages: {
        1: [
            {
                id: "101",
                content: "Hi Coach! I've been reviewing the new workout program you sent.",
                time: "12:30 PM",
                isMine: false,
            },
            {
                id: "102",
                content: "Great! Let me know if you have any questions about the exercises.",
                time: "12:45 PM",
                isMine: true,
            },
            {
                id: "103",
                content: "Thanks for the new program! I'll start it tomorrow.",
                time: "1:15 PM",
                isMine: false,
            },
        ],
        2: [
            {
                id: "201",
                content: "Coach, I need to adjust my diet plan. I'm feeling too hungry in the evenings.",
                time: "3 days ago, 2:15 PM",
                isMine: false,
            },
            {
                id: "202",
                content: "We can definitely make some adjustments. Try adding more protein and healthy fats to your dinner.",
                time: "3 days ago, 3:00 PM",
                isMine: true,
            },
            {
                id: "203",
                content: "That helped a lot! Also, I've completed all my workouts this week!",
                time: "Yesterday, 7:20 PM",
                isMine: false,
            },
        ],
        3: [
            {
                id: "301",
                content: "Hello Alex, we've updated your trainer profile with your new certifications.",
                time: "Last week, 10:30 AM",
                isMine: false,
            },
            {
                id: "302",
                content: "Thanks for the update. Have there been any new client applications?",
                time: "Last week, 2:15 PM",
                isMine: true,
            },
            {
                id: "303",
                content: "Yes, we've added 3 new clients to your roster.",
                time: "3 days ago, 9:45 AM",
                isMine: false,
            },
        ],
        4: [
            {
                id: "401",
                content: "Hi Coach, I've been making good progress with the program.",
                time: "2 weeks ago, 4:30 PM",
                isMine: false,
            },
            {
                id: "402",
                content: "That's great to hear, Michael! Your consistency is paying off.",
                time: "2 weeks ago, 5:00 PM",
                isMine: true,
            },
            {
                id: "403",
                content: "When should I schedule my next assessment?",
                time: "1 week ago, 11:15 AM",
                isMine: false,
            },
        ],
    },
};

const TrainerChatInterface = ({ onSendMessage }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [reply, setReply] = useState("");
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});

    // Load mock data on component mount
    useEffect(() => {
        setConversations(trainerMockData.conversations);
        setMessages(trainerMockData.messages);
    }, []);

    // Filter conversations based on search query and filter type
    const filteredConversations = conversations.filter((conversation) => {
        const matchesSearch =
            conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filter === "all" ||
            (filter === "unread" && conversation.unread) ||
            (filter === "clients" && conversation.role === "client") ||
            (filter === "admin" && conversation.role === "admin");

        return matchesSearch && matchesFilter;
    });

    // Get the active conversation
    const activeConversation = activeConversationId ? conversations.find((conv) => conv.id === activeConversationId) : null;

    // Handle selecting a conversation
    const handleSelectConversation = (conversation) => {
        setActiveConversationId(conversation.id);

        // Mark conversation as read when selected
        if (conversation.unread) {
            setConversations((prevConversations) =>
                prevConversations.map((conv) => (conv.id === conversation.id ? { ...conv, unread: false } : conv))
            );
        }
    };

    // Handle sending a message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (reply.trim() === "" || !activeConversationId) return;

        // Create new message
        const newMessage = {
            id: `new-${Date.now()}`,
            content: reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
        };

        // Update messages state
        setMessages((prevMessages) => ({
            ...prevMessages,
            [activeConversationId]: [...(prevMessages[activeConversationId] || []), newMessage],
        }));

        // Update conversation's last message
        setConversations((prevConversations) =>
            prevConversations.map((conv) =>
                conv.id === activeConversationId
                    ? {
                          ...conv,
                          lastMessage: reply,
                          lastMessageTime: "Just now",
                      }
                    : conv
            )
        );

        // Call parent onSendMessage if provided
        if (onSendMessage) {
            onSendMessage(reply, activeConversationId);
        }

        setReply("");
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Conversations list */}
            <div className="lg:col-span-1">
                <div className="mb-4">
                    <FormField
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-0"
                    />
                </div>

                <div className="mb-4 flex">
                    <Button
                        variant={filter === "all" ? "orangeFilled" : "orangeOutline"}
                        size="small"
                        onClick={() => setFilter("all")}
                        className="flex-1 justify-center"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "unread" ? "orangeFilled" : "orangeOutline"}
                        size="small"
                        onClick={() => setFilter("unread")}
                        className="ml-2 flex-1 justify-center"
                    >
                        Unread
                    </Button>
                    <Button
                        variant={filter === "clients" ? "orangeFilled" : "orangeOutline"}
                        size="small"
                        onClick={() => setFilter("clients")}
                        className="ml-2 flex-1 justify-center"
                    >
                        Clients
                    </Button>
                </div>

                <div className="h-[500px] grow overflow-y-auto">
                    <ConversationList
                        conversations={filteredConversations}
                        selectedConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                    />
                </div>
            </div>

            {/* Chat area */}
            <div className="lg:col-span-2">
                <div className="flex h-[600px] flex-col overflow-hidden rounded-lg bg-[#0f0f0f]">
                    {activeConversation ? (
                        <>
                            <ChatHeader conversation={activeConversation} />

                            {/* Client info (only for client role) */}
                            {activeConversation.role === "client" && (
                                <div className="border-b border-[#333] bg-[#1a1a1a] p-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Plan: <span className="text-gray-200">{activeConversation.plan}</span>
                                        </span>
                                        <span className="text-gray-400">
                                            Goal: <span className="text-gray-200">{activeConversation.goalType}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Messages area */}
                            <div className="flex-grow space-y-4 overflow-y-auto p-4">
                                {messages[activeConversationId] && messages[activeConversationId].length > 0 ? (
                                    messages[activeConversationId].map((message) => (
                                        <MessageBubble key={message.id} message={message} />
                                    ))
                                ) : (
                                    <EmptyChatState message={`Start the conversation with ${activeConversation.name}`} />
                                )}
                            </div>

                            {/* Message input */}
                            <MessageInput
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onSubmit={handleSendMessage}
                                placeholder={`Message ${activeConversation.name}...`}
                            />
                        </>
                    ) : (
                        <NoConversationSelected />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerChatInterface;
