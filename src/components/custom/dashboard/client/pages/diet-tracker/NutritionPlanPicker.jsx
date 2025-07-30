"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

import { InfoBanner } from "@/components/common/InfoBanner";

import { mockNutritionPlans } from "./mockNutritionPlan";
import { NutritionPlanCard } from "./NutritionPlanCard";
import { PlanDetailsModal } from "./PlanDetailsModal";

export const NutritionPlanPicker = ({ onStartPlan, loading }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleStartPlan = async (plan) => {
    setIsStarting(true);
    try {
      await onStartPlan(true, null, null, plan);
    } catch (error) {
      console.error("Error starting plan:", error);
    } finally {
      setIsStarting(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <div className="px-4 py-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 relative pb-2">
          <h1 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon
              icon="mdi:nutrition"
              className="text-[#FF9A00]"
              width={24}
              height={24}
            />
            Choose a Temporary Nutrition Plan
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm">
            Select from our recommended nutrition plans to start tracking your progress
            until your trainer assigns you a personalized plan.
          </p>
        </div>

        {/* Status Banner */}
        <div className="mb-6">
          <InfoBanner
            icon="mdi:account-supervisor-circle"
            title="No Nutrition Plan Assigned Yet"
            subtitle="Your trainer hasn't assigned you a specific nutrition plan yet. You can use one of our recommended temporary plans below to get started with tracking your meals and progress."
            variant="primary"
            buttonText="Contact Your Trainer"
            onButtonClick={() => {
              // TODO: Add contact trainer functionality
            }}
          />
        </div>

        {/* Nutrition Plans */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 h-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {mockNutritionPlans.map((plan, index) => (
              <NutritionPlanCard
                key={plan.id}
                plan={plan}
                index={index}
                onViewPlan={handleViewPlan}
              />
            ))}
          </div>
        )}

        {/* Helpful tips section */}
        <div className="mt-8 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:lightbulb-on"
              className="text-[#FF9A00]"
              width={20}
              height={20}
            />
            What You Get With Any Plan
          </h3>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Carefully curated meals that align with your selected plan's
                goals and macronutrient targets
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Ability to log custom meals and snacks to track exactly what
                you're eating
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Detailed progress tracking with real-time analytics and
                completion rates
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Daily nutrition targets and guidance to help you stay on track
                with your goals
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={closeModal}
        onStartPlan={handleStartPlan}
        isStarting={isStarting}
      />
    </>
  );
};
