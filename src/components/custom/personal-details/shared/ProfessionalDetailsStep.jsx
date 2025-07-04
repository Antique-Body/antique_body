"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { CertificationUpload } from "../../shared";

import { FormSection, LanguageSelector, TrainingTypeSelector } from "./";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const ProfessionalDetailsStep = ({
  formData,
  onChange,
  certFields,
  handleCertChange,
  addCertField,
  removeCertField,
  errors = {},
}) => {
  const handleLanguageChange = (languages) => {
    onChange({
      target: {
        name: "languages",
        value: languages,
      },
    });
  };

  const handleEnvironmentChange = (environment) => {
    onChange({
      target: {
        name: "trainingEnvironment",
        value: environment,
      },
    });
  };

  const handleTrainingTypeToggle = (typeId) => {
    const currentTypes = formData.trainingTypes || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter((id) => id !== typeId)
      : [...currentTypes, typeId];

    onChange({
      target: {
        name: "trainingTypes",
        value: newTypes,
      },
    });
  };

  // Get completion status for visual indicators
  const getCompletionStatus = () => {
    const hasLanguages = formData.languages?.length > 0;
    const hasEnvironment = formData.trainingEnvironment;
    const hasTypes = formData.trainingTypes?.length > 0;

    const certNumber = formData.certifications.filter(
      (cert) => cert.name && cert.name.trim() !== ""
    ).length;

    return {
      hasLanguages,
      hasEnvironment,
      hasTypes,
      certNumber,
    };
  };

  const status = getCompletionStatus();

  console.log(certFields, "status");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Progress Overview */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasLanguages
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:translate"
              width={18}
              height={18}
              className={
                status.hasLanguages ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasLanguages ? "text-green-400" : "text-gray-400"
                }`}
              >
                Languages
              </p>
              <p className="text-xs text-gray-500">
                {status.hasLanguages ? `${formData.languages.length}` : "0"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasEnvironment
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:home-variant"
              width={18}
              height={18}
              className={
                status.hasEnvironment ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasEnvironment ? "text-green-400" : "text-gray-400"
                }`}
              >
                Environment
              </p>
              <p className="text-xs text-gray-500">
                {status.hasEnvironment ? "Set" : "Not set"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasTypes
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:dumbbell"
              width={18}
              height={18}
              className={status.hasTypes ? "text-green-400" : "text-gray-400"}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasTypes ? "text-green-400" : "text-gray-400"
                }`}
              >
                Training Types
              </p>
              <p className="text-xs text-gray-500">
                {status.hasTypes ? `${formData.trainingTypes.length}` : "0"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.certNumber > 0
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:certificate"
              width={18}
              height={18}
              className={
                status.certNumber > 0 ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.certNumber > 0 ? "text-green-400" : "text-gray-400"
                }`}
              >
                Certificates
              </p>
              <p className="text-xs text-gray-500">
                {status.certNumber > 0 ? `${status.certNumber}` : "0"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Languages */}
      <motion.div variants={fadeInUp}>
        <FormSection
          title="Languages"
          icon={<Icon icon="mdi:translate" width={20} height={20} />}
        >
          <LanguageSelector
            selectedLanguages={formData.languages || []}
            onChange={handleLanguageChange}
            error={errors.languages}
          />
        </FormSection>
      </motion.div>

      {/* Training Setup */}
      <motion.div variants={fadeInUp}>
        <FormSection
          title=""
          icon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
          description=""
        >
          <TrainingTypeSelector
            selectedEnvironment={formData.trainingEnvironment}
            selectedTypes={formData.trainingTypes || []}
            onEnvironmentChange={handleEnvironmentChange}
            onTypeToggle={handleTrainingTypeToggle}
            errorEnvironment={errors.trainingEnvironment}
            errorTypes={errors.trainingTypes}
          />
        </FormSection>
      </motion.div>

      {/* Certifications */}
      <motion.div variants={fadeInUp}>
        <FormSection
          title="Certifications"
          icon={<Icon icon="mdi:certificate" width={20} height={20} />}
          description="Upload your professional certifications and credentials"
        >
          <CertificationUpload
            certFields={certFields}
            handleCertChange={handleCertChange}
            addCertField={addCertField}
            removeCertField={removeCertField}
            isRegistration={true}
          />
        </FormSection>
      </motion.div>
    </motion.div>
  );
};
