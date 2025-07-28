"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Accordion } from "@/components/common/Accordion";
import { Button } from "@/components/common/Button";
import { SESSION_FORMATS } from "src/enums/sessionFormats";

export const Preview = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  useEffect(() => {
    if (data.coverImage && typeof data.coverImage !== "string") {
      const url = URL.createObjectURL(data.coverImage);
      setCoverImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setCoverImageUrl(null);
    }
  }, [data.coverImage]);

  const getTotalExercises = () =>
    data.schedule?.reduce(
      (total, session) => total + session.exercises.length,
      0
    ) || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:information-outline" },
    { id: "schedule", label: "Schedule", icon: "mdi:calendar-outline" },
    { id: "features", label: "Features", icon: "mdi:star-outline" },
  ];

  return (
    <div className="flex flex-col -mx-4 sm:-mx-5">
      {/* Banner image with gradient overlay */}
      <div className="relative h-40 sm:h-56 w-full overflow-hidden rounded-xl mb-5">
        {(typeof data.coverImage === "string" && data.coverImage) ||
        (typeof data.coverImage !== "string" && coverImageUrl) ? (
          <Image
            src={
              typeof data.coverImage === "string"
                ? data.coverImage
                : coverImageUrl
            }
            alt={data.title || "Plan cover"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222] flex items-center justify-center">
            <Icon icon="mdi:image" className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.6)] to-[#111]" />

        {/* Plan type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 bg-blue-600/90 text-white shadow-lg">
            <Icon icon="heroicons:bolt-20-solid" className="w-3.5 h-3.5" />
            Training Plan
          </span>
        </div>

        {/* Price tag */}
        {data.price && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-[#FF6B00]/90 text-white shadow-lg">
              <Icon
                icon="heroicons:banknotes-20-solid"
                className="w-3.5 h-3.5 mr-1"
              />
              ${data.price}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {data.title || "Untitled Plan"}
          </h1>
          <p className="text-sm text-gray-300 line-clamp-2">
            {data.description}
          </p>
        </div>
      </div>

      {/* Content container */}
      <div className="px-4 sm:px-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
              <Icon
                icon="heroicons:calendar-20-solid"
                className="w-4 h-4 text-blue-500"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {data.duration} {data.durationType}
              </div>
              <div className="text-xs text-gray-400">Duration</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
              <Icon
                icon="heroicons:clock-20-solid"
                className="w-4 h-4 text-blue-500"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {data.sessionsPerWeek || 0}
              </div>
              <div className="text-xs text-gray-400">Sessions/Week</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
              <Icon icon="mdi:dumbbell" className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {data.schedule?.length || 0}
              </div>
              <div className="text-xs text-gray-400">Total Sessions</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
              <Icon icon="mdi:arm-flex" className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {getTotalExercises()}
              </div>
              <div className="text-xs text-gray-400">Total Exercises</div>
            </div>
          </div>
        </div>

        {/* Improved Tabs navigation */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-1 mb-5 flex overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 relative text-sm font-medium transition-colors whitespace-nowrap rounded-md flex items-center justify-center gap-2`}
              variant={activeTab === tab.id ? "primary" : "ghost"}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon icon="mdi:target" className="w-5 h-5 text-blue-500" />
                  Training Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Training Level
                    </div>
                    <div className="text-base text-white capitalize">
                      {data.difficultyLevel || "Not specified"}
                    </div>
                  </div>
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Sessions per Week
                    </div>
                    <div className="text-base text-white">
                      {data.sessionsPerWeek || 0} sessions
                    </div>
                  </div>
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Session Format
                    </div>
                    <div className="text-base text-white">
                      {data.sessionFormat
                        ? SESSION_FORMATS.find(
                            (f) => f.id === data.sessionFormat
                          )?.label || "Not specified"
                        : "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              {data.keyFeatures && data.keyFeatures.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon icon="mdi:star" className="w-5 h-5 text-blue-500" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.keyFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 bg-[#242424] p-2.5 rounded-lg"
                      >
                        <Icon
                          icon="heroicons:check-circle-20-solid"
                          className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {data.description && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon
                      icon="mdi:information"
                      className="w-5 h-5 text-blue-500"
                    />
                    Plan Description
                  </h3>
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <p className="text-sm text-white">{data.description}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Schedule tab */}
          {activeTab === "schedule" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {data.schedule && data.schedule.length > 0 ? (
                <div className="space-y-4">
                  {data.schedule.map((session, index) => (
                    <Accordion
                      key={session.id || index}
                      title={session.name || `Session ${index + 1}`}
                      icon="mdi:dumbbell"
                      iconColor="#3B82F6"
                      bgColor="#1a1a1a"
                      borderColor="#333"
                      defaultOpen={index === 0}
                      subtitle={`${session.exercises?.length || 0} exercises • ${session.duration || 0} min`}
                    >
                      {session.description && (
                        <div className="bg-[#242424] p-3 rounded-lg mb-3 text-sm text-gray-300">
                          {session.description}
                        </div>
                      )}

                      {session.exercises && session.exercises.length > 0 ? (
                        <div className="space-y-2 pt-2">
                          {session.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exercise.id || exerciseIndex}
                              className="bg-[#242424] rounded-lg p-3"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-xs text-white">
                                    {exerciseIndex + 1}
                                  </div>
                                  <span className="text-sm font-medium text-white">
                                    {exercise.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-[#333] px-2 py-0.5 rounded-full text-gray-300">
                                    {typeof exercise.sets === "number"
                                      ? exercise.sets
                                      : Array.isArray(exercise.sets)
                                        ? exercise.sets.length
                                        : 0}{" "}
                                    × {exercise.reps}
                                  </span>
                                  <span className="text-xs bg-[#333] px-2 py-0.5 rounded-full text-gray-300">
                                    {exercise.rest} rest
                                  </span>
                                </div>
                              </div>

                              {exercise.notes && (
                                <div className="mt-2 text-xs text-gray-400 bg-[#2a2a2a] p-2 rounded-md">
                                  <span className="text-gray-300 font-medium">
                                    Notes:{" "}
                                  </span>
                                  {exercise.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-3 text-center">
                          <p className="text-sm text-gray-400">
                            No exercises added to this session yet.
                          </p>
                        </div>
                      )}
                    </Accordion>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <Icon
                    icon="mdi:dumbbell"
                    className="w-10 h-10 text-gray-600 mx-auto mb-3"
                  />
                  <p className="text-gray-400">No sessions scheduled yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Go back to the Schedule step to add training sessions.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Features & Timeline tab */}
          {activeTab === "features" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Timeline */}
              {data.timeline && data.timeline.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:timeline-clock"
                      className="w-5 h-5 text-blue-500"
                    />
                    Program Timeline
                  </h3>

                  <div className="space-y-3">
                    {data.timeline.map((block, index) => (
                      <div
                        key={index}
                        className="bg-[#242424] rounded-lg p-3 border border-[#333] hover:border-blue-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                            {index + 1}
                          </div>
                          <h4 className="text-sm font-medium text-white">
                            {block.week}
                          </h4>
                        </div>
                        <div className="ml-8">
                          <p className="text-sm text-blue-400 font-medium mb-1">
                            {block.title}
                          </p>
                          <p className="text-xs text-gray-300">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {data.features && Object.keys(data.features).length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon
                      icon="mdi:package-variant"
                      className="w-5 h-5 text-blue-500"
                    />
                    Included Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(data.features).map(([key, enabled]) => {
                      if (!enabled) return null;

                      // Convert camelCase to readable text
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 bg-[#242424] p-2.5 rounded-lg"
                        >
                          <Icon
                            icon="heroicons:check-circle-20-solid"
                            className="w-5 h-5 text-green-500 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
