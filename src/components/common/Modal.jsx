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
          return "w-full max-w-4xl mx-4 sm:mx-auto"; // Responsive width for large modals
        case "small":
          return "w-full max-w-sm mx-4 sm:mx-auto"; // Responsive width for small modals
        default:
          return "w-full max-w-xl mx-4 sm:mx-auto"; // Responsive width for default modals
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
          className={`animate-modalFadeIn relative max-h-screen sm:max-h-[90vh] rounded-none sm:rounded-xl border-0 sm:border border-[#333] bg-[#121212]/95 shadow-2xl flex flex-col ${getMaxWidth()}`}
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
          <div className="border-b border-[#333] p-4 sm:p-6 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-white pr-6">
              {title}
            </h2>
          </div>

          {/* Modal content - with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="mb-4">{message}</div>
              {children}
            </div>
          </div>

          {/* Footer with action buttons */}
          {footerButtons && (
            <div
              className={`flex-shrink-0${
                footerBorder ? " border-t border-[#333]" : ""
              } p-4 sm:p-6 flex flex-col sm:flex-row justify-end gap-3 bg-[#121212]/95`}
            >
              {secondaryButtonText && (
                <Button
                  variant="secondary"
                  onClick={secondaryButtonAction || onClose}
                  className="cursor-pointer rounded-lg px-4 sm:px-6 py-3 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 w-full sm:w-auto order-2 sm:order-1 min-h-[44px] sm:min-h-[40px]"
                >
                  {secondaryButtonText || cancelButtonText}
                </Button>
              )}

              <Button
                variant="orangeFilled"
                onClick={() => {
                  if (primaryButtonAction) {
                    primaryButtonAction();
                  } else if (onConfirm) {
                    onConfirm();
                  }
                  // else do nothing
                }}
                disabled={primaryButtonDisabled}
                className={`cursor-pointer rounded-lg px-4 sm:px-6 py-3 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 w-full sm:w-auto order-1 sm:order-2 min-h-[44px] sm:min-h-[40px] ${
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
