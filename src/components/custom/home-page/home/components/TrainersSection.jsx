import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const TrainersSection = ({ trainers }) => {
  // Limit to only 5 trainers
  const limitedTrainers = trainers.slice(0, 5);
  const [activeTrainer, setActiveTrainer] = useState(null);

  return (
    <div className="relative w-full py-10">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 gap-2 mb-4 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
              <span className="text-[#FF6B00]">
                <Icon icon="mdi:account-group" className="text-sm" />
              </span>
              <span className="text-sm font-medium text-[#FF6B00]">
                Featured Trainers
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                Connect with Top Trainers
              </span>
            </h2>

            <p className="text-gray-300 max-w-2xl mt-3">
              Connect with certified professionals who specialize in ancient
              Greek training methods, providing personalized guidance for your
              unique fitness journey.
            </p>
          </div>

          <Link href="/trainers-marketplace" className="hidden md:block">
            <Button
              variant="orangeOutline"
              size="small"
              className="flex items-center gap-2"
            >
              View All
              <Icon icon="mdi:arrow-right" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Responsive Trainer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
        {limitedTrainers.map((trainer, index) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: activeTrainer === index ? 1.03 : 1,
            }}
            transition={{
              duration: 0.4,
              delay: Math.min(index * 0.1, 0.5),
              scale: { type: "spring", stiffness: 150 },
            }}
            onMouseEnter={() => setActiveTrainer(index)}
            onMouseLeave={() => setActiveTrainer(null)}
            className="group h-full"
          >
            <div
              className={`h-full bg-gradient-to-b from-[#121212] to-black/90 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/10 ${
                activeTrainer === index
                  ? "border-[#FF6B00]/50"
                  : "border-gray-800"
              }`}
            >
              {/* Trainer image with overlay */}
              <div className="h-[220px] relative overflow-hidden">
                {trainer.image ? (
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    width={320}
                    height={220}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Icon
                      icon="mdi:account"
                      className="text-4xl text-gray-700"
                    />
                  </div>
                )}

                {/* Image overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Specialization tag */}
                <div className="absolute top-3 right-3 bg-[#FF6B00]/10 backdrop-blur-sm px-2 py-1 rounded-full border border-[#FF6B00]/20">
                  <span className="text-xs font-medium text-[#FF6B00]">
                    {trainer.specialization}
                  </span>
                </div>

                {/* Trainer info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                    {trainer.name}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-[#FF6B00] mr-1"
                    />
                    {trainer.location}
                  </p>
                </div>
              </div>

              {/* Trainer details and stats */}
              <div className="p-4">
                {/* Rating and review count */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {[...Array(Math.floor(trainer.rating))].map((_, i) => (
                        <Icon
                          key={i}
                          icon="mdi:star"
                          className="text-[#FF6B00] text-sm"
                        />
                      ))}
                      {trainer.rating % 1 !== 0 && (
                        <Icon
                          icon="mdi:star-half"
                          className="text-[#FF6B00] text-sm"
                        />
                      )}
                    </div>
                    <span className="text-white text-sm font-semibold">
                      {trainer.rating}
                    </span>
                    <span className="text-gray-400 ml-1 text-xs">
                      ({trainer.reviewCount})
                    </span>
                  </div>

                  <div className="bg-[#FF6B00]/10 px-2 py-1 rounded-full text-xs border border-[#FF6B00]/10">
                    <span className="text-[#FF6B00]">
                      {trainer.clientCount} clients
                    </span>
                  </div>
                </div>

                {/* Bio with line clamp */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {trainer.bio}
                </p>

                {/* CTA button */}
                <Link href="/trainers-marketplace">
                  <Button
                    variant="outline"
                    size="small"
                    className="w-full group border-gray-700 hover:border-[#FF6B00] transition-colors"
                  >
                    <span className="group-hover:text-[#FF6B00] transition-colors">
                      View Profile
                    </span>
                    <Icon
                      icon="mdi:arrow-right"
                      className="ml-2 group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]"
                    />
                  </Button>
                </Link>
              </div>

              {/* Enhanced hover glow effect */}
              <motion.div
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  boxShadow:
                    activeTrainer === index
                      ? "0 0 20px 1px rgba(255, 107, 0, 0.2)"
                      : "0 0 0px 0px rgba(255, 107, 0, 0)",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="flex justify-center mt-8 md:hidden">
        <Link href="/trainers-marketplace">
          <Button
            variant="orangeOutline"
            size="small"
            className="flex items-center gap-2"
          >
            View All Trainers
            <Icon icon="mdi:arrow-right" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
