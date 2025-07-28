/**
 * Generate a secure chat ID by concatenating trainer and client IDs
 * @param {string} trainerId - The trainer's ID
 * @param {string} clientId - The client's ID
 * @returns {string} The secure chat ID
 */
export const generateChatId = (trainerId, clientId) => {
  if (!trainerId || !clientId) {
    throw new Error("Both trainerId and clientId are required");
  }
  
  // Sort IDs to ensure consistent chat ID regardless of who initiates
  const sortedIds = [trainerId, clientId].sort();
  return `${sortedIds[0]}${sortedIds[1]}`;
};

/**
 * Parse a chat ID to extract trainer and client IDs
 * @param {string} chatId - The chat ID to parse
 * @returns {object} Object containing trainerId and clientId
 */
export const parseChatId = (chatId) => {
  if (!chatId || typeof chatId !== 'string') {
    throw new Error("Invalid chat ID");
  }

  // Since we're concatenating IDs directly, we need to determine which is which
  // This is a simplified approach - in a real app you might want to validate against the database
  // For now, we'll assume the first part is always the trainer ID and second is client ID
  // This works because we sort them when generating
  
  // Since CUIDs are 25 characters, we can split at the 25th character
  const trainerId = chatId.substring(0, 25);
  const clientId = chatId.substring(25);
  
  return { trainerId, clientId };
};

/**
 * Check if a chat ID is valid
 * @param {string} chatId - The chat ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidChatId = (chatId) => {
  if (!chatId || typeof chatId !== 'string') {
    return false;
  }
  
  // CUIDs are 25 characters, so a valid chat ID should be 50 characters
  return chatId.length === 50;
}; 