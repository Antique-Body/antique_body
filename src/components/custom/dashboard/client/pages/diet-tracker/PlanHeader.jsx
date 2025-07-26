"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

export const PlanHeader = ({
  activePlan,
  currentDay,
  completionRate,
  validationError,
  onClearValidationError,
}) => {
  const getTrainerName = () => {
    const trainer = activePlan?.assignedBy?.trainerProfile;
    if (!trainer) return "Your Trainer";
    return (
      `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() ||
      "Your Trainer"
    );
  };

  const getTrainerImage = () =>
    activePlan?.assignedBy?.trainerProfile?.profileImage;

  return (
    <div className="space-y-4">
      {/* Validation Error */}
      {validationError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:alert-circle"
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="text-red-400 font-medium">Action Not Allowed</h4>
                <p className="text-red-300 text-sm mt-1">{validationError}</p>
              </div>
            </div>
            <button
              onClick={onClearValidationError}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF9A00]/5 rounded-xl border border-[#FF6B00]/30 overflow-hidden backdrop-blur-sm shadow-lg shadow-[#FF6B00]/10">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Left side - Plan info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {/* Trainer Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex items-center justify-center">
                    {getTrainerImage() ? (
                      <Image
                        src={getTrainerImage()}
                        alt="Trainer"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Icon icon="mdi:account" className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                </div>

                {/* Plan Title and Trainer */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {activePlan?.nutritionPlan?.title || "Your Nutrition Plan"}
                  </h1>
                  <p className="text-[#FF6B00] font-medium">
                    Assigned by {getTrainerName()}
                  </p>
                </div>
              </div>

              {/* Plan Description */}
              <p className="text-zinc-300 mb-4 leading-relaxed">
                {activePlan?.nutritionPlan?.description ||
                  "Follow your personalized nutrition plan to achieve your fitness goals."}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Overall Progress
                  </span>
                  <span className="text-sm font-medium text-[#FF6B00]">
                    {Math.round(completionRate)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Day Indicator */}
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:calendar-today"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span className="text-zinc-300 text-sm">
                  Currently on Day {currentDay} of{" "}
                  {activePlan?.nutritionPlan?.days?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
