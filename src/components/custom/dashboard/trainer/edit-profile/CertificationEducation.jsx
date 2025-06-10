import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import { SectionTitle } from "@/components/custom/dashboard/shared";
import { EducationUpload } from "@/components/custom/personal-details/shared/EducationUpload";
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

export const CertificationEducation = ({
  trainerData,
  setTrainerData,
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

  const [educationFields, setEducationFields] = useState([]);

  console.log(certFields, "certFields");

  console.log(trainerData, "trainerData certifikati");
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

  // Initialize educationFields from trainerData.education
  useEffect(() => {
    if (trainerData.education && trainerData.education.length > 0) {
      setEducationFields(trainerData.education);
    } else {
      // If no education, initialize with one empty field
      setEducationFields([
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          description: "",
        },
      ]);
    }
  }, [trainerData.education]);

  // Handler for certification changes
  const handleCertChange = (index, field, value) => {
    const updatedFields = [...certFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setCertFields(updatedFields);
  };

  // Handler for education changes
  const handleEducationChange = (index, field, value) => {
    const updatedFields = [...educationFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setEducationFields(updatedFields);

    // Update the parent component's state
    setTrainerData({
      ...trainerData,
      education: updatedFields,
    });
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

  // Add new education field
  const addEducationField = () => {
    const newFields = [
      ...educationFields,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        description: "",
      },
    ];
    setEducationFields(newFields);
  };

  // Remove certification field
  const removeCertField = (index) => {
    const newFields = certFields.filter((_, i) => i !== index);
    setCertFields(newFields);
  };

  // Remove education field
  const removeEducationField = (index) => {
    const newFields = educationFields.filter((_, i) => i !== index);
    setEducationFields(newFields);

    // Update the parent component's state
    setTrainerData({
      ...trainerData,
      education: newFields,
    });
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
      <SectionTitle title="Certifications & Education" />

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

      {/* Education Section */}
      <motion.h3
        variants={fadeInUp}
        className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
      >
        Education
      </motion.h3>

      <motion.div variants={fadeInUp}>
        <EducationUpload
          educationFields={educationFields}
          handleEducationChange={handleEducationChange}
          addEducationField={addEducationField}
          removeEducationField={removeEducationField}
        />
        <p className="mt-2 text-xs text-gray-400">
          Add your educational background to showcase your knowledge and
          qualifications
        </p>
      </motion.div>
    </motion.div>
  );
};
