"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

export const Features = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleArrayChange = (name, index, value) => {
    if (!name || !(name in data)) return;
    const array = Array.isArray(data[name]) ? data[name] : [""];
    if (typeof index !== "number" || index < 0 || index >= array.length) return;
    const newArray = [...array];
    newArray[index] = value;
    onChange({ [name]: newArray });
  };

  const addArrayItem = (name) => {
    if (!name || !(name in data)) return;
    const array = Array.isArray(data[name]) ? data[name] : [""];
    onChange({ [name]: [...array, ""] });
  };

  const removeArrayItem = (name, index) => {
    if (!name || !(name in data)) return;
    const array = Array.isArray(data[name]) ? data[name] : [""];
    if (array.length === 1) return;
    if (typeof index !== "number" || index < 0 || index >= array.length) return;
    const newArray = array.filter((_, i) => i !== index);
    onChange({ [name]: newArray });
  };

  const handleTimelineChange = (index, field, value) => {
    const timeline = data.timeline || [
      { week: "", title: "", description: "" },
    ];
    const newTimeline = [...timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    onChange({ timeline: newTimeline });
  };

  const addTimelineItem = () => {
    const timeline = data.timeline || [
      { week: "", title: "", description: "" },
    ];
    onChange({
      timeline: [...timeline, { week: "", title: "", description: "" }],
    });
  };

  const removeTimelineItem = (index) => {
    const timeline = data.timeline || [
      { week: "", title: "", description: "" },
    ];
    if (timeline.length === 1) return;
    const newTimeline = timeline.filter((_, i) => i !== index);
    onChange({ timeline: newTimeline });
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Key Features */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-md">
                <Icon
                  icon="mdi:star"
                  className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                />
              </div>
              <span className="text-sm sm:text-base">Key Features</span>
            </h3>

            <div className="space-y-3">
              {(data.keyFeatures || [""]).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FormField
                    name={`keyFeature-${idx}`}
                    value={feature}
                    onChange={(e) =>
                      handleArrayChange("keyFeatures", idx, e.target.value)
                    }
                    placeholder={
                      [
                        "Personalized meal plans",
                        "Flexible food choices",
                        "Progress tracking",
                        "Educational resources",
                      ][idx] || `Feature #${idx + 1}`
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayItem("keyFeatures", idx)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                    disabled={(data.keyFeatures || [""]).length === 1}
                    title="Remove feature"
                    variant="ghost"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addArrayItem("keyFeatures")}
                className="w-full py-2 px-4 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] hover:bg-[#FF6B00]/20 transition-colors flex items-center justify-center gap-2"
                variant="orangeOutline"
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                Add Feature
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
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
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Timeline */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-md">
                <Icon
                  icon="mdi:timeline-clock"
                  className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                />
              </div>
              <span className="text-sm sm:text-base">Timeline Structure</span>
            </h3>

            <div className="space-y-4">
              {(
                data.timeline || [{ week: "", title: "", description: "" }]
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#242424] rounded-lg border border-[#444] p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <FormField
                      label="Week(s)"
                      name={`timeline-week-${idx}`}
                      value={item.week}
                      onChange={(e) =>
                        handleTimelineChange(idx, "week", e.target.value)
                      }
                      placeholder={
                        ["Week 1-2", "Week 3-4", "Week 5-8"][idx] || "Week(s)"
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => removeTimelineItem(idx)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
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
                  </div>

                  <FormField
                    label="Title"
                    name={`timeline-title-${idx}`}
                    value={item.title}
                    onChange={(e) =>
                      handleTimelineChange(idx, "title", e.target.value)
                    }
                    placeholder={
                      [
                        "Baseline establishment",
                        "Habit formation",
                        "Progressive implementation",
                      ][idx] || "Phase title"
                    }
                  />

                  <FormField
                    label="Description"
                    name={`timeline-description-${idx}`}
                    type="textarea"
                    value={item.description}
                    onChange={(e) =>
                      handleTimelineChange(idx, "description", e.target.value)
                    }
                    placeholder="Focus on building consistent eating patterns and introducing key nutritional concepts."
                    rows={2}
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={addTimelineItem}
                className="w-full py-2 px-4 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] hover:bg-[#FF6B00]/20 transition-colors flex items-center justify-center gap-2"
                variant="orangeOutline"
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                Add Timeline Block
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
