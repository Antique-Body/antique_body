"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { FormField } from "@/components/common/FormField";

const FEATURE_OPTIONS = [
  {
    key: "support24_7",
    label: "24/7 Support & Consultation",
    icon: "mdi:clock-time-four-outline",
    description: "Round-the-clock support for your clients",
    color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/30",
    iconColor: "text-indigo-400",
  },
  {
    key: "liveTraining",
    label: "Live Training Sessions",
    icon: "mdi:dumbbell",
    description: "Real-time workout sessions with clients",
    color: "from-orange-500/20 to-red-500/20 border-red-500/30",
    iconColor: "text-red-400",
  },
  {
    key: "onlineCalls",
    label: "Online Video Calls",
    icon: "mdi:video-outline",
    description: "Virtual consultations and check-ins",
    color: "from-green-500/20 to-emerald-500/20 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    key: "personalizedNutrition",
    label: "Personalized Nutrition Plan",
    icon: "mdi:nutrition",
    description: "Custom diet plans for each client",
    color: "from-purple-500/20 to-violet-500/20 border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    key: "progressTracking",
    label: "Progress Tracking",
    icon: "mdi:chart-line",
    description: "Detailed progress monitoring and analytics",
    color: "from-cyan-500/20 to-blue-500/20 border-blue-500/30",
    iconColor: "text-cyan-400",
  },
  {
    key: "mealPlanning",
    label: "Weekly Meal Planning",
    icon: "mdi:food-apple-outline",
    description: "Structured meal plans and recipes",
    color: "from-green-500/20 to-lime-500/20 border-lime-500/30",
    iconColor: "text-lime-400",
  },
  {
    key: "flexibleScheduling",
    label: "Flexible Scheduling",
    icon: "mdi:calendar-clock",
    description: "Adaptable training schedule",
    color: "from-yellow-500/20 to-amber-500/20 border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    key: "recoveryPlans",
    label: "Recovery Plans",
    icon: "mdi:meditation",
    description: "Rest and recovery guidance",
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    iconColor: "text-teal-400",
  },
];

export const Features = ({ data, onChange }) => {
  const handleFeatureToggle = (key) => {
    onChange({
      features: {
        ...data.features,
        [key]: !data.features[key],
      },
    });
  };

  const handleAddKeyFeature = () => {
    onChange({
      keyFeatures: [...data.keyFeatures, ""],
    });
  };

  const handleRemoveKeyFeature = (index) => {
    const newFeatures = data.keyFeatures.filter((_, i) => i !== index);
    onChange({
      keyFeatures: newFeatures,
    });
  };

  const handleKeyFeatureChange = (index, value) => {
    const newFeatures = [...data.keyFeatures];
    newFeatures[index] = value;
    onChange({
      keyFeatures: newFeatures,
    });
  };

  const handleAddTimelineBlock = () => {
    onChange({
      timeline: [...data.timeline, { week: "", title: "", description: "" }],
    });
  };

  const handleRemoveTimelineBlock = (index) => {
    const newTimeline = data.timeline.filter((_, i) => i !== index);
    onChange({
      timeline: newTimeline,
    });
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...data.timeline];
    newTimeline[index] = {
      ...newTimeline[index],
      [field]: value,
    };
    onChange({
      timeline: newTimeline,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold text-white mb-2">Plan Features</h2>
        <p className="text-gray-400">
          Define what makes your training plan special
        </p>
      </motion.div>

      {/* Simple Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon icon="mdi:star" className="w-5 h-5 text-[#FF6B00]" />
          Key Benefits
        </h3>

        <div className="space-y-3">
          {data.keyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 items-center"
            >
              <div className="w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:check" className="w-3 h-3 text-[#FF6B00]" />
              </div>
              <FormField
                value={feature}
                onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
                placeholder="e.g., Personalized workout plan"
                className="flex-1"
              />
              {data.keyFeatures.length > 1 && (
                <button
                  onClick={() => handleRemoveKeyFeature(index)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors rounded"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}

          {data.keyFeatures.length < 5 && (
            <button
              onClick={handleAddKeyFeature}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6B00] transition-colors p-2 rounded-lg hover:bg-[#FF6B00]/10"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Add benefit
            </button>
          )}
        </div>
      </motion.div>

      {/* Simple Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon icon="mdi:timeline-clock" className="w-5 h-5 text-purple-400" />
          Training Phases
        </h3>

        <div className="space-y-4">
          {data.timeline.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-[#222] rounded-lg border border-[#333] p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B00] to-purple-500 flex items-center justify-center font-semibold text-white text-sm flex-shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Duration"
                      placeholder="Week 1-4"
                      value={block.week}
                      onChange={(e) =>
                        handleTimelineChange(index, "week", e.target.value)
                      }
                    />
                    <FormField
                      label="Phase Name"
                      placeholder="Foundation Phase"
                      value={block.title}
                      onChange={(e) =>
                        handleTimelineChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <FormField
                    label="Description"
                    type="textarea"
                    placeholder="What happens in this phase..."
                    value={block.description}
                    onChange={(e) =>
                      handleTimelineChange(index, "description", e.target.value)
                    }
                    rows={2}
                  />
                </div>

                {data.timeline.length > 1 && (
                  <button
                    onClick={() => handleRemoveTimelineBlock(index)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors rounded"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {data.timeline.length < 4 && (
            <button
              onClick={handleAddTimelineBlock}
              className="w-full py-3 border border-dashed border-[#333] rounded-lg text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Add phase
            </button>
          )}
        </div>
      </motion.div>

      {/* Simplified Additional Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon icon="mdi:gift" className="w-5 h-5 text-green-400" />
          Additional Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURE_OPTIONS.map((feature) => {
            const checked = data.features[feature.key];
            return (
              <motion.button
                key={feature.key}
                type="button"
                onClick={() => handleFeatureToggle(feature.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={
                  `relative p-4 rounded-lg border w-full text-left transition-all duration-200 flex items-center gap-4 ` +
                  (checked
                    ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/60 shadow-lg"
                    : "bg-[#222] border-[#333] hover:border-[#444]") +
                  " focus:outline-none"
                }
                style={{ minHeight: 80 }}
              >
                <div
                  className={
                    `w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ` +
                    (checked
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[#333] text-gray-400")
                  }
                >
                  <Icon icon={feature.icon} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-medium text-base ${
                        checked ? "text-green-300" : "text-white"
                      }`}
                    >
                      {feature.label}
                    </h4>
                    {checked && (
                      <span className="ml-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/80">
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
                {/* Hidden checkbox for accessibility */}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleFeatureToggle(feature.key)}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </motion.button>
            );
          })}
        </div>

        {Object.values(data.features).some(Boolean) && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-sm text-green-400">
              <Icon icon="mdi:check" className="w-4 h-4 inline mr-1" />
              {Object.values(data.features).filter(Boolean).length} additional
              services selected
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
