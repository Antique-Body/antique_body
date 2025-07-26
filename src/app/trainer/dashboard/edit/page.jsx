"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";
import { BottomNavigation } from "@/components/custom/dashboard/shared";
import {
  Availability,
  TrainerBasicInformation,
  Certification,
  Gallery,
  Specialties,
  WorkoutSpaceLocation,
} from "@/components/custom/dashboard/trainer/settings";
import { useTrainerEditProfileForm } from "@/hooks/useTrainerEditProfileForm";

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

export default function TrainerEditProfilePage() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [activeSection, setActiveSection] = useState("basicInfo");
  const contentRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use the existing hook for form functionality
  const {
    _loading,
    error,
    setError,
    handleSubmit: hookHandleSubmit,
    previewImage,
    handleImageUpload,
    handleChange,
    trainerData,
    setTrainerData,
    formProgress: _formProgress,
    initialCertifications,
    resetCertFieldsTrigger,
    certFields,
    setCertFields,
    handleCertificationsChange,
    handleResetCertifications,
  } = useTrainerEditProfileForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const _updatedData = await hookHandleSubmit(e);

      // Update session to refresh user data
      await updateSession();

      // Navigate back to dashboard
      router.push("/trainer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save profile");
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  // Scroll to section content when changing sections on mobile
  useEffect(() => {
    if (contentRef.current && window.innerWidth < 768) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

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
      <div className="px-4 py-5">
        {/* Header with Save Button */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <Button
              variant="orangeFilled"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white py-2 px-6 rounded-full shadow-md whitespace-nowrap"
            >
              <div className="flex items-center justify-center gap-2">
                {isSaving ? (
                  <>
                    <div className="animate-spin">
                      <Icon icon="eos-icons:loading" width={16} height={16} />
                    </div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" width={16} height={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </div>
            </Button>
          </div>
          <p className="text-zinc-400">
            Update your professional information and trainer details
          </p>
        </div>

        <div className="">
          <div>
            {/* Error Banner */}
            {error && (
              <InfoBanner
                icon="mdi:alert-circle"
                title="Error"
                subtitle={error}
                variant="primary"
                className="mb-4 mt-2"
              />
            )}

            {/* Desktop tabs - hidden on mobile */}
            <div className="hidden md:flex overflow-x-auto gap-1 mb-6 pb-1 scrollbar-hide border-b border-[rgba(255,255,255,0.1)]">
              {TRAINER_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 transition-all ${
                    activeSection === section.id
                      ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                      : "text-gray-400"
                  }`}
                >
                  <Icon icon={section.icon} width={18} height={18} />
                  {section.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="pb-20">
              {TRAINER_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className={activeSection === section.id ? "block" : "hidden"}
                >
                  {formContent[section.id]}
                </div>
              ))}
            </form>
          </div>

          {/* Mobile Bottom Navigation */}
          <BottomNavigation
            sections={TRAINER_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>
    </DndProvider>
  );
}
