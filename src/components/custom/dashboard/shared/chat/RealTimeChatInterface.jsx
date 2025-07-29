"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { MessageIcon } from "@/components/common/Icons";
import { useChat, useConversations } from "@/hooks/useChat";
import { useGlobalPresence, useChatPresence } from "@/hooks/usePresence";
import { isValidChatId } from "@/utils/chatUtils";

import { TypingIndicator } from "./TypingIndicator";

const ConversationItem = ({ conversation, isSelected, _onClick, isOnline }) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const handleClick = () => {
    // Navigate to the conversation page
    const userRole = session?.user?.role || 'client';
    const basePath = userRole === 'trainer' ? '/trainer/dashboard/messages' : '/client/dashboard/messages';
    router.push(`${basePath}/${conversation.id}`);
  };

  return (
    <div
      className={`cursor-pointer border-b border-[#333] p-4 transition-colors hover:bg-[#1a1a1a] ${
        isSelected ? "bg-[#1a1a1a]" : ""
      }`}
      onClick={handleClick}
    >
    <div className="flex items-center">
      {/* Avatar with online indicator */}
      <div className="relative">
        <Image
          src={conversation.avatar || "/assets/images/default-avatar.jpg"}
          alt={conversation.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f0f] bg-green-500"></div>
        )}
        {conversation.isNewChat && (
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        )}
      </div>

      {/* Contact info */}
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-100">{conversation.name}</h3>
          <span className="text-xs text-gray-400">
            {conversation.lastMessageAt
              ? new Date(conversation.lastMessageAt).toLocaleDateString()
              : conversation.isNewChat ? "New" : ""}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="max-w-[150px] truncate text-sm text-gray-400">
            {conversation.isNewChat 
              ? "Start conversation" 
              : "Chat active"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

const MessageBubble = ({ message }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 break-words overflow-hidden ${
          message.isMine
            ? "rounded-tr-none bg-orange-900/20 text-white"
            : "rounded-tl-none bg-[#222] text-white"
        }`}
      >
        {message.messageType === "text" && (
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        )}
        {message.messageType === "file" && (
          <div className="break-words">
            <p className="mb-2 break-words whitespace-pre-wrap">{message.content}</p>
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all"
            >
              {message.fileName}
            </a>
          </div>
        )}
        <div
          className={`mt-1 flex items-center justify-between text-xs ${
            message.isMine ? "text-orange-300/70" : "text-gray-400"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {message.isMine && (
            <span className="ml-2">
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatHistory = ({ conversation, onClose, onRefreshConversations = null, isOnline }) => {
  const { data: session } = useSession();
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);
  
  const {
    messages,
    loading,
    error,
    sending,
    fetchMessages,
    sendMessage,
    markAsRead,
  } = useChat(conversation?.id);

  const {
    isOtherUserTyping,
    typingUserNames,
    setTypingStatus,
  } = useChatPresence(conversation?.id);

  useEffect(() => {
    if (conversation && !conversation.isNewChat) {
      fetchMessages();
      markAsRead();
    }
  }, [conversation, fetchMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (reply.trim() === "" || sending) return;

    try {
      if (conversation.isNewChat) {
        // For new chats, we need to send message and then refresh conversations
        // The API will automatically create the conversation when first message is sent
        const response = await fetch(`/api/messages/direct/${conversation.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: reply.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        await response.json();
        setReply("");
        
                 // Update the conversation to mark it as no longer new
         // and trigger a refresh of the conversation list
         if (onRefreshConversations) {
           onRefreshConversations();
         }
      } else {
        await sendMessage(reply);
        setReply("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
          <MessageIcon size={32} className="text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No Conversation Selected</h3>
        <p className="max-w-md text-gray-400">
          Select a conversation from the list to start chatting with your{" "}
          {session?.user?.role === "trainer" ? "client" : "coach"}.
        </p>
      </div>
    );
  }



  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center border-b border-[#333] p-4">
        <button
          onClick={onClose}
          className="mr-3 rounded p-1 hover:bg-[#333] lg:hidden"
        >
          ←
        </button>
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
                  {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-[#0a0a0a] bg-green-400"></div>
        )}
        </div>
        <div>
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow space-y-4 overflow-y-auto p-4">
        {conversation.isNewChat ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <MessageIcon size={32} className="text-green-400" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-100">
              Start a conversation with {conversation.name}
            </h3>
            <p className="max-w-md text-gray-400">
              This is the beginning of your conversation. Send a message below to get started!
            </p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="py-8 text-center text-gray-400">Loading messages...</div>
            )}
            
            {error && (
              <div className="py-8 text-center text-red-400">
                Error: {error}
              </div>
            )}

            {!loading && !error && messages.length === 0 && (
              <div className="py-8 text-center text-gray-400">
                Start the conversation with {conversation.name}
              </div>
            )}

            {!loading && !error && messages.length > 0 && (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                <TypingIndicator 
                  isTyping={isOtherUserTyping} 
                  userName={typingUserNames} 
                />
                
                <div ref={messagesEndRef} />
              </>
            )}
          </>
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
              onChange={(e) => {
                setReply(e.target.value);
                
                // Handle typing indicator
                if (e.target.value.trim()) {
                  setTypingStatus(true);
                } else {
                  setTypingStatus(false);
                }
              }}
              onFocus={() => setTypingStatus(true)}
              onBlur={() => setTypingStatus(false)}
              background="dark"
              disabled={sending}
            />
          </div>
          <Button
            type="submit"
            variant="orangeFilled"
            size="default"
            disabled={reply.trim() === "" || sending}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const RealTimeChatInterface = ({ conversationId }) => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [invalidChatId, setInvalidChatId] = useState(false);
  const [validatedChatIds, setValidatedChatIds] = useState(new Set()); // Cache validated chat IDs
  const [sessionStorageProcessed, setSessionStorageProcessed] = useState(false);



  const { conversations, loading, error, fetchConversations } = useConversations();
  const { isUserOnline } = useGlobalPresence();

  useEffect(() => {
    fetchConversations();
    
    // Cleanup function to clear validation cache when component unmounts
    return () => {
      setValidatedChatIds(new Set());
    };
  }, [fetchConversations]);

  // If conversationId is provided, find and set that conversation
  useEffect(() => {
    const handleConversationId = async () => {
      if (conversationId) {
        // Validate chat ID format
        if (!isValidChatId(conversationId)) {
          setInvalidChatId(true);
          setActiveConversation(null);
          setShowMobileChat(false);
          return;
        }
        
        setInvalidChatId(false);
        
        // Only check for existing conversation if conversations are loaded
        const conversation = conversations.length > 0 ? conversations.find(conv => conv.id === conversationId) : null;
        if (conversation) {
          // Existing conversation found - no validation needed
          setActiveConversation(conversation);
          setShowMobileChat(true);
        } else {
          // Conversations are loaded but this one doesn't exist, or conversations not loaded yet
          // Try session storage for new conversation
          let participantName = "New Conversation";
          let participantAvatar = null;
          
          // Try to get participant info from session storage first (only if not already processed)
          let participantInfoFound = false;
          if (!sessionStorageProcessed) {
            try {
              const tempConversationData = sessionStorage.getItem('tempConversation');
              if (tempConversationData) {
                const participantInfo = JSON.parse(tempConversationData);
                
                // Verify this is for the current chat ID and not expired (5 minutes)
                const isExpired = Date.now() - participantInfo.timestamp > 5 * 60 * 1000;
                const isForCurrentChat = participantInfo.chatId === conversationId;
                
                if (!isExpired && isForCurrentChat) {
                  participantName = participantInfo.name || "New Conversation";
                  participantAvatar = participantInfo.avatar || null;
                  participantInfoFound = true;
                  
                  // Clear the session storage after using it
                  sessionStorage.removeItem('tempConversation');
                  // Mark as processed to prevent future accesses
                  setSessionStorageProcessed(true);
                }
              }
            } catch (error) {
              console.error("Error parsing participant info from session storage:", error);
            }
          }

          // Only do server validation if session storage didn't work and we haven't validated this chat ID
          if (!participantInfoFound && !validatedChatIds.has(conversationId)) {
            try {
              const response = await fetch('/api/messages/validate-chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId: conversationId }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.hasAccess && data.participantInfo) {
                  participantName = data.participantInfo.name;
                  participantAvatar = data.participantInfo.avatar;
                  participantInfoFound = true;
                  
                  // Cache this validation result
                  setValidatedChatIds(prev => new Set([...prev, conversationId]));
                }
              }
            } catch (error) {
              console.error("Error validating chat access:", error);
            }
          }
          
          // Only allow creating temp conversations if participant info is provided
          if (participantName !== "New Conversation") {
            const tempConversation = {
              id: conversationId,
              participantId: null,
              name: participantName,
              avatar: participantAvatar,
              lastMessageAt: null,
              unreadCount: 0,
              isNewChat: true,
            };
            setActiveConversation(tempConversation);
            setShowMobileChat(true);
          } else {
            setInvalidChatId(true);
            setActiveConversation(null);
            setShowMobileChat(false);
          }
        }
      }
    };

    // Reset session storage processed flag when conversation ID changes
    setSessionStorageProcessed(false);
    handleConversationId();
  }, [conversationId, validatedChatIds]);

  // Handle when conversations are loaded and we have a conversation ID
  useEffect(() => {
    if (conversationId && conversations.length > 0 && !activeConversation) {
      const existingConversation = conversations.find(conv => conv.id === conversationId);
      if (existingConversation) {
        setActiveConversation(existingConversation);
        setShowMobileChat(true);
        setInvalidChatId(false);
      }
    }
  }, [conversations, conversationId, activeConversation]);

  const handleRefreshConversations = () => {
    fetchConversations();
    setActiveConversation(null);
    setShowMobileChat(false);
    setValidatedChatIds(new Set()); // Clear validation cache on refresh
  };

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conversation.unreadCount > 0) ||
      (filter === "active" && !conversation.isNewChat);

    return matchesSearch && matchesFilter;
  });

  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setShowMobileChat(true);
  };

  const handleCloseMobileChat = () => {
    setShowMobileChat(false);
    setActiveConversation(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Conversations list */}
      <div className={`lg:col-span-1 ${showMobileChat ? "hidden lg:block" : ""}`}>
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
            variant={filter === "active" ? "orangeFilled" : "orangeOutline"}
            size="small"
            onClick={() => setFilter("active")}
            className="ml-2 flex-1 justify-center"
          >
            Active
          </Button>
        </div>

        <div className="h-[500px] grow overflow-y-auto rounded-lg bg-[#0f0f0f]">
          {loading && (
            <div className="p-4 text-center text-gray-400">Loading conversations...</div>
          )}
          
          {error && (
            <div className="p-4 text-center text-red-400">Error: {error}</div>
          )}

          {invalidChatId && (
            <div className="p-4 text-center text-red-400">
              Invalid conversation ID. Please use a valid conversation link.
            </div>
          )}

          {!loading && !error && !invalidChatId && filteredConversations.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              {conversations.length === 0 
                ? "No conversations found. Accept a coaching request to start chatting."
                : "No conversations match your filters."}
            </div>
          )}

          {!loading && !error && filteredConversations.length > 0 && (
            <>
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={activeConversation?.id === conversation.id}
                  onClick={handleSelectConversation}
                  isOnline={isUserOnline(conversation.participantId)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`lg:col-span-2 ${!showMobileChat ? "hidden lg:block" : ""}`}>
        <div className="h-[600px] overflow-hidden rounded-lg bg-[#0f0f0f]">
          <ChatHistory
            conversation={activeConversation}
            onClose={handleCloseMobileChat}
            onRefreshConversations={handleRefreshConversations}
            isOnline={activeConversation ? isUserOnline(activeConversation.participantId) : false}
          />
        </div>
      </div>
    </div>
  );
}; 