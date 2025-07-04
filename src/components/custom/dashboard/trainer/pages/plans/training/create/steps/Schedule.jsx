"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ExerciseModal } from "../../../../exercises/components/ExerciseModal";

import styles from "./Schedule.module.css";

import { ErrorMessage } from "@/components/common";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";

const SESSION_TYPES = [
  {
    id: "strength",
    label: "Strength",
    icon: "game-icons:muscle-up",
    color: "from-red-500/40 to-orange-500/40 border-orange-500/50",
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/20",
  },
  {
    id: "cardio",
    label: "Cardio",
    icon: "mdi:heart-pulse",
    color: "from-green-500/40 to-emerald-500/40 border-emerald-500/50",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    id: "hiit",
    label: "HIIT",
    icon: "material-symbols:timer",
    color: "from-blue-500/40 to-cyan-500/40 border-cyan-500/50",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
  {
    id: "flexibility",
    label: "Flexibility",
    icon: "mdi:yoga",
    color: "from-purple-500/40 to-violet-500/40 border-violet-500/50",
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/20",
  },
  {
    id: "mobility",
    label: "Mobility",
    icon: "material-symbols:sports-martial-arts",
    color: "from-pink-500/40 to-rose-500/40 border-rose-500/50",
    iconColor: "text-rose-400",
    bgColor: "bg-rose-500/20",
  },
  {
    id: "endurance",
    label: "Endurance",
    icon: "mdi:run-fast",
    color: "from-yellow-500/40 to-amber-500/40 border-amber-500/50",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  {
    id: "power",
    label: "Power",
    icon: "mdi:lightning-bolt",
    color: "from-indigo-500/40 to-blue-500/40 border-blue-500/50",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "speed",
    label: "Speed",
    icon: "material-symbols:speed",
    color: "from-teal-500/40 to-cyan-500/40 border-cyan-500/50",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
  {
    id: "rest",
    label: "Rest Day",
    icon: "mdi:sleep",
    color: "from-gray-500/40 to-slate-500/40 border-slate-500/50",
    iconColor: "text-slate-400",
    bgColor: "bg-slate-500/20",
  },
];

const DEFAULT_SESSION = {
  id: "",
  name: "",
  duration: 60,
  day: "day1",
  description: "",
  type: "strength",
  exercises: [],
  isRestDay: false,
};

const DEFAULT_EXERCISE = {
  id: "",
  name: "",
  sets: 3,
  reps: 12,
  rest: 60,
  notes: "",
  type: "strength",
  equipment: "",
  muscles: [],
  imageUrl: "",
  videoUrl: "",
  instructions: "",
  tips: "",
  muscleGroups: [],
  level: "intermediate",
  location: "gym",
};

function SessionDndWrapper({ id, index, moveSession, children }) {
  const ref = React.useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "SESSION",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item, _monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveSession(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "SESSION",
    item: { id, index },
    collect: ({ isDragging }) => ({
      isDragging,
    }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 1 : 0.5 }}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
}

// Utility to normalize muscleGroups
function normalizeMuscleGroups(muscleGroups) {
  return (muscleGroups || []).map((muscle) => {
    if (typeof muscle === "object" && (muscle.id || muscle.name)) {
      return {
        id: muscle.id || muscle.name,
        name: muscle.name || muscle.id,
      };
    } else if (typeof muscle === "string") {
      return { id: muscle, name: muscle };
    } else {
      return { id: JSON.stringify(muscle), name: String(muscle) };
    }
  });
}

const ExerciseCard = React.memo(function ExerciseCard({
  exercise,
  sessionIndex,
  exerciseIndex,
  handleExerciseChange,
  onRemove,
  setShowMediaPreview,
}) {
  const [activeMedia, setActiveMedia] = useState("image"); // 'image' or 'video'
  // Normalize muscleGroups for consistent rendering
  const normalizedMuscleGroups = normalizeMuscleGroups(exercise.muscleGroups);

  return (
    <div className="bg-gradient-to-br from-[#3a3a3a] to-[#404040] rounded-xl border border-[#555] hover:border-[#666] transition-all duration-300 overflow-hidden shadow-lg">
      <div className="flex">
        {/* Left side - Exercise details */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white text-lg">
              {exercise.name}
            </h4>
            <Button
              variant="ghost"
              size="small"
              onClick={onRemove}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/30"
              leftIcon={
                <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
              }
            />
          </div>

          {/* Exercise controls */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <FormField
              label="Sets"
              type="number"
              value={exercise.sets}
              min={1}
              onChange={(e) =>
                handleExerciseChange(
                  sessionIndex,
                  exerciseIndex,
                  "sets",
                  Number.parseInt(e.target.value)
                )
              }
              className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-lg focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
            />
            <FormField
              label="Reps"
              type="number"
              value={exercise.reps}
              min={1}
              onChange={(e) =>
                handleExerciseChange(
                  sessionIndex,
                  exerciseIndex,
                  "reps",
                  Number.parseInt(e.target.value)
                )
              }
              className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-lg focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
            />
            <FormField
              label="Rest (s)"
              type="number"
              value={exercise.rest}
              min={0}
              onChange={(e) =>
                handleExerciseChange(
                  sessionIndex,
                  exerciseIndex,
                  "rest",
                  Number.parseInt(e.target.value)
                )
              }
              className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-lg focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
            />
          </div>

          {/* Exercise Instructions - sada editable */}
          <div className="space-y-2 mb-4">
            <label
              htmlFor={`instructions-${sessionIndex}-${exerciseIndex}`}
              className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2"
            >
              <Icon icon="mdi:information-outline" className="w-4 h-4" />
              Instructions
            </label>
            <FormField
              id={`instructions-${sessionIndex}-${exerciseIndex}`}
              type="textarea"
              value={exercise.instructions}
              onChange={(e) =>
                handleExerciseChange(
                  sessionIndex,
                  exerciseIndex,
                  "instructions",
                  e.target.value
                )
              }
              placeholder="Add instructions for this exercise..."
              rows={3}
              className="bg-[#4a4a4a]/60 border border-[#666]/40 rounded-lg text-gray-300 text-sm leading-relaxed"
            />
          </div>

          <FormField
            label="Notes"
            type="textarea"
            value={exercise.notes}
            onChange={(e) =>
              handleExerciseChange(
                sessionIndex,
                exerciseIndex,
                "notes",
                e.target.value
              )
            }
            placeholder="Add specific instructions, form cues, or modifications..."
            rows={3}
            className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg resize-none text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm placeholder-gray-400"
          />

          {/* Muscle Groups */}
          {normalizedMuscleGroups.length > 0 && (
            <div className="space-y-2">
              <label
                htmlFor={`target-muscles-${sessionIndex}-${exerciseIndex}`}
                className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2"
              >
                <Icon icon="mdi:muscle" className="w-4 h-4" />
                Target Muscles
              </label>
              <div
                id={`target-muscles-${sessionIndex}-${exerciseIndex}`}
                className="flex flex-wrap gap-2"
              >
                {normalizedMuscleGroups.map((muscle, idx) => (
                  <span
                    key={muscle.id || muscle.name || idx}
                    className="px-3 py-1 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF8500]/20 border border-[#FF6B00]/40 rounded-full text-xs font-medium text-[#FF6B00] capitalize"
                  >
                    {muscle.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Media preview */}
        <div className="w-72 border-l border-[#555] flex flex-col bg-[#3a3a3a]/90">
          {/* Media type selector */}
          <div className="flex border-b border-[#555]">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setActiveMedia("image")}
              className={`flex-1 rounded-none border-r border-[#555] ${
                activeMedia === "image"
                  ? "bg-[#FF6B00]/30 text-[#FF6B00] border-[#FF6B00]/60"
                  : "text-gray-300 hover:text-white hover:bg-[#555]/70"
              }`}
              leftIcon={<Icon icon="mdi:image" className="w-4 h-4" />}
            >
              Image
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setActiveMedia("video")}
              className={`flex-1 rounded-none ${
                activeMedia === "video"
                  ? "bg-[#FF6B00]/30 text-[#FF6B00] border-[#FF6B00]/60"
                  : "text-gray-300 hover:text-white hover:bg-[#555]/70"
              }`}
              leftIcon={<Icon icon="mdi:video" className="w-4 h-4" />}
            >
              Video
            </Button>
          </div>

          {/* Media preview area */}
          <div className="flex-1 p-4">
            {activeMedia === "image" ? (
              exercise.imageUrl ? (
                <Button
                  variant="ghost"
                  onClick={() =>
                    setShowMediaPreview({
                      type: "image",
                      url: exercise.imageUrl,
                      name: exercise.name,
                    })
                  }
                  className="w-full h-full p-0 relative rounded-lg overflow-hidden bg-black/40 hover:bg-black/50"
                  aria-label={`Preview image of ${exercise.name}`}
                >
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="object-cover"
                    width={1000}
                    height={1000}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white/40 backdrop-blur-sm rounded-full p-3">
                      <Icon icon="mdi:magnify" className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                  <div className="text-center py-8">
                    <Icon
                      icon="mdi:image-off"
                      className="w-12 h-12 mx-auto mb-3 text-gray-500"
                    />
                    <span className="text-sm text-gray-400">
                      No image available
                    </span>
                  </div>
                </div>
              )
            ) : exercise.videoUrl ? (
              <Button
                variant="ghost"
                onClick={() =>
                  setShowMediaPreview({
                    type: "video",
                    url: exercise.videoUrl,
                    name: exercise.name,
                  })
                }
                className="w-full h-full p-0 relative rounded-lg overflow-hidden bg-black/40 hover:bg-black/50"
                aria-label={`Preview video of ${exercise.name}`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FF6B00]/40 backdrop-blur-sm flex items-center justify-center hover:bg-[#FF6B00]/50 transition-colors">
                    <Icon icon="mdi:play" className="w-8 h-8 text-[#FF6B00]" />
                  </div>
                </div>
              </Button>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                <div className="text-center py-8">
                  <Icon
                    icon="mdi:video-off"
                    className="w-12 h-12 mx-auto mb-3 text-gray-500"
                  />
                  <span className="text-sm text-gray-400">
                    No video available
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const Schedule = ({ data, onChange }) => {
  const [activeSession, setActiveSession] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showMediaPreview, setShowMediaPreview] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [subtitleExists, setSubtitleExists] = useState(false);
  const [lastCheckedSubtitle, setLastCheckedSubtitle] = useState("");

  // Fetch exercises when modal opens
  useEffect(() => {
    if (showExerciseLibrary) {
      fetchExercises();
    }
  }, [showExerciseLibrary]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch("/api/users/trainer/exercises");
      const data = await response.json();
      if (data.success) {
        setExercises(data.exercises);
      }
    } catch (error) {
      setErrorMessage(
        `Failed to fetch exercises. ${
          error?.message ? "Error: " + error.message : ""
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExercise = async (exerciseData) => {
    try {
      const response = await fetch("/api/users/trainer/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exerciseData),
      });

      const result = await response.json();
      if (result.success) {
        const exerciseToAdd = {
          ...DEFAULT_EXERCISE,
          id: crypto.randomUUID(),
          ...exerciseData,
          ...result.exercise,
        };

        const newSchedule = [...data.schedule];
        newSchedule[activeSession].exercises = [
          ...newSchedule[activeSession].exercises,
          exerciseToAdd,
        ];

        onChange({ schedule: newSchedule });
        setShowCreateExercise(false);
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
    }
  };

  const handleAddExercisesFromLibrary = () => {
    const newSchedule = [...data.schedule];
    const selectedExercisesToAdd = selectedExercises.map((exercise) => ({
      ...DEFAULT_EXERCISE,
      id: crypto.randomUUID(),
      name: exercise.name,
      type: exercise.type,
      equipment: exercise.equipment,
      muscles: exercise.muscles,
      imageUrl: exercise.imageUrl || "",
      videoUrl: exercise.videoUrl || "",
      instructions: exercise.instructions || "",
      tips: exercise.tips || "",
      muscleGroups: exercise.muscleGroups || [],
      level: exercise.level || "intermediate",
      location: exercise.location || "gym",
    }));

    newSchedule[activeSession].exercises = [
      ...newSchedule[activeSession].exercises,
      ...selectedExercisesToAdd,
    ];

    onChange({
      schedule: newSchedule,
    });

    setSelectedExercises([]);
    setShowExerciseLibrary(false);
  };

  const toggleExerciseSelection = useCallback((exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.find((e) => e.id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  }, []);

  const handleExerciseChange = useCallback(
    (sessionIndex, exerciseIndex, field, value) => {
      onChange((prev) => {
        const newSchedule = [...prev.schedule];
        newSchedule[sessionIndex] = {
          ...newSchedule[sessionIndex],
          exercises: [...newSchedule[sessionIndex].exercises],
        };
        newSchedule[sessionIndex].exercises[exerciseIndex] = {
          ...newSchedule[sessionIndex].exercises[exerciseIndex],
          [field]: value,
        };
        return { ...prev, schedule: newSchedule };
      });
    },
    [onChange]
  );

  const handleAddSession = useCallback(
    (isRestDay = false) => {
      const defaultType = isRestDay
        ? "rest"
        : SESSION_TYPES.find((t) => t.id !== "rest")?.id || "strength";
      const newSession = {
        ...DEFAULT_SESSION,
        id: crypto.randomUUID(),
        day: `day${(data.schedule.length % 7) + 1}`,
        isRestDay,
        type: defaultType,
        name: isRestDay ? "Rest Day" : "",
        exercises: isRestDay ? [] : DEFAULT_SESSION.exercises,
      };

      onChange({
        schedule: [...data.schedule, newSession],
      });
    },
    [data.schedule, onChange]
  );

  const handleRemoveSession = useCallback(
    (index) => {
      const newSchedule = data.schedule.filter((_, i) => i !== index);
      onChange({
        schedule: newSchedule,
      });
      if (activeSession >= newSchedule.length) {
        setActiveSession(Math.max(0, newSchedule.length - 1));
      }
      if (expandedSession === index) {
        setExpandedSession(null);
      }
    },
    [data.schedule, onChange, activeSession, expandedSession]
  );

  const handleSessionChange = useCallback(
    (index, field, value) => {
      const newSchedule = [...data.schedule];
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value,
      };
      onChange({
        schedule: newSchedule,
      });
    },
    [data.schedule, onChange]
  );

  const moveSession = useCallback(
    (from, to) => {
      const updated = [...data.schedule];
      const [removed] = updated.splice(from, 1);
      updated.splice(to, 0, removed);
      onChange({ schedule: updated });
    },
    [data.schedule, onChange]
  );

  // Memoize filtered exercises for efficiency
  const filteredExercises = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(lowerSearch)
    );
  }, [exercises, searchQuery]);

  // Fallback ako nema schedule
  const schedule = data.schedule || [];

  useEffect(() => {
    if (
      showMediaPreview &&
      showMediaPreview.type === "video" &&
      showMediaPreview.url
    ) {
      const vttUrl = showMediaPreview.url.replace(/\.[^/.]+$/, ".vtt");
      setLastCheckedSubtitle(vttUrl);
      fetch(vttUrl, { method: "HEAD" })
        .then((res) => setSubtitleExists(res.ok))
        .catch(() => setSubtitleExists(false));
    } else {
      setSubtitleExists(false);
      setLastCheckedSubtitle("");
    }
  }, [showMediaPreview]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Media Preview Modal */}
        {showMediaPreview && (
          <Modal
            isOpen={!!showMediaPreview}
            onClose={() => setShowMediaPreview(null)}
            title={showMediaPreview.name}
            size="large"
          >
            {showMediaPreview.type === "image" ? (
              <Image
                src={showMediaPreview.url}
                alt={showMediaPreview.name}
                className="w-full h-auto rounded-lg"
                width={1000}
                height={1000}
              />
            ) : (
              <video
                src={showMediaPreview.url}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
              >
                {subtitleExists &&
                  lastCheckedSubtitle ===
                    showMediaPreview.url.replace(/\.[^/.]+$/, ".vtt") && (
                    <track
                      kind="captions"
                      src={showMediaPreview.url.replace(/\.[^/.]+$/, ".vtt")}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
              </video>
            )}
          </Modal>
        )}

        {/* Sessions List with DnD */}
        <div className="space-y-4">
          {schedule.map((session, sessionIndex) => {
            const sessionType =
              SESSION_TYPES.find((t) => t.id === session.type) ||
              SESSION_TYPES[0];
            const isExpanded = expandedSession === sessionIndex;

            return (
              <SessionDndWrapper
                key={session.id}
                id={session.id}
                index={sessionIndex}
                moveSession={moveSession}
              >
                <div
                  className={`bg-gradient-to-r ${sessionType.color} rounded-2xl border overflow-hidden`}
                >
                  <motion.div
                    initial={{ opacity: 10, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Session Header */}
                    <div className="p-4 flex items-center justify-between bg-gradient-to-r from-black/20 to-black/10">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Drag Handle Icon (optional, whole card is draggable) */}
                        <Icon
                          icon="mdi:drag-vertical"
                          className="w-5 h-5 text-gray-300 cursor-move"
                        />
                        <div
                          className={`p-3 rounded-xl ${
                            sessionType.bgColor
                          } border ${sessionType.iconColor.replace(
                            "text-",
                            "border-"
                          )}/30`}
                        >
                          <Icon
                            icon={sessionType.icon}
                            className={`w-6 h-6 ${sessionType.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {session.name ||
                                `${sessionType.label} ${sessionIndex + 1}`}
                            </h3>
                            <span className="ml-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs text-white font-medium">
                              Day {sessionIndex + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-100">
                            {!session.isRestDay && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Icon
                                    icon="mdi:clock-outline"
                                    className="w-4 h-4"
                                  />
                                  {session.duration}min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Icon
                                    icon="mdi:dumbbell"
                                    className="w-4 h-4"
                                  />
                                  {session.exercises.length} exercises
                                </span>
                              </>
                            )}
                            {session.isRestDay && (
                              <span className="flex items-center gap-1">
                                <Icon icon="mdi:sleep" className="w-4 h-4" />
                                Recovery day
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSession(sessionIndex);
                          }}
                          className="text-gray-200 hover:text-red-300 hover:bg-red-500/20"
                          leftIcon={
                            <Icon
                              icon="mdi:trash-can-outline"
                              className="w-5 h-5"
                            />
                          }
                        />
                        {!session.isRestDay && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() =>
                              setExpandedSession(
                                isExpanded ? null : sessionIndex
                              )
                            }
                            className="text-gray-200 hover:text-white hover:bg-white/20"
                            leftIcon={
                              <Icon
                                icon={
                                  isExpanded
                                    ? "mdi:chevron-up"
                                    : "mdi:chevron-down"
                                }
                                className="w-5 h-5 transition-transform"
                              />
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Session Details */}
                    {!session.isRestDay && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-white/20"
                          >
                            <div className="p-6 space-y-6 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-sm">
                              {/* Session Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <FormField
                                    label="Session Name"
                                    type="text"
                                    value={session.name}
                                    onChange={(e) =>
                                      handleSessionChange(
                                        sessionIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Upper Body Strength"
                                    className="w-full bg-white/10 border border-white/30 rounded-lg text-white px-4 py-3 backdrop-blur-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all placeholder-gray-300"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <FormField
                                    label="Duration (minutes)"
                                    type="number"
                                    value={session.duration}
                                    onChange={(e) =>
                                      handleSessionChange(
                                        sessionIndex,
                                        "duration",
                                        Number.parseInt(e.target.value)
                                      )
                                    }
                                    min="1"
                                    className="w-full bg-white/10 border border-white/30 rounded-lg text-white px-4 py-3 backdrop-blur-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                                  />
                                </div>
                              </div>

                              {/* Session Type Selector */}
                              <fieldset className="mb-6">
                                <legend className="block text-sm font-medium text-white mb-3">
                                  Session Type
                                </legend>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {SESSION_TYPES.filter(
                                    (type) => type.id !== "rest"
                                  ).map((type) => (
                                    <Button
                                      key={type.id}
                                      variant="ghost"
                                      onClick={() =>
                                        handleSessionChange(
                                          sessionIndex,
                                          "type",
                                          type.id
                                        )
                                      }
                                      className={`p-4 rounded-xl border-2 transition-all ${
                                        session.type === type.id
                                          ? `${type.bgColor} border-current ${type.iconColor} bg-white/20`
                                          : "bg-white/10 border-white/20 text-gray-200 hover:border-white/30 hover:bg-white/15 backdrop-blur-sm"
                                      }`}
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <Icon
                                          icon={type.icon}
                                          className="w-6 h-6"
                                        />
                                        <span className="text-xs font-medium">
                                          {type.label}
                                        </span>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </fieldset>

                              {/* Exercises */}
                              <div className="space-y-3">
                                <h4
                                  id={`exercises-label-${sessionIndex}`}
                                  className="text-lg font-semibold text-white flex items-center gap-2"
                                >
                                  <Icon
                                    icon="mdi:dumbbell"
                                    className="w-5 h-5"
                                  />
                                  Exercises ({session.exercises.length})
                                </h4>

                                {session.exercises.map(
                                  (exercise, exerciseIndex) => (
                                    <ExerciseCard
                                      key={`${session.id}-${
                                        exercise.id || exerciseIndex
                                      }`}
                                      exercise={exercise}
                                      sessionIndex={sessionIndex}
                                      exerciseIndex={exerciseIndex}
                                      handleExerciseChange={
                                        handleExerciseChange
                                      }
                                      onRemove={() => {
                                        const newSchedule = [...data.schedule];
                                        newSchedule[sessionIndex].exercises =
                                          newSchedule[
                                            sessionIndex
                                          ].exercises.filter(
                                            (_, i) => i !== exerciseIndex
                                          );
                                        onChange({ schedule: newSchedule });
                                      }}
                                      setShowMediaPreview={setShowMediaPreview}
                                    />
                                  )
                                )}

                                {/* Add Exercise Buttons */}
                                <div className="flex gap-4 pt-2">
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setActiveSession(sessionIndex);
                                      setShowExerciseLibrary(true);
                                    }}
                                    className="flex-1 py-4 px-6 text-base font-semibold bg-[#FF6B00] hover:bg-[#FF6B00]/90 border-0"
                                    leftIcon={
                                      <Icon
                                        icon="mdi:library"
                                        className="w-6 h-6"
                                      />
                                    }
                                  >
                                    From Library
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setActiveSession(sessionIndex);
                                      setShowCreateExercise(true);
                                    }}
                                    className="flex-1 py-4 px-6 text-base font-semibold border-2 border-green-400/60 text-green-300 hover:bg-green-500/20 hover:border-green-400/80 hover:text-green-200 backdrop-blur-sm"
                                    leftIcon={
                                      <Icon
                                        icon="mdi:plus-circle"
                                        className="w-6 h-6"
                                      />
                                    }
                                  >
                                    Create Exercise
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                </div>
              </SessionDndWrapper>
            );
          })}
        </div>

        {/* Add Session Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="large"
            onClick={() => handleAddSession(false)}
            className="flex-1 py-4 border-2 border-dashed border-[#555] hover:border-[#FF6B00] hover:bg-[#FF6B00]/20 text-gray-300 hover:text-white bg-[#3a3a3a]/70"
            leftIcon={<Icon icon="mdi:plus-circle" className="w-6 h-6" />}
          >
            Add Training Session
          </Button>

          <Button
            variant="outline"
            size="large"
            onClick={() => handleAddSession(true)}
            className="flex-1 py-4 border-2 border-dashed border-[#555] hover:border-[#64748b] hover:bg-[#64748b]/20 text-gray-300 hover:text-white bg-[#3a3a3a]/70"
            leftIcon={<Icon icon="mdi:sleep" className="w-6 h-6" />}
          >
            Add Rest Day
          </Button>
        </div>

        {/* Exercise Library Modal */}
        <Modal
          isOpen={showExerciseLibrary}
          onClose={() => {
            setShowExerciseLibrary(false);
            setSelectedExercises([]);
          }}
          title="Exercise Library"
          size="large"
          primaryButtonText={`Add Selected (${selectedExercises.length})`}
          primaryButtonAction={handleAddExercisesFromLibrary}
          primaryButtonDisabled={selectedExercises.length === 0}
          secondaryButtonText="Cancel"
        >
          <ErrorMessage error={errorMessage} />
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="backdrop-blur-md bg-gradient-to-r from-[#232323]/80 to-[#323232]/80 rounded-3xl p-6 border border-[#FF7800]/20 shadow-xl">
              <div className="flex flex-col gap-3">
                {/* Search Input */}
                <div className="relative w-full">
                  <FormField
                    type="text"
                    placeholder="Search exercises by name, muscle group, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=""
                    prefixIcon={
                      <Icon
                        icon="mdi:magnify"
                        className="w-5 h-5 text-[#FF7800]"
                      />
                    }
                  />

                  {searchQuery && (
                    <Button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
                      onClick={() => setSearchQuery("")}
                    >
                      <Icon icon="mdi:close-circle" className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex gap-2 flex-wrap justify-start md:justify-start">
                  {[
                    { label: "All", icon: "mdi:apps" },
                    { label: "Strength", icon: "mdi:dumbbell" },
                    { label: "Cardio", icon: "mdi:heart-pulse" },
                    { label: "Flexibility", icon: "mdi:yoga" },
                  ].map(({ label, icon }, idx) => (
                    <Button
                      key={`${label}-${icon}-${idx}`}
                      variant="ghost"
                      size="small"
                      isActive={activeFilter === label}
                      onClick={() => setActiveFilter(label)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold border text-sm shadow-sm transition-all duration-200
                        ${
                          activeFilter === label
                            ? "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] text-white border-[#FF7800] shadow-lg scale-105"
                            : "bg-zinc-800/80 text-zinc-200 border-zinc-700 hover:bg-[#FF7800]/10 hover:text-[#FF7800] hover:border-[#FF7800]"
                        }
                      `}
                    >
                      <Icon
                        icon={icon}
                        className={`w-4 h-4 ${
                          activeFilter === label
                            ? "text-white"
                            : "text-[#FF7800] group-hover:text-[#FF7800]"
                        }`}
                      />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Counter */}
            {selectedExercises.length > 0 && (
              <div className="mt-4 p-4 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {selectedExercises.length}
                      </span>
                    </div>
                    <span className="text-[#FF6B00] font-semibold">
                      {selectedExercises.length} exercise
                      {selectedExercises.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedExercises([])}
                    className="text-[#FF6B00] hover:text-white hover:bg-[#FF6B00]/30"
                    leftIcon={<Icon icon="mdi:close" className="w-4 h-4" />}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Exercise Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4" />
                <p className="text-gray-400 text-lg">Loading exercises...</p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-2 ${styles.customScrollbar}`}
              >
                {filteredExercises.map((exercise, index) => {
                  const isSelected = selectedExercises.some(
                    (e) => e.id === exercise.id
                  );
                  const normalizedMuscleGroups = normalizeMuscleGroups(
                    exercise.muscleGroups
                  );
                  return (
                    <motion.div
                      key={exercise.id || `exercise-lib-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={[
                        "group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/25 to-indigo-600/25 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-gradient-to-r from-slate-700/80 to-slate-600/80 border-slate-500/60 hover:border-blue-400/60 hover:shadow-md hover:shadow-blue-400/10",
                      ].join(" ")}
                      onClick={() => toggleExerciseSelection(exercise)}
                    >
                      {/* Selection Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
                      )}

                      <div className="p-3 flex items-center gap-3 relative z-10">
                        {/* Exercise Image with Overlay */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-600 flex-shrink-0 shadow-md">
                          {exercise.imageUrl ? (
                            <>
                              <Image
                                src={exercise.imageUrl}
                                alt={exercise.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                width={48}
                                height={48}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                              <Icon
                                icon="mdi:dumbbell"
                                className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors"
                              />
                            </div>
                          )}
                        </div>

                        {/* Exercise Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base text-white truncate group-hover:text-blue-300 transition-colors">
                                {exercise.name}
                              </h4>
                            </div>
                          </div>

                          {/* Exercise Details Row */}
                          <div className="flex items-center gap-3 mb-1">
                            {/* Type Badge */}
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-400" />
                              <span className="text-xs font-medium text-slate-200 capitalize">
                                {exercise.type}
                              </span>
                            </div>

                            {/* Level Badge */}
                            <div
                              className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                                exercise.level === "beginner"
                                  ? "bg-emerald-500/30 text-emerald-300"
                                  : exercise.level === "intermediate"
                                  ? "bg-amber-500/30 text-amber-300"
                                  : "bg-red-500/30 text-red-300"
                              }`}
                            >
                              {exercise.level.charAt(0).toUpperCase()}
                            </div>

                            {/* Equipment Badge */}
                            <div className="flex items-center gap-0.5 text-xs text-slate-300">
                              <Icon
                                icon={
                                  exercise.equipment
                                    ? "mdi:dumbbell"
                                    : "mdi:account"
                                }
                                className="w-3 h-3"
                              />
                            </div>

                            {/* Location Badge */}
                            <div className="flex items-center gap-0.5 text-xs text-slate-300">
                              <Icon
                                icon={
                                  exercise.location === "gym"
                                    ? "mdi:weight-lifter"
                                    : exercise.location === "home"
                                    ? "mdi:home"
                                    : "mdi:pine-tree"
                                }
                                className="w-3 h-3"
                              />
                            </div>
                          </div>

                          {/* Muscle Groups */}
                          {normalizedMuscleGroups
                            .slice(0, 2)
                            .map((muscle, idx) => (
                              <span
                                key={muscle.id || muscle.name || idx}
                                className="px-1.5 py-0.5 bg-slate-600/60 rounded text-xs text-slate-300 font-medium"
                              >
                                {muscle.name}
                              </span>
                            ))}
                        </div>

                        {/* Media Indicators and Selection */}
                        <div className="flex items-center gap-2">
                          {/* Media Indicators */}
                          <div className="flex items-center gap-1">
                            {exercise.imageUrl && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                                <Icon
                                  icon="mdi:image"
                                  className="w-2.5 h-2.5 text-blue-400"
                                />
                              </div>
                            )}
                            {exercise.videoUrl && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20">
                                <Icon
                                  icon="mdi:video"
                                  className="w-2.5 h-2.5 text-purple-400"
                                />
                              </div>
                            )}
                          </div>

                          {/* Selection Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? "border-blue-400 bg-blue-500 scale-110"
                                : "border-slate-400 group-hover:border-blue-400 group-hover:scale-105"
                            }`}
                          >
                            {isSelected && (
                              <Icon
                                icon="mdi:check-bold"
                                className="w-3 h-3 text-white"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  );
                })}

                {/* Empty State */}
                {filteredExercises.length === 0 && (
                  <div className="lg:col-span-2 flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center mb-3" />
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">
                      No exercises found
                    </h3>
                    <p className="text-slate-400 text-center max-w-md text-sm">
                      {searchQuery
                        ? `No exercises match "${searchQuery}". Try adjusting your search.`
                        : "Start building your exercise library by creating your first exercise."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>

        {/* Create Exercise Modal */}
        <ExerciseModal
          isOpen={showCreateExercise}
          onClose={() => setShowCreateExercise(false)}
          mode="create"
          onSave={handleCreateExercise}
        />
      </div>
    </DndProvider>
  );
};
