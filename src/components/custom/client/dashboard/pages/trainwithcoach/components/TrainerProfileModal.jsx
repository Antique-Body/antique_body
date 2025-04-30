import { useState } from "react";

import { Button } from "@/components/common/Button";
import {
  BookmarkIcon,
  CertificateIcon,
  ClockIcon,
  CloseXIcon,
  LocationIcon,
  UserProfileIcon,
} from "@/components/common/Icons";
import {
  About,
  Availability,
  Expertise,
  Testimonials,
} from "@/components/custom/client/dashboard/pages/trainwithcoach/components";

// This component is the profile modal that appears when "View Profile" is clicked
export const TrainerProfileModal = ({ trainer, onClose }) => {
  const [activeTab, setActiveTab] = useState("about");

  // Function to render rating stars
  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-[#FF6B00]">
            ★
          </span>,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-[#FF6B00]">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-[#444]">
            ★
          </span>,
        );
      }
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-70 p-4">
      <div
        className="animate-fadeIn relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#333] bg-[#121212] shadow-2xl"
        style={{
          animation: "fadeIn 0.3s ease-out",
          boxShadow: "0 15px 40px -10px rgba(255,107,0,0.3)",
        }}
      >
        {/* Orange accent line at top */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>

        {/* Close button */}
        <Button variant="ghost" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <CloseXIcon size={24} />
        </Button>

        {/* Profile header */}
        <div className="flex flex-col items-start gap-6 p-6 pb-4 md:flex-row">
          {/* Trainer photo */}
          <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-3xl font-semibold text-white transition-transform duration-300 ease-in-out md:h-40 md:w-40">
            <UserProfileIcon size={80} className="text-white" />

            {/* Shine effect */}
            <div
              className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] rotate-45 transform bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]"
              style={{
                animation: "shine 3s infinite",
                animationTimingFunction: "ease-in-out",
              }}
            ></div>
          </div>

          {/* Trainer info */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{trainer?.name}</h2>
              {trainer?.preferred && (
                <span className="rounded bg-[rgba(255,107,0,0.2)] px-3 py-1 text-xs font-medium text-[#FF6B00]">
                  Preferred for your goals
                </span>
              )}
            </div>

            <p className="mb-2 text-lg font-medium text-[#FF6B00]">{trainer?.specialty}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {trainer?.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]"
                >
                  <CertificateIcon size={12} />
                  {cert}
                </span>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-gray-300">
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">{renderStars(trainer?.rating)}</div>
                <span className="ml-1">{trainer?.rating} Rating</span>
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon size={16} />
                <span>{trainer?.experience} Experience</span>
              </div>

              <div className="flex items-center gap-1">
                <LocationIcon size={16} />
                <span>{trainer?.proximity}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="orangeFilled">Book Session</Button>

              <Button variant="secondary">Message</Button>

              <Button variant="secondary" leftIcon={<BookmarkIcon size={16} />}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-[#333] px-6">
          <div className="flex overflow-x-auto">
            <Button variant="tab" onClick={() => setActiveTab("about")} isActive={activeTab === "about"}>
              About
            </Button>
            <Button variant="tab" onClick={() => setActiveTab("expertise")} isActive={activeTab === "expertise"}>
              Expertise
            </Button>
            <Button variant="tab" onClick={() => setActiveTab("availability")} isActive={activeTab === "availability"}>
              Availability
            </Button>
            <Button variant="tab" onClick={() => setActiveTab("testimonials")} isActive={activeTab === "testimonials"}>
              Testimonials
            </Button>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === "about" && <About trainer={trainer} />}
          {activeTab === "expertise" && <Expertise trainer={trainer} />}
          {activeTab === "availability" && <Availability trainer={trainer} />}
          {activeTab === "testimonials" && <Testimonials trainer={trainer} renderStars={renderStars} />}
        </div>
      </div>
    </div>
  );
};
