"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { SaveIcon } from "@/components/common/Icons";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";
import { Card } from "@/components/custom/Card";
import {
  BasicInformation,
  AboutYou,
  AreasOfExpertise,
  ServicesOffered,
  Availability,
} from "@/components/custom/trainer/edit-profile";

const EditProfilePage = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);

  // Sample trainer data - in a real app this would come from an API
  const [trainerData, setTrainerData] = useState({
    name: "Alex Miller",
    specialty: "Football Conditioning Specialist",
    certifications: ["UEFA A License", "NSCA CSCS"],
    experience: "8 years",
    hourlyRate: 75,
    rating: 4.8,
    proximity: "5 miles away",
    description:
      "Professional strength and conditioning coach with over 8 years of experience working with athletes from amateur to professional levels. Specializing in sport-specific training programs that enhance performance and prevent injuries.",
    philosophy:
      "My approach to training is focused on building sustainable habits and tailoring workouts to individual needs. I believe in a balanced approach that combines strength, conditioning, mobility, and proper recovery techniques.",
    education: ["Bachelor's Degree in Exercise Science", "Master's in Sports Performance"],
    services: [
      {
        name: "Personal Training",
        description: "One-on-one customized training sessions to meet your specific goals.",
      },
      {
        name: "Nutrition Planning",
        description: "Customized meal plans and nutritional guidance to complement your training.",
      },
      {
        name: "Performance Assessment",
        description: "Comprehensive analysis of your current fitness level and performance metrics.",
      },
      {
        name: "Remote Coaching",
        description: "Virtual training sessions and programming for clients who prefer training remotely.",
      },
    ],
    expertise: [
      { area: "Strength Training", level: 90 },
      { area: "Sport-specific Conditioning", level: 95 },
      { area: "Nutrition Planning", level: 85 },
      { area: "Injury Prevention", level: 80 },
      { area: "Recovery Protocols", level: 90 },
    ],
    location: {
      city: "Los Angeles",
      state: "California",
      country: "USA",
    },
    contact: {
      email: "alex.miller@example.com",
      phone: "+1 (555) 123-4567",
    },
    availability: {
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["Morning", "Afternoon"],
    },
  });

  // Handler for text input changes
  const handleChange = e => {
    const { name, value } = e.target;

    // Handle nested properties (using dot notation in the name)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setTrainerData({
        ...trainerData,
        [parent]: {
          ...trainerData[parent],
          [child]: value,
        },
      });
    } else {
      setTrainerData({
        ...trainerData,
        [name]: value,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this to storage
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new certification
  const [newCertification, setNewCertification] = useState("");

  const addCertification = () => {
    if (newCertification.trim()) {
      setTrainerData({
        ...trainerData,
        certifications: [...trainerData.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  // Remove a certification
  const removeCertification = index => {
    setTrainerData({
      ...trainerData,
      certifications: trainerData.certifications.filter((_, i) => i !== index),
    });
  };

  // Add a new education item
  const [newEducation, setNewEducation] = useState("");

  const addEducation = () => {
    if (newEducation.trim()) {
      setTrainerData({
        ...trainerData,
        education: [...trainerData.education, newEducation.trim()],
      });
      setNewEducation("");
    }
  };

  // Remove an education item
  const removeEducation = index => {
    setTrainerData({
      ...trainerData,
      education: trainerData.education.filter((_, i) => i !== index),
    });
  };

  // Add a new service
  const [newService, setNewService] = useState({ name: "", description: "" });

  const addService = () => {
    if (newService.name.trim() && newService.description.trim()) {
      setTrainerData({
        ...trainerData,
        services: [...trainerData.services, { ...newService }],
      });
      setNewService({ name: "", description: "" });
    }
  };

  // Remove a service
  const removeService = index => {
    setTrainerData({
      ...trainerData,
      services: trainerData.services.filter((_, i) => i !== index),
    });
  };

  // Update expertise level
  const updateExpertiseLevel = (index, level) => {
    const updatedExpertise = [...trainerData.expertise];
    updatedExpertise[index].level = Number(level);
    setTrainerData({
      ...trainerData,
      expertise: updatedExpertise,
    });
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();

    // In a real app, you'd save this to your backend
    router.push("/trainer/dashboard");
  };

  // Go back to dashboard
  const goBack = () => {
    router.push("/trainer/dashboard");
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-8 flex items-center justify-center">
        <AntiqueBodyLogo />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <BackButton onClick={() => router.push("/trainer/dashboard")} />
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Card variant="darkStrong" width="100%" maxWidth="100%">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* BASIC INFORMATION SECTION */}
          <BasicInformation
            trainerData={trainerData}
            handleChange={handleChange}
            previewImage={previewImage}
            handleImageUpload={handleImageUpload}
            newCertification={newCertification}
            setNewCertification={setNewCertification}
            addCertification={addCertification}
            removeCertification={removeCertification}
          />

          {/* ABOUT SECTION */}
          <AboutYou
            trainerData={trainerData}
            handleChange={handleChange}
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            addEducation={addEducation}
            removeEducation={removeEducation}
          />

          {/* EXPERTISE SECTION */}
          <AreasOfExpertise trainerData={trainerData} updateExpertiseLevel={updateExpertiseLevel} />

          {/* SERVICES SECTION */}
          <ServicesOffered
            trainerData={trainerData}
            newService={newService}
            setNewService={setNewService}
            addService={addService}
            removeService={removeService}
          />

          {/* AVAILABILITY SECTION */}
          <Availability trainerData={trainerData} handleChange={handleChange} setTrainerData={setTrainerData} />

          {/* Submit Button */}
          <div className="flex justify-end border-t border-[#333] pt-8">
            <div className="flex gap-4">
              <Button variant="secondary" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" variant="orangeFilled" size="large" leftIcon={<SaveIcon size={20} />}>
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfilePage;
