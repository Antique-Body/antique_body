"use client";

import Ably from "ably";
import { useState, useEffect, useCallback, useRef } from "react";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const ablyRef = useRef(null);
  const channelRef = useRef(null);

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const user = await response.json();
          setCurrentUserId(user.id);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [chatId]);

  // Initialize Ably connection
  useEffect(() => {
    if (!chatId || !currentUserId) {
      return;
    }

    let isInitializing = false;
    let isMounted = true;

    const initializeAbly = async () => {
      if (isInitializing || !isMounted) return;
      isInitializing = true;
      try {
        // Create new Ably instance for this conversation
        const ably = new Ably.Realtime({
          key: "2w4ttQ.tWBjDA:Qs_hl_wWs0fZTk45sNaCux58grBzCSSWSveC8i42FJw",
          clientId: currentUserId,
        });

        ablyRef.current = ably;

        const channelName = `chat:${chatId}`;
        const channel = ably.channels.get(channelName);
        channelRef.current = channel;
        
        // Create a specific callback function to avoid duplicates
        const messageCallback = (message) => {
          // Only add messages for the current conversation
          if (message.data.chatId === chatId) {
            setMessages((prev) => {
              // Check if message already exists to prevent duplicates
              const messageExists = prev.some(msg => msg.id === message.data.id);
              if (messageExists) {
                return prev;
              }
              
              // Add isMine property based on current user
              const messageWithIsMine = {
                ...message.data,
                isMine: message.data.senderId === currentUserId
              };
              
              return [...prev, messageWithIsMine];
            });
          }
        };
        
        // Subscribe to new messages
        channel.subscribe("message", messageCallback);
      } catch (err) {
        console.error("Failed to initialize Ably:", err);
        setError("Failed to connect to chat service");
      } finally {
        isInitializing = false;
      }
    };

    // Clean up previous connections before initializing new ones
    try {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      // if (ablyRef.current && ablyRef.current.connection.state !== 'closed') {
      //   ablyRef.current.connection.close();
      //   ablyRef.current = null;
      // }
    } catch (err) {
      console.error("Error during Ably cleanup before initialization:", err);
    }

    initializeAbly();

    return () => {
      isMounted = false;
      try {
        if (channelRef.current) {
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
        // if (ablyRef.current && ablyRef.current.connection.state !== 'closed') {
        //   ablyRef.current.connection.close();
        //   ablyRef.current = null;
        // }
      } catch (err) {
        console.error("Error during Ably cleanup:", err);
      }
    };
  }, [chatId, currentUserId]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!chatId || !currentUserId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/messages/direct/${chatId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      
      // Add isMine property to fetched messages
      const messagesWithIsMine = (data.messages || []).map(message => ({
        ...message,
        isMine: message.senderId === currentUserId
      }));
      
      setMessages(messagesWithIsMine);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUserId]);

  // Send a message
  const sendMessage = useCallback(async (content, messageType = "text", fileData = null) => {
    if (!chatId || !content.trim()) return;

    setSending(true);
    setError(null);

    try {
      const requestBody = {
        content: content.trim(),
        messageType,
        ...(fileData && {
          fileUrl: fileData.url,
          fileName: fileData.name,
        }),
      };

      const response = await fetch(`/api/messages/direct/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      // Don't add the message here - let Ably handle it for consistency
      // This prevents duplicate messages
      
      return data.message;
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      throw err;
    } finally {
      setSending(false);
    }
  }, [chatId]);

  // Mark messages as read (called when conversation is opened)
  const markAsRead = useCallback(async () => {
    if (!chatId) return;

    try {
      const response = await fetch(`/api/messages/direct/${chatId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }

      const data = await response.json();
      console.log(`Marked ${data.markedAsRead} messages as read`);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [chatId]);

  // Delete chat
  const deleteChat = useCallback(async () => {
    if (!chatId) return;

    try {
      const response = await fetch(`/api/messages/direct/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      const data = await response.json();
      console.log("Chat deleted successfully:", data.message);
      return { success: true };
    } catch (err) {
      console.error("Error deleting chat:", err);
      return { success: false, error: err.message };
    }
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    sending,
    fetchMessages,
    sendMessage,
    markAsRead,
    deleteChat,
  };
};

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/messages/conversations");
      
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
  };
}; 