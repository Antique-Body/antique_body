import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import { SectionTitle } from "@/components/custom/dashboard/shared";
import { CertificationUpload } from "@/components/custom/shared";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Certification = ({
  trainerData,
  onResetCertifications,
  resetCertFieldsTrigger,
  initialCertifications,
  onCertificationsChange,
  certFields: propCertFields,
  setCertFields: propSetCertFields,
}) => {
  // Ako su proslijeđeni certFields i setCertFields iz parenta, koristi njih, inače koristi lokalni state
  const [localCertFields, localSetCertFields] = useState([]);
  const certFields = propCertFields || localCertFields;
  const setCertFields = propSetCertFields || localSetCertFields;

  // Initialize certFields from trainerData.certifications
  useEffect(() => {
    if (
      trainerData.trainerProfile.certifications &&
      trainerData.trainerProfile.certifications.length > 0
    ) {
      const mappedCerts = trainerData.trainerProfile.certifications.map(
        (cert) => {
          if (typeof cert === "string") {
            return {
              name: cert,
              issuer: "",
              expiryDate: "",
              status: "pending",
              documents: [],
              files: [],
              hidden: false,
              id: undefined,
              trainerProfileId: undefined,
              createdAt: undefined,
              updatedAt: undefined,
            };
          }
          return {
            id: cert.id,
            trainerProfileId: cert.trainerProfileId,
            name: cert.name || "",
            issuer: cert.issuer || "",
            expiryDate: cert.expiryDate ? cert.expiryDate.substring(0, 10) : "",
            status: cert.status || "pending",
            documents: cert.documents || [],
            files: [],
            hidden: cert.hidden !== undefined ? cert.hidden : false,
            createdAt: cert.createdAt,
            updatedAt: cert.updatedAt,
          };
        }
      );
      setCertFields(mappedCerts);
    } else {
      setCertFields([
        {
          name: "",
          issuer: "",
          expiryDate: "",
          status: "pending",
          documents: [],
          files: [],
          hidden: false,
        },
      ]);
    }
  }, [trainerData.trainerProfile.certifications, resetCertFieldsTrigger]);

  // Handler for certification changes
  const handleCertChange = (index, field, value) => {
    const updatedFields = [...certFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setCertFields(updatedFields);
  };

  // Add new certification field
  const addCertField = () => {
    const newFields = [
      ...certFields,
      {
        name: "",
        issuer: "",
        expiryDate: "",
        status: "pending",
        documents: [],
        files: [],
        hidden: false,
      },
    ];
    setCertFields(newFields);
  };

  // Remove certification field
  const removeCertField = (index) => {
    const newFields = certFields.filter((_, i) => i !== index);
    setCertFields(newFields);
  };

  // Dodaj poziv onCertificationsChange svaki put kad se certFields promijeni
  useEffect(() => {
    if (typeof onCertificationsChange === "function") {
      onCertificationsChange(certFields);
    }
    // eslint-disable-next-line
  }, [certFields]);

  // Prilikom spremanja (Save Profile), šalji hidden: isHidden
  // Ovo radiš u parentu, ali ovdje možeš pripremiti podatke:

  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SectionTitle title="Certifications" />

      {/* Certifications Section */}
      <motion.h3
        variants={fadeInUp}
        className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
      >
        Certifications
      </motion.h3>

      <motion.div variants={fadeInUp}>
        <CertificationUpload
          certFields={certFields}
          handleCertChange={handleCertChange}
          addCertField={addCertField}
          removeCertField={removeCertField}
          onResetCertifications={onResetCertifications}
          initialCertifications={initialCertifications}
        />
        <p className="mt-2 text-xs text-gray-400">
          Add certifications to build credibility with potential clients
        </p>
      </motion.div>
    </motion.div>
  );
};
