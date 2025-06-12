"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import {
  Button,
  Card,
  BrandLogo,
  BackButton,
  FullScreenLoader,
  InfoBanner,
} from "@/components/common";
import { DashboardTabs } from "@/components/custom/dashboard/shared";
import { AnimatedTabContent } from "@/components/custom/dashboard/shared/DashboardTabs";
import {
  Availability,
  BasicInformation,
  Certification,
  Specialties,
  WorkoutSpaceLocation,
} from "@/components/custom/dashboard/trainer/edit-profile";
import { useTrainerEditProfileForm } from "@/hooks/useTrainerEditProfileForm";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const TrainerEditProfilePage = () => {
  const {
    previewImage,
    activeSection,
    setActiveSection,
    formProgress,
    loading,
    error,
    setError,
    trainerData,
    setTrainerData,
    initialCertifications,
    resetCertFieldsTrigger,
    certFields,
    setCertFields,
    handleChange,
    handleImageUpload,
    handleCertificationsChange,
    handleResetCertifications,
    handleSubmit,
    goBack,
  } = useTrainerEditProfileForm();

  const sections = [
    { id: "basicInfo", label: "Basic Information", badgeCount: 0 },
    { id: "specialties", label: "Specialties", badgeCount: 0 },
    { id: "certification", label: "Certification", badgeCount: 0 },
    { id: "availability", label: "Availability", badgeCount: 0 },
    {
      id: "workoutSpaceLocation",
      label: "Workout Space & Location",
      badgeCount: 0,
    },
  ];

  if (loading) {
    return <FullScreenLoader text="Preparing your Profile Settings" />;
  }

  return (
    <div className="relative min-h-screen  bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.3),transparent_70%)] px-4 py-6">
      {/* Animated shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-gradient-to-r from-[#FF7800]/5 to-[#FF5F00]/5 blur-3xl"></div>
        <div className="animate-pulse-slow absolute right-[10%] top-[50%] h-60 w-60 rounded-full bg-gradient-to-r from-[#FF7800]/5 to-[#FF5F00]/5 blur-3xl"></div>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-screen-xl"
      >
        <motion.div
          variants={fadeIn}
          className="mb-8 flex items-center justify-center"
        >
          <BrandLogo />
        </motion.div>
        <motion.div
          variants={fadeIn}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <BackButton onClick={goBack} />
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Profile completion</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7800] to-[#FF5F00] transition-all duration-1000"
                style={{ width: `${formProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-[#FF7800]">
              {formProgress}%
            </span>
          </div>
        </motion.div>
        {error && (
          <div className="mb-4">
            <InfoBanner
              icon="mdi:alert-circle"
              title="Error updating profile"
              subtitle={error}
              variant="danger"
              buttonText="Dismiss"
              onButtonClick={() => setError("")}
              className="relative mb-4"
            />
          </div>
        )}
        <motion.div variants={fadeIn}>
          <DashboardTabs
            activeTab={activeSection}
            setActiveTab={setActiveSection}
            tabs={sections}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <Card
            variant="darkStrong"
            width="100%"
            maxWidth="100%"
            className="backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="relative space-y-10">
              {/* Active section */}
              <AnimatedTabContent
                isActive={activeSection === "basicInfo"}
                tabId="basicInfo"
              >
                <BasicInformation
                  trainerData={trainerData.trainerProfile}
                  handleChange={handleChange}
                  previewImage={previewImage}
                  handleImageUpload={handleImageUpload}
                />
              </AnimatedTabContent>
              <AnimatedTabContent
                isActive={activeSection === "specialties"}
                tabId="specialties"
              >
                <Specialties
                  trainerData={trainerData}
                  handleChange={handleChange}
                  setTrainerData={setTrainerData}
                />
              </AnimatedTabContent>
              <AnimatedTabContent
                isActive={activeSection === "certification"}
                tabId="certification"
              >
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
              </AnimatedTabContent>
              <AnimatedTabContent
                isActive={activeSection === "availability"}
                tabId="availability"
              >
                <Availability
                  trainerData={trainerData}
                  handleChange={handleChange}
                  setTrainerData={setTrainerData}
                />
              </AnimatedTabContent>
              <AnimatedTabContent
                isActive={activeSection === "workoutSpaceLocation"}
                tabId="workoutSpaceLocation"
              >
                <WorkoutSpaceLocation
                  trainerData={trainerData}
                  setTrainerData={setTrainerData}
                />
              </AnimatedTabContent>
              {/* Navigation and Submit */}
              <div className="flex justify-between border-t border-[#333] pt-8">
                <div className="flex items-center gap-3">
                  {sections.map((section, _index) => {
                    const isActive = activeSection === section.id;
                    return (
                      <Button
                        key={section.id}
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveSection(section.id)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 p-0 ${
                          isActive
                            ? "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] shadow-lg shadow-orange-500/20"
                            : "bg-[#333] hover:bg-[#666]"
                        }`}
                        aria-label={`Go to ${section.label}`}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={goBack}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="orangeFilled"
                    size="large"
                    leftIcon={
                      <Icon
                        icon="material-symbols:save"
                        width={20}
                        height={20}
                      />
                    }
                    className="relative overflow-hidden"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TrainerEditProfilePage;
