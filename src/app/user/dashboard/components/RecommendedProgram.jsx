"use client";
import { useState } from "react";

const RecommendedProgram = ({ program }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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
      case "crown":
        return <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `${program.color}20`,
              border: `1px solid ${program.color}40`,
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={program.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              {getIconPath(program.icon)}
            </svg>
          </div>
          <h3 className="text-2xl font-bold">Your Recommended Program</h3>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300"
            style={{
              background: `${program.color}20`,
              border: `1px solid ${program.color}40`,
              color: program.color,
            }}
            onClick={() => setShowTrainingModal(true)}>
            View Details
          </button>
        </div>
      </div>

      {/* Recommendation Card */}
      <div
        className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#111] to-[#0a0a0a] border shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        style={{ borderColor: `${program.color}40` }}
        onClick={toggleDetails}>
        {/* Card header */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: program.color }}></div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `${program.color}20`,
                  border: `1px solid ${program.color}40`,
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={program.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  {getIconPath(program.icon)}
                </svg>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Personalized for You
                </span>
                <h2 className="text-2xl font-bold">{program.name}</h2>
                <p className="text-gray-300">{program.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
              <div className="p-2 rounded-lg bg-[#1A1A1A] text-center">
                <p className="text-xs text-gray-400">LOCATION</p>
                <p className="text-sm font-medium">
                  {program.preferences.location}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1A1A] text-center">
                <p className="text-xs text-gray-400">EQUIPMENT</p>
                <p className="text-sm font-medium">
                  {program.preferences.equipment}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1A1A] text-center">
                <p className="text-xs text-gray-400">DURATION</p>
                <p className="text-sm font-medium">
                  {program.preferences.duration}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#1A1A1A] text-center">
                <p className="text-xs text-gray-400">FREQUENCY</p>
                <p className="text-sm font-medium">
                  {program.preferences.frequency}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-6">{program.description}</p>

          {/* Training Days Preview */}
          {showDetails && (
            <div className="mb-6 animate-fadeIn">
              <h4 className="font-semibold mb-4 text-lg">Training Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.days.map((day, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#333] p-4 bg-[#1A1A1A] hover:bg-[#222] transition-colors duration-300">
                    <h5 className="font-medium mb-3">{day.name}</h5>
                    <div className="space-y-2">
                      {day.exercises.slice(0, 3).map((ex, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm pb-2 border-b border-[#333]">
                          <p>{ex.name}</p>
                          <p className="text-gray-400">
                            {ex.sets} × {ex.reps}
                          </p>
                        </div>
                      ))}
                      {day.exercises.length > 3 && (
                        <p className="text-sm text-gray-400">
                          + {day.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Notes */}
              <div className="mt-6 p-4 rounded-xl bg-[#1A1A1A] border border-[#333]">
                <h4 className="font-semibold mb-3">Training Notes</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {program.notes.slice(0, 4).map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-300"
              style={{ color: program.color }}
              onClick={(e) => {
                e.stopPropagation();
                toggleDetails();
              }}>
              {showDetails ? "Hide Details" : "Show Details"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showDetails ? "rotate(90deg)" : "rotate(0deg)",
                }}
                className="transition-transform duration-300">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${program.color}, ${program.color}BB)`,
                boxShadow: `0 8px 16px -8px ${program.color}80`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowTrainingModal(true);
              }}>
              Start Recommended Program
            </button>
          </div>
        </div>
      </div>

      {/* Training Modal */}
      {showTrainingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#111] border rounded-3xl max-w-3xl w-full overflow-hidden animate-scaleIn"
            style={{ borderColor: `${program.color}40` }}>
            {/* Modal header */}
            <div
              className="h-2 w-full"
              style={{ backgroundColor: program.color }}></div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `${program.color}20`,
                      border: `1px solid ${program.color}40`,
                    }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={program.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      {getIconPath(program.icon)}
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{program.name}</h2>
                    <p className="text-gray-300">{program.summary}</p>
                  </div>
                </div>

                <button
                  className="bg-[#222] hover:bg-[#333] rounded-full p-2 transition-colors duration-300"
                  onClick={() => setShowTrainingModal(false)}>
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      Program Details
                    </h3>
                    <p className="text-gray-400 mb-4">{program.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-[#1A1A1A]">
                        <p className="text-xs text-gray-400">LOCATION</p>
                        <p className="font-medium">
                          {program.preferences.location}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#1A1A1A]">
                        <p className="text-xs text-gray-400">EQUIPMENT</p>
                        <p className="font-medium">
                          {program.preferences.equipment}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#1A1A1A]">
                        <p className="text-xs text-gray-400">DURATION</p>
                        <p className="font-medium">
                          {program.preferences.duration}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#1A1A1A]">
                        <p className="text-xs text-gray-400">FREQUENCY</p>
                        <p className="font-medium">
                          {program.preferences.frequency}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Fitness Benefits
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Performance Enhancement",
                          description:
                            "Improve strength, power, and overall athletic performance",
                          icon: "trending-up",
                        },
                        {
                          title: "Hormonal Optimization",
                          description:
                            "Optimize hormone levels for better muscle growth and recovery",
                          icon: "activity",
                        },
                        {
                          title: "Recovery Focus",
                          description:
                            "Strategic rest periods and recovery techniques for optimal results",
                          icon: "refresh-cw",
                        },
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div
                            className="mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `${program.color}20`,
                            }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={program.color}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              {benefit.icon === "trending-up" && (
                                <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
                              )}
                              {benefit.icon === "activity" && (
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                              )}
                              {benefit.icon === "refresh-cw" && (
                                <>
                                  <path d="M23 4v6h-6"></path>
                                  <path d="M1 20v-6h6"></path>
                                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
                                  <path d="M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
                                </>
                              )}
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-gray-400">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Workout Schedule</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {program.days.map((day, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#333] bg-[#1A1A1A] hover:bg-[#222] transition-colors duration-300">
                        <h4 className="font-medium mb-3">{day.name}</h4>
                        <div className="space-y-2">
                          {day.exercises.map((ex, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm pb-2 border-b border-[#333]">
                              <p>{ex.name}</p>
                              <p className="text-gray-400">
                                {ex.sets} × {ex.reps}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  className="px-4 py-2 bg-transparent border border-[#333] hover:border-white rounded-xl transition-all duration-300"
                  onClick={() => setShowTrainingModal(false)}>
                  Go Back
                </button>

                <button
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${program.color}, ${program.color}BB)`,
                    boxShadow: `0 8px 16px -8px ${program.color}80`,
                  }}
                  onClick={() => {
                    setShowTrainingModal(false);
                    window.location.href = `/user/workout/${program.id}`;
                  }}>
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedProgram;
