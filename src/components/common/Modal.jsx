"use client";
import { Icon } from "@iconify/react";
import { memo, useEffect } from "react";
import ReactDOM from "react-dom";

import { Button } from "@/components/common/Button";

export const Modal = memo(
  ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    children,
    footerButtons = true,
    primaryButtonAction,
    secondaryButtonAction,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonDisabled = false,
    footerBorder = true,
    size = "default", // default, large, small
    isNested = false, // New prop to handle nested modals
  }) => {
    // Handle ESC key press and body scroll lock
    useEffect(() => {
      if (!isOpen) return;

      // Lock body scroll when modal is open (only for the first modal)
      let originalStyle;
      if (!isNested) {
        originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
      }

      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          // For nested modals, we let the child handle ESC first
          if (!isNested) {
            onClose();
          }
        }
      };

      window.addEventListener("keydown", handleEscKey);

      // Cleanup function to remove event listener and restore scroll
      return () => {
        if (!isNested && originalStyle) {
          document.body.style.overflow = originalStyle;
        }
        window.removeEventListener("keydown", handleEscKey);
      };
    }, [isOpen, onClose, isNested]);

    if (!isOpen) return null;

    // Handle backdrop click to close modal
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    // Determine max width based on size prop
    const getMaxWidth = () => {
      switch (size) {
        case "large":
          return "sm:max-w-3xl"; // Only apply on sm+ screens
        case "small":
          return "sm:max-w-sm"; // Only apply on sm+ screens
        default:
          return "sm:max-w-xl"; // Only apply on sm+ screens
      }
    };

    // Determine z-index based on whether it's nested
    const zIndexClass = isNested ? "z-[60]" : "z-50";

    return ReactDOM.createPortal(
      <div
        className={`fixed inset-0 ${zIndexClass} flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-0 sm:p-4`}
        onClick={handleBackdropClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        <div
          className={`animate-modalFadeIn relative w-full sm:w-auto max-h-screen sm:max-h-[90vh] sm:rounded-xl border-0 sm:border border-[#333] bg-[#121212]/95 shadow-2xl flex flex-col ${getMaxWidth()}`}
          style={{
            animation: "modalFadeIn 0.3s ease-out",
            boxShadow: "0 15px 40px -10px rgba(255,107,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Orange accent line at top */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>

          {/* Close button */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 p-0 text-gray-400 transition-colors duration-200 hover:text-white"
          >
            <Icon icon="mdi:close" width="20" height="20" />
          </Button>

          {/* Modal header */}
          <div className="border-b border-[#333] p-4 sm:p-5 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-white pr-6">
              {title}
            </h2>
          </div>

          {/* Modal content - with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-5">
              <div className="mb-4">{message}</div>
              {children}
            </div>
          </div>

          {/* Footer with action buttons */}
          {footerButtons && (
            <div
              className={`flex-shrink-0${
                footerBorder ? " border-t border-[#333]" : ""
              } p-4 sm:p-5 flex flex-col sm:flex-row justify-end gap-2 bg-[#121212]/95`}
            >
              {secondaryButtonText && (
                <Button
                  variant="secondary"
                  onClick={secondaryButtonAction || onClose}
                  className="cursor-pointer rounded-lg px-4 sm:px-6 py-3 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 w-full sm:w-auto order-2 sm:order-1"
                >
                  {secondaryButtonText || cancelButtonText}
                </Button>
              )}

              <Button
                variant="orangeFilled"
                onClick={() => {
                  (primaryButtonAction || onConfirm)();
                }}
                disabled={primaryButtonDisabled}
                className={`cursor-pointer rounded-lg px-4 sm:px-6 py-3 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 w-full sm:w-auto order-1 sm:order-2 ${
                  primaryButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:-translate-y-0.5"
                }`}
              >
                {primaryButtonText || confirmButtonText}
              </Button>
            </div>
          )}
        </div>
      </div>,
      typeof window !== "undefined" ? document.body : null
    );
  }
);
