import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { getYouTubeEmbedUrl } from "@/utils/trainingUtils";

export function VideoModal({ isOpen, onClose, videoUrl, exercise }) {
  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 rounded-full p-2">
              <Icon
                icon="mdi:play"
                className="text-white"
                width={20}
                height={20}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Exercise Tutorial
              </h3>
              <p className="text-zinc-400 text-sm">
                {exercise?.name || "Exercise Video"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
            title="Close video (Esc)"
          >
            <Icon
              icon="mdi:close"
              width={24}
              height={24}
              className="text-zinc-400 group-hover:text-white"
            />
          </button>
        </div>

        {/* Video Content */}
        <div className="p-6">
          <div className="relative bg-black rounded-xl overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              className="w-full aspect-video video-modal-iframe-min-height"
              allowFullScreen
              title={`${exercise?.name || "Exercise"} Tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Video Info */}
          {exercise && (
            <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl">
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300 mb-3">
                {exercise.sets && exercise.reps && (
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:target" width={16} height={16} />
                    <span>
                      {typeof exercise.sets === "number"
                        ? exercise.sets
                        : Array.isArray(exercise.sets)
                        ? exercise.sets.length
                        : 0}{" "}
                      sets × {exercise.reps} reps
                    </span>
                  </div>
                )}

                {exercise.rest && (
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:clock" width={16} height={16} />
                    <span>{exercise.rest}s rest</span>
                  </div>
                )}

                {exercise.type && (
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:dumbbell" width={16} height={16} />
                    <span>{exercise.type.toUpperCase()}</span>
                  </div>
                )}

                {exercise.weight && (
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:weight" width={16} height={16} />
                    <span>{exercise.weight}kg</span>
                  </div>
                )}
              </div>

              {/* Muscle groups */}
              {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2">
                    Target Muscles:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-700/30"
                      >
                        {muscle.name || muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {exercise.instructions && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2">
                    Instructions:
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {exercise.instructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Video URL display for development */}
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-red-600 rounded-full p-1.5 flex-shrink-0">
                <Icon
                  icon="mdi:video"
                  className="text-white"
                  width={14}
                  height={14}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-red-300 font-medium text-sm mb-1">
                  Video Source
                </h4>
                <div className="text-xs text-red-200/70 font-mono bg-red-900/30 px-2 py-1 rounded border border-red-700/50 truncate">
                  {videoUrl}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-700 p-4 bg-zinc-800/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              <Icon
                icon="mdi:keyboard"
                width={16}
                height={16}
                className="inline mr-1"
              />
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-zinc-700 rounded text-xs">
                Esc
              </kbd>{" "}
              to close
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors font-medium"
            >
              Close Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoUrl: PropTypes.string.isRequired,
  exercise: PropTypes.shape({
    name: PropTypes.string,
    sets: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    reps: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // Add more fields as needed based on usage
  }),
};
