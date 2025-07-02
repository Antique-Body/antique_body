"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PlanPreviewModal } from "./PlanPreviewModal";

import { Card } from "@/components/common";
import { Button } from "@/components/common/Button";
import {
  ClockIcon,
  CopyIcon,
  DollarIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/common/Icons";

export const PlanCard = ({
  id,
  title,
  description,
  image,
  createdAt,
  planType,
  duration,
  clientCount = 0,
  price,
  editUrl,
  weeklySchedule,
  index = 0,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isNutrition = planType === "nutrition";

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const handleCardClick = (e) => {
    // Don't open modal if clicking on one of the buttons
    if (e.target.closest("button")) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleCopyClick = () => {
    // Navigate to the same edit page but with a query param to indicate it's a copy operation
    router.push(
      `${editUrl}?mode=copy&title=${encodeURIComponent(`Copy of ${title}`)}`
    );
  };

  const handleEditClick = () => {
    // Navigate to the edit page
    router.push(editUrl);
  };

  const planData = {
    id,
    title,
    description,
    image,
    createdAt,
    planType,
    duration,
    clientCount,
    price,
    editUrl,
    weeklySchedule,
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full cursor-pointer"
        onClick={handleCardClick}
      >
        <Card
          variant="darkStrong"
          width="100%"
          className="flex h-full flex-col overflow-hidden hover:border-[#FF6B00] transition-all duration-300"
        >
          <div className="relative h-40 overflow-hidden">
            {image && (
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>

            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  isNutrition
                    ? "bg-green-900/80 text-green-100"
                    : "bg-blue-900/80 text-blue-100"
                }`}
              >
                {isNutrition ? "Nutrition" : "Training"}
              </span>

              {price && (
                <span className="flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#FF6B00]/20 text-[#FF6B00]">
                  <DollarIcon size={12} className="mr-1" />${price}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <h3 className="mb-2 text-xl font-bold text-white line-clamp-1">
              {title}
            </h3>
            <p className="mb-3 text-sm text-gray-400 line-clamp-2">
              {description}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <ClockIcon size={16} className="text-gray-500" />
                  <span>{duration}</span>
                </div>

                <div className="flex items-center gap-1">
                  <UsersIcon size={16} className="text-gray-500" />
                  <span>
                    {clientCount} {clientCount === 1 ? "client" : "clients"}
                  </span>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs">{formattedDate}</span>
                </div>
              </div>

              <div
                className="flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex space-x-2">
                  <Button
                    variant="darkOutline"
                    size="small"
                    leftIcon={<CopyIcon size={16} />}
                    onClick={handleCopyClick}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="small"
                    leftIcon={<TrashIcon size={16} />}
                  >
                    Delete
                  </Button>
                </div>
                <Button
                  onClick={handleEditClick}
                  variant="orangeOutline"
                  size="small"
                  leftIcon={<EditIcon size={16} />}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <PlanPreviewModal
        plan={planData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
