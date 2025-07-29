let ably = null;

// Dynamically import Ably only on client side
const getAbly = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Ably can only be used on the client side');
  }
  const { default: Ably } = await import('ably');
  return Ably;
};

// Check if Ably API key is configured
const checkAblyKey = () => {
  if (!process.env.NEXT_PUBLIC_ABLY_KEY) {
    throw new Error('NEXT_PUBLIC_ABLY_KEY environment variable is not set. Please add it to your .env.local file.');
  }
};

export const getAblyClient = async (clientId = null) => {
  if (!ably) {
    checkAblyKey();
    const Ably = await getAbly();
    const config = {
      key: process.env.NEXT_PUBLIC_ABLY_KEY
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
    return true;
  } catch (error) {
    console.error('Failed to publish message:', error);
    return false;
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
  const client = await getAblyClient(user.id);
  const channel = client.channels.get(getChannelName(channelName));
  
  try {
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
  const client = await getAblyClient(userId);
  const channel = client.channels.get(getChannelName(channelName));
  
  try {
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