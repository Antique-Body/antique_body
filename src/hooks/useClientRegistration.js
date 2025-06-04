import { useRouter } from "next/navigation";
import { useState } from "react";

export function useClientRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    // Physical Information
    height: "",
    weight: "",
    fitnessLevel: "",
    trainingExperience: "",
    // Fitness Goals
    fitnessGoals: [],
    activityPreferences: [],
    preferredFrequency: "",
    goalDescription: "",
    // Contact and Location
    email: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    // Availability
    preferredTimeOfDay: "",
    preferredDays: "",
    availabilityNotes: "",
    // Budget
    budgetRange: "",
    currency: "EUR",
    // Profile Setup
    profileImage: null,
    bio: "",
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
        if (age < 16) {
          newErrors.dateOfBirth = "You must be at least 16 years old.";
        }
      }
      if (!formData.gender) newErrors.gender = "Gender is required";
      // Physical information is optional
    }
    if (currentStep === 2) {
      if (!formData.fitnessGoals || formData.fitnessGoals.length === 0)
        newErrors.fitnessGoals = "At least one fitness goal is required";
      if (!formData.preferredFrequency)
        newErrors.preferredFrequency = "Training frequency is required";
    }
    if (currentStep === 3) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.location || !formData.location.city)
        newErrors["location.city"] = "City is required";
      if (!formData.location || !formData.location.country)
        newErrors["location.country"] = "Country is required";
      if (!formData.preferredTimeOfDay)
        newErrors.preferredTimeOfDay = "Preferred time of day is required";
      if (!formData.preferredDays)
        newErrors.preferredDays = "Preferred days are required";
    }
    if (currentStep === 4) {
      // Bio and profile image are optional
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

    // Prepare FormData for file upload
    const uploadData = new FormData();
    if (formData.profileImage && formData.profileImage instanceof File) {
      uploadData.append("profileImage", formData.profileImage);
    }

    // Handle profile image upload if present
    let uploadedUrls = {};
    const hasImageToUpload =
      formData.profileImage && formData.profileImage instanceof File;

    if (hasImageToUpload) {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        setErrors({ general: "Error uploading profile image." });
        setLoading(false);
        return;
      }

      uploadedUrls = await uploadRes.json();
    }

    // Prepare data for creating profile
    const clientData = {
      ...formData,
      profileImage: uploadedUrls.profileImage || formData.profileImage,
      currency: formData.currency || "EUR", // default to EUR if not set
    };

    // Debug: log data for backend
    console.log("Data for backend:", clientData);

    // Send data to backend for profile creation
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

    setLoading(false);
    // Redirect if successful
    router.push("/client/dashboard");
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
    scrollToTop,
  };
}
