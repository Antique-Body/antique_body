"use client";

import Ably from "ably";
import { useState, useEffect, useCallback, useRef } from "react";

import { joinGlobalPresence, leaveGlobalPresence, updateGlobalPresence, joinChatPresence, updateTypingStatus } from "@/lib/ably";

export const useGlobalPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [myPresence, setMyPresence] = useState(null);
  const [loading, setLoading] = useState(true);
  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const currentUserRef = useRef(null);

  // Initialize global presence
  const initializePresence = useCallback(async () => {
    try {
      // Get current user
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        throw new Error("Failed to get current user");
      }
      
      const user = await response.json();
      currentUserRef.current = user;

      // Create Ably instance directly with API key (simpler for development)
      ablyRef.current = new Ably.Realtime({
        key: "2w4ttQ.tWBjDA:Qs_hl_wWs0fZTk45sNaCux58grBzCSSWSveC8i42FJw",
        clientId: user.id,
      });

      // Get global presence channel
      channelRef.current = ablyRef.current.channels.get('presence:global');
      
      // Subscribe to presence events
      channelRef.current.presence.subscribe('enter', (member) => {
        setOnlineUsers(prev => {
          const exists = prev.some(u => u.clientId === member.clientId);
          if (exists) return prev;
          return [...prev, member];
        });
      });

      channelRef.current.presence.subscribe('leave', (member) => {
        setOnlineUsers(prev => prev.filter(u => u.clientId !== member.clientId));
      });

      channelRef.current.presence.subscribe('update', (member) => {
        setOnlineUsers(prev => prev.map(u => 
          u.clientId === member.clientId ? member : u
        ));
      });

      // Get current presence members
      const presentMembers = await channelRef.current.presence.get();
      setOnlineUsers(presentMembers);

      // Join global presence
      const userData = {
        id: user.id,
        name: user.trainerInfo?.trainerProfile?.firstName || user.clientInfo?.clientProfile?.firstName || 'Unknown User',
        avatar: user.trainerInfo?.trainerProfile?.profileImage || user.clientInfo?.clientProfile?.profileImage,
        role: user.role
      };
      
      await joinGlobalPresence(userData);
      setMyPresence(userData);
      setLoading(false);

    } catch (error) {
      console.error("Failed to initialize presence:", error);
      setLoading(false);
    }
  }, []);

  // Leave presence when component unmounts
  const cleanup = useCallback(async () => {
    try {
      if (channelRef.current && channelRef.current.presence) {
        await leaveGlobalPresence();
        channelRef.current.presence.unsubscribe();
      }
      if (ablyRef.current && ablyRef.current.connection && ablyRef.current.connection.state !== 'closed') {
        ablyRef.current.connection.close();
      }
    } catch (error) {
      console.error("Failed to cleanup presence:", error);
    }
  }, []);

  // Update presence data
  const updatePresence = useCallback(async (data) => {
    if (!myPresence) return;
    
    const updatedData = { ...myPresence, ...data };
    await updateGlobalPresence(updatedData);
    setMyPresence(updatedData);
  }, [myPresence]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => onlineUsers.some(user => user.data?.userId === userId), [onlineUsers]);

  useEffect(() => {
    initializePresence();

    // Cleanup on unmount and page unload
    const handleBeforeUnload = () => {
      // During page reload, the connection might already be closing
      // So we'll just try to leave presence without waiting
      try {
        if (channelRef.current && channelRef.current.presence) {
          leaveGlobalPresence().catch(() => {
            // Ignore errors during page unload
          });
        }
              } catch {
          // Ignore errors during page unload
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, [initializePresence, cleanup]);

  return {
    onlineUsers,
    myPresence,
    loading,
    updatePresence,
    isUserOnline,
  };
};

export const useChatPresence = (chatId) => {
  const [presenceMembers, setPresenceMembers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const channelRef = useRef(null);
  const currentUserRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize chat presence
  useEffect(() => {
    const initializeChatPresence = async () => {
      if (!chatId) return;

      try {
        // Get current user
        const response = await fetch("/api/users/me");
        if (!response.ok) return;
        
        const user = await response.json();
        currentUserRef.current = user;

                 // Create Ably instance directly with API key (simpler for development)
         const ably = new Ably.Realtime({
           key: "2w4ttQ.tWBjDA:Qs_hl_wWs0fZTk45sNaCux58grBzCSSWSveC8i42FJw",
           clientId: user.id,
         });

        // Get chat channel
        const channelName = `chat:${chatId}`;
        channelRef.current = ably.channels.get(channelName);
        
        // Subscribe to presence events
        channelRef.current.presence.subscribe('enter', (member) => {
          setPresenceMembers(prev => {
            const exists = prev.some(u => u.clientId === member.clientId);
            if (exists) return prev;
            return [...prev, member];
          });
        });

        channelRef.current.presence.subscribe('leave', (member) => {
          setPresenceMembers(prev => prev.filter(u => u.clientId !== member.clientId));
          setTypingUsers(prev => prev.filter(u => u.clientId !== member.clientId));
        });

        channelRef.current.presence.subscribe('update', (member) => {
          setPresenceMembers(prev => prev.map(u => 
            u.clientId === member.clientId ? member : u
          ));
          
          // Update typing users
          setTypingUsers(prev => {
            const filtered = prev.filter(u => u.clientId !== member.clientId);
            if (member.data?.typing && member.clientId !== user.id) {
              return [...filtered, member];
            }
            return filtered;
          });
        });

        // Get current presence members
        const presentMembers = await channelRef.current.presence.get();
        setPresenceMembers(presentMembers);

        // Join chat presence
        const userData = {
          id: user.id,
          name: user.trainerInfo?.trainerProfile?.firstName || user.clientInfo?.clientProfile?.firstName || 'Unknown User'
        };
        
        await joinChatPresence(chatId, userData);

      } catch (error) {
        console.error("Failed to initialize chat presence:", error);
      }
    };

    initializeChatPresence();

    return () => {
      if (channelRef.current) {
        channelRef.current.presence.leave();
        channelRef.current.presence.unsubscribe();
      }
    };
  }, [chatId]);

  // Set typing status
  const setTypingStatus = useCallback(async (isTyping) => {
    if (!chatId) return;

    try {
      await updateTypingStatus(chatId, isTyping);
      
      // Auto-clear typing after 3 seconds of inactivity
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          updateTypingStatus(chatId, false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to update typing status:", error);
    }
  }, [chatId]);

  // Check if someone is typing (excluding current user)
  const isOtherUserTyping = typingUsers.length > 0;
  const typingUserNames = typingUsers
    .filter(user => user.clientId !== currentUserRef.current?.id)
    .map(user => user.data?.name || 'Someone')
    .join(', ');

  return {
    presenceMembers,
    typingUsers,
    isOtherUserTyping,
    typingUserNames,
    setTypingStatus,
  };
}; 