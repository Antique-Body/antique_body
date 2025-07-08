import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { DetailsTabNutrition } from "./planPreviewModal/DetailsTabNutrition";
import { DetailsTabTraining } from "./planPreviewModal/DetailsTabTraining";
import { OverviewTab } from "./planPreviewModal/OverviewTab";
import { ScheduleTab } from "./planPreviewModal/ScheduleTab";
import { StatsTab } from "./planPreviewModal/StatsTab";
import { usePlanPDF } from "./planPreviewModal/usePlanPDF";
import { WeeklyScheduleTab } from "./planPreviewModal/WeeklyScheduleTab";

import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Modal } from "@/components/common/Modal";

export const PlanPreviewModal = ({ plan, isOpen, onClose, days, type }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDay, setActiveDay] = useState(null);
  const [navError, setNavError] = useState("");
  const router = useRouter();
  const isNutrition = type === "nutrition";
  const {
    handleDownloadPDF,
    isDownloading,
    error: pdfError,
    success: pdfSuccess,
    setSuccess: setPdfSuccess,
  } = usePlanPDF();

  // Set first day as default when plan/days/type/schedule changes
  useEffect(() => {
    let firstDay = null;
    if (isNutrition) {
      const dayArr = days || plan?.days || [];
      if (dayArr.length > 0) {
        firstDay = dayArr[0].day || dayArr[0].name;
      }
    } else {
      const schedArr = plan?.schedule || [];
      if (schedArr.length > 0) {
        firstDay = schedArr[0].day || schedArr[0].name;
      }
    }
    setActiveDay(firstDay);
  }, [isNutrition, days, plan, plan?.schedule]);

  if (!plan) return null;

  const {
    title,
    description,
    image,
    createdAt,
    duration,
    clientCount = 0,
    price,
    keyFeatures,
    schedule,

    averageRating,
    successRate,
    testimonial,
    // Nutrition-specific fields
    nutritionInfo,
    supplementRecommendations,
    cookingTime,
    // Training-specific fields
    trainingType,
    sessionsPerWeek,
    sessionFormat,
    difficultyLevel,
    features, // Training plan features
    timeline,
  } = plan;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Plan Details" },
    { id: "schedule", label: "Timeline" },
    { id: "weekly", label: "Weekly Schedule" },
    { id: "stats", label: "Statistics" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="large"
      footerButtons={false}
    >
      <div className="flex flex-col -mt-6 -mx-4 sm:-mx-5">
        {/* Banner image with gradient overlay */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          {image && image !== "" && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]" />

          {/* Plan type badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${
                isNutrition
                  ? "bg-green-900/80 text-green-100"
                  : "bg-blue-900/80 text-blue-100"
              }`}
            >
              <Icon
                icon={
                  isNutrition
                    ? "heroicons:beaker-20-solid"
                    : "heroicons:bolt-20-solid"
                }
                className="w-4 h-4"
              />
              {isNutrition ? "Nutrition Plan" : "Training Plan"}
            </span>
          </div>

          {/* Price tag */}
          {price && (
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-[#FF6B00] text-white">
                <Icon
                  icon="heroicons:banknotes-20-solid"
                  className="w-4 h-4 mr-1"
                />
                ${price}
              </span>
            </div>
          )}
        </div>

        {/* Content container */}
        <div className="px-4 sm:px-5">
          {/* Title and metadata section */}
          <div className="mt-6 mb-6">
            <div className="flex justify-between mb-4 items-start gap-4 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {title}
              </h1>

              {/* Action buttons */}
              {navError && <ErrorMessage error={navError} />}
              <div className="flex flex-wrap gap-3">
                {/* Download PDF Button */}
                <Button
                  variant="outline"
                  className="whitespace-nowrap bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] border-[#FF6B00]/30 hover:border-[#FF6B00]/70 hover:bg-gradient-to-r hover:from-[rgba(255,107,0,0.1)] hover:to-[rgba(255,107,0,0.2)] transition-all duration-300"
                  onClick={() => {
                    handleDownloadPDF(plan, days, type, () => {
                      setTimeout(() => setPdfSuccess(null), 2000);
                    });
                  }}
                  loading={isDownloading}
                  disabled={isDownloading}
                >
                  <Icon
                    icon="heroicons:arrow-down-tray-20-solid"
                    className="w-4 h-4 mr-2 text-[#FF6B00]"
                  />
                  {isDownloading ? "Generating PDF..." : "Download PDF"}
                </Button>
                {pdfError && (
                  <div className="w-full text-red-500 text-sm mt-2">
                    {pdfError}
                  </div>
                )}
                {pdfSuccess && !pdfError && (
                  <div className="w-full text-green-500 text-sm mt-2">
                    {pdfSuccess}
                  </div>
                )}
                {/* Client assignments button */}
                <Button
                  variant="orangeFilled"
                  className="whitespace-nowrap"
                  onClick={() => {
                    if (plan?.id && type) {
                      setNavError("");
                      router.push(
                        `/trainer/dashboard/plans/${type}/clients/${plan.id}`
                      );
                    } else {
                      console.error(
                        "Missing or invalid navigation parameters: plan.id or type"
                      );
                      setNavError(
                        "Unable to navigate: Missing or invalid plan information. Please try again or contact support."
                      );
                    }
                  }}
                >
                  <Icon
                    icon="heroicons:users-20-solid"
                    className="w-4 h-4 mr-2"
                  />
                  View Client Assignments
                </Button>
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base mb-4">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:calendar-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>Created: {formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:clock-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>Duration: {duration}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:users-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>{clientCount} active clients</span>
              </div>
            </div>
          </div>

          {/* Tabs navigation */}
          <div className="border-b border-[#333] mb-6">
            <div className="flex space-x-6 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  type="button"
                  className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                      : "text-gray-400 hover:text-white border-b-2 border-transparent"
                  } bg-transparent rounded-none`}
                  onClick={() => setActiveTab(tab.id)}
                  variant="tab"
                  isActive={activeTab === tab.id}
                  style={{ position: "relative" }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="mb-6">
            {activeTab === "overview" && (
              <OverviewTab
                description={description}
                keyFeatures={keyFeatures}
                difficultyLevel={difficultyLevel}
              />
            )}
            {activeTab === "details" &&
              (isNutrition ? (
                <DetailsTabNutrition
                  plan={plan}
                  supplementRecommendations={supplementRecommendations}
                  duration={duration}
                  cookingTime={cookingTime}
                  nutritionInfo={nutritionInfo}
                />
              ) : (
                <DetailsTabTraining
                  trainingType={trainingType}
                  sessionsPerWeek={sessionsPerWeek}
                  sessionFormat={sessionFormat}
                  difficultyLevel={difficultyLevel}
                  features={features}
                />
              ))}
            {activeTab === "schedule" && (
              <ScheduleTab
                timeline={timeline}
                isNutrition={isNutrition}
                days={days}
                plan={plan}
                schedule={schedule}
              />
            )}
            {activeTab === "weekly" && (
              <WeeklyScheduleTab
                isNutrition={isNutrition}
                days={days}
                plan={plan}
                schedule={schedule}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
              />
            )}
            {activeTab === "stats" && (
              <StatsTab
                averageRating={averageRating}
                successRate={successRate}
                testimonial={testimonial}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
