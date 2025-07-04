import { twMerge } from "tailwind-merge";

// Create a single PrismaClient instance

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

// Calculate distance between two lat/lon points in kilometers
export function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Updates form data for both flat and nested fields (dot notation), handling checkboxes.
 * @param {object} data - The current form data object
 * @param {object} e - The event from the input
 * @returns {object} - The updated data object
 */
export function updateFormData(data, e) {
  const { name, value, type, checked } = e.target;
  if (name.includes(".")) {
    const keys = name.split(".");
    // Recursively/iteratively build the new object structure
    const updateNested = (obj, keys, val) => {
      if (keys.length === 1) {
        return {
          ...obj,
          [keys[0]]: val,
        };
      }
      const [first, ...rest] = keys;
      return {
        ...obj,
        [first]: updateNested(obj?.[first] || {}, rest, val),
      };
    };
    return updateNested(data, keys, type === "checkbox" ? checked : value);
  } else {
    return {
      ...data,
      [name]: type === "checkbox" ? checked : value,
    };
  }
}
