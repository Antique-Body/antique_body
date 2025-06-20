import { Readable } from "stream";

import formidable from "formidable";

import { uploadFile, initGCS } from "@/lib/storage";

export const config = { api: { bodyParser: false } };

// Konfiguracija po key-u
const UPLOAD_CONFIG = {
  profileImage: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/x-png",
    ],
    folder: "profile-images",
    maxSize: 1,
  },
  certifications: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/x-png",
      "application/pdf",
      "application/x-pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    folder: "certificates",
    maxSize: 10,
  },
  gallery: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
    ],
    folder: "gallery",
    maxSize: 1,
  },
  videos: {
    allowedTypes: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ],
    folder: "videos",
    maxSize: 100,
  },
  // Dodaj nove key-eve po potrebi
};

function validateFile(file, allowedTypes, maxSizeMB = 10) {
  if (!file || !file.mimetype) return;
  if (!allowedTypes.includes(file.mimetype?.toLowerCase())) {
    throw new Error("Invalid file type");
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error("File too large");
  }
}

export async function POST(req) {
  initGCS();

  // 1. Uzmi headers
  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // 2. Uzmi body kao buffer
  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Napravi fake Node.js request
  const nodeReq = new Readable();
  nodeReq._read = () => {};
  nodeReq.push(buffer);
  nodeReq.push(null);
  nodeReq.headers = headers;
  nodeReq.method = req.method;

  return new Promise((resolve) => {
    const form = formidable({ multiples: true });
    form.parse(nodeReq, async (err, fields, files) => {
      try {
        console.log("FILES RECEIVED:", files); // Debug log
        if (err) throw err;
        const uploadedUrls = {};
        // 1. Prvo obradi certifications posebno (kao array arraya)
        const certGrouped = {};
        for (const key of Object.keys(files)) {
          const certMatch = key.match(/^certifications\[(\d+)\]$/);
          if (certMatch) {
            const idx = Number(certMatch[1]);
            const config = UPLOAD_CONFIG.certifications;
            if (!certGrouped[idx]) certGrouped[idx] = [];
            const fileOrArray = files[key];
            const fileArr = Array.isArray(fileOrArray)
              ? fileOrArray
              : [fileOrArray];
            for (const file of fileArr) {
              if (!file || !file.mimetype) continue;
              validateFile(file, config.allowedTypes, config.maxSize);
              const url = await uploadFile(file, config.folder);
              certGrouped[idx].push({
                url,
                originalName: file.originalFilename,
                mimetype: file.mimetype,
              });
            }
          }
        }
        // Pretvori certGrouped u array arraya po indeksima
        if (Object.keys(certGrouped).length > 0) {
          const maxIdx = Math.max(...Object.keys(certGrouped).map(Number));
          uploadedUrls.certifications = [];
          for (let i = 0; i <= maxIdx; i++) {
            uploadedUrls.certifications[i] = certGrouped[i] || [];
          }
        }
        // 2. Ostale key-eve obradi generički
        for (const key of Object.keys(files)) {
          // preskoči certifications[...]
          if (/^certifications\[\d+\]$/.test(key)) continue;
          const baseKeyMatch = key.match(/^(\w+)(\[(\d+)\])?$/);
          if (!baseKeyMatch) continue;
          const baseKey = baseKeyMatch[1];
          if (baseKey === "certifications") continue;
          const config = UPLOAD_CONFIG[baseKey];
          if (!config) continue;
          const fileOrArray = files[key];
          const fileArr = Array.isArray(fileOrArray)
            ? fileOrArray
            : [fileOrArray];
          // profileImage: vrati samo url (string)
          if (baseKey === "profileImage") {
            let url = null;
            for (const file of fileArr) {
              if (!file || !file.mimetype) continue;
              validateFile(file, config.allowedTypes, config.maxSize);
              url = await uploadFile(file, config.folder);
              break; // uzmi samo prvi
            }
            if (url) uploadedUrls.profileImage = url;
            continue;
          }
          // gallery i videos: array objekata
          if (baseKey === "gallery" || baseKey === "videos") {
            if (!uploadedUrls[baseKey]) uploadedUrls[baseKey] = [];
            for (const file of fileArr) {
              if (!file || !file.mimetype) continue;
              validateFile(file, config.allowedTypes, config.maxSize);
              const url = await uploadFile(file, config.folder);
              uploadedUrls[baseKey].push({
                url,
                originalName: file.originalFilename,
                mimetype: file.mimetype,
              });
            }
            continue;
          }
          // Ostali key-evi po potrebi
        }
        // Debug: logaj uploadedUrls prije resolve
        console.log("uploadedUrls", uploadedUrls);
        resolve(new Response(JSON.stringify(uploadedUrls), { status: 200 }));
      } catch (error) {
        resolve(
          new Response(JSON.stringify({ error: error.message }), {
            status: 400,
          })
        );
      }
    });
  });
}
