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
  const [errors, setErrors] = useState([]);
  const [previews, setPreviews] = useState([]);
  const prevUrlsRef = useRef([]);

  // Sync previews with files
  useEffect(() => {
    setPreviews((prev) =>
      certFields.map((field, idx) => {
        const files = field.files || [];
        return files.map((file, i) => {
          // If preview exists for this file at the same index and file is the same, use it
          if (
            prev[idx] &&
            prev[idx][i] &&
            prev[idx].length === files.length &&
            prevUrlsRef.current[idx] &&
            prevUrlsRef.current[idx][i] === file
          ) {
            return prev[idx][i];
          }
          return file.type && file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : "";
        });
      })
    );
    // Remember current file objects for comparison
    prevUrlsRef.current = certFields.map((field) => field.files || []);
  }, [certFields]);

  // Cleanup blob URLs on unmount or change
  useEffect(
    () => () => {
      previews.forEach((previewArray) => {
        if (previewArray) {
          previewArray.forEach((url) => {
            if (url && url.startsWith("blob:")) {
              URL.revokeObjectURL(url);
            }
          });
        }
      });
    },
    [previews]
  );

  const handleAddFiles = (index, files) => {
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    const currentFiles = certFields[index].files || [];
    const combinedFiles = [...currentFiles, ...fileArray];
    if (combinedFiles.length > MAX_FILES) {
      setErrors((prev) => {
        const updated = [...prev];
        updated[
          index
        ] = `You can upload a maximum of ${MAX_FILES} files per certification.`;
        return updated;
      });
      return;
    }
    const errorsArr = fileArray.map(validateCertFile).filter(Boolean);
    if (errorsArr.length > 0) {
      setErrors((prev) => {
        const updated = [...prev];
        updated[index] = errorsArr.join(", ");
        return updated;
      });
      return;
    }
    setErrors((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
    handleCertChange(index, "files", combinedFiles);
  };

  const handleRemoveFile = (certIndex, fileIndex) => {
    const currentFiles = certFields[certIndex].files || [];
    if (currentFiles.length <= fileIndex) return;
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(fileIndex, 1);
    handleCertChange(certIndex, "files", updatedFiles);
  };

  const handleRemoveCertField = (index) => {
    setErrors((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setPreviews((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].forEach((url) => {
          if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }
      updated.splice(index, 1);
      return updated;
    });
    removeCertField(index);
  };

  return {
    previews,
    errors,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveCertField,
  };
}
