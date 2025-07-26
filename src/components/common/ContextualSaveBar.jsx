import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ContextualSaveBar({
  visible,
  onSave,
  onDiscard,
  isShaking,
  isSaving,
  message = "You have unsaved changes",
}) {
  const router = useRouter();
  const [isInternalShaking, setIsInternalShaking] = useState(false);

  // Block navigation when SaveBar is visible
  useEffect(() => {
    if (!visible) return;

    // Block browser back/forward
    const handlePopState = (event) => {
      event.preventDefault();
      event.stopPropagation();
      triggerShake();
      // Push the current state back to prevent navigation
      window.history.pushState(null, "", window.location.href);
    };

    // Block beforeunload (page refresh, close tab)
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    // Add initial history state to detect back button
    window.history.pushState(null, "", window.location.href);

    // Add event listeners
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Intercept all Link clicks and router.push calls
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Override router methods
    router.push = (..._args) => {
      triggerShake();
      return Promise.resolve(false);
    };

    router.replace = (..._args) => {
      triggerShake();
      return Promise.resolve(false);
    };

    router.back = () => {
      triggerShake();
    };

    router.forward = () => {
      triggerShake();
    };

    // Intercept all clicks on links
    const handleLinkClick = (event) => {
      const target = event.target.closest("a[href], button[data-href]");
      if (target) {
        const href =
          target.getAttribute("href") || target.getAttribute("data-href");
        if (href && href !== window.location.pathname) {
          event.preventDefault();
          event.stopPropagation();
          triggerShake();
        }
      }
    };

    // Add click listener to document
    document.addEventListener("click", handleLinkClick, true);

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);

      // Restore original router methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [visible, router]);

  // Trigger shake animation
  const triggerShake = () => {
    setIsInternalShaking(true);
    setTimeout(() => setIsInternalShaking(false), 800);
  };

  // Use either external or internal shaking state
  const shouldShake = isShaking || isInternalShaking;

  if (!visible) return null;

  return (
    <div
      className={`sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-xl border-b border-orange-500/50 backdrop-blur-lg overflow-hidden transition-all duration-500 ${
        shouldShake ? "animate-shake" : ""
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 animate-pulse" />

      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse" />

      {/* Saving overlay animation */}
      {isSaving && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-blue-600/90 to-purple-600/90 flex items-center justify-center z-10 animate-pulse backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white">
            <div className="relative">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-white/50 rounded-full animate-ping"></div>
            </div>
            <span className="font-bold text-lg">Saving changes...</span>
          </div>
        </div>
      )}

      {/* Content with padding for sticky positioning */}
      <div className="relative flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Left side - Warning message */}
        <div className="flex items-center gap-4">
          {/* Animated warning icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping" />
            <div className="relative bg-yellow-500 rounded-full p-2.5 shadow-lg">
              <Icon
                icon="mdi:content-save-alert"
                width={20}
                height={20}
                className="text-white animate-pulse"
              />
            </div>
          </div>

          {/* Message with enhanced typography */}
          <div>
            <div className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
              {message}
            </div>
            <div className="text-yellow-100/90 text-sm font-medium">
              Save your changes or they will be lost
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          {/* Discard button */}
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="group relative px-5 py-2.5 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:close-circle"
                width={16}
                height={16}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span>Discard</span>
            </div>
          </button>

          {/* Enhanced Save button with animation */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={`group relative px-6 py-2.5 font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 disabled:cursor-not-allowed ${
              isSaving
                ? "bg-green-500 text-white border-green-400 animate-pulse"
                : "bg-white hover:bg-gray-100 text-gray-900 border-white/20"
            }`}
          >
            <div className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon
                    icon="mdi:content-save"
                    width={16}
                    height={16}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span>Save Changes</span>
                </>
              )}
            </div>
            {/* Enhanced shine effect */}
            {!isSaving && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine rounded-lg" />
            )}
            {/* Success ripple effect */}
            <div className="absolute inset-0 bg-green-400/20 rounded-lg opacity-0 group-active:opacity-100 group-active:animate-ping pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Enhanced bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className={`h-full transition-all duration-500 ${
            isSaving
              ? "bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"
              : "bg-gradient-to-r from-yellow-400 to-white animate-pulse"
          }`}
          style={{ width: "100%" }}
        />
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          10% {
            transform: translateX(-6px) rotate(-0.3deg) scale(1.02);
          }
          20% {
            transform: translateX(6px) rotate(0.3deg) scale(1.02);
          }
          30% {
            transform: translateX(-4px) rotate(-0.2deg) scale(1.01);
          }
          40% {
            transform: translateX(4px) rotate(0.2deg) scale(1.01);
          }
          50% {
            transform: translateX(-3px) rotate(-0.1deg) scale(1.01);
          }
          60% {
            transform: translateX(3px) rotate(0.1deg) scale(1.01);
          }
          70% {
            transform: translateX(-2px) scale(1.005);
          }
          80% {
            transform: translateX(2px) scale(1.005);
          }
          90% {
            transform: translateX(-1px) scale(1.002);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes saveSuccess {
          0% {
            transform: scale(1);
            background-color: rgb(34, 197, 94);
          }
          50% {
            transform: scale(1.05);
            background-color: rgb(16, 185, 129);
          }
          100% {
            transform: scale(1);
            background-color: rgb(34, 197, 94);
          }
        }

        .animate-shake {
          animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .animate-shine {
          animation: shine 0.6s ease-out;
        }

        .animate-save-success {
          animation: saveSuccess 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
