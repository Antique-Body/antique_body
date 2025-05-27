"use client";
import { Icon } from "@iconify/react";
import { memo, useEffect } from "react";

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
  }) => {
    // Handle ESC key press
    useEffect(() => {
      if (!isOpen) return;

      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleEscKey);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener("keydown", handleEscKey);
      };
    }, [isOpen, onClose]);

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
          return "max-w-3xl"; // Reduced from 4xl to 3xl
        case "small":
          return "max-w-sm"; // Reduced from md to sm
        default:
          return "max-w-xl"; // Reduced from 2xl to xl
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-[6px] p-2 sm:p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`animate-modalFadeIn relative w-full ${getMaxWidth()} max-h-[90vh] overflow-hidden rounded-xl border border-[#333] bg-[#121212]/95 shadow-2xl flex flex-col`}
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
          <div className="border-b border-[#333] p-4 sm:p-5">
            <h2 className="text-lg sm:text-xl font-bold text-white pr-6">
              {title}
            </h2>
          </div>

          {/* Modal content - with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-5">
              {message}
              {children}
            </div>
          </div>

          {/* Footer with action buttons */}
          {footerButtons && (
            <div
              className={`${
                footerBorder ? "border-t border-[#333]" : ""
              } p-4 sm:p-5 flex justify-end gap-2 bg-[#121212]/95`}
            >
              {secondaryButtonText && (
                <Button
                  variant="secondary"
                  onClick={secondaryButtonAction || onClose}
                  className="cursor-pointer rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300"
                >
                  {secondaryButtonText || cancelButtonText}
                </Button>
              )}

              <Button
                variant="orangeFilled"
                onClick={primaryButtonAction || onConfirm}
                disabled={primaryButtonDisabled}
                className={`cursor-pointer rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-all duration-300 ${
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
      </div>
    );
  }
);
