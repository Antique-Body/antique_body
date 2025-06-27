import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
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

// Shared Modal Component
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
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] sm:max-h-[95vh] overflow-hidden border border-[rgba(255,107,0,0.1)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-transparent flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-xl shadow-lg">
              <Icon
                icon="mdi:account-edit"
                width={20}
                height={20}
                className="text-white sm:w-6 sm:h-6"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,107,0,0.1)] rounded-xl transition-all duration-200 group"
          >
            <Icon
              icon="mdi:close"
              width={20}
              height={20}
              className="text-gray-400 group-hover:text-white transition-colors sm:w-6 sm:h-6"
            />
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl backdrop-blur-sm flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-500/20 rounded-lg">
                <Icon
                  icon="mdi:alert-circle"
                  width={16}
                  height={16}
                  className="text-red-400 sm:w-5 sm:h-5"
                />
              </div>
              <div>
                <span className="text-red-400 font-semibold text-sm sm:text-base">
                  Error
                </span>
                <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Sidebar Navigation */}
          <ProfileSidebar
            sections={sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 sm:p-6 lg:p-8">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl"
              >
                {/* Section Header */}
                <SectionHeader
                  sections={sections}
                  activeSection={activeSection}
                />

                {/* Content */}
                <Card
                  variant="darkStrong"
                  className="backdrop-blur-xl border-[rgba(255,107,0,0.1)] bg-gradient-to-br from-[rgba(255,107,0,0.02)] to-transparent !w-full"
                >
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    {children}
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <ProfileFooter
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          loading={loading}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </motion.div>
    </div>
  );
};

// Sidebar Component
const ProfileSidebar = ({ sections, activeSection, setActiveSection }) => (
  <div className="w-full lg:w-80 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-b lg:border-b-0 lg:border-r border-[rgba(255,107,0,0.1)] flex-shrink-0">
    {/* Mobile: Horizontal scroll */}
    <div className="lg:hidden p-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
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

    {/* Desktop: Vertical sidebar */}
    <div className="hidden lg:block p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Icon
          icon="mdi:format-list-bulleted"
          width={20}
          height={20}
          className="text-[#FF6B00]"
        />
        Profile Sections
      </h3>
      <div className="space-y-2">
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

// Sidebar Button Component
const SidebarButton = ({
  section,
  index,
  isActive,
  onClick,
  isMobile = false,
}) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * (isMobile ? 0.05 : 0.1) }}
    onClick={onClick}
    className={`${
      isMobile
        ? "flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap"
        : "w-full text-left p-4 rounded-xl transition-all duration-300 group"
    } ${
      isActive
        ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg shadow-orange-500/20"
        : isMobile
        ? "bg-[rgba(255,107,0,0.1)] text-gray-300 hover:text-white hover:bg-[rgba(255,107,0,0.2)]"
        : "hover:bg-[rgba(255,107,0,0.05)] text-gray-300 hover:text-white"
    }`}
  >
    {isMobile ? (
      <>
        <Icon
          icon={section.icon}
          width={16}
          height={16}
          className={isActive ? "text-white" : "text-[#FF6B00]"}
        />
        <span className="text-sm font-medium">{section.label}</span>
      </>
    ) : (
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-white/20"
              : "bg-[rgba(255,107,0,0.1)] group-hover:bg-[rgba(255,107,0,0.2)]"
          }`}
        >
          <Icon
            icon={section.icon}
            width={20}
            height={20}
            className={isActive ? "text-white" : "text-[#FF6B00]"}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium transition-colors ${
              isActive ? "text-white" : "text-gray-200 group-hover:text-white"
            }`}
          >
            {section.label}
          </h4>
          <p
            className={`text-sm mt-1 transition-colors ${
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-white rounded-full mt-2"
          />
        )}
      </div>
    )}
  </motion.button>
);

// Section Header Component
const SectionHeader = ({ sections, activeSection }) => {
  const currentSection = sections.find((s) => s.id === activeSection);
  if (!currentSection) return null;

  return (
    <div className="mb-6 lg:mb-8 hidden sm:block">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] rounded-lg">
          <Icon
            icon={currentSection.icon}
            width={20}
            height={20}
            className="text-white"
          />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-white">
          {currentSection.label}
        </h3>
      </div>
      <p className="text-gray-400 ml-11 text-sm">
        {currentSection.description}
      </p>
    </div>
  );
};

// Footer Component
const ProfileFooter = ({
  sections,
  activeSection,
  setActiveSection,
  loading,
  onClose,
  onSubmit,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-[rgba(255,107,0,0.1)] bg-gradient-to-r from-[rgba(255,107,0,0.02)] to-transparent flex-shrink-0 gap-4 sm:gap-0">
    {/* Progress Dots */}
    <div className="flex items-center gap-2 order-2 sm:order-1">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        const isCompleted =
          sections.findIndex((s) => s.id === activeSection) > index;
        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] shadow-lg shadow-orange-500/30 scale-125"
                : isCompleted
                ? "bg-[#FF6B00]/60 hover:bg-[#FF6B00]/80"
                : "bg-[#333] hover:bg-[#555]"
            }`}
            aria-label={`Go to ${section.label}`}
          />
        );
      })}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={loading}
        className="flex-1 sm:flex-none border-[rgba(255,107,0,0.3)] text-gray-300 hover:text-white hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.1)] transition-all duration-300 px-4 py-2 text-sm sm:text-base"
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 sm:flex-none bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 py-2 text-sm sm:text-base font-medium"
      >
        {loading ? (
          <>
            <Icon
              icon="eos-icons:loading"
              width={16}
              height={16}
              className="mr-2 animate-spin"
            />
            Saving...
          </>
        ) : (
          <>
            <Icon
              icon="mdi:content-save"
              width={16}
              height={16}
              className="mr-2"
            />
            Save Profile
          </>
        )}
      </Button>
    </div>
  </div>
);

