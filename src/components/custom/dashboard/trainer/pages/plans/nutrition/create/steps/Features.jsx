"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCallback } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

export const Features = ({ data, onChange }) => {
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onChange({ [name]: value });
    },
    [onChange]
  );

  const handleArrayChange = useCallback(
    (name, index, value) => {
      if (!name || !(name in data)) return;
      const array = Array.isArray(data[name]) ? data[name] : [""];
      if (typeof index !== "number" || index < 0 || index >= array.length)
        return;
      const newArray = [...array];
      newArray[index] = value;
      onChange({ [name]: newArray });
    },
    [data, onChange]
  );

  const addArrayItem = useCallback(
    (name) => {
      if (!name || !(name in data)) return;
      const array = Array.isArray(data[name]) ? data[name] : [""];
      onChange({ [name]: [...array, ""] });
    },
    [data, onChange]
  );

  const removeArrayItem = useCallback(
    (name, index) => {
      if (!name || !(name in data)) return;
      const array = Array.isArray(data[name]) ? data[name] : [""];
      if (array.length === 1) return;
      if (typeof index !== "number" || index < 0 || index >= array.length)
        return;
      const newArray = array.filter((_, i) => i !== index);
      onChange({ [name]: newArray });
    },
    [data, onChange]
  );

  const handleTimelineChange = useCallback(
    (index, field, value) => {
      const timeline = data.timeline || [
        { week: "", title: "", description: "" },
      ];
      if (typeof index !== "number" || index < 0 || index >= timeline.length) {
        return;
      }
      const newTimeline = [...timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      onChange({ timeline: newTimeline });
    },
    [data, onChange]
  );

  const addTimelineItem = useCallback(() => {
    const timeline = data.timeline || [
      { week: "", title: "", description: "" },
    ];
    onChange({
      timeline: [...timeline, { week: "", title: "", description: "" }],
    });
  }, [data, onChange]);

  const removeTimelineItem = useCallback(
    (index) => {
      const timeline = data.timeline || [
        { week: "", title: "", description: "" },
      ];
      if (timeline.length === 1) return;
      const newTimeline = timeline.filter((_, i) => i !== index);
      onChange({ timeline: newTimeline });
    },
    [data, onChange]
  );

  const handleRemoveKeyFeature = useCallback(
    (index) => {
      removeArrayItem("keyFeatures", index);
    },
    [removeArrayItem]
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Plan Features
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Define the key features and structure of your nutrition plan
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 h-full"
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
                    name={`keyFeature-${index}`}
                    value={feature}
                    onChange={(e) =>
                      handleArrayChange("keyFeatures", index, e.target.value)
                    }
                    placeholder={
                      [
                        "Personalized meal plans",
                        "Flexible food choices",
                        "Progress tracking",
                        "Educational resources",
                      ][index] || `Feature #${index + 1}`
                    }
                    className="flex-1 h-full !mb-0"
                  />
                  {data.keyFeatures.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveKeyFeature(index)}
                      className="flex items-center justify-center self-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      variant="ghost"
                      aria-label="Remove benefit"
                    >
                      <Icon icon="mdi:close" className="w-5 h-5" />
                    </Button>
                  )}
                </motion.div>
              ))}
              {data.keyFeatures.length < 5 && (
                <Button
                  type="button"
                  onClick={() => addArrayItem("keyFeatures")}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF6B00] transition-colors p-2 rounded-lg hover:bg-[#FF6B00]/10"
                  variant="ghost"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4" />
                  Add benefit
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 h-full"
          >
            {/* Timeline */}
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon
                icon="mdi:timeline-clock"
                className="w-5 h-5 text-purple-400"
              />
              Nutrition Phases
            </h3>

            <div className="space-y-6">
              {data.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center w-full"
                >
                  {/* Broj faze iznad kartice */}
                  <div className="-mb-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg border-4 border-[#1a1a1a]">
                      {index + 1}
                    </div>
                  </div>
                  {/* Kartica faze */}
                  <div className="bg-[#222] rounded-lg border border-[#333] p-4 mt-0 w-full max-w-full sm:max-w-2xl relative">
                    {data.timeline.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTimelineItem(index)}
                        className="absolute top-3 right-3 z-20 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={
                          (
                            data.timeline || [
                              { week: "", title: "", description: "" },
                            ]
                          ).length === 1
                        }
                        title="Remove timeline block"
                        variant="ghost"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          label="Week(s)"
                          name={`timeline-week-${index}`}
                          value={item.week}
                          onChange={(e) =>
                            handleTimelineChange(index, "week", e.target.value)
                          }
                          placeholder={
                            ["Week 1-2", "Week 3-4", "Week 5-8"][index] ||
                            "Week(s)"
                          }
                          className="flex-1"
                        />

                        <FormField
                          label="Title"
                          name={`timeline-title-${index}`}
                          value={item.title}
                          onChange={(e) =>
                            handleTimelineChange(index, "title", e.target.value)
                          }
                          placeholder={
                            [
                              "Baseline establishment",
                              "Habit formation",
                              "Progressive implementation",
                            ][index] || "Phase title"
                          }
                        />
                      </div>
                      <FormField
                        label="Description"
                        name={`timeline-description-${index}`}
                        type="textarea"
                        value={item.description}
                        onChange={(e) =>
                          handleTimelineChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Focus on building consistent eating patterns and introducing key nutritional concepts."
                        rows={2}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              {data.timeline.length < 4 && (
                <Button
                  type="button"
                  onClick={addTimelineItem}
                  className="w-full py-3 border border-dashed border-[#333] rounded-lg text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
                  variant="ghost"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4" />
                  Add Timeline Block
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5"
      >
        <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="mdi:information" className="w-4 h-4 text-[#FF6B00]" />
          Additional Information
        </h3>

        <div className="space-y-3 sm:space-y-4">
          <FormField
            label="Recommended Frequency"
            name="recommendedFrequency"
            value={data.recommendedFrequency || ""}
            onChange={handleChange}
            placeholder="Daily meal plans"
          />

          <FormField
            label="Adaptability"
            name="adaptability"
            type="textarea"
            value={data.adaptability || ""}
            onChange={handleChange}
            placeholder="Highly customizable based on client progress and feedback"
            rows={2}
          />

          <FormField
            label="Cooking Time"
            name="cookingTime"
            value={data.cookingTime || ""}
            onChange={handleChange}
            placeholder="e.g., 15-30 minutes per meal"
          />

          <FormField
            label="Supplement Recommendations"
            name="supplementRecommendations"
            type="textarea"
            value={data.supplementRecommendations || ""}
            onChange={handleChange}
            placeholder="Optional supplements that complement this nutrition plan..."
            rows={2}
          />
        </div>
      </motion.div>
    </div>
  );
};

Features.propTypes = {
  data: PropTypes.shape({
    keyFeatures: PropTypes.arrayOf(PropTypes.string),
    recommendedFrequency: PropTypes.string,
    adaptability: PropTypes.string,
    cookingTime: PropTypes.string,
    supplementRecommendations: PropTypes.string,
    timeline: PropTypes.arrayOf(
      PropTypes.shape({
        week: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
