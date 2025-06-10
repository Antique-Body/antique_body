"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import {
  Button,
  Card,
  BrandLogo,
  BackButton,
  FullScreenLoader,
} from "@/components/common";
import { DashboardTabs } from "@/components/custom/dashboard/shared";
import { AnimatedTabContent } from "@/components/custom/dashboard/shared/DashboardTabs";
import {
  Availability,
  BasicInformation,
  CertificationEducation,
  Specialties,
  WorkoutSpaceLocation,
} from "@/components/custom/dashboard/trainer/edit-profile";

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
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState("basicInfo");
  const [formProgress, setFormProgress] = useState(20);

  // Novo: loading state
  const [loading, setLoading] = useState(true);

  // Novo: inicijalni state je prazan dok ne dođe fetch
  const [trainerData, setTrainerData] = useState({
    rating: "",
    trainerProfile: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      specialties: [],
      languages: [],
      trainingEnvironments: [],
      trainingTypes: [],
      certifications: [],
      professionalBio: "",
      city: "",
      state: "",
      country: "",
      pricingType: "",
      pricePerSession: "",
      currency: "EUR",
      contactEmail: "",
      contactPhone: "",
      profileImage: "",
      description: "",
      location: {
        city: "",
        state: "",
        country: "",
        lat: null,
        lon: null,
        gyms: [],
      },
    },
    proximity: "",
    education: [],
    services: [],
    expertise: [],
    availability: { weekdays: [], timeSlots: [] },
  });
  // Dodajem state za inicijalni snapshot
  // Dodajem state za inicijalni snapshot certifikata
  const [initialCertifications, setInitialCertifications] = useState([]);
  const [resetCertFieldsTrigger, setResetCertFieldsTrigger] = useState(0);
  const [certFields, setCertFields] = useState([]);

  // Novo: fetch podataka iz baze
  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/trainer");
        if (!res.ok) throw new Error("No trainer profile");
        const data = await res.json();
        console.log(data, "data");
        const newTrainerData = {
          ...trainerData,
          rating: data.rating || "",
          trainerProfile: {
            ...trainerData.trainerProfile,
            ...data.trainerProfile,
            dateOfBirth: data.trainerProfile?.dateOfBirth
              ? data.trainerProfile.dateOfBirth.slice(0, 10)
              : "",
            specialties:
              data.trainerProfile?.specialties?.map((s) => s.name) || [],
            languages: data.trainerProfile?.languages?.map((l) => l.name) || [],
            trainingEnvironments:
              data.trainerProfile?.trainingEnvironments?.map((e) => e.name) ||
              [],
            trainingTypes:
              data.trainerProfile?.trainingTypes?.map((t) => t.name) || [],
            certifications: data.trainerProfile?.certifications || [],
            city: data.trainerProfile?.city || "",
            state: data.trainerProfile?.state || "",
            country: data.trainerProfile?.country || "",
            pricingType: data.trainerProfile?.pricingType || "",
            pricePerSession: data.trainerProfile?.pricePerSession || "",
            currency: data.trainerProfile?.currency || "EUR",
            contactEmail: data.trainerProfile?.contactEmail || "",
            contactPhone: data.trainerProfile?.contactPhone || "",
            profileImage: data.trainerProfile?.profileImage || "",
            firstName: data.trainerProfile?.firstName || "",
            lastName: data.trainerProfile?.lastName || "",
            professionalBio: data.trainerProfile?.professionalBio || "",
            description: data.trainerProfile?.professionalBio || "",
            profileImage: data.trainerProfile?.profileImage || "",
            location: {
              ...(data.trainerProfile?.location || {}),
              city: data.trainerProfile?.location?.city || "",
              state: data.trainerProfile?.location?.state || "",
              country: data.trainerProfile?.location?.country || "",
              lat: data.trainerProfile?.location?.lat || null,
              lon: data.trainerProfile?.location?.lon || null,
              gyms: data.trainerProfile?.location?.gyms || [],
            },
          },
        };
        setTrainerData(newTrainerData);
        setInitialCertifications(data.trainerProfile?.certifications || []); // Spremi snapshot certifikata
      } catch {
        // Ako nema profila, ostavi prazno (user treba popuniti)
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
    // eslint-disable-next-line
  }, []);

  console.log(trainerData, "trainerData");

  // Calculate form completion percentage
  const calculateFormProgress = useCallback(() => {
    // This is a simplified calculation - in a real app you'd check all required fields
    const totalFields = 15; // approximate total number of important fields
    let filledFields = 0;

    if (trainerData.rating) filledFields++;
    if (trainerData.trainerProfile.firstName) filledFields++;
    if (trainerData.trainerProfile.lastName) filledFields++;
    if (trainerData.trainerProfile.dateOfBirth) filledFields++;
    if (trainerData.trainerProfile.gender) filledFields++;
    if (trainerData.trainerProfile.specialties.length > 0) filledFields++;
    if (trainerData.trainerProfile.languages.length > 0) filledFields++;
    if (trainerData.trainerProfile.trainingEnvironments.length > 0)
      filledFields++;
    if (trainerData.trainerProfile.trainingTypes.length > 0) filledFields++;
    if (trainerData.trainerProfile.certifications.length > 0) filledFields++;
    if (trainerData.trainerProfile.professionalBio) filledFields++;
    if (trainerData.trainerProfile.city) filledFields++;
    if (trainerData.trainerProfile.state) filledFields++;
    if (trainerData.trainerProfile.country) filledFields++;
    if (trainerData.trainerProfile.pricingType) filledFields++;
    if (trainerData.trainerProfile.pricePerSession) filledFields++;
    if (trainerData.trainerProfile.currency) filledFields++;
    if (trainerData.trainerProfile.contactEmail) filledFields++;
    if (trainerData.trainerProfile.contactPhone) filledFields++;
    if (trainerData.trainerProfile.profileImage) filledFields++;
    if (trainerData.proximity) filledFields++;
    if (trainerData.education.length > 0) filledFields++;
    if (trainerData.services.length > 0) filledFields++;
    if (trainerData.expertise.length > 0) filledFields++;
    if (trainerData.availability.weekdays.length > 0) filledFields++;
    if (trainerData.availability.timeSlots.length > 0) filledFields++;

    setFormProgress(
      Math.max(20, Math.round((filledFields / totalFields) * 100))
    );
  }, [trainerData]);

  // Update form progress whenever any data changes
  useEffect(() => {
    calculateFormProgress();
  }, [calculateFormProgress]);

  // Handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      setTrainerData({
        ...trainerData,
        trainerProfile: {
          ...trainerData.trainerProfile,
          location: {
            ...trainerData.trainerProfile.location,
            [name.replace("location.", "")]: value,
          },
        },
      });
    } else if (name === "certifications") {
      setTrainerData({
        ...trainerData,
        trainerProfile: {
          ...trainerData.trainerProfile,
          [name]: Array.isArray(value) ? value : [value],
        },
      });
    } else {
      setTrainerData({
        ...trainerData,
        trainerProfile: {
          ...trainerData.trainerProfile,
          [name]: value,
        },
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // Za prikaz slike
        setTrainerData((prev) => ({
          ...prev,
          trainerProfile: {
            ...prev.trainerProfile,
            profileImage: file, // Spremi file objekt
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Funkcija za reset samo certifikata
  const handleResetCertifications = () => {
    setCertFields(initialCertifications);
    setTrainerData((prev) => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        certifications: initialCertifications,
      },
    }));
    setResetCertFieldsTrigger((prev) => prev + 1);
  };

  const handleCertificationsChange = (newCertFields) => {
    setCertFields(newCertFields);
  };

  // Prilagođavam handleSubmit da šalje podatke na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Pripremi FormData za upload slike i certifikata
      const formData = new FormData();

      // Dodaj profilnu sliku ako je novi file (nije string tj. nije već URL)
      if (
        trainerData.trainerProfile.profileImage &&
        typeof trainerData.trainerProfile.profileImage !== "string"
      ) {
        formData.append(
          "profileImage",
          trainerData.trainerProfile.profileImage
        );
      }

      // Dodaj certifikate koji su novi fileovi
      certFields.forEach((cert, idx) => {
        if (cert.files && cert.files.length > 0) {
          for (const file of cert.files) {
            if (file && typeof file !== "string") {
              formData.append(`certifications[${idx}]`, file);
            }
          }
        }
      });

      // 2. Ako ima fileova, uploadaj ih
      let uploadedUrls = {};
      if ([...formData.keys()].length > 0) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        uploadedUrls = await uploadRes.json();
        if (uploadedUrls.error) throw new Error(uploadedUrls.error);
      }

      // 3. Zamijeni profileImage i certifikate s novim URL-ovima
      let profileImageUrl = trainerData.trainerProfile.profileImage;
      if (uploadedUrls.profileImage) {
        profileImageUrl = uploadedUrls.profileImage;
      }

      // Pripremi certifikate za spremanje (samo URL-ovi, bez file objekata)
      const certificationsForSave = certFields.map((cert, idx) => ({
        ...cert,
        hidden: cert.hidden || false,
        documents:
          uploadedUrls.certifications && uploadedUrls.certifications[idx]
            ? uploadedUrls.certifications[idx]
            : cert.documents || [],
        files: undefined, // ne šalji fileove
      }));

      // 4. Pripremi payload: availability, education, certifications unutar trainerProfile
      const body = {
        trainerProfile: {
          ...trainerData.trainerProfile,
          profileImage: profileImageUrl,
          certifications: certificationsForSave,
          availability: trainerData.availability,
          education: trainerData.education,
        },
      };

      // 5. Pošalji na backend
      const res = await fetch("/api/users/trainer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setTimeout(() => {
        router.push("/trainer/dashboard");
      }, 1000);
      console.log(res, "res");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  // Go back to dashboard
  const goBack = () => {
    router.push("/trainer/dashboard");
  };

  // Navigation sections
  const sections = [
    { id: "basicInfo", label: "Basic Information", badgeCount: 0 },
    { id: "specialties", label: "Specialties", badgeCount: 0 },
    {
      id: "certificationEducation",
      label: "Certification & Education",
      badgeCount: 0,
    },
    { id: "availability", label: "Availability", badgeCount: 0 },
    {
      id: "workoutSpaceLocation",
      label: "Workout Space & Location",
      badgeCount: 0,
    },
  ];

  // Loading indikator
  if (loading) {
    return (
      <>
        <FullScreenLoader text="Preparing your Profile Settings" />
      </>
    );
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
                isActive={activeSection === "certificationEducation"}
                tabId="certificationEducation"
              >
                <CertificationEducation
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
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
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
