"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { MessageIcon } from "@/components/common/Icons";
import { useChat, useConversations } from "@/hooks/useChat";
import { useChatBlock } from "@/hooks/useChatBlock";
import { useGlobalPresence, useChatPresence } from "@/hooks/usePresence";
import { isValidChatId } from "@/utils/chatUtils";

// Avatar component with fallback
const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClass} ${className} rounded-full bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8] flex items-center justify-center font-semibold text-white`}
      >
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={parseInt(sizeClass.split(" ")[0].replace("h-", "")) * 4}
      height={parseInt(sizeClass.split(" ")[0].replace("h-", "")) * 4}
      className={`${sizeClass} ${className} rounded-full object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

import { TypingIndicator } from "./TypingIndicator";

const ConversationItem = ({ conversation, isSelected, onClick, isOnline }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(conversation);
    }
  };

  return (
    <div
      className={`cursor-pointer border-b border-[#333] p-4 transition-colors hover:bg-[#1a1a1a] ${
        isSelected ? "bg-[#1a1a1a]" : ""
      }`}
      onClick={() => onClick?.(conversation)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center">
        {/* Avatar with online indicator */}
        <div className="relative">
          <Avatar src={conversation.avatar} alt={conversation.name} size="lg" />
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
                : conversation.isNewChat
                  ? "New"
                  : ""}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="max-w-[150px] truncate text-sm text-gray-400">
              {conversation.isBlocked
                ? "Blocked chat"
                : conversation.isNewChat
                  ? "Start conversation"
                  : "Chat active"}
            </p>
            <div className="flex items-center gap-2">
              {conversation.isBlocked && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Blocked</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                    />
                  </svg>
                </span>
              )}
              {conversation.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {conversation.unreadCount > 9
                    ? "9+"
                    : conversation.unreadCount}
                </span>
              )}
            </div>
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
            <p className="mb-2 break-words whitespace-pre-wrap">
              {message.content}
            </p>
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
            <span className="ml-2">{message.isRead ? "✓✓" : "✓"}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatHistory = ({
  conversation,
  onClose,
  onRefreshConversations = null,
  isOnline,
  onDeleteChat,
  onUpdateConversation = null,
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Determine if user is trainer based on current path (fallback if session role is not available)
  const isTrainer =
    pathname?.includes("/trainer/") || session?.user?.role === "trainer";
  const [reply, setReply] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const messagesEndRef = useRef(null);
  const {
    blockChat,
    unblockChat,
    checkChatBlockedStatus,
    loading: blockLoading,
  } = useChatBlock();

  const {
    messages,
    loading,
    error,
    sending,
    fetchMessages,
    sendMessage,
    markAsRead,
    deleteChat,
  } = useChat(conversation?.id);

  const { isOtherUserTyping, typingUserNames, setTypingStatus } =
    useChatPresence(conversation?.id);

  useEffect(() => {
    if (conversation && !conversation.isNewChat) {
      fetchMessages();
      markAsRead();
    }
  }, [conversation, fetchMessages, markAsRead]);

  // Check if chat is blocked
  useEffect(() => {
    if (conversation) {
      // First check if the conversation already has blocked status
      if (conversation.hasOwnProperty("isBlocked")) {
        setIsBlocked(conversation.isBlocked);
      } else if (!conversation.isNewChat && isTrainer) {
        // Fall back to API check for older conversations
        const checkBlockedStatus = async () => {
          try {
            const result = await checkChatBlockedStatus(
              conversation.participantId,
              conversation.id
            );
            setIsBlocked(result.isBlocked);
          } catch (error) {
            console.error("Error checking blocked status:", error);
          }
        };
        checkBlockedStatus();
      } else {
        setIsBlocked(false);
      }
    }
  }, [conversation, isTrainer, checkChatBlockedStatus]);

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
        const response = await fetch(
          `/api/messages/direct/${conversation.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: reply.trim(),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send message");
        }

        await response.json();
        setReply("");

        // Update the current conversation to mark it as no longer new
        if (conversation && onUpdateConversation) {
          const updatedConversation = {
            ...conversation,
            isNewChat: false,
            lastMessageAt: new Date().toISOString(),
          };
          onUpdateConversation(updatedConversation);
        }

        // Refresh conversations list without clearing active conversation
        if (onRefreshConversations) {
          // Pass true to keep the active conversation
          onRefreshConversations(true);
        }
      } else {
        await sendMessage(reply);
        setReply("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Handle blocked chat error specifically
      if (error.message.includes("blocked")) {
        setIsBlocked(true);
      }
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
      <div className="flex items-center justify-between border-b border-[#333] p-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 rounded p-1 hover:bg-[#333] lg:hidden"
          >
            ←
          </button>
          <div className="relative mr-3">
            <Avatar
              src={conversation.avatar}
              alt={conversation.name}
              size="md"
            />
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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Block/Unblock Chat button - only for trainers */}
          {isTrainer && !conversation.isNewChat && (
            <div className="relative">
              {isBlocked ? (
                <button
                  type="button"
                  onClick={() => setShowUnblockConfirm(true)}
                  className="rounded p-2 text-gray-400 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                  title="Unblock chat"
                  disabled={blockLoading}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Unblock chat</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBlockConfirm(true)}
                  className="rounded p-2 text-gray-400 hover:bg-orange-500/20 hover:text-orange-400 transition-colors"
                  title="Block chat"
                  disabled={blockLoading}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Block chat</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                    />
                  </svg>
                </button>
              )}

              {/* Block confirmation modal */}
              {showBlockConfirm && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[#333] bg-[#1a1a1a] p-4 shadow-lg z-10">
                  <h4 className="mb-2 font-medium text-gray-100">Block Chat</h4>
                  <p className="mb-4 text-sm text-gray-400">
                    This will prevent {conversation.name} from sending you
                    messages in this chat. They can still see your profile and
                    request coaching.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          // Get the client user ID from the conversation
                          const clientUserId = conversation.participantId;

                          await blockChat(clientUserId, conversation.id);
                          setShowBlockConfirm(false);
                          setIsBlocked(true);
                          // Optionally refresh conversations or show success message
                        } catch (error) {
                          console.error("Error blocking chat:", error);
                        }
                      }}
                      disabled={blockLoading}
                      className="flex-1 rounded bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {blockLoading ? "Blocking..." : "Block Chat"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBlockConfirm(false)}
                      className="flex-1 rounded bg-[#333] px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#444] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Unblock confirmation modal */}
              {showUnblockConfirm && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[#333] bg-[#1a1a1a] p-4 shadow-lg z-10">
                  <h4 className="mb-2 font-medium text-gray-100">
                    Unblock Chat
                  </h4>
                  <p className="mb-4 text-sm text-gray-400">
                    This will allow {conversation.name} to send you messages
                    again.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const clientUserId = conversation.participantId;

                          await unblockChat(clientUserId, conversation.id);
                          setShowUnblockConfirm(false);
                          setIsBlocked(false);
                          // Optionally refresh conversations or show success message
                        } catch (error) {
                          console.error("Error unblocking chat:", error);
                        }
                      }}
                      disabled={blockLoading}
                      className="flex-1 rounded bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {blockLoading ? "Unblocking..." : "Unblock Chat"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUnblockConfirm(false)}
                      className="flex-1 rounded bg-[#333] px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#444] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delete button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Delete conversation"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Delete conversation</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[#333] bg-[#1a1a1a] p-4 shadow-lg z-10">
                <h4 className="mb-2 font-medium text-gray-100">
                  Delete Conversation
                </h4>
                <p className="mb-4 text-sm text-gray-400">
                  Are you sure you want to delete this conversation? This action
                  cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const result = await deleteChat();
                        if (result.success) {
                          setShowDeleteConfirm(false);
                          if (onDeleteChat) {
                            onDeleteChat();
                          }
                        } else {
                          console.error("Failed to delete chat:", result.error);
                        }
                      } catch (error) {
                        console.error("Error deleting chat:", error);
                      }
                    }}
                    className="flex-1 rounded bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded bg-[#333] px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
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
            <p className="text-gray-400 text-center">
              This is the beginning of your conversation. Send a message below
              to get started!
            </p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="py-8 text-center text-gray-400">
                Loading messages...
              </div>
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
      {isBlocked && session?.user?.role === "trainer" ? (
        <div className="border-t border-[#333] p-4 bg-orange-900/20">
          <div className="flex items-center gap-3 text-orange-300">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Chat blocked</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
              />
            </svg>
            <span className="text-sm">
              You have blocked this chat. Unblock to send messages.
            </span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="border-t border-[#333] p-4"
        >
          <div className="flex items-start gap-2">
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
              className="mt-[5px]"
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export const RealTimeChatInterface = ({ conversationId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine if user is trainer based on current path (fallback if session role is not available)
  const isTrainer =
    pathname?.includes("/trainer/") || session?.user?.role === "trainer";
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [invalidChatId, setInvalidChatId] = useState(false);
  const [validatedChatIds, setValidatedChatIds] = useState(new Set()); // Cache validated chat IDs
  const [sessionStorageProcessed, setSessionStorageProcessed] = useState(false);
  const [cachedParticipantData, setCachedParticipantData] = useState({}); // Store participant data by conversation ID

  const { conversations, loading, error, fetchConversations } =
    useConversations();
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
        const conversation =
          conversations.length > 0
            ? conversations.find((conv) => conv.id === conversationId)
            : null;

        if (conversation) {
          // Existing conversation found - no validation needed
          setActiveConversation(conversation);
          setShowMobileChat(true);
        } else if (!loading) {
          // Only create temporary conversation if conversations are fully loaded
          // and conversation doesn't exist

          // Conversations are loaded but this one doesn't exist, or conversations not loaded yet
          // Try session storage for new conversation
          let participantName = "New Conversation";
          let participantAvatar = null;
          let participantInfoFound = false;

          // Check cached participant data first
          if (cachedParticipantData[conversationId]) {
            const cached = cachedParticipantData[conversationId];
            participantName = cached.name || "New Conversation";
            participantAvatar = cached.avatar || null;
            participantInfoFound = true;
          }

          // If no cached data, try to read from sessionStorage
          if (!participantInfoFound && !sessionStorageProcessed) {
            // Try to read from sessionStorage
            try {
              // Check if sessionStorage is available (privacy mode, quota issues, etc.)
              if (
                typeof Storage === "undefined" ||
                typeof sessionStorage === "undefined"
              ) {
                console.warn(
                  "SessionStorage is not available in this environment"
                );
                setSessionStorageProcessed(true); // Skip future attempts
              } else {
                const tempConversationData =
                  sessionStorage.getItem("tempConversation");
                if (tempConversationData) {
                  let participantInfo;
                  try {
                    participantInfo = JSON.parse(tempConversationData);
                  } catch (parseError) {
                    console.error(
                      "Failed to parse participant info from sessionStorage:",
                      parseError
                    );
                    // Clear corrupted data
                    try {
                      sessionStorage.removeItem("tempConversation");
                    } catch (removeError) {
                      console.error(
                        "Failed to remove corrupted sessionStorage data:",
                        removeError
                      );
                    }
                    setSessionStorageProcessed(true);
                    return;
                  }

                  // Verify this is for the current chat ID and not expired (5 minutes)
                  const isExpired =
                    Date.now() - participantInfo.timestamp > 5 * 60 * 1000;
                  const isForCurrentChat =
                    participantInfo.chatId === conversationId;

                  if (!isExpired && isForCurrentChat) {
                    // Store the data in cached state for persistence
                    setCachedParticipantData((prev) => ({
                      ...prev,
                      [conversationId]: {
                        name: participantInfo.name,
                        avatar: participantInfo.avatar,
                      },
                    }));

                    // Use the participant info
                    participantName =
                      participantInfo.name || "New Conversation";
                    participantAvatar = participantInfo.avatar || null;
                    participantInfoFound = true;

                    // Clear the session storage
                    try {
                      sessionStorage.removeItem("tempConversation");
                    } catch (removeError) {
                      console.error(
                        "Failed to remove sessionStorage data:",
                        removeError
                      );
                    }
                    setSessionStorageProcessed(true);
                  }
                }
              }
            } catch (error) {
              // Handle all other sessionStorage errors (quota exceeded, privacy restrictions, etc.)
              console.error("SessionStorage access error:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
              });

              // Mark as processed to prevent repeated failures
              setSessionStorageProcessed(true);

              // Optionally notify user if sessionStorage is critical for functionality
              if (error.name === "QuotaExceededError") {
                console.warn(
                  "SessionStorage quota exceeded. Some features may not work properly."
                );
              } else if (error.message && error.message.includes("privacy")) {
                console.warn(
                  "SessionStorage blocked by privacy settings. Some features may not work properly."
                );
              }
            }
          }

          // Only do server validation if session storage didn't work and we haven't validated this chat ID
          if (!participantInfoFound && !validatedChatIds.has(conversationId)) {
            try {
              const response = await fetch("/api/messages/validate-chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
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
                  setValidatedChatIds(
                    (prev) => new Set([...prev, conversationId])
                  );
                }
              }
            } catch (error) {
              console.error("Error validating chat access:", error);
            }
          }

          // Create conversation if we have any participant info
          if (participantInfoFound || participantName !== "New Conversation") {
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

    handleConversationId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, validatedChatIds, loading, conversations]);

  // Reset session storage state only when conversation ID changes
  useEffect(() => {
    setSessionStorageProcessed(false);
  }, [conversationId]);

  // Handle when conversations are loaded and we have a conversation ID
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const existingRealConversation = conversations.find(
        (conv) => conv.id === conversationId && !conv.isNewChat
      );

      if (existingRealConversation) {
        // Only switch to URL conversation if:
        // 1. No active conversation currently set (initial load), OR
        // 2. Active conversation doesn't exist in real conversations (cleanup stale temporary)
        // Don't switch if user has an active real conversation, even if URL is different
        const shouldSwitchToUrlConversation =
          !activeConversation ||
          !conversations.find(
            (conv) => conv.id === activeConversation.id && !conv.isNewChat
          );

        if (shouldSwitchToUrlConversation) {
          setActiveConversation(existingRealConversation);
          setShowMobileChat(true);
          setInvalidChatId(false);
        }
      }
    }
  }, [conversations, conversationId, loading, activeConversation]);

  const handleRefreshConversations = (keepActive = false) => {
    fetchConversations();
    if (!keepActive) {
      setActiveConversation(null);
      setShowMobileChat(false);
    }
    setValidatedChatIds(new Set()); // Clear validation cache on refresh
  };

  // Function to update the active conversation
  const handleUpdateConversation = (updatedConversation) => {
    setActiveConversation(updatedConversation);
  };

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conversation.unreadCount > 0) ||
      (filter === "active" &&
        !conversation.isNewChat &&
        !conversation.isBlocked) ||
      (filter === "blocked" && conversation.isBlocked);

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

  const handleDeleteChat = () => {
    // Close the chat and refresh conversations
    setShowMobileChat(false);
    setActiveConversation(null);
    fetchConversations();

    // Redirect to messages page without chat ID
    const basePath = isTrainer
      ? "/trainer/dashboard/messages"
      : "/client/dashboard/messages";
    router.push(basePath);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Conversations list */}
      <div
        className={`lg:col-span-1 ${showMobileChat ? "hidden lg:block" : ""}`}
      >
        <div className="mb-4">
          <FormField
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
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
            className="flex-1 justify-center"
          >
            Unread
          </Button>
          <Button
            variant={filter === "active" ? "orangeFilled" : "orangeOutline"}
            size="small"
            onClick={() => setFilter("active")}
            className="flex-1 justify-center"
          >
            Active
          </Button>
          {isTrainer && (
            <Button
              variant={filter === "blocked" ? "orangeFilled" : "orangeOutline"}
              size="small"
              onClick={() => setFilter("blocked")}
              className="flex-1 justify-center"
            >
              Blocked
            </Button>
          )}
        </div>

        <div className="h-[500px] grow overflow-y-auto rounded-lg bg-[#0f0f0f]">
          {loading && (
            <div className="p-4 text-center text-gray-400">
              Loading conversations...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-400">Error: {error}</div>
          )}

          {invalidChatId && (
            <div className="p-4 text-center text-red-400">
              Invalid conversation. Please use a valid conversation link.
            </div>
          )}

          {!loading &&
            !error &&
            !invalidChatId &&
            filteredConversations.length === 0 && (
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
      <div
        className={`lg:col-span-2 ${!showMobileChat ? "hidden lg:block" : ""}`}
      >
        <div className="h-[600px] overflow-hidden rounded-lg bg-[#0f0f0f]">
          <ChatHistory
            conversation={activeConversation}
            onClose={handleCloseMobileChat}
            onRefreshConversations={handleRefreshConversations}
            onDeleteChat={handleDeleteChat}
            onUpdateConversation={handleUpdateConversation}
            isOnline={
              activeConversation
                ? isUserOnline(activeConversation.participantId)
                : false
            }
          />
        </div>
      </div>
    </div>
  );
};
