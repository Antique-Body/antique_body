// components/custom/ConfirmationModal.jsx
"use client";

import { memo } from "react";
import { VaseIcon, GreekPatternBorder } from "@/components/common/Icons";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor = "bg-orange-500 hover:bg-orange-600",
  showButtons = true,
  icon = "vase"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur backdrop-filter bg-zinc-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl shadow-2xl max-w-xl w-full relative overflow-hidden border border-zinc-700">
        <GreekPatternBorder isVisible={true} />
        
        {/* Glow effect behind modal */}
        <div className="absolute inset-0 -z-10 bg-orange-500 opacity-5 blur-xl rounded-xl"></div>
        
        {/* Icon */}
        <div className="absolute top-8 right-8">
          <VaseIcon className="h-16 w-16 text-orange-500 opacity-20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-orange-500 z-20 cursor-pointer p-2 rounded-full hover:bg-zinc-700/30"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal content */}
        <div className="p-8 pt-10">
          <h3 className="text-3xl font-bold spartacus-font tracking-wide text-orange-500 mb-6">{title}</h3>
          <div className="border-l-2 border-orange-500/30 pl-6 mb-8">
            <p className="text-zinc-300 text-lg">{message}</p>
          </div>

          {/* Action buttons - only show if showButtons is true */}
          {showButtons && (
            <div className="flex gap-4 justify-end mt-10">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 cursor-pointer"
              >
                {cancelButtonText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-6 py-3 rounded-md text-white ${confirmButtonColor} shadow-lg shadow-orange-500/20 cursor-pointer`}
              >
                {confirmButtonText}
              </button>
            </div>
          )}
        </div>
        
        <GreekPatternBorder position="bottom" isVisible={true} />
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Modal);