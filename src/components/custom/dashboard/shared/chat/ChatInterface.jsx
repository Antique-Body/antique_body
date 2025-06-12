import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { MessageIcon } from "@/components/common/Icons";

export const ConversationList = ({
  conversations = [],
  selectedConversationId,
  onSelectConversation,
}) => (
  <div className="flex h-full flex-col bg-[#0f0f0f]">
    {/* Conversations list */}
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          No conversations found
        </div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`cursor-pointer border-b border-[#333] p-4 transition-colors hover:bg-[#1a1a1a] ${
              selectedConversationId === conversation.id ? "bg-[#1a1a1a]" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-center">
              {/* Avatar with online indicator */}
              <div className="relative">
                <Image
                  src={
                    conversation.avatar || "/assets/images/default-avatar.jpg"
                  }
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
                  <h3 className="font-medium text-gray-100">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {conversation.timestamp || conversation.lastMessageTime}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="max-w-[150px] truncate text-sm text-gray-400">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export const ChatHistory = ({ conversation, messages = [] }) => {
  const [reply, setReply] = useState("");

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
          <MessageIcon size={32} className="text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No Conversation Selected</h3>
        <p className="max-w-md text-gray-400">
          Select a conversation from the list or start a new message to begin
          chatting.
        </p>
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (reply.trim() === "") return;
    setReply("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
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
              : "Last seen " +
                (conversation.lastSeen ||
                  conversation.lastActive ||
                  "recently")}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow space-y-4 overflow-y-auto p-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isMine
                    ? "rounded-tr-none bg-orange-900/20 text-white"
                    : "rounded-tl-none bg-[#222] text-white"
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`mt-1 text-xs ${
                    message.isMine ? "text-orange-300/70" : "text-gray-400"
                  }`}
                >
                  {message.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">
            Start the conversation with {conversation.name}
          </div>
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
              onChange={(e) => setReply(e.target.value)}
              background="dark"
            />
          </div>
          <Button
            type="submit"
            variant="orangeFilled"
            size="default"
            disabled={reply.trim() === ""}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});

  // Sample data - in real app, fetch from API
  useEffect(() => {
    // Simulate API fetch
    setConversations([
      {
        id: "1",
        name: "Alex Campbell",
        avatar: "/trainers/trainer1.jpg",
        lastMessage:
          "Great progress this week! Let's discuss adjusting your program.",
        lastMessageTime: "Today, 2:30 PM",
        unread: true,
        isOnline: true,
        lastActive: "Just now",
      },
      {
        id: "2",
        name: "NutritionBot",
        avatar: "/logo/logo-icon.png",
        lastMessage:
          "Your nutrition log shows you're consistently under your protein goal.",
        lastMessageTime: "Yesterday",
        unread: false,
        isOnline: false,
        lastActive: "5 hours ago",
      },
    ]);

    setMessages({
      1: [
        {
          id: "101",
          content:
            "Great progress this week! Let's discuss adjusting your program on our next call.",
          time: "2:30 PM",
          isMine: false,
        },
        {
          id: "102",
          content: "Thanks! I'm feeling much stronger already.",
          time: "2:35 PM",
          isMine: true,
        },
      ],
      2: [
        {
          id: "201",
          content:
            "Your nutrition log shows you're consistently under your protein goal. Consider adding protein-rich foods to your breakfast.",
          time: "10:15 AM",
          isMine: false,
        },
      ],
    });
  }, []);

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "unread" && conversation.unread);
    return matchesSearch && matchesFilter;
  });

  // Get the active conversation
  const activeConversation = activeConversationId
    ? conversations.find((conv) => conv.id === activeConversationId)
    : null;

  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversationId(conversation.id);
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
        </div>

        <div className="h-[500px] grow overflow-y-auto">
          <ConversationList
            conversations={filteredConversations}
            selectedConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="lg:col-span-2">
        <div className="h-[600px]">
          <ChatHistory
            conversation={activeConversation}
            messages={
              activeConversationId ? messages[activeConversationId] || [] : []
            }
          />
        </div>
      </div>
    </div>
  );
};
