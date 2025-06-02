import { Readable } from "stream";

import formidable from "formidable";

import { uploadFile, initGCS } from "@/lib/storage";

export const config = { api: { bodyParser: false } };

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/x-png",
];
const ALLOWED_CERT_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "application/x-pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function validateFile(file, allowedTypes, maxSizeMB = 10) {
  if (!file || !file.mimetype) return; // ignoriraj prazne slotove
  // Log za debug
  console.log("Validating file:", file?.originalFilename, file?.mimetype);
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
        // Handle profileImage as array or single file
        let profileImageFile = files.profileImage;
        if (Array.isArray(profileImageFile)) {
          profileImageFile = profileImageFile[0];
        }
        if (profileImageFile && profileImageFile.mimetype) {
          validateFile(profileImageFile, ALLOWED_IMAGE_TYPES, 5);
          uploadedUrls.profileImage = await uploadFile(
            profileImageFile,
            "profile-images"
          );
        }
        // Grupiraj certifikate po indexu (certifications[0], certifications[1], ...)
        const grouped = {};
        Object.keys(files).forEach((key) => {
          const match = key.match(/^certifications\[(\d+)\]$/);
          if (match) {
            const certIdx = Number(match[1]);
            if (!grouped[certIdx]) grouped[certIdx] = [];
            const fileOrArray = files[key];
            if (Array.isArray(fileOrArray)) {
              grouped[certIdx].push(...fileOrArray);
            } else {
              grouped[certIdx].push(fileOrArray);
            }
          }
        });
        const maxIdx = Math.max(-1, ...Object.keys(grouped).map(Number));
        uploadedUrls.certifications = [];
        for (let i = 0; i <= maxIdx; i++) {
          const certFiles = grouped[i] || [];
          const certDocs = [];
          for (const cert of certFiles) {
            if (!cert || !cert.mimetype) continue;
            validateFile(cert, ALLOWED_CERT_TYPES);
            const url = await uploadFile(cert, "certificates");
            certDocs.push({
              url,
              originalName: cert.originalFilename,
              mimetype: cert.mimetype,
            });
          }
          uploadedUrls.certifications.push(certDocs);
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
