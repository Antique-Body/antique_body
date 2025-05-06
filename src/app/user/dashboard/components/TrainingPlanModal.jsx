"use client";
import { useEffect, useState } from "react";

const TrainingPlanModal = ({ training, onClose }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  const getIconPath = (iconName) => {
    switch (iconName) {
      case "lightning":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "zap":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "dumbbell":
        return (
          <path d="M6 5H4a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5H4v8h2v-8zm12-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8zm-6-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8z" />
        );
      case "activity":
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case "flame":
        return (
          <path d="M12 2c1 3 2 5 2 7 0 2.236-1.765 4-4 4s-4-1.764-4-4c0-2 1-4 2-7 1 3 2 5 2 7 0 1.105.893 2 2 2s2-.895 2-2c0-2-1-4-2-7zm0 18c3.314 0 6-2 6-6 0-3.355-2.984-6.584-6-12-3.016 5.418-6 8.646-6 12 0 4 2.686 6 6 6z" />
        );
      case "award":
        return (
          <path d="M12 15c5 0 9-4 9-9h-4.5L15 3.5 12 1 9 3.5 7.5 6H3c0 5 4 9 9 9zm0 0v8m-4-4h8" />
        );
      default:
        return null;
    }
  };

  const handleStartTraining = () => {
    setIsStarting(true);
    // Simulate loading state
    setTimeout(() => {
      setIsStarting(false);
      onClose();
      // Navigate to the workout page
      window.location.href = `/user/workout/${training.id}`;
    }, 1500);
  };

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.find((e) => e.name === exercise.name);
      if (isSelected) {
        return prev.filter((e) => e.name !== exercise.name);
      }
      return [...prev, exercise];
    });
  };

  const startTimer = () => {
    setTimerActive(true);
    setTimer(60); // Start with 60 seconds
  };

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#111] border rounded-3xl max-w-3xl w-full overflow-hidden animate-scaleIn"
        style={{ borderColor: `${training.color}40` }}>
        {/* Modal header */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: training.color }}></div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `${training.color}20`,
                  border: `1px solid ${training.color}40`,
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={training.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  {getIconPath(training.icon)}
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{training.name}</h2>
                <p className="text-gray-300">{training.summary}</p>
              </div>
            </div>

            <button
              className="bg-[#222] hover:bg-[#333] rounded-full p-2 transition-colors duration-300"
              onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Training Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
              <div className="text-sm text-gray-400 mb-1">Location</div>
              <div className="font-medium">{training.preferences.location}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
              <div className="text-sm text-gray-400 mb-1">Equipment</div>
              <div className="font-medium">
                {training.preferences.equipment}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
              <div className="text-sm text-gray-400 mb-1">Duration</div>
              <div className="font-medium">{training.preferences.duration}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
              <div className="text-sm text-gray-400 mb-1">Frequency</div>
              <div className="font-medium">
                {training.preferences.frequency}
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {training.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedExercises.find((e) => e.name === exercise.name)
                      ? "bg-[#222] border-[#FF6B00]"
                      : "bg-[#1A1A1A] border-[#333] hover:border-[#444]"
                  }`}
                  onClick={() => toggleExercise(exercise)}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#333]">
                        {exercise.sets} sets
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#333]">
                        {exercise.reps}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {exercise.restTime} rest
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timer Section */}
          <div className="mb-8 p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Rest Timer</h3>
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timerActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-[#333] hover:bg-[#444]"
                }`}
                onClick={startTimer}
                disabled={timerActive}>
                {timerActive ? "Stop" : "Start"}
              </button>
            </div>
            <div className="text-4xl font-bold text-center">
              {timer !== null ? `${timer}s` : "--"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              className="px-4 py-2 bg-transparent border border-[#333] hover:border-white rounded-xl transition-all duration-300"
              onClick={onClose}>
              Go Back
            </button>

            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                isStarting ? "opacity-75 cursor-not-allowed" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${training.color}, ${training.color}BB)`,
                boxShadow: `0 8px 16px -8px ${training.color}80`,
              }}
              onClick={handleStartTraining}
              disabled={isStarting}>
              {isStarting ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  Starting...
                </>
              ) : (
                <>
                  Start This Program
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanModal;
