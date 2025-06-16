import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { RatingStars } from "./RatingStars";
import { TrainerDetails } from "./TrainerDetails";

import { Button } from "@/components/common/Button";

export const TrainerProfileModal = ({ trainer, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("about");
  // const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!trainer || !isOpen) return null;

  const tabs = [
    { id: "about", label: "About", icon: "mdi:information" },
    { id: "expertise", label: "Expertise", icon: "mdi:certificate" },
    { id: "schedule", label: "Schedule", icon: "mdi:calendar" },
    { id: "reviews", label: "Reviews", icon: "mdi:star" },
    { id: "gallery", label: "Gallery", icon: "mdi:image" },
  ];

  // Stop propagation to prevent closing when clicking inside
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Close on escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const imageSrc = trainer.imag;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={handleContentClick}
          >
            {/* Header section with close button */}
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:text-[#FF6B00] transition-colors"
                aria-label="Close profile"
              >
                <Icon icon="mdi:close" className="h-6 w-6" />
              </Button>

              {/* Banner image */}
              <div className="h-48 relative">
                <Image
                  src={imageSrc}
                  alt={trainer.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
              </div>

              {/* Trainer info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Profile image */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-zinc-900 overflow-hidden bg-zinc-800">
                    <Image
                      src={imageSrc}
                      alt={trainer.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>

                  {/* Verification badge */}
                  {trainer.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-[#FF6B00] rounded-full p-1 border-2 border-zinc-900">
                      <Icon icon="mdi:check" className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {trainer.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <div className="flex items-center text-zinc-300">
                      <Icon
                        icon="mdi:map-marker"
                        className="h-5 w-5 text-[#FF6B00] mr-1"
                      />
                      {trainer.location}
                    </div>

                    <div className="flex items-center">
                      <RatingStars
                        rating={trainer.rating}
                        size={16}
                        className="mr-1"
                      />
                      <span className="text-white font-medium">
                        {trainer.rating.toFixed(1)}
                      </span>
                      <span className="text-zinc-400 ml-1">
                        ({trainer.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="text-zinc-300">
                      <span className="text-[#FF6B00] font-medium">
                        ${trainer.price}
                      </span>
                      /session
                    </div>
                  </div>
                </div>

                {/* Action buttons (desktop) */}
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    className="flex items-center gap-1"
                  >
                    <Icon icon="mdi:message" className="h-4 w-4" />
                    Message
                  </Button>

                  <Button
                    variant="orangeFilled"
                    size="small"
                    // onClick={() => setIsBookingOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Icon icon="mdi:calendar-check" className="h-4 w-4" />
                    Book Session
                  </Button>
                </div>
              </div>
            </div>

            {/* Action buttons (mobile) */}
            <div className="md:hidden flex gap-2 px-4 mt-20 mb-4">
              <Button
                variant="outline"
                size="small"
                className="flex-1 flex items-center justify-center gap-1"
              >
                <Icon icon="mdi:message" className="h-4 w-4" />
                Message
              </Button>

              <Button
                variant="orangeFilled"
                size="small"
                // onClick={() => setIsBookingOpen(true)}
                className="flex-1 flex items-center justify-center gap-1"
              >
                <Icon icon="mdi:calendar-check" className="h-4 w-4" />
                Book Session
              </Button>
            </div>

            {/* Tabs navigation */}
            <div className="px-4 border-b border-zinc-800">
              <div className="flex overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="tab"
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center px-4 py-3 font-medium text-sm"
                  >
                    <Icon icon={tab.icon} className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              <TrainerDetails trainer={trainer} activeTab={activeTab} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
