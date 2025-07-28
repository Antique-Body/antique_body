import Ably from "ably";

let ably = null;

export const getAblyClient = (clientId = null) => {
  if (!ably) {
    const config = {
      key: process.env.NEXT_PUBLIC_ABLY_KEY || "2w4ttQ.tWBjDA:Qs_hl_wWs0fZTk45sNaCux58grBzCSSWSveC8i42FJw"
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
  const client = getAblyClient();
  const channel = client.channels.get(getChannelName(channelName));
  
  try {
    await channel.publish('message', message);
    return true;
  } catch (error) {
    console.error('Failed to publish message:', error);
    return false;
  }
};

export const subscribeToMessages = (channelName, callback) => {
  const client = getAblyClient();
  const channel = client.channels.get(getChannelName(channelName));
  
  channel.subscribe('message', callback);
  
  return () => {
    channel.unsubscribe('message', callback);
  };
};

export const generateAblyToken = async (userId) => {
  const client = getAblyClient();
  
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
  const client = getAblyClient(user.id);
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
  const client = getAblyClient(userId);
  const channel = client.channels.get('presence:global');
  
  try {
    await channel.presence.leave();
    return true;
  } catch (error) {
    console.error('Failed to leave global presence:', error);
    return false;
  }
};

export const updateGlobalPresence = async (data, userId = null) => {
  const client = getAblyClient(userId);
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
  const client = getAblyClient(user.id);
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
  const client = getAblyClient(userId);
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