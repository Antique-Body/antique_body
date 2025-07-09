import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function useClientRegistration() {
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    // Physical Information
    height: "",
    weight: "",
    // Fitness Experience
    experienceLevel: "",
    previousActivities: "",
    // Languages and Goals
    languages: [],
    primaryGoal: "",
    secondaryGoal: "",
    goalDescription: "",
    preferredActivities: [],
    // Contact and Location
    contactEmail: "",
    contactPhone: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    // Profile and Health Info
    profileImage: null,
    description: "",
    medicalConditions: "",
    allergies: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    if (!e.target || typeof e.target.name !== "string") return;
    const { name, value } = e.target;
    if (typeof name === "string" && name.includes(".")) {
      // Handle nested objects like location.city
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate current step
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      // Basic Info Step validation
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      else {
        // Age validation
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 12) {
          newErrors.dateOfBirth = "You must be at least 12 years old.";
        }
      }
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.height) newErrors.height = "Height is required";
      if (!formData.weight) newErrors.weight = "Weight is required";
      if (!formData.experienceLevel)
        newErrors.experienceLevel = "Experience level is required";
    }

    if (currentStep === 2) {
      // Goals and Preferences Step validation
      if (!formData.languages || formData.languages.length === 0)
        newErrors.languages = "At least one language is required";
      if (!formData.primaryGoal)
        newErrors.primaryGoal = "Primary goal is required";
      if (
        !formData.preferredActivities ||
        formData.preferredActivities.length === 0
      )
        newErrors.preferredActivities =
          "Select at least one activity you're interested in";
    }

    if (currentStep === 3) {
      // Contact and Location Step validation

      if (!formData.location.city)
        newErrors["location.city"] = "City is required";
      if (!formData.location.country)
        newErrors["location.country"] = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Scroll to top helper
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      scrollToTop();
      return;
    }
    setLoading(true);

    // 1. Prepare FormData for file uploads
    const uploadData = new FormData();
    if (formData.profileImage && formData.profileImage instanceof File) {
      uploadData.append("profileImage", formData.profileImage);
    }

    // 2. Upload images first if there are any
    let uploadedUrls = {};
    const hasFilesToUpload =
      formData.profileImage && formData.profileImage instanceof File;

    if (hasFilesToUpload) {
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          setErrors({ general: "Error uploading images." });
          setLoading(false);
          return;
        }

        uploadedUrls = await uploadRes.json();
      } catch (error) {
        setErrors({ general: "Error uploading images: " + error.message });
        setLoading(false);
        return;
      }
    }

    // 3. Prepare client data for the API
    const clientData = {
      ...formData,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      profileImage: uploadedUrls.profileImage || formData.profileImage,
    };

    // 4. Send data to backend API
    try {
      const res = await fetch("/api/users/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrors({ general: err.error || "Error saving profile." });
        setLoading(false);
        return;
      }

      // 5. Refresh session and redirect to dashboard on success
      await update();
      router.push("/client/dashboard");
    } catch (error) {
      setErrors({ general: "Error: " + error.message });
      setLoading(false);
    }
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      scrollToTop();
    }
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Profile image change handler
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    step,
    setStep,
    loading,
    setLoading,
    handleChange,
    validateStep,
    handleSubmit,
    goToNextStep,
    goToPrevStep,
    handleProfileImageChange,
    scrollToTop,
  };
}
