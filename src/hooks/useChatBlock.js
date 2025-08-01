import { useState, useCallback } from "react";

export const useChatBlock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const blockChat = useCallback(async (blockedUserId, chatId, reason = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/block-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedUserId, chatId, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to block chat");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unblockChat = useCallback(async (blockedUserId, chatId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/block-chat?blockedUserId=${blockedUserId}&chatId=${chatId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unblock chat");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkChatBlockedStatus = useCallback(async (blockedUserId, chatId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/block-chat?blockedUserId=${blockedUserId}&chatId=${chatId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check chat blocked status");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlockedChats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/block-chat");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get blocked chats");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    blockChat,
    unblockChat,
    checkChatBlockedStatus,
    getBlockedChats,
    loading,
    error,
  };
}; 