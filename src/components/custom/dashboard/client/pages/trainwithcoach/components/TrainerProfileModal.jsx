import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import {
  About,
  Availability,
  Expertise,
  Reviews,
} from "@/components/custom/dashboard/client/pages/trainwithcoach/components";
import { DashboardTabs } from "@/components/custom/dashboard/shared";

// This component is the profile modal that appears when "View Profile" is clicked
export const TrainerProfileModal = ({ trainer, onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState("about");

  // Define tabs for the DashboardTabs component
  const tabs = [
    { id: "about", label: "About", badgeCount: 0 },
    { id: "expertise", label: "Expertise", badgeCount: 0 },
    { id: "availability", label: "Availability", badgeCount: 0 },
    { id: "reviews", label: "Reviews", badgeCount: 0 },
  ];

  // Function to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-[#FF6B00]">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-[#FF6B00]">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-[#444]">
            ★
          </span>
        );
      }
    }

    return stars;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={trainer?.name}
      size="large"
      footerButtons={false}
    >
      {/* Profile header with trainer info */}
      <div className="mb-4 flex flex-col items-start gap-4 md:flex-row">
        {/* Trainer photo */}
        <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-3xl font-semibold text-white md:h-32 md:w-32">
          {trainer?.image ? (
            <Image
              src={trainer.image}
              alt={trainer.name}
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon
              icon="mdi:account"
              width={60}
              height={60}
              className="text-white"
            />
          )}

          {/* Shine effect with reduced animation */}
          <div
            className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] rotate-45 transform bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]"
            style={{
              animation: "shine 5s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Trainer info */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            {trainer?.preferred && (
              <span className="rounded bg-[rgba(255,107,0,0.2)] px-3 py-1 text-xs font-medium text-[#FF6B00]">
                Preferred for your goals
              </span>
            )}
          </div>

          <p className="mb-2 text-lg font-medium text-[#FF6B00]">
            {trainer?.specialty}
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {trainer?.certifications?.map((cert, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]"
              >
                <Icon icon="mdi:certificate" width={12} height={12} />
                {typeof cert === "string" ? cert : cert.name}
              </span>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">{renderStars(trainer?.rating)}</div>
              <span className="ml-1">{trainer?.rating} Rating</span>
            </div>

            <div className="flex items-center gap-1">
              <Icon icon="mdi:clock-outline" width={16} height={16} />
              <span>{trainer?.experience}</span>
            </div>

            <div className="flex items-center gap-1">
              <Icon icon="mdi:map-marker" width={16} height={16} />
              <span>{trainer?.proximity}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="orangeFilled" className="px-3 py-1.5 text-sm">
              Book Session
            </Button>
            <Button variant="secondary" className="px-3 py-1.5 text-sm">
              Message
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-sm"
              leftIcon={
                <Icon icon="mdi:bookmark-outline" width={14} height={14} />
              }
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="-mx-4 border-b border-[#333] sm:-mx-5">
        <div className="px-4 sm:px-5">
          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        <div
          className={`transition-opacity duration-200 ${
            activeTab === "about" ? "block" : "hidden"
          }`}
        >
          <About trainer={trainer} />
        </div>

        <div
          className={`transition-opacity duration-200 ${
            activeTab === "expertise" ? "block" : "hidden"
          }`}
        >
          <Expertise trainer={trainer} />
        </div>

        <div
          className={`transition-opacity duration-200 ${
            activeTab === "availability" ? "block" : "hidden"
          }`}
        >
          <Availability trainer={trainer} />
        </div>

        <div
          className={`transition-opacity duration-200 ${
            activeTab === "reviews" ? "block" : "hidden"
          }`}
        >
          <Reviews trainer={trainer} renderStars={renderStars} />
        </div>
      </div>
    </Modal>
  );
};
