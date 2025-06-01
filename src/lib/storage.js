// Storage service abstraction for file uploads
// Default: Google Cloud Storage (GCS)

import fs from "fs";

import { v4 as uuidv4 } from "uuid";

// --- GCS IMPLEMENTATION ---
let uploadFileImpl = null;
let validateFileImpl = null;

export function setStorageProvider({ uploadFile, validateFile }) {
  uploadFileImpl = uploadFile;
  validateFileImpl = validateFile;
}

// Default GCS provider
export function initGCS() {
  const { Storage } = require("@google-cloud/storage");
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT,
    keyFilename: process.env.GCS_KEYFILE,
  });
  const bucket = storage.bucket(process.env.GCS_BUCKET);

  setStorageProvider({
    validateFile: (file, allowedTypes, maxSizeMB = 10) => {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Invalid file type");
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error("File too large");
      }
    },
    uploadFile: async (file, folder) => {
      const ext = file.originalFilename.split(".").pop();
      const gcsFile = bucket.file(`${folder}/${uuidv4()}.${ext}`);
      await gcsFile.save(fs.readFileSync(file.filepath), {
        contentType: file.mimetype,
        resumable: false,
      });
      return `https://storage.googleapis.com/${bucket.name}/${gcsFile.name}`;
    },
  });
}

// --- API ---
export function validateFile(file, allowedTypes, maxSizeMB = 10) {
  if (!validateFileImpl) throw new Error("No storage provider set");
  return validateFileImpl(file, allowedTypes, maxSizeMB);
}

export async function uploadFile(file, folder) {
  if (!uploadFileImpl) throw new Error("No storage provider set");
  return await uploadFileImpl(file, folder);
}

// --- Example for Cloudinary (not active, just for reference) ---
// export function useCloudinary() {
//   const cloudinary = require('cloudinary').v2;
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
//   setStorageProvider({
//     validateFile: (file, allowedTypes, maxSizeMB = 10) => {
//       if (!allowedTypes.includes(file.mimetype)) {
//         throw new Error("Invalid file type");
//       }
//       if (file.size > maxSizeMB * 1024 * 1024) {
//         throw new Error("File too large");
//       }
//     },
//     uploadFile: async (file, folder) => {
//       const result = await cloudinary.uploader.upload(file.filepath, {
//         folder,
//         resource_type: "auto",
//       });
//       return result.secure_url;
//     },
//   });
// }
