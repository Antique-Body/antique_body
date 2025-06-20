import { Readable } from "stream";

import formidable from "formidable";

import { uploadFile, initGCS } from "@/lib/storage";

export const config = { api: { bodyParser: false } };

// Apstraktna konfiguracija za sve tipove uploada
const UPLOAD_CONFIG = {
  profileImage: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "profile-images",
    maxSize: 1,
    returnType: "single", // single URL
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
    maxSize: 10,
    returnType: "array", // array of objects
  },
  gallery: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "gallery",
    maxSize: 10,
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
    maxSize: 100,
    returnType: "array",
  },
  exerciseImage: {
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    folder: "exercise-images",
    maxSize: 5,
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
    maxSize: 50,
    returnType: "single",
  },
};

// Apstraktna validacija fajla
function validateFile(file, config) {
  if (!file || !file.mimetype) return;
  if (!config.allowedTypes.includes(file.mimetype?.toLowerCase())) {
    throw new Error(
      `Invalid file type. Allowed: ${config.allowedTypes.join(", ")}`
    );
  }
  if (file.size > config.maxSize * 1024 * 1024) {
    throw new Error(`File too large. Maximum: ${config.maxSize}MB`);
  }
}

// Apstraktna obrada fajlova
async function processFiles(files, config) {
  const fileArray = Array.isArray(files) ? files : [files];
  const validFiles = fileArray.filter((file) => file && file.mimetype);

  if (validFiles.length === 0) return null;

  // Za single return type, uzmi samo prvi fajl
  if (config.returnType === "single") {
    const file = validFiles[0];
    validateFile(file, config);
    const url = await uploadFile(file, config.folder);
    return url;
  }

  // Za array return type, obradi sve fajlove
  const uploadPromises = validFiles.map(async (file) => {
    validateFile(file, config);
    const url = await uploadFile(file, config.folder);
    return {
      url,
      originalName: file.originalFilename,
      mimetype: file.mimetype,
    };
  });

  return Promise.all(uploadPromises);
}

export async function POST(req) {
  initGCS();

  // Parse request
  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

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
        if (err) throw err;

        const uploadedUrls = {};

        // Apstraktna obrada svih fajlova
        for (const [key, fileData] of Object.entries(files)) {
          // Posebna obrada za certifications array
          const certMatch = key.match(/^certifications\[(\d+)\]$/);
          if (certMatch) {
            const idx = Number(certMatch[1]);
            const config = UPLOAD_CONFIG.certifications;
            if (!uploadedUrls.certifications) uploadedUrls.certifications = [];
            const result = await processFiles(fileData, config);
            if (result) uploadedUrls.certifications[idx] = result;
            continue;
          }

          // Standardna obrada
          const baseKeyMatch = key.match(/^(\w+)(\[(\d+)\])?$/);
          if (!baseKeyMatch) continue;

          const baseKey = baseKeyMatch[1];
          const config = UPLOAD_CONFIG[baseKey];
          if (!config) continue;

          const result = await processFiles(fileData, config);
          if (result) uploadedUrls[baseKey] = result;
        }

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
