import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function useClientEditProfileForm() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState("basicInfo");
  const [formProgress, setFormProgress] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    experienceLevel: "",
    previousActivities: "",
    languages: [],
    primaryGoal: "",
    secondaryGoal: "",
    goalDescription: "",
    preferredActivities: [],
    email: "",
    phone: "",
    location: { city: "", state: "", country: "" },
    profileImage: null,
    description: "",
    medicalConditions: "",
    allergies: "",
  });

  // Helper function to process client data
  const processClientData = useCallback(
    (data) => ({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
      gender: data.gender || "",
      height: data.height || "",
      weight: data.weight || "",
      experienceLevel: data.experienceLevel || "",
      previousActivities: data.previousActivities || "",
      languages:
        data.languages?.map((l) => (typeof l === "object" ? l.name : l)) || [],
      primaryGoal: data.primaryGoal || "",
      secondaryGoal: data.secondaryGoal || "",
      goalDescription: data.goalDescription || "",
      preferredActivities:
        data.preferredActivities?.map((a) =>
          typeof a === "object" ? a.name : a
        ) || [],
      email: data.email || data.contactEmail || "",
      phone: data.phone || data.contactPhone || "",
      location: data.location || { city: "", state: "", country: "" },
      profileImage: data.profileImage || null,
      description: data.description || "",
      medicalConditions: data.medicalConditions || "",
      allergies: data.allergies || "",
    }),
    []
  );

  // Fetch client profile on mount or use initial data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/client?mode=edit");
        if (!res.ok) throw new Error("No client profile");
        const { data } = await res.json();
        const processedData = processClientData(data);
        setClientData(processedData);
        setPreviewImage(processedData.profileImage || null);
      } catch {
        // If no profile, keep empty
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [processClientData]); // Remove initialUserData dependency

  // Progress calculation
  const calculateFormProgress = useCallback(() => {
    const totalFields = 12;
    let filledFields = 0;
    if (clientData.firstName) filledFields++;
    if (clientData.lastName) filledFields++;
    if (clientData.dateOfBirth) filledFields++;
    if (clientData.gender) filledFields++;
    if (clientData.height) filledFields++;
    if (clientData.weight) filledFields++;
    if (clientData.experienceLevel) filledFields++;
    if ((clientData.languages || []).length > 0) filledFields++;
    if ((clientData.preferredActivities || []).length > 0) filledFields++;
    if (clientData.primaryGoal) filledFields++;
    if (clientData.location?.city) filledFields++;
    if (clientData.profileImage) filledFields++;
    setFormProgress(
      Math.max(20, Math.round((filledFields / totalFields) * 100))
    );
  }, [clientData]);

  useEffect(() => {
    calculateFormProgress();
  }, [calculateFormProgress]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      setClientData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name.replace("location.", "")]: value,
        },
      }));
    } else {
      setClientData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleImageUpload = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setClientData((prev) => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setClientData((prev) => ({ ...prev, profileImage: null }));
    }
  }, []);

  useEffect(() => {
    if (
      clientData.profileImage &&
      typeof clientData.profileImage === "string"
    ) {
      setPreviewImage(clientData.profileImage);
    }
  }, [clientData.profileImage]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        const formData = new FormData();
        if (
          clientData.profileImage &&
          typeof clientData.profileImage !== "string"
        ) {
          formData.append("profileImage", clientData.profileImage);
        }
        let uploadedUrls = {};
        if ([...formData.keys()].length > 0) {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          uploadedUrls = await uploadRes.json();
          if (uploadedUrls.error) throw new Error(uploadedUrls.error);
        }
        let profileImageUrl = clientData.profileImage;
        if (uploadedUrls.profileImage) {
          profileImageUrl = uploadedUrls.profileImage;
        }
        // Prepare payload
        const body = {
          ...clientData,
          profileImage: profileImageUrl,
        };
        const res = await fetch("/api/users/client", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update profile");

        // Return the updated data for the onSave callback
        const updatedData = {
          ...clientData,
          profileImage: profileImageUrl,
        };

        setLoading(false);
        return updatedData;
        // Don't navigate away since this is used in a modal now
        // router.push("/client/dashboard");
      } catch (err) {
        setError(err.message || "Error updating profile");
        setLoading(false);
        throw err;
      }
    },
    [clientData]
  );

  const goBack = useCallback(() => {
    router.push("/client/dashboard");
  }, [router]);

  return {
    previewImage,
    activeSection,
    setActiveSection,
    formProgress,
    loading,
    error,
    setError,
    clientData,
    setClientData,
    handleChange,
    handleImageUpload,
    handleSubmit,
    goBack,
  };
}
