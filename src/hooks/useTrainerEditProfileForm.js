import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

export function useTrainerEditProfileForm() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState("basicInfo");
  const [formProgress, setFormProgress] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      description: "",
      pricingType: "",
      pricePerSession: "",
      currency: "EUR",
      contactEmail: "",
      contactPhone: "",
      profileImage: "",
      availability: {
        weekdays: [],
        timeSlots: [],
        sessionDuration: 60,
        cancellationPolicy: 24,
      },
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
    services: [],
    expertise: [],
  });
  const [initialCertifications, setInitialCertifications] = useState([]);
  const [resetCertFieldsTrigger, setResetCertFieldsTrigger] = useState(0);
  const [certFields, setCertFields] = useState([]);

  // Fetch podataka
  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/trainer");
        if (!res.ok) throw new Error("No trainer profile");
        const data = await res.json();
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
            pricingType: data.trainerProfile?.pricingType || "",
            pricePerSession: data.trainerProfile?.pricePerSession || "",
            currency: data.trainerProfile?.currency || "EUR",
            contactEmail: data.trainerProfile?.contactEmail || "",
            contactPhone: data.trainerProfile?.contactPhone || "",
            profileImage: data.trainerProfile?.profileImage || "",
            firstName: data.trainerProfile?.firstName || "",
            lastName: data.trainerProfile?.lastName || "",
            description: data.trainerProfile?.description || "",
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
        setInitialCertifications(data.trainerProfile?.certifications || []);
      } catch {
        // Ako nema profila, ostavi prazno
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
    // eslint-disable-next-line
  }, []);

  // Progress calculation
  const calculateFormProgress = useCallback(() => {
    const totalFields = 15;
    let filledFields = 0;
    if (trainerData.rating) filledFields++;
    if (trainerData.trainerProfile.firstName) filledFields++;
    if (trainerData.trainerProfile.lastName) filledFields++;
    if (trainerData.trainerProfile.dateOfBirth) filledFields++;
    if (trainerData.trainerProfile.gender) filledFields++;
    if ((trainerData.trainerProfile.specialties || []).length > 0)
      filledFields++;
    if ((trainerData.trainerProfile.languages || []).length > 0) filledFields++;
    if ((trainerData.trainerProfile.trainingEnvironments || []).length > 0)
      filledFields++;
    if ((trainerData.trainerProfile.trainingTypes || []).length > 0)
      filledFields++;
    if ((trainerData.trainerProfile.certifications || []).length > 0)
      filledFields++;
    if (trainerData.trainerProfile.description) filledFields++;
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
    if ((trainerData.services || []).length > 0) filledFields++;
    if ((trainerData.expertise || []).length > 0) filledFields++;
    if (
      (
        (trainerData.trainerProfile.availability &&
          trainerData.trainerProfile.availability.weekdays) ||
        []
      ).length > 0
    )
      filledFields++;
    if (
      (
        (trainerData.trainerProfile.availability &&
          trainerData.trainerProfile.availability.timeSlots) ||
        []
      ).length > 0
    )
      filledFields++;
    setFormProgress(
      Math.max(20, Math.round((filledFields / totalFields) * 100))
    );
  }, [trainerData]);

  useEffect(() => {
    calculateFormProgress();
  }, [calculateFormProgress]);

  // Handleri
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          location: {
            ...prev.trainerProfile.location,
            [name.replace("location.", "")]: value,
          },
        },
      }));
    } else if (name === "certifications") {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          [name]: Array.isArray(value) ? value : [value],
        },
      }));
    } else {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          [name]: value,
        },
      }));
    }
  }, []);

  const handleImageUpload = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setTrainerData((prev) => ({
          ...prev,
          trainerProfile: {
            ...prev.trainerProfile,
            profileImage: file,
          },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          profileImage: "",
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (
      trainerData.trainerProfile.profileImage &&
      typeof trainerData.trainerProfile.profileImage === "string"
    ) {
      setPreviewImage(null);
    }
  }, [trainerData.trainerProfile.profileImage]);

  const handleResetCertifications = useCallback(() => {
    setCertFields(initialCertifications);
    setTrainerData((prev) => ({
      ...prev,
      trainerProfile: {
        ...prev.trainerProfile,
        certifications: initialCertifications,
      },
    }));
    setResetCertFieldsTrigger((prev) => prev + 1);
  }, [initialCertifications]);

  const handleCertificationsChange = useCallback((newCertFields) => {
    setCertFields(newCertFields);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      try {
        const formData = new FormData();
        if (
          trainerData.trainerProfile.profileImage &&
          typeof trainerData.trainerProfile.profileImage !== "string"
        ) {
          formData.append(
            "profileImage",
            trainerData.trainerProfile.profileImage
          );
        }
        certFields.forEach((cert, idx) => {
          if (cert.files && cert.files.length > 0) {
            for (const file of cert.files) {
              if (file && typeof file !== "string") {
                formData.append(`certifications[${idx}]`, file);
              }
            }
          }
        });
        let uploadedUrls = {};
        if ([...formData.keys()].length > 0) {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          uploadedUrls = await uploadRes.json();
          if (uploadedUrls.error) throw new Error(uploadedUrls.error);
        }
        let profileImageUrl = trainerData.trainerProfile.profileImage;
        if (uploadedUrls.profileImage) {
          profileImageUrl = uploadedUrls.profileImage;
        }
        const certificationsForSave = certFields.map((cert, idx) => {
          let documents = cert.documents || [];
          if (
            uploadedUrls.certifications &&
            Array.isArray(uploadedUrls.certifications[idx]) &&
            uploadedUrls.certifications[idx].length > 0
          ) {
            documents = uploadedUrls.certifications[idx];
          }
          const base = {
            ...cert,
            hidden: cert.hidden || false,
            files: undefined,
          };
          if (cert.id && (!documents || documents.length === 0)) {
            const { documents: _omit, ...rest } = base;
            return rest;
          }
          return { ...base, documents };
        });

        // Transform relacijska polja u nizove stringova
        const specialties = Array.isArray(
          trainerData.trainerProfile.specialties
        )
          ? trainerData.trainerProfile.specialties
          : [];
        const languages = Array.isArray(trainerData.trainerProfile.languages)
          ? trainerData.trainerProfile.languages
          : [];
        const trainingEnvironments = Array.isArray(
          trainerData.trainerProfile.trainingEnvironments
        )
          ? trainerData.trainerProfile.trainingEnvironments
          : [];
        const trainingTypes = Array.isArray(
          trainerData.trainerProfile.trainingTypes
        )
          ? trainerData.trainerProfile.trainingTypes
          : [];

        // Pripremi payload
        const body = {
          trainerProfile: {
            ...trainerData.trainerProfile,
            profileImage: profileImageUrl,
            certifications: certificationsForSave,
            availability: trainerData.trainerProfile.availability,
            specialties,
            languages,
            trainingEnvironments,
            trainingTypes,
            // location.gyms ostaje kao što je
          },
        };

        const res = await fetch("/api/users/trainer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update profile");
        setTimeout(() => {
          router.push("/trainer/dashboard");
        }, 1000);
      } catch (err) {
        setError(err.message || "Error updating profile");
      }
    },
    [trainerData, certFields, router]
  );

  const goBack = useCallback(() => {
    router.push("/trainer/dashboard");
  }, [router]);

  return {
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
  };
}
