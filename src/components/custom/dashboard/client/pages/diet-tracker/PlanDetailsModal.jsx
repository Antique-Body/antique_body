"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";

export const PlanDetailsModal = ({
  plan,
  isOpen,
  onClose,
  onStartPlan,
  isStarting,
}) => {
  if (!isOpen || !plan) return null;

  const handleStartPlan = () => {
    onStartPlan(plan);
  };

  // Get today's date for display
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: plan.color + "20" }}
          >
            <Icon
              icon={plan.icon}
              className="w-5 h-5"
              style={{ color: plan.color }}
            />
          </div>
          <span>{plan.title}</span>
        </div>
      }
      subtitle={plan.subtitle}
      footerButtons={true}
      primaryButtonText={
        isStarting ? "Starting Plan..." : `Start Today - ${today}`
      }
      primaryButtonAction={handleStartPlan}
      primaryButtonDisabled={isStarting}
      primaryButtonIcon={isStarting ? null : "mdi:rocket-launch"}
      isLoading={isStarting}
      secondaryButtonText="Cancel"
      secondaryButtonAction={onClose}
    >
      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Plan Visual */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-lg ring-2 ring-zinc-600/30 shadow-lg">
                {plan.coverImage ? (
                  <Image
                    src={plan.coverImage}
                    alt={plan.title}
                    className="object-cover w-full h-full"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundColor: plan.color + "20" }}
                  >
                    <Icon
                      icon={plan.icon}
                      width={32}
                      height={32}
                      style={{ color: plan.color }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Plan Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {plan.title}
                </h3>

                {/* Duration Badge */}
                <div className="flex items-center gap-1 bg-zinc-800/60 px-2 py-1 rounded-md border border-zinc-700/50">
                  <Icon
                    icon="mdi:calendar-clock"
                    width={14}
                    height={14}
                    className="text-[#FF9A00]"
                  />
                  <span className="text-xs text-zinc-300 whitespace-nowrap">
                    {plan.duration} {plan.durationType}
                  </span>
                </div>
              </div>

              {/* Info Pills - Compact */}
              <div className="flex flex-wrap gap-2">
                {/* Calories */}
                <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="mdi:fire"
                      width={14}
                      height={14}
                      className="text-[#FF7800]"
                    />
                    <span className="text-zinc-300 text-xs font-medium">
                      {plan.nutritionInfo.calories} cal
                    </span>
                  </div>
                </div>

                {/* Protein */}
                <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="mdi:food-steak"
                      width={14}
                      height={14}
                      className="text-green-400"
                    />
                    <span className="text-zinc-300 text-xs font-medium">
                      {plan.nutritionInfo.protein}g protein
                    </span>
                  </div>
                </div>

                {/* Primary Goal */}
                {plan.tags[0] && (
                  <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="mdi:target"
                        width={14}
                        height={14}
                        className="text-[#FF9A00]"
                      />
                      <span className="text-zinc-300 text-xs font-medium">
                        {plan.tags[0]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Primary Goal */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:target"
                className="text-[#FF7800]"
                width={20}
                height={20}
              />
              <span className="text-zinc-400 text-sm">Primary Goal</span>
            </div>
            <p className="text-white font-medium">{plan.goal}</p>
          </div>

          {/* Nutrition Stats */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:nutrition"
                className="text-[#FF9A00]"
                width={20}
                height={20}
              />
              <span className="text-zinc-400 text-sm">Nutrition Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-zinc-400 text-xs mb-1">Calories</p>
                <p className="text-[#FF7800] font-medium">
                  {plan.nutritionInfo.calories}
                </p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-xs mb-1">Protein</p>
                <p className="text-green-400 font-medium">
                  {plan.nutritionInfo.protein}g
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Description */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon
              icon="mdi:information"
              className="text-[#FF9A00]"
              width={20}
              height={20}
            />
            <h4 className="text-white font-medium">Plan Description</h4>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
            <p className="text-zinc-300 text-sm">{plan.description}</p>
          </div>
        </div>

        {/* Plan Features */}
        {plan.tags?.length > 0 && (
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:tag"
                className="text-[#FF9A00]"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Plan Features</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#FF7800]/10 text-[#FF9A00] text-sm rounded-full border border-[#FF7800]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Meal */}
        {plan.days?.[0]?.meals?.[0] && (
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:food"
                className="text-[#FF7800]"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Sample Meal</h4>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                <span className="text-white font-medium">
                  {plan.days[0].meals[0].name} - {plan.days[0].meals[0].time}
                </span>
              </div>
              <h4 className="text-zinc-300 font-medium mb-2">
                {plan.days[0].meals[0].options[0].name}
              </h4>
              <p className="text-zinc-400 text-sm mb-3">
                {plan.days[0].meals[0].options[0].description}
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-[#FF6B00]">
                  {plan.days[0].meals[0].options[0].calories} cal
                </span>
                <span className="text-green-400">
                  {plan.days[0].meals[0].options[0].protein}g protein
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning Notice */}
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/10 rounded-xl p-4 border border-amber-700/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Icon
              icon="mdi:alert"
              className="text-amber-400 mt-0.5"
              width={20}
              height={20}
            />
            <div>
              <p className="text-amber-400 font-medium mb-1">
                Important Notice
              </p>
              <p className="text-sm text-amber-300/80">
                Once you start this nutrition plan, you won't be able to switch
                to another plan. Make sure this aligns with your goals before
                proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
