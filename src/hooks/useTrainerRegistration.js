import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function useTrainerRegistration() {
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    // Professional Information
    trainingSince: "",
    specialties: [],
    description: "",
    // Languages and Training Types
    languages: [],
    trainingEnvironment: "",
    trainingTypes: [],
    // Contact and Location
    contactEmail: "",
    contactPhone: "",
    profileImage: null,
    location: {
      city: "",
      state: "",
      country: "",
    },
    // Legacy fields for compatibility
    certifications: [{ name: "", issuer: "", expiryDate: "", files: [] }],
    currency: "EUR",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log(formData, "fpr,dDate");
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

  // Handle certification fields
  const handleCertChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  // Add new certification field
  const addCertField = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", expiryDate: "", files: [] },
      ],
    }));
  };

  // Remove certification field
  const removeCertField = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
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
      if (!formData.trainingSince)
        newErrors.trainingSince = "Training since is required";
      if (!formData.specialties || formData.specialties.length === 0)
        newErrors.specialties = "At least one specialty is required";
    }
    if (currentStep === 2) {
      if (!formData.languages || formData.languages.length === 0)
        newErrors.languages = "At least one language is required";
      if (!formData.trainingEnvironment)
        newErrors.trainingEnvironment = "Training environment is required";
      if (!formData.trainingTypes || formData.trainingTypes.length === 0)
        newErrors.trainingTypes = "At least one training type is required";
    }
    if (currentStep === 3) {
      if (!formData.location || !formData.location.city)
        newErrors["location.city"] = "City is required";
      if (!formData.location || !formData.location.state)
        newErrors["location.state"] = "State/Province is required";
      if (!formData.location || !formData.location.country)
        if (!formData.pricingType || formData.pricingType === "")
          newErrors.pricingType = "Pricing approach is required";
      if (
        (formData.pricingType === "fixed" ||
          formData.pricingType === "package_deals") &&
        (!formData.pricePerSession || Number(formData.pricePerSession) <= 0)
      ) {
        newErrors.pricePerSession = "Price per session is required";
      }
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
    // 1. Pripremi FormData za upload fileova
    const uploadData = new FormData();
    if (formData.profileImage && formData.profileImage instanceof File) {
      uploadData.append("profileImage", formData.profileImage);
    }
    // Dodaj sve fajlove za svaki certifikat
    formData.certifications.forEach((cert, i) => {
      if (cert.files && Array.isArray(cert.files)) {
        cert.files.forEach((file) => {
          if (file instanceof File && file.size > 0) {
            uploadData.append(`certifications[${i}]`, file);
          }
        });
      }
    });
    // Debug: logaj certifikate i fajlove
    // 2. Prvo uploadaj slike/certifikate
    let uploadedUrls = {};
    const hasFilesToUpload =
      (formData.profileImage && formData.profileImage instanceof File) ||
      formData.certifications.some((c) => c.files && c.files.length > 0);
    if (hasFilesToUpload) {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!uploadRes.ok) {
        setErrors({ general: "Greška pri uploadu slika/certifikata." });
        setLoading(false);
        return;
      }
      uploadedUrls = await uploadRes.json();
      console.log("uploadedUrls from /api/upload:", uploadedUrls);
    }
    // 3. Pripremi podatke za API
    console.log(
      "formData.certifications before mapping:",
      formData.certifications
    );
    let certifications = formData.certifications.map((cert, i) => ({
      ...cert,
      documents:
        Array.isArray(uploadedUrls.certifications) &&
        uploadedUrls.certifications[i]
          ? uploadedUrls.certifications[i]
          : [],
    }));
    // Ako je certifications slučajno array arraya, flattenaj
    if (Array.isArray(certifications[0])) {
      certifications = certifications.flat();
    }
    // Debug: logaj certifications prije slanja
    console.log("Certifications payload:", certifications);
    const trainerData = {
      ...formData,
      profileImage: uploadedUrls.profileImage || formData.profileImage,
      certifications,
    };
    console.log("Final trainerData payload:", trainerData);
    // 4. Pošalji podatke na backend
    const res = await fetch("/api/users/trainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainerData),
    });
    if (!res.ok) {
      const err = await res.json();
      setErrors({ general: err.error || "Greška pri spremanju profila." });
      setLoading(false);
      return;
    }
    // 5. Refresh session and redirect to dashboard on success
    await update();
    router.push("/trainer/dashboard");
  };

  // Move to next step
  const goToNextStep = (e) => {
    e.preventDefault();
    // if (validateStep(step)) {
    setStep(step + 1);
    //   window.scrollTo(0, 0);
    // } else {
    //   scrollToTop();
    // }
  };

  // Move to previous step
  const goToPrevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Za profilnu sliku
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
    handleCertChange,
    addCertField,
    removeCertField,
    validateStep,
    handleSubmit,
    goToNextStep,
    goToPrevStep,
    handleProfileImageChange,
    scrollToTop,
  };
}
