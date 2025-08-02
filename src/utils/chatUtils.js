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
 * Parse a chat ID to extract the two IDs
 * @param {string} chatId - The chat ID to parse
 * @returns {object} Object containing the two IDs (need to determine which is trainer/client via DB)
 */
export const parseChatId = (chatId) => {
  if (!chatId || typeof chatId !== "string") {
    throw new Error("Invalid chat ID");
  }

  // Since CUIDs are 25 characters, we can split at the 25th character
  const firstId = chatId.substring(0, 25);
  const secondId = chatId.substring(25);

  // Return both IDs - the API routes will determine which is trainer/client
  // by checking the database for both combinations
  return {
    firstId,
    secondId,
    // For backward compatibility, provide these too
    // but the actual determination should be done in API routes
    trainerId: firstId,
    clientId: secondId,
  };
};

/**
 * Check if a chat ID is valid
 * @param {string} chatId - The chat ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidChatId = (chatId) => {
  if (!chatId || typeof chatId !== "string") {
    return false;
  }

  // CUIDs are 25 characters, so a valid chat ID should be 50 characters
  return chatId.length === 50;
};
