import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { RatingStars } from "./RatingStars";

import { Button } from "@/components/common/Button";

export const TrainerSpotlight = ({ trainers, onTrainerClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate feature trainers
  useEffect(() => {
    if (!isPaused && trainers.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % trainers.length);
      }, 6000); // Change every 6 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, trainers.length]);

  // No trainers or only one trainer
  if (!trainers || trainers.length === 0) {
    return null;
  }

  const activeTrainer = trainers[activeIndex];

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Background with Overlay */}
      <div className="relative aspect-[2.5/1] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrainer.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={activeTrainer.image}
              alt={activeTrainer.name}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 z-10 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTrainer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="inline-flex items-center px-3 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full mb-4">
                      <Icon
                        icon="mdi:star"
                        className="w-4 h-4 text-[#FF6B00] mr-1"
                      />
                      <span className="text-xs font-medium text-[#FF6B00]">
                        Featured Trainer
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                      {activeTrainer.name}
                    </h1>

                    <p className="text-lg text-zinc-300 font-medium mb-1">
                      {activeTrainer.specialty}
                    </p>

                    <div className="flex items-center text-zinc-300 mb-4">
                      <Icon
                        icon="mdi:map-marker"
                        className="w-5 h-5 text-[#FF6B00] mr-1"
                      />
                      <span>{activeTrainer.location}</span>
                      <span className="mx-2 text-zinc-500">•</span>
                      <RatingStars
                        rating={activeTrainer.rating}
                        size={16}
                        className="mr-1"
                      />
                      <span className="text-white font-medium">
                        {activeTrainer.rating.toFixed(1)}
                      </span>
                      <span className="text-zinc-400 ml-1">
                        ({activeTrainer.reviewCount})
                      </span>
                    </div>

                    <p className="text-zinc-300 mb-6 max-w-md">
                      {activeTrainer.bio}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant="orangeFilled"
                        size="medium"
                        onClick={() => onTrainerClick(activeTrainer)}
                        className="group"
                        rightIcon={
                          <Icon
                            icon="mdi:arrow-right"
                            className="w-5 h-5 ml-1 group-hover:translate-x-0.5 transition-transform"
                          />
                        }
                      >
                        View Profile
                      </Button>

                      <Button variant="outline" size="medium">
                        Book Session
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:w-1/2 hidden lg:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots for multiple trainers */}
      {trainers.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {trainers.map((_, index) => (
            <Button
              key={index}
              variant={index === activeIndex ? "orangeFilled" : "secondary"}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 min-w-0 min-h-0 p-0 rounded-full transition-all ${
                index === activeIndex ? "w-6" : "bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Go to trainer ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
