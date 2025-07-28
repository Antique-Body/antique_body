"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

// Nutrition feature options similar to training features
const NUTRITION_FEATURE_OPTIONS = [
  {
    key: "mealPreparationGuides",
    label: "Meal Preparation Guides",
    icon: "mdi:food-outline",
    description: "Step-by-step meal prep instructions for clients",
  },
  {
    key: "groceryLists",
    label: "Grocery Lists",
    icon: "mdi:cart-outline",
    description: "Weekly shopping lists tailored to the meal plan",
  },
  {
    key: "nutritionalEducation",
    label: "Nutritional Education",
    icon: "mdi:book-open-variant",
    description: "Educational materials about nutrition fundamentals",
  },
  {
    key: "recipeCollection",
    label: "Recipe Collection",
    icon: "mdi:chef-hat",
    description: "Curated recipes that align with the nutrition goals",
  },
  {
    key: "supplementGuide",
    label: "Supplement Guide",
    icon: "mdi:pill",
    description: "Optional supplement recommendations and timing",
  },
  {
    key: "foodSubstitutions",
    label: "Food Substitutions",
    icon: "mdi:food-variant",
    description: "Alternative options for dietary restrictions",
  },
];

export const Features = ({ data, onChange }) => {
  const handleFeatureToggle = (key) => {
    onChange({
      features: {
        ...data.features,
        [key]: !data.features?.[key],
      },
    });
  };

  const handleAddKeyFeature = () => {
    onChange({
      keyFeatures: [...(data.keyFeatures || []), ""],
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
      timeline: [
        ...(data.timeline || []),
        { week: "", title: "", description: "" },
      ],
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="text-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-2"
        >
          Plan Features
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-400"
        >
          Define what makes your nutrition plan special
        </motion.p>
      </div>

      {/* IMPROVED TOP SECTION - Single card with tabs */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333] overflow-hidden shadow-lg">
        {/* Tabs */}
        <div className="flex border-b border-[#333]">
          <div className="px-5 py-3 border-b-2 border-[#FF6B00] text-white font-medium flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
              <Icon icon="mdi:star" className="text-[#FF6B00] w-3 h-3" />
            </div>
            <span>Key Benefits</span>
          </div>
          <div className="px-5 py-3 text-gray-400 font-medium flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#333]/50 flex items-center justify-center">
              <Icon icon="mdi:food-apple" className="text-gray-400 w-3 h-3" />
            </div>
            <span>Additional Services</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5">
          {/* Key Benefits Section */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-300">
                Define key benefits of your plan
              </h3>
              <span className="text-xs text-gray-500">
                {data.keyFeatures?.length || 0}/5
              </span>
            </div>

            {(data.keyFeatures || []).map((feature, index) => (
              <div key={index} className="flex gap-2 items-center group">
                <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:check" className="w-3 h-3 text-[#FF6B00]" />
                </div>
                <FormField
                  value={feature}
                  onChange={(e) =>
                    handleKeyFeatureChange(index, e.target.value)
                  }
                  placeholder="e.g., Personalized meal plan"
                  className="flex-1 h-full !mb-0"
                  backgroundStyle="darker"
                  size="small"
                />
                {(data.keyFeatures || []).length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveKeyFeature(index)}
                    className="flex items-center justify-center self-center p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-colors rounded-full"
                    variant="ghost"
                    aria-label="Remove benefit"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {(data.keyFeatures || []).length < 5 && (
              <Button
                type="button"
                onClick={handleAddKeyFeature}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF6B00] transition-colors p-2 rounded-lg hover:bg-[#FF6B00]/10 w-full justify-center mt-2 border border-dashed border-[#444]"
                variant="ghost"
              >
                <Icon icon="mdi:plus" className="w-3 h-3" />
                Add benefit
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#333] to-transparent my-6"></div>

          {/* Additional Services Section - Redesigned with bigger buttons */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-300">
                Select additional services
              </h3>
              {data.features && Object.values(data.features).some(Boolean) && (
                <Button
                  type="button"
                  onClick={() =>
                    onChange({
                      features: Object.keys(data.features || {}).reduce(
                        (acc, key) => {
                          acc[key] = false;
                          return acc;
                        },
                        {}
                      ),
                    })
                  }
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors p-1"
                  variant="ghost"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NUTRITION_FEATURE_OPTIONS.map((feature) => {
                const checked = data.features?.[feature.key];
                return (
                  <button
                    key={feature.key}
                    type="button"
                    onClick={() => handleFeatureToggle(feature.key)}
                    className={`group relative p-4 rounded-lg transition-all duration-200 flex items-center gap-3 h-full ${
                      checked
                        ? "bg-gradient-to-br from-[#FF6B00]/20 to-[#FF6B00]/10 border border-[#FF6B00]/50 text-white"
                        : "bg-[#2A2A2A] border border-[#444] text-gray-300 hover:bg-[#333] hover:text-white"
                    }`}
                    aria-pressed={checked}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        checked ? "bg-[#FF6B00]/30" : "bg-[#333]"
                      }`}
                    >
                      <Icon
                        icon={feature.icon}
                        className={`w-4 h-4 ${checked ? "text-[#FF6B00]" : "text-gray-400 group-hover:text-[#FF6B00]"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm block">
                        {feature.label}
                      </span>
                      <span className="text-xs text-gray-500 block mt-1 line-clamp-2">
                        {feature.description}
                      </span>
                    </div>
                    {checked && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full bg-[#FF6B00] flex items-center justify-center">
                          <Icon
                            icon="mdi:check"
                            className="w-2 h-2 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Phases - Full width below with improved design */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333] overflow-hidden shadow-lg">
        <div className="border-b border-[#333] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
              <Icon
                icon="mdi:timeline-clock"
                className="text-[#FF6B00] w-5 h-5"
              />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Nutrition Phases
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            {data.timeline?.length || 0}/4 phases
          </div>
        </div>

        <div className="p-6 space-y-6">
          {(data.timeline || []).map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#FF6B00]/20 mr-3">
                  {index + 1}
                </div>
                <div className="h-px flex-grow bg-gradient-to-r from-[#FF6B00]/50 to-transparent"></div>
              </div>

              {/* Phase card - improved design */}
              <div className="bg-[#222] border border-[#444] rounded-lg p-4 hover:border-[#FF6B00]/30 transition-all duration-200">
                {/* Remove button */}
                {(data.timeline || []).length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveTimelineBlock(index)}
                    className="absolute top-2 right-2 z-20 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    variant="ghost"
                    aria-label="Remove phase"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                  </Button>
                )}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      label="Duration"
                      placeholder="Week 1-4"
                      value={block.week}
                      onChange={(e) =>
                        handleTimelineChange(index, "week", e.target.value)
                      }
                      backgroundStyle="darker"
                      size="small"
                    />
                    <FormField
                      label="Phase Name"
                      placeholder="Foundation Phase"
                      value={block.title}
                      onChange={(e) =>
                        handleTimelineChange(index, "title", e.target.value)
                      }
                      backgroundStyle="darker"
                      size="small"
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
                    backgroundStyle="darker"
                    size="small"
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {(data.timeline || []).length < 4 && (
            <Button
              type="button"
              onClick={handleAddTimelineBlock}
              className="w-full py-3 border border-dashed border-[#444] rounded-lg text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/5 transition-all flex items-center justify-center gap-2"
              variant="ghost"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Add phase
            </Button>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333] overflow-hidden shadow-lg">
        <div className="border-b border-[#333] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
              <Icon icon="mdi:information" className="text-[#FF6B00] w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Additional Information
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <FormField
            label="Recommended Frequency"
            name="recommendedFrequency"
            value={data.recommendedFrequency || ""}
            onChange={handleChange}
            placeholder="Daily meal plans"
            backgroundStyle="darker"
          />

          <FormField
            label="Adaptability"
            name="adaptability"
            type="textarea"
            value={data.adaptability || ""}
            onChange={handleChange}
            placeholder="Highly customizable based on client progress and feedback"
            rows={2}
            backgroundStyle="darker"
          />

          <FormField
            label="Cooking Time"
            name="cookingTime"
            value={data.cookingTime || ""}
            onChange={handleChange}
            placeholder="e.g., 15-30 minutes per meal"
            backgroundStyle="darker"
          />

          <FormField
            label="Supplement Recommendations"
            name="supplementRecommendations"
            type="textarea"
            value={data.supplementRecommendations || ""}
            onChange={handleChange}
            placeholder="Optional supplements that complement this nutrition plan..."
            rows={2}
            backgroundStyle="darker"
          />
        </div>
      </div>
    </motion.div>
  );
};
