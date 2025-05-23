import { PrismaClient } from "@prisma/client";
import { twMerge } from "tailwind-merge";

// Create a single PrismaClient instance
export const prisma = new PrismaClient();

// Rate limiting map
const rateLimitMap = new Map();

// Rate limiting function
export async function checkRateLimit(key, limit = 5, window = 60 * 1000) {
  const now = Date.now();
  const windowStart = now - window;

  // Get existing attempts
  const attempts = rateLimitMap.get(key) || [];

  // Remove old attempts
  const recentAttempts = attempts.filter((time) => time > windowStart);

  // Check if limit exceeded
  if (recentAttempts.length >= limit) {
    return false;
  }

  // Add new attempt
  recentAttempts.push(now);
  rateLimitMap.set(key, recentAttempts);

  return true;
}

export function cn(...inputs) {
  return twMerge(inputs);
}

// Format phone number consistently
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");
  // Add + prefix if not present
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

// Generate secure random code
export function generateSecureCode(length = 6) {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}
