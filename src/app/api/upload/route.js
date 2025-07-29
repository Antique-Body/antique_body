import { Readable } from "stream";
import formidable from "formidable";
import { UPLOAD_CONFIG } from "@/config/upload";
import { uploadFile, initGCS } from "@/lib/storage";

// Next.js App Router config for file uploads
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Simple test endpoint
export async function GET() {
  return new Response(
    JSON.stringify({ success: true, message: "Upload API is working" }),
    { status: 200 }
  );
}

export async function POST(request) {
  console.log("=== UPLOAD API CALLED ===");
  console.log("Request method:", request.method);
  console.log("Request URL:", request.url);

  // Simple test response to see if POST is working
  if (
    request.method === "POST" &&
    !request.headers.get("content-type")?.includes("multipart/form-data")
  ) {
    console.log("Simple POST test - no multipart data");
    return new Response(
      JSON.stringify({ success: true, message: "POST method working" }),
      { status: 200 }
    );
  }

  try {
    // Initialize GCS
    initGCS();

    // Get request headers
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Request headers:", headers);

    // Get request body as buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("Request buffer size:", buffer.length);

    // Create a readable stream for formidable
    const nodeReq = new Readable();
    nodeReq._read = () => {};
    nodeReq.push(buffer);
    nodeReq.push(null);
    nodeReq.headers = headers;
    nodeReq.method = request.method;

    return new Promise((resolve) => {
      // Configure formidable
      const form = formidable({
        multiples: true,
        keepExtensions: true,
        uploadDir: "/tmp",
        maxFileSize: 50 * 1024 * 1024,
      });

      // Parse the form
      form.parse(nodeReq, async (err, fields, files) => {
        try {
          if (err) {
            console.error("Formidable error:", err);
            throw err;
          }

          console.log("=== FORMIDABLE PARSED ===");
          console.log("Fields:", fields);
          console.log("Files keys:", Object.keys(files));
          console.log("Files structure:", files);

          // Extract files from the request
          const filesArray = [];
          Object.keys(files).forEach((key) => {
            console.log("Processing key:", key);
            const match = key.match(/^files\[(\d+)\]$/);
            if (match) {
              const index = parseInt(match[1]);
              // Extract the first file from the array since formidable returns arrays
              const fileArray = files[key];
              if (Array.isArray(fileArray) && fileArray.length > 0) {
                filesArray[index] = fileArray[0];
                console.log(`Added file at index ${index}:`, fileArray[0]);
              }
            }
          });

          console.log("Files array length:", filesArray.length);
          console.log("Files array:", filesArray);

          if (filesArray.length > 0) {
            console.log("Processing files...");

            const config = UPLOAD_CONFIG.files;
            console.log("Using config:", config);

            const result = await processFiles(filesArray, config);
            console.log("Process files result:", result);

            if (result && result.length > 0) {
              console.log("Files uploaded successfully:", result.length);
              resolve(
                new Response(
                  JSON.stringify({
                    success: true,
                    data: result,
                  }),
                  { status: 200 }
                )
              );
            } else {
              console.log("No files were processed successfully");
              resolve(
                new Response(
                  JSON.stringify({
                    success: true,
                    data: [],
                  }),
                  { status: 200 }
                )
              );
            }
          } else {
            console.log("No files found in request");
            resolve(
              new Response(
                JSON.stringify({
                  success: true,
                  data: [],
                }),
                { status: 200 }
              )
            );
          }
        } catch (error) {
          console.error("Upload processing error:", error);
          resolve(
            new Response(
              JSON.stringify({
                success: false,
                error: error.message,
              }),
              { status: 400 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// File processing function
async function processFiles(files, config) {
  console.log("processFiles called with:", {
    filesCount: files.length,
    config,
  });

  const fileArray = Array.isArray(files) ? files : [files];
  const validFiles = fileArray.filter((file) => file && file.mimetype);

  console.log("Valid files:", validFiles.length);
  console.log(
    "Valid files details:",
    validFiles.map((f) => ({
      name: f.originalFilename,
      size: f.size,
      type: f.mimetype,
      filepath: f.filepath,
    }))
  );

  if (validFiles.length === 0) {
    console.log("No valid files found");
    return null;
  }

  // Process all files
  console.log("Processing array of files:", validFiles.length);
  const uploadPromises = validFiles.map(async (file, index) => {
    console.log(`Uploading file ${index}:`, file.originalFilename);
    try {
      validateFile(file, config);
      const url = await uploadFile(file, config.folder);
      console.log(`File ${index} uploaded to:`, url);
      return {
        url,
        originalName: file.originalFilename,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error(`Error uploading file ${index}:`, error);
      throw error;
    }
  });

  const result = await Promise.all(uploadPromises);
  console.log("All files uploaded:", result);
  return result;
}

// File validation function
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
