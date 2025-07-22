"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AnatomicalViewer } from "../../../../exercises/components/AnatomicalViewer";
import { ExerciseLibrarySelector } from "../../../../exercises/components/ExerciseLibrarySelector";
import { ExerciseModal } from "../../../../exercises/components/ExerciseModal";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
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
  day: 1, // promijenjeno iz stringa u broj
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

// Helper function to check if a URL is a YouTube URL
function isYouTubeUrl(url) {
  return (
    typeof url === "string" &&
    (url.includes("youtube.com") || url.includes("youtu.be"))
  );
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper function to get YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  const id = getYouTubeVideoId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

export const Schedule = ({ data, onChange }) => {
  const [activeSession, setActiveSession] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [activeMedia, setActiveMedia] = useState({}); // Add this state to track active media for each exercise
  const [videoError, setVideoError] = useState({});

  // Exercise library pagination and filtering state
  const [libraryExercises, setLibraryExercises] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryHasMore, setLibraryHasMore] = useState(true);
  const [libraryPage, setLibraryPage] = useState(1);
  const [librarySearch, setLibrarySearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [useStaticLibrary, setUseStaticLibrary] = useState(false); // Toggle between static and backend
  const searchTimeoutRef = useRef(null);

  // Helper function to get active media for a specific exercise
  const getActiveMedia = (sessionIndex, exerciseIndex) => {
    const key = `${sessionIndex}-${exerciseIndex}`;
    return activeMedia[key] || "image";
  };

  // Helper function to set active media for a specific exercise
  const setActiveMediaForExercise = (
    sessionIndex,
    exerciseIndex,
    mediaType
  ) => {
    const key = `${sessionIndex}-${exerciseIndex}`;
    setActiveMedia((prev) => ({
      ...prev,
      [key]: mediaType,
    }));
  };

  // Fetch exercises when modal opens
  useEffect(() => {
    if (showExerciseLibrary) {
      // The ExerciseLibrarySelector now handles its own pagination and filtering
      // setLibraryPage(1);
      // setLibraryHasMore(true);
      // setLibraryLoading(false);
      // setLibraryFilters({ search: "", type: "", level: "", location: "", equipment: "" });
    }
  }, [showExerciseLibrary]);

  // Fetch exercises from backend with pagination and search
  const fetchLibraryExercises = async ({
    page = 1,
    search = "",
    append = false,
  } = {}) => {
    if (append) {
      setLibraryLoading(true);
    } else {
      setSearchLoading(true);
    }

    try {
      const response = await fetch(
        `/api/users/trainer/exercises?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=10`
      );
      const data = await response.json();
      if (data.success) {
        setLibraryExercises((prev) =>
          append ? [...prev, ...data.exercises] : data.exercises
        );
        setLibraryHasMore(data.pagination?.hasNextPage ?? false);
        setLibraryPage(page);
      } else {
        setLibraryHasMore(false);
        setLibraryExercises(append ? (prev) => prev : []);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setLibraryHasMore(false);
      setLibraryExercises(append ? (prev) => prev : []);
    } finally {
      if (append) {
        setLibraryLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  };

  // Open modal and load first page
  const openExerciseLibrary = () => {
    setShowExerciseLibrary(true);
    setLibraryExercises([]);
    setLibraryPage(1);
    setLibrarySearch("");
    setLibraryHasMore(true);
    setSearchLoading(false);
    setLibraryLoading(false);
    fetchLibraryExercises({ page: 1, search: "", append: false });
  };

  // Handle search in modal with debounce
  const handleLibrarySearch = (value) => {
    setLibrarySearch(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setLibraryPage(1);
      setLibraryHasMore(true);
      fetchLibraryExercises({ page: 1, search: value, append: false });
    }, 300); // 300ms debounce
  };

  // Handle scroll in modal
  const handleLibraryScroll = () => {
    if (!libraryLoading && libraryHasMore) {
      fetchLibraryExercises({
        page: libraryPage + 1,
        search: librarySearch,
        append: true,
      });
    }
  };

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    },
    []
  );

  const handleCreateExercise = async (exerciseData) => {
    console.log("[DEBUG] handleCreateExercise called with:", exerciseData);
    try {
      const response = await fetch("/api/users/trainer/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exerciseData),
      });

      const result = await response.json();
      const exerciseFromDb =
        result.exercise || result.data?.exercise || result.data;
      if (result.success && exerciseFromDb) {
        // Add the exercise as returned from the backend (with backend id, normalized fields, etc)
        const normalizedExercise = {
          ...exerciseFromDb,
          muscleGroups: Array.isArray(exerciseFromDb.muscleGroups)
            ? exerciseFromDb.muscleGroups
            : [],
        };

        // Provjera duplikata po id-u
        const alreadyExists = data.schedule[activeSession].exercises.some(
          (ex) => ex.id === normalizedExercise.id
        );
        if (alreadyExists) {
          console.warn(
            "[DEBUG] Exercise with this id already exists, skipping add:",
            normalizedExercise.id
          );
          return normalizedExercise;
        }

        const newSchedule = data.schedule.map((session, idx) =>
          idx === activeSession
            ? {
                ...session,
                exercises: [...session.exercises, normalizedExercise],
              }
            : session
        );
        onChange({ schedule: newSchedule });
        console.log("[DEBUG] Backend exercise:", normalizedExercise);
        console.log("[DEBUG] New schedule:", newSchedule);
        console.log("[DEBUG] data.schedule BEFORE update:", data.schedule);
        return normalizedExercise;
      } else {
        console.log(
          "[DEBUG] Backend response error or missing exercise:",
          result
        );
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
        day: data.schedule.length + 1, // uvijek broj, npr. 1, 2, 3...
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

  // Fallback ako nema schedule
  let schedule = data.schedule || [];

  // Reset video error when videoUrl changes
  useEffect(() => {
    setVideoError({});
  }, [data.schedule]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            Training Schedule
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Create and organize your training sessions
          </p>
        </motion.div>

        {/* Add Session Buttons - moved to top */}
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
                    <div
                      className={`p-3 sm:p-4 flex items-center justify-between bg-gradient-to-r from-black/20 to-black/10 cursor-pointer select-none transition-all duration-200 active:bg-black/30 ${
                        isExpanded ? "ring-2 ring-orange-400/30" : ""
                      }`}
                      onClick={() =>
                        !session.isRestDay &&
                        setExpandedSession(isExpanded ? null : sessionIndex)
                      }
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      style={{ touchAction: "manipulation" }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Icon
                          icon="mdi:drag-vertical"
                          className="w-5 h-5 text-gray-300 cursor-move flex-shrink-0 hidden sm:inline"
                        />
                        <div
                          className={`p-2 sm:p-3 rounded-xl ${
                            sessionType.bgColor
                          } border ${sessionType.iconColor.replace(
                            "text-",
                            "border-"
                          )}/30 flex-shrink-0`}
                        >
                          <Icon
                            icon={sessionType.icon}
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${sessionType.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span className="text-base sm:text-lg font-semibold text-white truncate">
                              Day {sessionIndex + 1}:{" "}
                              {session.isRestDay
                                ? "Rest Day"
                                : session.name || sessionType.label}
                            </span>
                            {!session.isRestDay && (
                              <span className="mt-1 sm:mt-0 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs sm:text-sm text-white font-medium w-fit">
                                {sessionType.label}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-100 mt-1">
                            {!session.isRestDay ? (
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
                            ) : (
                              <span className="flex items-center gap-1">
                                <Icon icon="mdi:sleep" className="w-4 h-4" />
                                Recovery day
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSession(sessionIndex);
                          }}
                          className="text-gray-200 hover:text-red-300 hover:bg-red-500/20 p-1 sm:p-2"
                          leftIcon={
                            <Icon
                              icon="mdi:trash-can-outline"
                              className="w-4 h-4 sm:w-5 sm:h-5"
                            />
                          }
                        />
                        {!session.isRestDay && (
                          <span className="inline-flex items-center justify-center rounded-full transition-all duration-200">
                            <Icon
                              icon={
                                isExpanded
                                  ? "mdi:chevron-up"
                                  : "mdi:chevron-down"
                              }
                              className="w-6 h-6 sm:w-5 sm:h-5 text-gray-200 group-hover:text-white transition-transform"
                            />
                          </span>
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
                            <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-black/40 to-black/25 backdrop-blur-sm">
                              {/* Session Info */}
                              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-6 lg:gap-8">
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                    <Icon
                                      icon="mdi:text-box"
                                      className="w-4 h-4 text-white/70"
                                    />
                                    Session Name
                                  </label>
                                  <input
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
                                    className="w-full bg-white/10 border border-white/30 rounded-xl text-white px-4 py-3 sm:py-4 backdrop-blur-sm focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all placeholder-gray-300 text-base sm:text-lg font-medium"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                    <Icon
                                      icon="mdi:clock-outline"
                                      className="w-4 h-4 text-white/70"
                                    />
                                    Duration (minutes)
                                  </label>
                                  <input
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
                                    className="w-full bg-white/10 border border-white/30 rounded-xl text-white px-4 py-3 sm:py-4 backdrop-blur-sm focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all text-base sm:text-lg font-medium text-center"
                                  />
                                </div>
                              </div>

                              {/* Session Type Selector */}
                              <div className="space-y-4">
                                <h4 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                                  <Icon
                                    icon="mdi:format-list-bulleted-type"
                                    className="w-5 h-5 text-white/80"
                                  />
                                  Session Type
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
                                      className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                                        session.type === type.id
                                          ? `${type.bgColor} border-current ${type.iconColor} bg-white/25 shadow-lg ring-2 ring-white/20`
                                          : "bg-white/10 border-white/20 text-gray-200 hover:border-white/40 hover:bg-white/20 backdrop-blur-sm"
                                      }`}
                                    >
                                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                                        <div
                                          className={`p-2 sm:p-3 rounded-lg ${
                                            session.type === type.id
                                              ? type.bgColor
                                              : "bg-white/20"
                                          } transition-all`}
                                        >
                                          <Icon
                                            icon={type.icon}
                                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                              session.type === type.id
                                                ? type.iconColor
                                                : "text-white/70"
                                            }`}
                                          />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                                          {type.label}
                                        </span>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Exercises Section */}
                              <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                                    <Icon
                                      icon="mdi:dumbbell"
                                      className="w-5 h-5 text-white/80"
                                    />
                                    Exercises
                                  </h4>
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Icon
                                      icon="mdi:counter"
                                      className="w-4 h-4 text-white/70"
                                    />
                                    <span className="text-sm font-medium text-white">
                                      {session.exercises.length}
                                    </span>
                                  </div>
                                </div>

                                {/* Exercises List */}
                                <div className="space-y-3 sm:space-y-4">
                                  {session.exercises.map(
                                    (exercise, exerciseIndex) => {
                                      const videoKey = `${sessionIndex}-${exerciseIndex}`;
                                      const videoUrl = exercise.videoUrl;

                                      let videoContent = null;
                                      if (videoUrl) {
                                        if (isYouTubeUrl(videoUrl)) {
                                          videoContent = (
                                            <iframe
                                              width="100%"
                                              height="250"
                                              style={{
                                                borderRadius: "12px",
                                                minHeight: 200,
                                                maxHeight: 320,
                                              }}
                                              src={getYouTubeEmbedUrl(videoUrl)}
                                              title={exercise.name}
                                              frameBorder="0"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            />
                                          );
                                        } else if (videoError[videoKey]) {
                                          videoContent = (
                                            <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 bg-black">
                                              <div className="text-center">
                                                <div className="bg-[#555]/10 rounded-full p-4 mb-4 mx-auto w-fit">
                                                  <Icon
                                                    icon="mdi:alert"
                                                    className="w-8 h-8 text-red-400"
                                                  />
                                                </div>
                                                <span className="text-sm text-red-400">
                                                  The video could not be loaded.
                                                  Please check the CORS settings
                                                  or the video URL.
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          videoContent = (
                                            <video
                                              src={videoUrl}
                                              controls
                                              className="w-full h-full rounded-xl pointer-events-auto"
                                              style={{
                                                minHeight: 200,
                                                maxHeight: 320,
                                              }}
                                              onError={() =>
                                                setVideoError((prev) => ({
                                                  ...prev,
                                                  [videoKey]: true,
                                                }))
                                              }
                                            >
                                              <track
                                                kind="captions"
                                                src={videoUrl.replace(
                                                  /\.[^/.]+$/,
                                                  ".vtt"
                                                )}
                                                srcLang="en"
                                                label="English"
                                                default
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          );
                                        }
                                      } else {
                                        videoContent = (
                                          <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300">
                                            <div className="text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                              <div className="bg-[#555]/10 rounded-full p-4 mb-4 mx-auto w-fit">
                                                <Icon
                                                  icon="mdi:video-off"
                                                  className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors"
                                                />
                                              </div>
                                              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                No video available
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <Card
                                          // Ispravljeno: koristimo samo exercise.id kao key
                                          key={exercise.id}
                                          variant="dark"
                                          hover={true}
                                          hoverBorderColor="#666"
                                          borderColor="#555"
                                          padding="0"
                                          className="shadow-lg !p-0"
                                        >
                                          <div className="flex flex-col lg:flex-row">
                                            {/* Exercise details - stacked on mobile */}
                                            <div className="flex-1 p-4 sm:p-6">
                                              <div className="flex items-center justify-between mb-4">
                                                <h5 className="font-semibold text-white text-base sm:text-lg leading-tight">
                                                  {exercise.name}
                                                </h5>
                                                <Button
                                                  variant="ghost"
                                                  size="small"
                                                  onClick={() => {
                                                    const newSchedule = [
                                                      ...data.schedule,
                                                    ];
                                                    newSchedule[
                                                      sessionIndex
                                                    ].exercises = newSchedule[
                                                      sessionIndex
                                                    ].exercises.filter(
                                                      (_, i) =>
                                                        i !== exerciseIndex
                                                    );
                                                    onChange({
                                                      schedule: newSchedule,
                                                    });
                                                  }}
                                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/30 p-2 rounded-lg transition-all"
                                                >
                                                  <Icon
                                                    icon="mdi:trash-can-outline"
                                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                                  />
                                                </Button>
                                              </div>

                                              {/* Exercise controls - responsive grid */}
                                              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                                <div className="space-y-2">
                                                  <label className="block text-xs sm:text-sm font-medium text-gray-300 text-center">
                                                    Sets
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={exercise.sets}
                                                    min={1}
                                                    onChange={(e) =>
                                                      handleExerciseChange(
                                                        sessionIndex,
                                                        exerciseIndex,
                                                        "sets",
                                                        Number.parseInt(
                                                          e.target.value
                                                        )
                                                      )
                                                    }
                                                    className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-base sm:text-lg py-2 sm:py-3 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <label className="block text-xs sm:text-sm font-medium text-gray-300 text-center">
                                                    Reps
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={exercise.reps}
                                                    min={1}
                                                    onChange={(e) =>
                                                      handleExerciseChange(
                                                        sessionIndex,
                                                        exerciseIndex,
                                                        "reps",
                                                        Number.parseInt(
                                                          e.target.value
                                                        )
                                                      )
                                                    }
                                                    className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-base sm:text-lg py-2 sm:py-3 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <label className="block text-xs sm:text-sm font-medium text-gray-300 text-center">
                                                    Rest (s)
                                                  </label>
                                                  <input
                                                    type="number"
                                                    value={exercise.rest}
                                                    min={0}
                                                    onChange={(e) =>
                                                      handleExerciseChange(
                                                        sessionIndex,
                                                        exerciseIndex,
                                                        "rest",
                                                        Number.parseInt(
                                                          e.target.value
                                                        )
                                                      )
                                                    }
                                                    className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-base sm:text-lg py-2 sm:py-3 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm"
                                                  />
                                                </div>
                                              </div>

                                              {/* Exercise Instructions */}
                                              <div className="space-y-2 mb-4">
                                                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                                                  <Icon
                                                    icon="mdi:information-outline"
                                                    className="w-4 h-4"
                                                  />
                                                  Instructions
                                                </label>
                                                <textarea
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
                                                  className="bg-[#4a4a4a]/60 border border-[#666]/40 rounded-lg text-gray-300 text-sm sm:text-base leading-relaxed resize-none w-full px-3 py-2 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm placeholder-gray-400"
                                                />
                                              </div>

                                              {/* Exercise Notes */}
                                              <div className="space-y-2 mb-4">
                                                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                                                  <Icon
                                                    icon="mdi:note-text"
                                                    className="w-4 h-4"
                                                  />
                                                  Notes
                                                </label>
                                                <textarea
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
                                                  className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg resize-none text-white text-sm sm:text-base focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm placeholder-gray-400 px-3 py-2"
                                                />
                                              </div>

                                              {/* Muscle Groups */}
                                              {normalizeMuscleGroups(
                                                exercise.muscleGroups
                                              ).length > 0 && (
                                                <div className="space-y-2">
                                                  <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                                                    <Icon
                                                      icon="mdi:muscle"
                                                      className="w-4 h-4"
                                                    />
                                                    Target Muscles
                                                  </label>
                                                  <div className="flex flex-wrap gap-2">
                                                    {normalizeMuscleGroups(
                                                      exercise.muscleGroups
                                                    ).map((muscle, idx) => (
                                                      // Ispravljeno: koristimo muscle.id kao key
                                                      <span
                                                        key={muscle.id}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF8500]/20 border border-[#FF6B00]/40 rounded-full text-xs sm:text-sm font-medium text-[#FF6B00] capitalize"
                                                      >
                                                        {muscle.name}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            {/* Media preview - full width on mobile, side by side on desktop */}
                                            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#555]/50 flex flex-col backdrop-blur-sm">
                                              {/* Media type selector */}
                                              <div className="flex p-2 gap-2 border-b border-[#555]/50">
                                                <Button
                                                  variant="ghost"
                                                  size="small"
                                                  onClick={() =>
                                                    setActiveMediaForExercise(
                                                      sessionIndex,
                                                      exerciseIndex,
                                                      "image"
                                                    )
                                                  }
                                                  className={`flex-1 rounded-xl py-2.5 px-4 transition-all duration-300 ${
                                                    getActiveMedia(
                                                      sessionIndex,
                                                      exerciseIndex
                                                    ) === "image"
                                                      ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                                                      : "text-gray-300 hover:text-white hover:bg-white/5"
                                                  }`}
                                                >
                                                  <div className="flex items-center justify-center gap-2">
                                                    <Icon
                                                      icon="mdi:image"
                                                      className="w-4 h-4 sm:w-5 sm:h-5"
                                                    />
                                                    <span className="text-sm font-medium">
                                                      Image
                                                    </span>
                                                  </div>
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="small"
                                                  onClick={() =>
                                                    setActiveMediaForExercise(
                                                      sessionIndex,
                                                      exerciseIndex,
                                                      "video"
                                                    )
                                                  }
                                                  className={`flex-1 rounded-xl py-2.5 px-4 transition-all duration-300 ${
                                                    getActiveMedia(
                                                      sessionIndex,
                                                      exerciseIndex
                                                    ) === "video"
                                                      ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                                                      : "text-gray-300 hover:text-white hover:bg-white/5"
                                                  }`}
                                                >
                                                  <div className="flex items-center justify-center gap-2">
                                                    <Icon
                                                      icon="mdi:video"
                                                      className="w-4 h-4 sm:w-5 sm:h-5"
                                                    />
                                                    <span className="text-sm font-medium">
                                                      Video
                                                    </span>
                                                  </div>
                                                </Button>
                                              </div>

                                              {/* Media preview area */}
                                              <div className="flex-1 p-4 min-h-[250px] sm:min-h-[300px] relative">
                                                {getActiveMedia(
                                                  sessionIndex,
                                                  exerciseIndex
                                                ) === "image" ? (
                                                  exercise.imageUrl ? (
                                                    <Button
                                                      variant="ghost"
                                                      className="w-full h-full p-0 relative rounded-xl overflow-hidden border border-[#555]/30 hover:border-[#555]/50 transition-all group"
                                                      aria-label={`Preview image of ${exercise.name}`}
                                                    >
                                                      <Image
                                                        src={exercise.imageUrl}
                                                        alt={exercise.name}
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                        width={1000}
                                                        height={1000}
                                                      />
                                                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                                                            <Icon
                                                              icon="mdi:magnify"
                                                              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </Button>
                                                  ) : exercise.muscleGroups &&
                                                    exercise.muscleGroups
                                                      .length > 0 ? (
                                                    <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300 bg-[#121211]">
                                                      <div className="flex flex-col items-center justify-center">
                                                        <AnatomicalViewer
                                                          exerciseName={
                                                            exercise.name
                                                          }
                                                          muscleGroups={
                                                            exercise.muscleGroups
                                                          }
                                                          size="medium"
                                                          showBothViews={true}
                                                          interactive={false}
                                                          showMuscleInfo={false}
                                                          showExerciseInfo={
                                                            false
                                                          }
                                                          darkMode={true}
                                                          compact={false}
                                                          className="mx-auto"
                                                          bodyColor="white"
                                                        />
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300">
                                                      <div className="text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                        <div className="bg-[#555]/10 rounded-full p-4 mb-4 mx-auto w-fit">
                                                          <Icon
                                                            icon="mdi:image-off"
                                                            className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors"
                                                          />
                                                        </div>
                                                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                          No image available
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : getActiveMedia(
                                                    sessionIndex,
                                                    exerciseIndex
                                                  ) === "video" ? (
                                                  <div className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300 bg-black">
                                                    {videoContent}
                                                  </div>
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300">
                                                    <div className="text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                      <div className="bg-[#555]/10 rounded-full p-4 mb-4 mx-auto w-fit">
                                                        <Icon
                                                          icon="mdi:video-off"
                                                          className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors"
                                                        />
                                                      </div>
                                                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                                        No video available
                                                      </span>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
                                      );
                                    }
                                  )}
                                </div>

                                {/* Add Exercise Buttons - mobile optimized */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setActiveSession(sessionIndex);
                                      openExerciseLibrary();
                                    }}
                                    className="w-full py-3 text-base font-semibold bg-[#FF6B00] hover:bg-[#FF6B00]/90 border-0"
                                    leftIcon={
                                      <Icon
                                        icon="mdi:library"
                                        className="w-5 h-5"
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
                                    className="w-full py-3 text-base font-semibold border-2 border-green-400/60 text-green-300 hover:bg-green-500/20 hover:border-green-400/80 hover:text-green-200 backdrop-blur-sm"
                                    leftIcon={
                                      <Icon
                                        icon="mdi:plus-circle"
                                        className="w-5 h-5"
                                      />
                                    }
                                  >
                                    Create New Exercise
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

        {/* Exercise Library Modal */}
        {showExerciseLibrary && (
          <Modal
            isOpen={showExerciseLibrary}
            onClose={() => {
              setShowExerciseLibrary(false);
              setSelectedExercises([]);
              setLibraryExercises([]);
              setLibrarySearch("");
              setLibraryPage(1);
              setLibraryHasMore(true);
              setSearchLoading(false);
              setLibraryLoading(false);
              setUseStaticLibrary(false);
            }}
            title="Exercise Library"
            size="large"
            primaryButtonText={`Add Selected (${selectedExercises.length})`}
            primaryButtonAction={handleAddExercisesFromLibrary}
            primaryButtonDisabled={selectedExercises.length === 0}
            secondaryButtonText="Cancel"
          >
            <ExerciseLibrarySelector
              exercises={libraryExercises}
              loading={libraryLoading}
              searchLoading={searchLoading}
              searchTerm={librarySearch}
              onSearch={handleLibrarySearch}
              onSelectExercise={(exercise) => {
                // Toggle selection logic
                setSelectedExercises((prev) => {
                  const isSelected = prev.find((e) => e.id === exercise.id);
                  if (isSelected) {
                    return prev.filter((e) => e.id !== exercise.id);
                  }
                  return [...prev, exercise];
                });
              }}
              onClose={() => {
                setShowExerciseLibrary(false);
                setSelectedExercises([]);
                setLibraryExercises([]);
                setLibrarySearch("");
                setLibraryPage(1);
                setLibraryHasMore(true);
                setSearchLoading(false);
                setLibraryLoading(false);
                setUseStaticLibrary(false);
              }}
              onScroll={handleLibraryScroll}
              hasMore={libraryHasMore}
              useStaticData={useStaticLibrary}
              selectedExercises={selectedExercises}
              onClearSelection={() => setSelectedExercises([])}
            />
          </Modal>
        )}

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
