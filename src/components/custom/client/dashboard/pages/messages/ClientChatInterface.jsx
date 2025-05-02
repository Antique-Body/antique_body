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
import { FormField } from "@/components/shared/FormField";

// Client chat mock data
const clientMockData = {
  conversations: [
    {
      id: "1",
      name: "Coach Alex Campbell",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Remember to track your measurements this week!",
      lastMessageTime: "Today, 10:45 AM",
      unread: true,
      isOnline: true,
      lastActive: "Just now",
      role: "trainer",
    },
    {
      id: "2",
      name: "NutritionBot",
      avatar: "https://ui-avatars.com/api/?name=NutritionBot&background=0D8ABC&color=fff",
      lastMessage: "I've analyzed your nutrition logs. You're making great progress!",
      lastMessageTime: "Yesterday",
      unread: false,
      isOnline: true,
      lastActive: "Always online",
      role: "bot",
    },
    {
      id: "3",
      name: "Support Team",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      lastMessage: "Let us know if you have any questions about your subscription.",
      lastMessageTime: "2 days ago",
      unread: false,
      isOnline: false,
      lastActive: "1 day ago",
      role: "support",
    },
  ],
  messages: {
    1: [
      {
        id: "101",
        content: "Good morning! How did yesterday's workout go?",
        time: "9:30 AM",
        isMine: false,
      },
      {
        id: "102",
        content: "It was great! I managed to increase my weights on all exercises.",
        time: "9:45 AM",
        isMine: true,
      },
      {
        id: "103",
        content: "Excellent progress! Remember to track your measurements this week!",
        time: "10:45 AM",
        isMine: false,
      },
    ],
    2: [
      {
        id: "201",
        content: "Hello! I noticed you've consistently hit your protein targets this week.",
        time: "Yesterday, 3:15 PM",
        isMine: false,
      },
      {
        id: "202",
        content: "Thanks! I've been focusing on adding more protein to each meal.",
        time: "Yesterday, 4:20 PM",
        isMine: true,
      },
      {
        id: "203",
        content: "I've analyzed your nutrition logs. You're making great progress!",
        time: "Yesterday, 5:45 PM",
        isMine: false,
      },
    ],
    3: [
      {
        id: "301",
        content: "Welcome to Antique Body! How can we help you today?",
        time: "3 days ago, 11:20 AM",
        isMine: false,
      },
      {
        id: "302",
        content: "I have a question about my subscription plan.",
        time: "3 days ago, 11:35 AM",
        isMine: true,
      },
      {
        id: "303",
        content: "Of course! What would you like to know?",
        time: "3 days ago, 11:40 AM",
        isMine: false,
      },
      {
        id: "304",
        content: "When does my current plan expire?",
        time: "3 days ago, 11:45 AM",
        isMine: true,
      },
      {
        id: "305",
        content:
          "Your current plan expires on November 15, 2023. Let us know if you have any questions about your subscription.",
        time: "2 days ago, 9:15 AM",
        isMine: false,
      },
    ],
  },
};

const ClientChatInterface = ({ onSendMessage }) => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [reply, setReply] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});

  // Load mock data on component mount
  useEffect(() => {
    setConversations(clientMockData.conversations);
    setMessages(clientMockData.messages);
  }, []);

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conversation.unread) ||
      (filter === "trainers" && conversation.role === "trainer") ||
      (filter === "support" && conversation.role === "support");

    return matchesSearch && matchesFilter;
  });

  // Get the active conversation
  const activeConversation = activeConversationId ? conversations.find(conv => conv.id === activeConversationId) : null;

  // Handle selecting a conversation
  const handleSelectConversation = conversation => {
    setActiveConversationId(conversation.id);

    // Mark conversation as read when selected
    if (conversation.unread) {
      setConversations(prevConversations =>
        prevConversations.map(conv => (conv.id === conversation.id ? { ...conv, unread: false } : conv)),
      );
    }
  };

  // Handle sending a message
  const handleSendMessage = e => {
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
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeConversationId]: [...(prevMessages[activeConversationId] || []), newMessage],
    }));

    // Update conversation's last message
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              lastMessage: reply,
              lastMessageTime: "Just now",
            }
          : conv,
      ),
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
          <Button
            variant={filter === "trainers" ? "orangeFilled" : "orangeOutline"}
            size="small"
            onClick={() => setFilter("trainers")}
            className="ml-2 flex-1 justify-center"
          >
            Trainers
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

              {/* Messages area */}
              <div className="flex-grow space-y-4 overflow-y-auto p-4">
                {messages[activeConversationId] && messages[activeConversationId].length > 0 ? (
                  messages[activeConversationId].map(message => <MessageBubble key={message.id} message={message} />)
                ) : (
                  <EmptyChatState message={`Start the conversation with ${activeConversation.name}`} />
                )}
              </div>

              {/* Message input */}
              <MessageInput
                value={reply}
                onChange={e => setReply(e.target.value)}
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

export default ClientChatInterface;
