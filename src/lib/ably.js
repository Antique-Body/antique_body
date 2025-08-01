let ably = null;

// Dynamically import Ably only on client side
const getAbly = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Ably can only be used on the client side');
  }
  const { default: Ably } = await import('ably');
  return Ably;
};


/**
 * Cleanup function to properly close Ably client connection and reset singleton
 */
export const cleanupAblyClient = async () => {
  if (ably) {
    try {
      // Close the connection if it's not already closed
      if (ably.connection && ably.connection.state !== 'closed') {
        await ably.close();
      }
    } catch (error) {
      console.warn('Error during Ably client cleanup:', error);
    } finally {
      // Reset the singleton instance regardless of cleanup success
      ably = null;
    }
  }
};

export const getAblyClient = async (clientId = null, forceRecreate = false) => {
  // Cleanup existing client if forceRecreate is true or if clientId changes
  if (forceRecreate || (ably && clientId && ably.auth.clientId !== clientId)) {
    await cleanupAblyClient();
  }
  
  if (!ably) {
    const Ably = await getAbly();
    const config = {
      authCallback: async (tokenParams, callback) => {
        try {
          // Fetch a fresh token from backend each time
          const tokenResponse = await fetch('/api/auth/ably-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId }),
          });

          if (!tokenResponse.ok) {
            throw new Error('Failed to get Ably token');
          }

          const { tokenRequest } = await tokenResponse.json();
          callback(null, tokenRequest);
        } catch (error) {
          callback(error, null);
        }
      }
    };
    
    if (clientId) {
      config.clientId = clientId;
    }
    
    ably = new Ably.Realtime(config);
  }
  return ably;
};

export const getChannelName = (channelName) => `chat:${channelName}`;

export const publishMessage = async (channelName, message) => {
  const client = await getAblyClient();
  const channel = client.channels.get(getChannelName(channelName));
  
  try {
    await channel.publish('message', message);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to publish message:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToMessages = async (channelName, callback) => {
  const client = await getAblyClient();
  const channel = client.channels.get(getChannelName(channelName));
  
  channel.subscribe('message', callback);
  
  return () => {
    channel.unsubscribe('message', callback);
  };
};

export const generateAblyToken = async (userId) => {
  const client = await getAblyClient();
  
  try {
    const tokenRequest = await client.auth.createTokenRequest({
      clientId: userId,
      capability: {
        'chat:*': ['subscribe', 'publish', 'presence'],
        'presence:global': ['subscribe', 'publish', 'presence']
      }
    });
    
    return tokenRequest;
  } catch (error) {
    console.error('Failed to generate Ably token:', error);
    throw error;
  }
};

// Global presence functions
export const joinGlobalPresence = async (user) => {
  const client = await getAblyClient(user.id);
  const channel = client.channels.get('presence:global');
  
  try {
    await channel.presence.enter({
      userId: user.id,
      name: user.name || 'Unknown User',
      avatar: user.avatar,
      role: user.role,
      lastSeen: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Failed to join global presence:', error);
    return false;
  }
};

export const leaveGlobalPresence = async (userId = null) => {
  try {
    const client = await getAblyClient(userId);
    
    // Check if client and connection are available
    if (!client || !client.connection) {
      console.warn('Ably client or connection not available for leaving presence');
      return false;
    }
    
    // Check connection state
    if (client.connection.state === 'closed' || client.connection.state === 'failed') {
      console.warn('Ably connection is closed or failed, skipping presence leave');
      return false;
    }
    
    const channel = client.channels.get('presence:global');
    
    // Check if channel and presence are available
    if (!channel || !channel.presence) {
      console.warn('Presence channel not available for leaving');
      return false;
    }
    
    await channel.presence.leave();
    return true;
  } catch (error) {
    console.error('Failed to leave global presence:', error);
    return false;
  }
};

export const updateGlobalPresence = async (data, userId = null) => {
  const client = await getAblyClient(userId);
  const channel = client.channels.get('presence:global');
  
  try {
    await channel.presence.update({
      ...data,
      lastSeen: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Failed to update global presence:', error);
    return false;
  }
};

// Chat presence functions
export const joinChatPresence = async (channelName, user) => {
  try {
    const client = await getAblyClient(user.id);
    
    // Check if client and connection are available
    if (!client || !client.connection) {
      console.warn('Ably client or connection not available for joining chat presence');
      return false;
    }
    
    // Check connection state
    if (client.connection.state === 'closed' || client.connection.state === 'failed') {
      console.warn('Ably connection is closed or failed, skipping chat presence join');
      return false;
    }
    
    const channel = client.channels.get(getChannelName(channelName));
    
    // Check if channel and presence are available
    if (!channel || !channel.presence) {
      console.warn('Chat presence channel not available for joining');
      return false;
    }
    
    await channel.presence.enter({
      userId: user.id,
      name: user.name || 'Unknown User',
      typing: false,
      lastSeen: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Failed to join chat presence:', error);
    return false;
  }
};

export const updateTypingStatus = async (channelName, isTyping, userId = null) => {
  try {
    const client = await getAblyClient(userId);
    
    // Check if client and connection are available
    if (!client || !client.connection) {
      console.warn('Ably client or connection not available for updating typing status');
      return false;
    }
    
    // Check connection state
    if (client.connection.state === 'closed' || client.connection.state === 'failed') {
      console.warn('Ably connection is closed or failed, skipping typing status update');
      return false;
    }
    
    const channel = client.channels.get(getChannelName(channelName));
    
    // Check if channel and presence are available
    if (!channel || !channel.presence) {
      console.warn('Chat presence channel not available for typing status update');
      return false;
    }
    
    await channel.presence.update({
      typing: isTyping,
      lastSeen: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Failed to update typing status:', error);
    return false;
  }
}; 