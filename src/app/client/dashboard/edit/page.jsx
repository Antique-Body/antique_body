"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";
import {
  ClientBasicInformation,
  ActivitiesAndLanguages,
  HealthInfo,
  ClientLocation,
} from "@/components/custom/dashboard/client/settings";
import { BottomNavigation } from "@/components/custom/dashboard/shared";
import { useClientEditProfileForm } from "@/hooks/useClientEditProfileForm";

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

export default function ClientEditProfilePage() {
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
    clientData,
    setClientData,
    formProgress: _formProgress,
  } = useClientEditProfileForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const _updatedData = await hookHandleSubmit(e);

      // Update session to refresh user data
      await updateSession();

      // Navigate back to dashboard
      router.push("/client/dashboard");
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
          Update your personal information and preferences
        </p>
      </div>

      <div className="">
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
          {CLIENT_SECTIONS.map((section) => (
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
          {CLIENT_SECTIONS.map((section) => (
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
        sections={CLIENT_SECTIONS}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </div>
  );
}
