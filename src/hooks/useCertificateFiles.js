import { useState, useEffect, useRef } from "react";

const ALLOWED_CERT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_CERT_SIZE_MB = 1;
const MAX_FILES = 5;

function validateCertFile(file) {
  if (!file) return "Invalid file";

  if (!ALLOWED_CERT_TYPES.includes(file.type)) {
    return "Unsupported file format!";
  }
  if (file.size > MAX_CERT_SIZE_MB * 1024 * 1024) {
    return `File is too large! Maximum size is ${MAX_CERT_SIZE_MB}MB.`;
  }
  return null;
}

export function useCertificateFiles(
  certFields,
  handleCertChange,
  removeCertField
) {
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});
  const prevCertFields = useRef([]);
  const blobUrls = useRef([]);

  // Clean up any existing blob URLs
  const cleanupBlobUrls = () => {
    blobUrls.current.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    blobUrls.current = [];
  };

  // Generate previews for image files
  useEffect(() => {
    if (!certFields || !Array.isArray(certFields)) return;

    // If certFields structure has changed, clean up previous blob URLs
    if (
      JSON.stringify(prevCertFields.current.map((f) => f.id)) !==
      JSON.stringify(certFields.map((f) => f.id))
    ) {
      cleanupBlobUrls();
    }

    // Store current certFields structure for next comparison
    prevCertFields.current = certFields;

    // Create new previews object
    const newPreviews = {};

    certFields.forEach((field, index) => {
      if (field.files && Array.isArray(field.files)) {
        newPreviews[index] = {};

        field.files.forEach((file, fileIndex) => {
          // Only create blob URLs for actual File objects that are images
          if (
            file instanceof File &&
            file.type &&
            file.type.startsWith("image/")
          ) {
            const blobUrl = URL.createObjectURL(file);
            newPreviews[index][fileIndex] = blobUrl;
            blobUrls.current.push(blobUrl);
          } else if (file.type && file.type.startsWith("image/") && file.url) {
            // If it's an image but already has a URL (from server)
            newPreviews[index][fileIndex] = file.url;
          }
        });
      }
    });

    setPreviews(newPreviews);
  }, [certFields]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      cleanupBlobUrls();
    },
    []
  );

  const handleAddFiles = (index, files) => {
    try {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const currentFiles = certFields[index]?.files || [];

      // Validate files before adding
      const errorsArr = fileArray.map(validateCertFile).filter(Boolean);
      if (errorsArr.length > 0) {
        setErrors((prev) => ({
          ...prev,
          [index]: errorsArr.join(", "),
        }));
        return;
      }

      // Check if we'll exceed the max files limit
      if (currentFiles.length + fileArray.length > MAX_FILES) {
        setErrors((prev) => ({
          ...prev,
          [index]: `You can upload a maximum of ${MAX_FILES} files per certification.`,
        }));
        return;
      }

      // Clear error if there was one
      setErrors((prev) => ({
        ...prev,
        [index]: "",
      }));

      // Combine existing files with new ones
      const combinedFiles = [...currentFiles, ...fileArray];
      handleCertChange(index, "files", combinedFiles);
    } catch (error) {
      console.error("Error adding files:", error);
      setErrors((prev) => ({
        ...prev,
        [index]: "Error adding files. Please try again.",
      }));
    }
  };

  const handleRemoveFile = (certIndex, fileIndex) => {
    try {
      const currentFiles = certFields[certIndex]?.files || [];
      if (currentFiles.length <= fileIndex) return;

      // Revoke the blob URL if this was an image file
      if (
        previews[certIndex] &&
        previews[certIndex][fileIndex] &&
        previews[certIndex][fileIndex].startsWith("blob:")
      ) {
        URL.revokeObjectURL(previews[certIndex][fileIndex]);
      }

      // Create a new array without the removed file
      const updatedFiles = [...currentFiles];
      updatedFiles.splice(fileIndex, 1);

      // Update the certFields state
      handleCertChange(certIndex, "files", updatedFiles);

      // Update previews state
      setPreviews((prev) => {
        const updated = { ...prev };
        if (updated[certIndex]) {
          const newPreviewsForCert = { ...updated[certIndex] };
          delete newPreviewsForCert[fileIndex];

          // Reindex the remaining previews
          const reindexed = {};
          Object.values(newPreviewsForCert).forEach((preview, idx) => {
            reindexed[idx] = preview;
          });

          updated[certIndex] = reindexed;
        }
        return updated;
      });
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const handleRemoveCertField = (index) => {
    try {
      // Clean up any blob URLs for this cert
      if (previews[index]) {
        Object.values(previews[index]).forEach((url) => {
          if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }

      // Remove this cert's errors
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });

      // Remove this cert's previews
      setPreviews((prev) => {
        const updated = { ...prev };
        delete updated[index];

        // Reindex the remaining previews
        const reindexed = {};
        Object.entries(updated).forEach(([key, value], idx) => {
          if (parseInt(key) > index) {
            reindexed[idx] = value;
          } else {
            reindexed[parseInt(key)] = value;
          }
        });

        return reindexed;
      });

      // Call the parent component's removeCertField function
      removeCertField(index);
    } catch (error) {
      console.error("Error removing certification field:", error);
    }
  };

  return {
    previews,
    errors,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveCertField,
  };
}
