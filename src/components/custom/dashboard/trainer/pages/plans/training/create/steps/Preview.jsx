"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const Preview = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getTotalExercises = () =>
    data.schedule?.reduce(
      (total, session) => total + session.exercises.length,
      0
    ) || 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule & Timeline" },
    { id: "weekly", label: "Weekly Schedule" },
  ];

  return (
    <div className="flex flex-col -mx-4 sm:-mx-5">
      {/* Banner image with gradient overlay */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl mb-6">
        {data.coverImage ? (
          <Image
            src={
              typeof data.coverImage === "string"
                ? data.coverImage
                : URL.createObjectURL(data.coverImage)
            }
            alt={data.title || "Plan cover"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222] flex items-center justify-center">
            <Icon icon="mdi:image" className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]"></div>

        {/* Plan type badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 bg-blue-900/80 text-blue-100">
            <Icon icon="heroicons:bolt-20-solid" className="w-4 h-4" />
            Training Plan
          </span>
        </div>

        {/* Price tag */}
        {data.price && (
          <div className="absolute top-4 right-4 z-10">
            <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-[#FF6B00] text-white">
              <Icon
                icon="heroicons:banknotes-20-solid"
                className="w-4 h-4 mr-1"
              />
              ${data.price}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {data.title || "Untitled Plan"}
          </h1>
          <p className="text-gray-300 line-clamp-2">{data.description}</p>
        </div>
      </div>

      {/* Content container */}
      <div className="px-4 sm:px-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="heroicons:calendar-20-solid"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {data.duration} {data.durationType}
            </div>
            <div className="text-sm text-gray-400">Duration</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="heroicons:clock-20-solid"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {data.sessionsPerWeek}
            </div>
            <div className="text-sm text-gray-400">Sessions/Week</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="mdi:dumbbell"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {data.schedule?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="mdi:arm-flex"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {getTotalExercises()}
            </div>
            <div className="text-sm text-gray-400">Total Exercises</div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-[#333] mb-6">
          <div className="flex space-x-6 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#FF6B00]"
                    : "text-gray-400 hover:text-white"
                }`}
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
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Training Details */}
                  <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Training Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:target"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        <div>
                          <div className="text-white font-medium">
                            Training Level
                          </div>
                          <div className="text-gray-400 capitalize">
                            {data.difficultyLevel || "Not specified"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:calendar"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        <div>
                          <div className="text-white font-medium">
                            Sessions per Week
                          </div>
                          <div className="text-gray-400">
                            {data.sessionsPerWeek} sessions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:format-list-bulleted"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        <div>
                          <div className="text-white font-medium">
                            Session Formats
                          </div>
                          <div className="text-gray-400">
                            {data.sessionFormats?.length > 0
                              ? data.sessionFormats.join(", ")
                              : "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Key Features */}
                  {data.keyFeatures && data.keyFeatures.length > 0 && (
                    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Key Features
                      </h3>
                      <div className="space-y-2">
                        {data.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Icon
                              icon="heroicons:check-circle-20-solid"
                              className="w-5 h-5 text-[#FF6B00] mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Schedule tab */}
          {activeTab === "schedule" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {data.timeline && data.timeline.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Timeline Structure
                  </h3>
                  <div className="space-y-4">
                    {data.timeline.map((block, index) => (
                      <div key={index} className="relative pl-8">
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-[#FF6B00]">
                            {index + 1}
                          </span>
                        </div>
                        {index !== data.timeline.length - 1 && (
                          <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]"></div>
                        )}
                        <div>
                          <h4 className="text-white font-medium">
                            {block.week}
                          </h4>
                          <p className="text-[#FF6B00]">{block.title}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon
                    icon="mdi:calendar-outline"
                    className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  />
                  <p className="text-gray-400">
                    No timeline structure defined yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Weekly Schedule tab */}
          {activeTab === "weekly" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {data.schedule && data.schedule.length > 0 ? (
                <div className="space-y-4">
                  {data.schedule.map((session, index) => (
                    <div
                      key={session.id || index}
                      className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium">
                            {session.name || `Session ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Day {index + 1} • {session.duration} minutes
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-sm">
                          {session.exercises?.length || 0} exercises
                        </div>
                      </div>
                      {session.description && (
                        <p className="text-gray-400 text-sm mb-4">
                          {session.description}
                        </p>
                      )}
                      {session.exercises && session.exercises.length > 0 && (
                        <div className="space-y-2">
                          {session.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exercise.id || exerciseIndex}
                              className="flex items-center justify-between p-3 bg-[#222] rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-sm text-white">
                                  {exerciseIndex + 1}
                                </div>
                                <span className="text-white">
                                  {exercise.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-400">
                                  {exercise.sets} × {exercise.reps}
                                </span>
                                <span className="text-gray-400">
                                  {exercise.rest} rest
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon
                    icon="mdi:dumbbell"
                    className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  />
                  <p className="text-gray-400">No sessions scheduled yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Go back to the Schedule step to add training sessions.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
