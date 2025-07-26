"use client";

import Ably from "ably";
import { useState, useEffect, useCallback, useRef } from "react";

export const useChat = (coachingRequestId) => {
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
  }, [coachingRequestId]);

  // Initialize Ably connection
  useEffect(() => {
    if (!coachingRequestId || !currentUserId) {
      return;
    }

    const initializeAbly = async () => {
      try {
        // Create new Ably instance for this conversation
        const ably = new Ably.Realtime({
          key: "2w4ttQ.tWBjDA:Qs_hl_wWs0fZTk45sNaCux58grBzCSSWSveC8i42FJw",
          clientId: currentUserId,
        });

        ablyRef.current = ably;

        const channelName = `chat:${coachingRequestId}`;
        const channel = ably.channels.get(channelName);
        channelRef.current = channel;
        
        // Create a specific callback function to avoid duplicates
        const messageCallback = (message) => {
          // Only add messages for the current conversation
          if (message.data.coachingRequestId === coachingRequestId) {
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
      }
    };

    // Clean up previous connections before initializing new ones
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    if (ablyRef.current) {
      ablyRef.current.close();
      ablyRef.current = null;
    }

    initializeAbly();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (ablyRef.current) {
        ablyRef.current.close();
      }
    };
  }, [coachingRequestId, currentUserId]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!coachingRequestId || !currentUserId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/messages/${coachingRequestId}`);
      
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
  }, [coachingRequestId, currentUserId]);

  // Send a message
  const sendMessage = useCallback(async (content, messageType = "text", fileData = null) => {
    if (!coachingRequestId || !content.trim()) return;

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

      const response = await fetch(`/api/messages/${coachingRequestId}`, {
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
  }, [coachingRequestId]);

  // Mark messages as read (called when conversation is opened)
  const markAsRead = useCallback(async () => {
    if (!coachingRequestId) return;

    try {
      // The GET request to fetch messages automatically marks them as read
      await fetch(`/api/messages/${coachingRequestId}`);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [coachingRequestId]);

  return {
    messages,
    loading,
    error,
    sending,
    fetchMessages,
    sendMessage,
    markAsRead,
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