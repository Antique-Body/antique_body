import { SPECIALTIES } from "@/enums/specialties";

/**
 * Maps specialty IDs to their proper display labels
 * @param {string} specialtyId - The ID of the specialty (e.g., "sports-performance")
 * @returns {string} - The proper display label (e.g., "Sports Performance")
 */
export const mapSpecialtyToLabel = (specialtyId) => {
  if (!specialtyId) return "";

  // Clean up the specialty ID (trim whitespace)
  const cleanId = specialtyId.trim();

  // Find the specialty in the SPECIALTIES enum
  const specialty = SPECIALTIES.find((s) => s.id === cleanId);

  // Return the label if found, otherwise return the original ID with proper capitalization
  if (specialty) {
    return specialty.label;
  }

  // Fallback: capitalize each word in the ID
  return cleanId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
