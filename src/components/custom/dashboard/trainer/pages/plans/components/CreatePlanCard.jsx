"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";

export const CreatePlanCard = ({ type }) => {
  const isNutrition = type === "nutrition";
  const url = isNutrition
    ? "/trainer/dashboard/plans/nutrition/create"
    : "/trainer/dashboard/plans/training/create";

  const config = {
    nutrition: {
      title: "Create Nutrition Plan",
      description: "Design personalized meal plans and dietary guidance",
      icon: "mdi:food-apple",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      features: ["Meal Planning", "Macro Tracking", "Recipe Library"],
    },
    training: {
      title: "Create Training Plan",
      description: "Build comprehensive workout routines and programs",
      icon: "mdi:dumbbell",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      features: ["Exercise Library", "Progress Tracking", "Custom Schedules"],
    },
  };

  const planConfig = config[type];

  return (
    <Link href={url}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <div
          className={`relative overflow-hidden rounded-2xl border border-[#333] ${planConfig.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:border-[#444] group-hover:shadow-xl`}
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${planConfig.color} opacity-5 group-hover:opacity-10 transition-opacity`}
          ></div>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${planConfig.color} shadow-lg`}
              >
                <Icon icon={planConfig.icon} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {planConfig.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {planConfig.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {planConfig.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${planConfig.color}`}
                  ></div>
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div
              className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${planConfig.color} text-white font-medium text-center shadow-lg group-hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon icon="mdi:plus" className="w-5 h-5" />
                Start Creating
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