// Form Content Renderer
const FormContentRenderer = ({ sections, activeSection, children }) => (
  <form className="space-y-6">
    {sections.map((section) => (
      <AnimatedTabContent
        key={section.id}
        isActive={activeSection === section.id}
        tabId={section.id}
      >
        {children[section.id]}
      </AnimatedTabContent>
    ))}
  </form>
);

// Client Configuration
const CLIENT_SECTIONS = [
  {
    id: "basicInfo",
    label: "Basic Information",
    icon: "mdi:account-circle",
    description: "Personal details and contact info",
  },
  {
    id: "activities",
    label: "Activities & Languages",
    icon: "mdi:run",
    description: "Preferred activities and languages",
  },
  {
    id: "health",
    label: "Health Information",
    icon: "mdi:heart-pulse",
    description: "Health conditions and fitness data",
  },
  {
    id: "contactLocation",
    label: "Location",
    icon: "mdi:map-marker",
    description: "Contact and location details",
  },
];

// Trainer Configuration
const TRAINER_SECTIONS = [
  {
    id: "basicInfo",
    label: "Basic Information",
    icon: "mdi:account-circle",
    description: "Personal details and contact info",
  },
  {
    id: "specialties",
    label: "Specialties",
    icon: "mdi:star-circle",
    description: "Training specialties and expertise",
  },
  {
    id: "certification",
    label: "Certifications",
    icon: "mdi:certificate",
    description: "Professional certifications",
  },
  {
    id: "availability",
    label: "Availability",
    icon: "mdi:calendar-clock",
    description: "Schedule and working hours",
  },
  {
    id: "workoutSpaceLocation",
    label: "Workout Space",
    icon: "mdi:map-marker",
    description: "Location and training environment",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: "mdi:image-multiple",
    description: "Photos and portfolio",
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
  const hook = useClientEditProfileForm();
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
      subtitle="Update your client profile information"
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
  const hook = useTrainerEditProfileForm();
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
        subtitle="Update your trainer profile information"
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
