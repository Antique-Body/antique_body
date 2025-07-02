import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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
      trainingEnvironment: "",
      trainingTypes: [],
      certifications: [],
      description: "",
      pricingType: "",
      pricePerSession: "",
      currency: "EUR",
      contactEmail: "",
      contactPhone: "",
      profileImage: "",
      sessionDuration: 60,
      cancellationPolicy: 24,
      trainerSince: "",
      availabilities: [],
      galleryImages: [],
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

  // Helper function to process trainer data
  const processTrainerData = useCallback((data) => {
    const availabilities = data.availabilities || [];
    const processedData = {
      rating: data.rating || "",
      trainerProfile: {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        gender: data.gender || "",
        specialties: data.specialties?.map((s) => s.name || s) || [],
        languages: data.languages?.map((l) => l.name || l) || [],
        trainingEnvironment: data.trainingEnvironment || "",
        trainingTypes: data.trainingTypes?.map((t) => t.name || t) || [],
        certifications: data.certifications || [],
        description: data.description || "",
        pricingType: data.pricingType || "",
        pricePerSession: data.pricePerSession || "",
        currency: data.currency || "EUR",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        profileImage: data.profileImage || "",
        sessionDuration: data.sessionDuration || 60,
        cancellationPolicy: data.cancellationPolicy || 24,
        trainerSince: data.trainerSince || "",
        availabilities: availabilities,
        galleryImages: data.galleryImages || [],
        location: {
          city: data.location?.city || "",
          state: data.location?.state || "",
          country: data.location?.country || "",
          lat: data.location?.lat || null,
          lon: data.location?.lon || null,
          gyms: data.location?.gyms || data.trainerGyms || [],
        },
      },
      proximity: "",
      services: [],
      expertise: [],
    };
    return processedData;
  }, []);

  // Fetch podataka ili koristi inicijalne podatke
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        let data;

        // Always fetch fresh data with edit mode for complete profile data
        // Don't use initialUserData as it contains only basic dashboard data
        const res = await fetch("/api/users/trainer?mode=edit");
        if (!res.ok) throw new Error("No trainer profile");

        const processedData = processTrainerData(data);
        setTrainerData(processedData);
        setInitialCertifications(data.certifications || []);
      } catch {
        // Ako nema profila, ostavi prazno
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [processTrainerData]); // Remove initialUserData dependency

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
    if (trainerData.trainerProfile.trainingEnvironment) filledFields++;
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
    if ((trainerData.trainerProfile.availabilities || []).length > 0)
      filledFields++;
    if ((trainerData.trainerProfile.galleryImages || []).length > 0)
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
    } else if (name === "sessionDuration" || name === "cancellationPolicy") {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          [name]: value,
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
      setPreviewImage(trainerData.trainerProfile.profileImage);
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
      setLoading(true);
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
        // Add new gallery files to form data
        const newGalleryFilesForUpload =
          trainerData.trainerProfile.galleryImages
            .map((img) => img.file)
            .filter(Boolean);

        newGalleryFilesForUpload.forEach((file) => {
          formData.append("gallery", file);
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

        // Construct the final galleryImages array
        const finalGalleryImages = [];
        const uploadedGalleryUrls = uploadedUrls.gallery
          ? uploadedUrls.gallery.map((u) => u.url)
          : [];
        let newUrlIndex = 0;

        trainerData.trainerProfile.galleryImages.forEach((img, index) => {
          const url = img.file ? uploadedGalleryUrls[newUrlIndex++] : img.url;
          if (url) {
            finalGalleryImages.push({
              url: url,
              isHighlighted: img.isHighlighted || false,
              order: index,
              description: img.description || null,
            });
          }
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
            availabilities: trainerData.trainerProfile.availabilities,
            galleryImages: finalGalleryImages,
            specialties,
            languages,
            trainingTypes,
            trainerSince:
              trainerData.trainerProfile.trainerSince !== "" &&
              trainerData.trainerProfile.trainerSince !== undefined &&
              trainerData.trainerProfile.trainerSince !== null
                ? Number(trainerData.trainerProfile.trainerSince)
                : null,
          },
        };
        const res = await fetch("/api/users/trainer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update profile");
        setLoading(false);
        // Don't navigate away since this is used in a modal now
        // router.push("/trainer/dashboard");
      } catch (err) {
        setError(err.message || "Error updating profile");
        setLoading(false);
      }
    },
    [trainerData, certFields]
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
