import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { RatingStars } from "./RatingStars";
import { TrainerDetails } from "./TrainerDetails";

import { Button } from "@/components/common/Button";

export const TrainerProfileModal = ({ trainer, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const imageSrc = trainer.image;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm overflow-hidden"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: isMobile ? 100 : 0,
              scale: isMobile ? 1 : 0.9,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: isMobile ? 100 : 0,
              scale: isMobile ? 1 : 0.9,
            }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-zinc-900 border border-zinc-800 rounded-t-xl sm:rounded-xl w-full h-[90vh] sm:h-auto sm:max-h-[90vh] max-w-4xl overflow-hidden flex flex-col relative"
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
                <Icon icon="mdi:close" className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>

              {/* Banner image */}
              <div className="h-32 sm:h-48 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                    isImageLoaded ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="mdi:account"
                      className="w-12 h-12 text-zinc-700"
                    />
                  </div>
                </div>
                <Image
                  src={imageSrc}
                  alt={trainer.name}
                  fill
                  className={`object-cover ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                  priority
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
              </div>

              {/* Trainer info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                {/* Profile image */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl border-4 border-zinc-900 overflow-hidden bg-zinc-800">
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
                      <Icon
                        icon="mdi:check"
                        className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {trainer.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 mt-1.5 sm:mt-2">
                    <div className="flex items-center text-zinc-300 text-sm">
                      <Icon
                        icon="mdi:map-marker"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF6B00] mr-1"
                      />
                      {trainer.location}
                    </div>

                    <div className="flex items-center">
                      <RatingStars
                        rating={trainer.rating}
                        size={14}
                        className="mr-1"
                      />
                      <span className="text-white font-medium text-sm">
                        {trainer.rating.toFixed(1)}
                      </span>
                      <span className="text-zinc-400 ml-1 text-xs">
                        ({trainer.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="text-zinc-300 text-sm">
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
                    className="flex items-center gap-1"
                  >
                    <Icon icon="mdi:calendar-check" className="h-4 w-4" />
                    Book Session
                  </Button>
                </div>
              </div>
            </div>

            {/* Action buttons (mobile) */}
            <div className="md:hidden flex gap-2 px-4 mt-16 sm:mt-20 mb-4">
              <Button
                variant="outline"
                size="small"
                className="flex-1 flex items-center justify-center gap-1 py-1.5"
              >
                <Icon icon="mdi:message" className="h-4 w-4" />
                Message
              </Button>

              <Button
                variant="orangeFilled"
                size="small"
                className="flex-1 flex items-center justify-center gap-1 py-1.5"
              >
                <Icon icon="mdi:calendar-check" className="h-4 w-4" />
                Book Session
              </Button>
            </div>

            {/* Tabs navigation */}
            <div className="px-2 sm:px-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
              <div className="flex overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="tab"
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Icon icon={tab.icon} className="h-4 w-4 mr-1.5 sm:mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 overscroll-contain">
              <TrainerDetails trainer={trainer} activeTab={activeTab} />
            </div>

            {/* Bottom safe area for mobile */}
            <div className="h-6 md:hidden bg-zinc-900"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
