import { Icon } from "@iconify/react";

import { SESSION_FORMATS } from "@/enums/sessionFormats";
import { TRAINING_TYPES } from "@/enums/trainingTypes";

// Helper to convert camelCase to spaced words and capitalize the first letter
function formatKey(key) {
  if (!key) return "";
  const result = key
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/[_-]+/g, " ") // replace underscores and dashes with space
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Helper to get className for difficulty level
const getDifficultyClass = (level) => {
  switch ((level || "").toLowerCase()) {
    case "beginner":
      return "bg-green-900/20 text-green-400";
    case "intermediate":
      return "bg-yellow-900/20 text-yellow-400";
    default:
      return "bg-red-900/20 text-red-400";
  }
};

export const DetailsTabTraining = ({
  trainingType,
  sessionsPerWeek,
  sessionFormat,
  difficultyLevel,
  features,
}) => (
  <div className="space-y-6">
    {trainingType && (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Icon
            icon="heroicons:bolt-20-solid"
            className="w-5 h-5 text-blue-400"
          />
          Training Type
        </h3>
        <p className="text-gray-300">
          {TRAINING_TYPES.find((t) => t.id === trainingType)?.label ||
            trainingType}
        </p>
      </div>
    )}
    {sessionsPerWeek && (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          Sessions Per Week
        </h3>
        <p className="text-[#FF6B00] text-2xl font-bold">{sessionsPerWeek}</p>
      </div>
    )}
    {difficultyLevel && (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          Difficulty Level
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyClass(
            difficultyLevel
          )}`}
        >
          {difficultyLevel}
        </span>
      </div>
    )}
    {sessionFormat && (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          Session Format
        </h3>
        <div className="space-y-2">
          {typeof sessionFormat === "object" ? (
            <>
              {sessionFormat.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{sessionFormat.duration}</span>
                </div>
              )}
              {sessionFormat.structure && (
                <div>
                  <span className="text-gray-400 block mb-1">Structure:</span>
                  <p className="text-gray-300">{sessionFormat.structure}</p>
                </div>
              )}
              {sessionFormat.equipment && (
                <div>
                  <span className="text-gray-400 block mb-1">Equipment:</span>
                  <p className="text-gray-300">{sessionFormat.equipment}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300">
              {SESSION_FORMATS.find((f) => f.id === sessionFormat)?.label ||
                sessionFormat}
            </p>
          )}
        </div>
      </div>
    )}
    {features && (
      <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Icon
            icon="heroicons:star-20-solid"
            className="w-5 h-5 text-[#FF6B00]"
          />
          Training Features
        </h3>
        {Array.isArray(features) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={`feature-${index}-${
                  typeof feature === "string"
                    ? feature
                    : JSON.stringify(feature)
                }`}
                className="flex items-start gap-2"
              >
                <Icon
                  icon="heroicons:check-circle-20-solid"
                  className="w-[18px] h-[18px] text-[#FF6B00] mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        ) : typeof features === "object" ? (
          <div className="space-y-3">
            {Object.entries(features).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-400 block mb-1 capitalize">
                  {formatKey(key)}:
                </span>
                <p className="text-gray-300">
                  {Array.isArray(value) ? value.join(", ") : value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">{features}</p>
        )}
      </div>
    )}
  </div>
);
