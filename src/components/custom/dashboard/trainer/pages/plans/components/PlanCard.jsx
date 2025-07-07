"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PlanPreviewModal } from "./PlanPreviewModal";

import {
  fetchPlanDetails,
  deletePlan,
} from "@/app/api/users/services/planService";
import { Card, ErrorMessage } from "@/components/common";
import { Button } from "@/components/common/Button";
import {
  ClockIcon,
  CopyIcon,
  DollarIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  ViewIcon,
} from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

export const PlanCard = ({
  id,
  title,
  description,
  coverImage,
  createdAt,
  type,
  duration,
  clientCount = 0,
  price,
  editUrl,
  index = 0,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [detailedPlanData, setDetailedPlanData] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const formattedDate = new Date(createdAt).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isNutrition = type === "nutrition";

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
    handleViewClick();
  };

  const fetchPlanDetailsHandler = async () => {
    try {
      setLoadingPlanDetails(true);
      const planData = await fetchPlanDetails(id, type);
      // Transform the data to match what PlanPreviewModal expects
      const transformedData = {
        id: planData.id,
        title: planData.title,
        description: planData.description,
        image: planData.coverImage,
        createdAt: planData.createdAt,
        duration: planData.duration
          ? `${planData.duration} ${planData.durationType || "weeks"}`
          : "Not specified",
        clientCount: planData.clientCount || 0,
        price: planData.price,
        keyFeatures: planData.keyFeatures || [],
        schedule: planData.schedule || [],
        timeline: planData.timeline || [],
        editUrl,
      };
      if (isNutrition) {
        transformedData.nutritionInfo = planData.nutritionInfo;
        transformedData.mealTypes = planData.mealTypes;
        transformedData.supplementRecommendations =
          planData.supplementRecommendations;
        transformedData.cookingTime = planData.cookingTime;
        if (planData.days) {
          transformedData.days = planData.days;
        }
        transformedData.targetGoal = planData.targetGoal;
      } else {
        transformedData.trainingType = planData.trainingType;
        transformedData.sessionsPerWeek = planData.sessionsPerWeek;
        transformedData.sessionFormat = planData.sessionFormat;
        transformedData.difficultyLevel = planData.difficultyLevel;
        transformedData.features = planData.features;
      }
      setDetailedPlanData(transformedData);
      return transformedData;
    } catch {
      return {
        id,
        title,
        description,
        image: coverImage,
        createdAt,
        duration,
        clientCount,
        price,
        keyFeatures: [],
        schedule: [],
        editUrl,
      };
    } finally {
      setLoadingPlanDetails(false);
    }
  };

  const handleViewClick = async () => {
    const planData = await fetchPlanDetailsHandler();
    setDetailedPlanData(planData);
    setIsModalOpen(true);
  };

  const handleCopyClick = () => {
    // Navigate to the same edit page but with a query param to indicate it's a copy operation
    router.push(
      `${editUrl}?mode=copy&title=${encodeURIComponent(`Copy of ${title}`)}`
    );
  };

  const handleEditClick = () => {
    // Use the correct edit URL based on plan type
    if (isNutrition) {
      router.push(`/trainer/dashboard/plans/nutrition/edit/${id}`);
    } else {
      router.push(`/trainer/dashboard/plans/training/edit/${id}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deletePlan(id, isNutrition ? "nutrition" : "training");
      if (onDelete) onDelete(id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      setDeleteError(
        t("plans.delete_error", "Failed to delete plan. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
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
        {deleteError && <ErrorMessage error={deleteError} />}
        <Card
          variant="darkStrong"
          width="100%"
          className="flex h-full flex-col overflow-hidden hover:border-[#FF6B00] transition-all duration-300 !p-0"
        >
          <div className="relative h-32 sm:h-40 overflow-hidden">
            {coverImage && (
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={coverImage}
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

          <div className="flex flex-1 flex-col p-2 sm:p-4">
            <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-white line-clamp-1">
              {title}
            </h3>
            <p className="mb-2 sm:mb-3 text-sm text-gray-400 line-clamp-2">
              {description}
            </p>

            <div className="mt-auto space-y-2 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <ClockIcon size={16} className="text-gray-500" />
                  <span>{duration || "Not specified"}</span>
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
                className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-1 sm:gap-2 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="darkOutline"
                  size="small"
                  leftIcon={<CopyIcon size={14} />}
                  onClick={handleCopyClick}
                  className="hover:border-[#FF6B00] hover:text-[#FF6B00] hover:scale-105 hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2"
                >
                  <span className="hidden sm:inline">Copy</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
                <Button
                  variant="darkOutline"
                  size="small"
                  leftIcon={<ViewIcon size={14} />}
                  onClick={handleViewClick}
                  loading={loadingPlanDetails}
                  className="hover:border-blue-400 hover:text-blue-300 hover:scale-105 hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2"
                >
                  <span className="hidden sm:inline">
                    {loadingPlanDetails ? "Loading..." : "View"}
                  </span>
                  <span className="sm:hidden">
                    {loadingPlanDetails ? "..." : "View"}
                  </span>
                </Button>
                <Button
                  variant="dangerOutline"
                  size="small"
                  leftIcon={<TrashIcon size={14} />}
                  onClick={handleDeleteClick}
                  className="hover:border-red-500 hover:text-red-400 hover:scale-105 hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2"
                >
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
                <Button
                  onClick={handleEditClick}
                  variant="orangeOutline"
                  size="small"
                  leftIcon={<EditIcon size={14} />}
                  className="hover:border-orange-400 hover:text-orange-300 hover:scale-105 hover:shadow-md transition-all duration-200 text-xs sm:text-sm px-1 sm:px-3 py-1 sm:py-2"
                >
                  <span className="hidden sm:inline">Edit</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <PlanPreviewModal
        plan={detailedPlanData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        days={detailedPlanData?.days}
        type={type}
      />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t("plans.delete_title", "Obriši plan")}
        message={
          <span>
            {t(
              "plans.delete_message",
              "Jesi li siguran da želiš obrisati plan"
            )}{" "}
            <span className="font-semibold">{title}</span>?
          </span>
        }
        confirmButtonText={
          deleting
            ? t("plans.deleting", "Brišem...")
            : t("plans.delete_confirm", "Da, obriši")
        }
        cancelButtonText={t("common.cancel", "Ne")}
        primaryButtonDisabled={deleting}
        primaryButtonAction={confirmDelete}
        secondaryButtonAction={() => setShowDeleteModal(false)}
        footerButtons
        footerBorder
        size="small"
      />
    </>
  );
};
