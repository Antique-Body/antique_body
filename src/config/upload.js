// Centralized configuration for file uploads.
// All sizes are in MB.

export const UPLOAD_CONFIG = {
  profileImage: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "profile-images",
    maxSize: 2, // MB
    returnType: "single",
  },
  certifications: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    folder: "certificates",
    maxSize: 10, // MB
    returnType: "array",
  },
  gallery: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "gallery",
    maxSize: 10, // MB
    returnType: "array",
  },
  videos: {
    allowedTypes: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ],
    folder: "videos",
    maxSize: 100, // MB
    returnType: "array",
  },
  exerciseImage: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "exercise-images",
    maxSize: 5, // MB
    returnType: "single",
  },
  exerciseVideo: {
    allowedTypes: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ],
    folder: "exercise-videos",
    maxSize: 50, // MB
    returnType: "single",
  },
  coverImage: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "cover-images",
    maxSize: 5, // MB
    returnType: "single",
  },
};

/**
 * Helper function to get config for a specific upload type.
 * @param {keyof typeof UPLOAD_CONFIG} type
 * @returns {typeof UPLOAD_CONFIG[keyof typeof UPLOAD_CONFIG]}
 */
export const getUploadConfig = (type) => UPLOAD_CONFIG[type];
