"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { ChevronDownIcon, MessageIcon, PlusIcon, SendIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { BackgroundShapes } from "@/components/custom/shared";
import { ChatHistory, ConversationList } from "@/components/custom/trainer/dashboard/pages/messaging";
import { FormField } from "@/components/shared/FormField";

// Sample conversation data
const sampleConversations = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/assets/images/avatar-1.jpg",
    lastMessage: "Looking forward to our next session!",
    lastMessageTime: "10:42 AM",
    unread: true,
    isOnline: true,
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Sarah Williams",
    avatar: "/assets/images/avatar-2.jpg",
    lastMessage: "My knee felt much better after our last session!",
    lastMessageTime: "Yesterday",
    unread: true,
    isOnline: false,
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "/assets/images/avatar-3.jpg",
    lastMessage: "I've updated my food diary for the week.",
    lastMessageTime: "Apr 5",
    unread: false,
    isOnline: false,
    lastActive: "5 hours ago",
  },
];

// Sample messages for a conversation
const sampleMessages = {
  1: [
    {
      id: "101",
      content: "Hi Coach, I wanted to ask about Saturday's session.",
      time: "10:30 AM",
      isMine: false,
    },
    {
      id: "102",
      content: "Of course, what would you like to know?",
      time: "10:32 AM",
      isMine: true,
    },
    {
      id: "103",
      content: "Can we move it to 11am instead of 10am?",
      time: "10:35 AM",
      isMine: false,
    },
    {
      id: "104",
      content: "Yes, that works for me. I'll update the schedule.",
      time: "10:38 AM",
      isMine: true,
    },
    {
      id: "105",
      content: "Great! Looking forward to our next session!",
      time: "10:42 AM",
      isMine: false,
    },
  ],
};

const MessagesPage = () => {
  // States for the messaging interface
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  // Filter conversations based on search query and filter type
  const filteredConversations = sampleConversations.filter(conversation => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "unread" && conversation.unread);
    return matchesSearch && matchesFilter;
  });

  // Get the active conversation
  const activeConversation = activeConversationId
    ? sampleConversations.find(conv => conv.id === activeConversationId)
    : null;

  // Handle sending a new message
  const handleSendMessage = e => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeConversation) return;

    // In a real app, this would send the message to an API
    setNewMessage("");
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Background shapes */}
      <BackgroundShapes />

      <div className="container relative z-10 mx-auto px-4 pb-10 pt-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="orangeFilled" leftIcon={<PlusIcon size={16} />}>
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Conversations list */}
          <div className="lg:col-span-1">
            <Card
              variant="darkStrong"
              width="100%"
              maxWidth="none"
              className="flex h-full max-h-[calc(100vh-150px)] flex-col"
            >
              <div className="mb-4">
                <FormField
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
              </div>

              <div className="grow overflow-y-auto">
                <ConversationList
                  conversations={filteredConversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={setActiveConversationId}
                />
              </div>
            </Card>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2">
            <Card
              variant="darkStrong"
              hover={activeConversationId ? true : false}
              width="100%"
              maxWidth="none"
              className="flex h-full max-h-[calc(100vh-150px)] flex-col"
              padding="0px"
            >
              {activeConversationId ? (
                <>
                  {/* Chat header */}
                  <div className="flex items-center justify-between border-b border-[#333] p-4">
                    <div className="flex items-center">
                      <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#333]">
                        {activeConversation?.avatar ? (
                          <Image
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-600 font-medium text-white">
                            {activeConversation?.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{activeConversation?.name}</div>
                        <div className="text-xs text-gray-400">
                          {activeConversation?.isOnline ? (
                            <span className="flex items-center text-green-400">
                              <span className="mr-1 h-2 w-2 rounded-full bg-green-400"></span> Online
                            </span>
                          ) : (
                            <span>Last active {activeConversation?.lastActive}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <Button variant="subtle" size="small" leftIcon={<MessageIcon size={16} />}>
                        Call
                      </Button>
                      <Button variant="subtle" size="small" className="ml-2" leftIcon={<ChevronDownIcon size={16} />}>
                        More
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto p-4" ref={chatContainerRef}>
                    <ChatHistory
                      messages={sampleMessages[activeConversationId] || []}
                      conversation={activeConversation}
                    />
                  </div>

                  {/* Message input */}
                  <div className="border-t border-[#333] p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <FormField
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="mb-0 flex-grow"
                      />
                      <Button type="submit" variant="orangeFilled" className="ml-2" leftIcon={<SendIcon size={16} />}>
                        Send
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                // Empty state
                <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
                    <MessageIcon size={24} stroke="#FF6B00" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No conversation selected</h3>
                  <p className="mb-6 max-w-md text-gray-400">
                    Select a conversation from the list or start a new one to begin messaging.
                  </p>
                  <Button variant="orangeFilled">Start New Conversation</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
