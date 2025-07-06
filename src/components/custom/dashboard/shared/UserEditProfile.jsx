import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AnimatedTabContent } from "./DashboardTabs";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  ClientBasicInformation,
  ActivitiesAndLanguages,
  HealthInfo,
  ClientLocation,
} from "@/components/custom/dashboard/client/settings";
import {
  Availability,
  TrainerBasicInformation,
  Certification,
  Gallery,
  Specialties,
  WorkoutSpaceLocation,
} from "@/components/custom/dashboard/trainer/settings";
import { useClientEditProfileForm } from "@/hooks/useClientEditProfileForm";
import { useTrainerEditProfileForm } from "@/hooks/useTrainerEditProfileForm";

// Enhanced Modal Component with sophisticated design
const ProfileEditModal = ({
  title,
  subtitle,
  sections,
  activeSection,
  setActiveSection,
  loading,
  error,
  onClose,
  onSubmit,
  children,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{
            opacity: isClosing ? 0 : 1,
            scale: isClosing ? 0.9 : 1,
            y: isClosing ? 30 : 0,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl shadow-2xl w-full max-w-7xl h-[96vh] overflow-hidden border border-[rgba(255,107,0,0.15)] flex flex-col relative"
        >
          {/* Enhanced ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/5 via-transparent to-[#FF9A00]/3 pointer-events-none" />

          {/* Sophisticated animated border with pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF6B00]/20 via-transparent to-[#FF9A00]/20 opacity-50"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.001, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ padding: "1px" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl" />
          </motion.div>

          {/* Enhanced Header with sophisticated design */}
          <motion.div
            className="relative flex items-center justify-between p-6 sm:p-8 border-b border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.08)] via-[rgba(255,107,0,0.04)] to-transparent flex-shrink-0"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div
                className="p-3 sm:p-4 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl shadow-lg relative overflow-hidden"
                variants={fadeIn}
                whileHover={{
                  scale: 1.05,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                {/* Enhanced shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                  initial={{ opacity: 0, x: -100 }}
                  whileHover={{
                    opacity: [0, 1, 0],
                    x: ["-100%", "100%"],
                    transition: { duration: 0.6 },
                  }}
                />
                <Icon
                  icon="mdi:account-edit"
                  width={24}
                  height={24}
                  className="text-white relative z-10"
                />
              </motion.div>
              <div>
                <motion.h2
                  className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                  variants={fadeIn}
                >
                  {title}
                </motion.h2>
                <motion.p
                  className="text-sm sm:text-base text-gray-400 mt-2 hidden sm:block"
                  variants={fadeIn}
                >
                  {subtitle}
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="ghost"
                onClick={handleClose}
                className="p-3 hover:bg-[rgba(255,107,0,0.15)] rounded-2xl transition-all duration-300 group border border-transparent hover:border-[rgba(255,107,0,0.3)]"
              >
                <Icon
                  icon="mdi:close"
                  width={24}
                  height={24}
                  className="text-gray-400 group-hover:text-white transition-colors duration-300"
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Error Banner with sophisticated animations */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mx-6 sm:mx-8 mt-4 p-4 sm:p-5 bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-500/30 rounded-2xl backdrop-blur-sm flex-shrink-0 relative overflow-hidden"
              >
                {/* Enhanced animated background with pulse */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    className="p-2 bg-red-500/25 rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      icon="mdi:alert-circle"
                      width={20}
                      height={20}
                      className="text-red-400"
                    />
                  </motion.div>
                  <div>
                    <span className="text-red-400 font-semibold text-base">
                      Error
                    </span>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0 relative">
            {/* Enhanced Sidebar Navigation */}
            <ProfileSidebar
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Enhanced Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 relative">
              <div className="p-6 sm:p-8 lg:p-10">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="max-w-5xl"
                >
                  {/* Enhanced Section Header */}
                  <SectionHeader
                    sections={sections}
                    activeSection={activeSection}
                  />

                  {/* Enhanced Content Card with sophisticated styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <Card
                      variant="formSection"
                      className="backdrop-blur-xl border-[rgba(255,107,0,0.15)] bg-gradient-to-br from-[rgba(255,107,0,0.03)] via-[rgba(30,30,30,0.8)] to-[rgba(255,107,0,0.02)] !w-full relative overflow-hidden"
                    >
                      {/* Enhanced subtle animated background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/2 via-transparent to-[#FF9A00]/2"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />

                      <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10"
                      >
                        {children}
                      </motion.div>
                    </Card>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <ProfileFooter
            sections={sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            loading={loading}
            onClose={handleClose}
            onSubmit={onSubmit}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Enhanced Sidebar Component with sophisticated design
const ProfileSidebar = ({ sections, activeSection, setActiveSection }) => (
  <div className="w-full lg:w-96 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0f0f0f]/95 to-[#050505]/95 border-b lg:border-b-0 lg:border-r border-[rgba(255,107,0,0.12)] flex-shrink-0 relative">
    {/* Enhanced ambient glow with subtle animation */}
    <motion.div
      className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#FF6B00]/30 to-transparent"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Mobile: Enhanced Horizontal scroll with better design */}
    <div className="lg:hidden p-5 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {sections.map((section, index) => (
          <SidebarButton
            key={section.id}
            section={section}
            index={index}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            isMobile
          />
        ))}
      </div>
    </div>

    {/* Desktop: Enhanced Vertical sidebar with sophisticated animations */}
    <div className="hidden lg:block p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
            <Icon
              icon="mdi:format-list-bulleted"
              width={20}
              height={20}
              className="text-white"
            />
          </div>
          Profile Sections
        </h3>
      </motion.div>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <SidebarButton
            key={section.id}
            section={section}
            index={index}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Sidebar Button Component with sophisticated interactions
const SidebarButton = ({
  section,
  index,
  isActive,
  onClick,
  isMobile = false,
}) => (
  <motion.button
    initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{
      delay: index * (isMobile ? 0.05 : 0.1),
      duration: 0.4,
      ease: "easeOut",
    }}
    onClick={onClick}
    whileHover={{
      scale: isMobile ? 1.02 : 1.03,
      x: isMobile ? 0 : 8,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.98 }}
    className={`${
      isMobile
        ? "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 whitespace-nowrap relative overflow-hidden"
        : "w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden"
    } ${
      isActive
        ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-xl shadow-orange-500/25 border border-orange-400/30"
        : isMobile
        ? "bg-[rgba(255,107,0,0.08)] text-gray-300 hover:text-white hover:bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.2)] hover:border-[rgba(255,107,0,0.4)]"
        : "hover:bg-[rgba(255,107,0,0.08)] text-gray-300 hover:text-white border border-transparent hover:border-[rgba(255,107,0,0.2)]"
    }`}
  >
    {/* Enhanced background glow effect for active state */}
    {isActive && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )}

    {isMobile ? (
      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          className={`p-2 rounded-xl transition-all duration-300 ${
            isActive ? "bg-white/20 shadow-lg" : "bg-[rgba(255,107,0,0.15)]"
          }`}
          whileHover={{
            rotate: 5,
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <Icon
            icon={section.icon}
            width={18}
            height={18}
            className={isActive ? "text-white" : "text-[#FF6B00]"}
          />
        </motion.div>
        <span className="text-sm font-semibold">{section.label}</span>
      </div>
    ) : (
      <div className="flex items-start gap-4 relative z-10">
        <motion.div
          className={`p-3 rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-white/20 shadow-lg"
              : "bg-[rgba(255,107,0,0.12)] group-hover:bg-[rgba(255,107,0,0.2)]"
          }`}
          whileHover={{
            rotate: 5,
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          <Icon
            icon={section.icon}
            width={22}
            height={22}
            className={isActive ? "text-white" : "text-[#FF6B00]"}
          />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-lg transition-colors duration-300 ${
              isActive ? "text-white" : "text-gray-200 group-hover:text-white"
            }`}
          >
            {section.label}
          </h4>
          <p
            className={`text-sm mt-1 transition-colors duration-300 leading-relaxed ${
              isActive
                ? "text-white/80"
                : "text-gray-400 group-hover:text-gray-300"
            }`}
          >
            {section.description}
          </p>
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-3 h-3 bg-white rounded-full shadow-lg mt-2"
          />
        )}
      </div>
    )}
  </motion.button>
);

// Enhanced Section Header Component with sophisticated animations
const SectionHeader = ({ sections, activeSection }) => {
  const currentSection = sections.find((s) => s.id === activeSection);
  if (!currentSection) return null;

  return (
    <motion.div
      className="mb-8 lg:mb-10 hidden sm:block"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-3">
        <motion.div
          className="p-3 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-2xl shadow-lg relative overflow-hidden"
          whileHover={{
            scale: 1.05,
            rotate: 5,
            transition: { type: "spring", stiffness: 300 },
          }}
        >
          {/* Enhanced shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
            initial={{ opacity: 0, x: -100 }}
            whileHover={{
              opacity: [0, 1, 0],
              x: ["-100%", "100%"],
              transition: { duration: 0.6 },
            }}
          />
          <Icon
            icon={currentSection.icon}
            width={24}
            height={24}
            className="text-white relative z-10"
          />
        </motion.div>
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white">
            {currentSection.label}
          </h3>
          {/* Enhanced gradient accent line */}
          <motion.div
            className="h-1 w-12 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full mt-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />
        </div>
      </div>
      <p className="text-gray-400 ml-16 text-base leading-relaxed">
        {currentSection.description}
      </p>
    </motion.div>
  );
};

// Enhanced Footer Component with sophisticated design
const ProfileFooter = ({
  sections,
  activeSection,
  setActiveSection,
  loading,
  onClose,
  onSubmit,
}) => (
  <motion.div
    className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 border-t border-[rgba(255,107,0,0.12)] bg-gradient-to-r from-[rgba(255,107,0,0.05)] via-transparent to-[rgba(255,107,0,0.03)] flex-shrink-0 gap-6 sm:gap-0 relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    {/* Enhanced ambient glow */}
    <motion.div
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/40 to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Enhanced Progress Dots with sophisticated animations */}
    <div className="flex items-center gap-3 order-2 sm:order-1">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isCompleted =
          sections.findIndex((s) => s.id === activeSection) > index;
        return (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] shadow-lg shadow-orange-500/40 scale-125"
                : isCompleted
                ? "bg-[#FF6B00]/70 hover:bg-[#FF6B00]/90 shadow-md"
                : "bg-[#333] hover:bg-[#555] hover:scale-110"
            }`}
            aria-label={`Go to ${section.label}`}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] opacity-50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        );
      })}
    </div>

    {/* Enhanced Action Buttons with sophisticated styling */}
    <div className="flex gap-4 order-1 sm:order-2 w-full sm:w-auto">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 sm:flex-none"
      >
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="w-full sm:w-auto border-[rgba(255,107,0,0.4)] text-gray-300 hover:text-white hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] transition-all duration-300 px-6 py-3 text-base font-medium rounded-xl"
        >
          Cancel
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 sm:flex-none"
      >
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-3 text-base font-semibold rounded-xl relative overflow-hidden"
        >
          {/* Enhanced button glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Icon icon="eos-icons:loading" width={18} height={18} />
                </motion.div>
                Saving...
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save" width={18} height={18} />
                Save Profile
              </>
            )}
          </div>
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

// Form Content Renderer with enhanced animations
const FormContentRenderer = ({ sections, activeSection, children }) => (
  <form className="space-y-8">
    {sections.map((section) => (
      <AnimatedTabContent
        key={section.id}
        isActive={activeSection === section.id}
        tabId={section.id}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children[section.id]}
        </motion.div>
      </AnimatedTabContent>
    ))}
  </form>
);

// Client Configuration with enhanced descriptions
const CLIENT_SECTIONS = [
  {
    id: "basicInfo",
    label: "Basic Information",
    icon: "mdi:account-circle",
    description: "Personal details, profile photo, and contact information",
  },
  {
    id: "activities",
    label: "Activities & Languages",
    icon: "mdi:run",
    description: "Preferred activities, fitness goals, and spoken languages",
  },
  {
    id: "health",
    label: "Health Information",
    icon: "mdi:heart-pulse",
    description: "Medical conditions, allergies, and health considerations",
  },
  {
    id: "contactLocation",
    label: "Location",
    icon: "mdi:map-marker",
    description: "Location details and contact preferences",
  },
];

// Trainer Configuration with enhanced descriptions
const TRAINER_SECTIONS = [
  {
    id: "basicInfo",
    label: "Basic Information",
    icon: "mdi:account-circle",
    description: "Personal details, pricing, and professional information",
  },
  {
    id: "specialties",
    label: "Specialties",
    icon: "mdi:star-circle",
    description: "Training specialties, expertise areas, and service types",
  },
  {
    id: "certification",
    label: "Certifications",
    icon: "mdi:certificate",
    description: "Professional certifications and qualifications",
  },
  {
    id: "availability",
    label: "Availability",
    icon: "mdi:calendar-clock",
    description: "Schedule, working hours, and session preferences",
  },
  {
    id: "workoutSpaceLocation",
    label: "Workout Space",
    icon: "mdi:map-marker",
    description: "Training locations and facility information",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: "mdi:image-multiple",
    description: "Photos, portfolio, and visual showcase",
  },
];

// Hook for shared profile edit logic
const useProfileEdit = (hookHandleSubmit, data, onSave, onClose, setError) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await hookHandleSubmit(e);
      if (onSave) {
        await onSave(data);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save profile");
    }
  };

  return { handleSubmit };
};

export const ClientEditProfile = ({
  onClose,
  userData: _userData = {},
  onSave,
}) => {
  // Don't pass userData to hook - let it fetch fresh data
  const hook = useClientEditProfileForm(null);
  const {
    activeSection,
    setActiveSection,
    loading,
    error,
    setError,
    handleSubmit: hookHandleSubmit,
    previewImage,
    handleImageUpload,
    handleChange,
    clientData,
    setClientData,
  } = hook;

  const { handleSubmit } = useProfileEdit(
    hookHandleSubmit,
    clientData,
    onSave,
    onClose,
    setError
  );

  const formContent = {
    basicInfo: (
      <ClientBasicInformation
        clientData={clientData}
        handleChange={handleChange}
        previewImage={previewImage}
        handleImageUpload={handleImageUpload}
      />
    ),
    activities: (
      <ActivitiesAndLanguages
        clientData={clientData}
        setClientData={setClientData}
        handleChange={handleChange}
      />
    ),
    health: <HealthInfo clientData={clientData} handleChange={handleChange} />,
    contactLocation: (
      <ClientLocation
        clientData={clientData}
        setClientData={setClientData}
        handleChange={handleChange}
      />
    ),
  };

  return (
    <ProfileEditModal
      title="Edit Profile"
      subtitle="Update your client profile information and preferences"
      sections={CLIENT_SECTIONS}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      loading={loading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormContentRenderer
        sections={CLIENT_SECTIONS}
        activeSection={activeSection}
      >
        {formContent}
      </FormContentRenderer>
    </ProfileEditModal>
  );
};

export const TrainerEditProfile = ({
  onClose,
  userData: _userData = {},
  onSave,
}) => {
  // Don't pass userData to hook - let it fetch fresh data with edit mode
  const hook = useTrainerEditProfileForm(null);
  const {
    activeSection,
    setActiveSection,
    loading,
    error,
    setError,
    handleSubmit: hookHandleSubmit,
    previewImage,
    handleImageUpload,
    handleChange,
    trainerData,
    setTrainerData,
    initialCertifications,
    resetCertFieldsTrigger,
    certFields,
    setCertFields,
    handleCertificationsChange,
    handleResetCertifications,
  } = hook;

  const { handleSubmit } = useProfileEdit(
    hookHandleSubmit,
    trainerData,
    onSave,
    onClose,
    setError
  );

  const formContent = {
    basicInfo: (
      <TrainerBasicInformation
        trainerData={trainerData?.trainerProfile || {}}
        handleChange={handleChange}
        previewImage={previewImage}
        handleImageUpload={handleImageUpload}
      />
    ),
    specialties: (
      <Specialties
        trainerData={trainerData}
        handleChange={handleChange}
        setTrainerData={setTrainerData}
      />
    ),
    certification: (
      <Certification
        trainerData={trainerData}
        handleChange={handleChange}
        setTrainerData={setTrainerData}
        onResetCertifications={handleResetCertifications}
        resetCertFieldsTrigger={resetCertFieldsTrigger}
        initialCertifications={initialCertifications}
        onCertificationsChange={handleCertificationsChange}
        certFields={certFields}
        setCertFields={setCertFields}
      />
    ),
    availability: (
      <Availability
        trainerData={trainerData}
        handleChange={handleChange}
        setTrainerData={setTrainerData}
      />
    ),
    workoutSpaceLocation: (
      <WorkoutSpaceLocation
        trainerData={trainerData}
        setTrainerData={setTrainerData}
      />
    ),
    gallery: (
      <Gallery trainerData={trainerData} setTrainerData={setTrainerData} />
    ),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ProfileEditModal
        title="Edit Profile"
        subtitle="Update your trainer profile information and showcase"
        sections={TRAINER_SECTIONS}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        loading={loading}
        error={error}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        <FormContentRenderer
          sections={TRAINER_SECTIONS}
          activeSection={activeSection}
        >
          {formContent}
        </FormContentRenderer>
      </ProfileEditModal>
    </DndProvider>
  );
};

export const UserEditProfile = ({ profileType = "client", ...props }) => {
  if (profileType === "trainer") {
    return <TrainerEditProfile {...props} />;
  }
  return <ClientEditProfile {...props} />;
};
