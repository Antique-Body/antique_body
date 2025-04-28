"use client";
import { Button } from "@/components/common/Button";
import {
  CloseIcon,
  GreekPatternBorder,
  IconButton,
  VaseIcon,
} from "@/components/common/Icons";
import { memo } from "react";

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
  icon = "vase",
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
          <VaseIcon className="h-16 w-16 text-orange-500 opacitqy-20" />
        </div>
        {/* Close button */}
        <IconButton
          icon={CloseIcon}
          onClick={onClose}
          className="absolute top-4 right-4 z-20"
          aria-label="Close"
        />
        {/* Modal content */}
        <div className="p-8 pt-10">
          <h3 className="text-3xl font-bold spartacus-font tracking-wide text-orange-500 mb-6">
            {title}
          </h3>
          <div className="border-l-2 border-orange-500/30 pl-6 mb-8">
            <p className="text-zinc-300 text-lg">{message}</p>
          </div>
          {/* Action buttons - only show if showButtons is true */}
          {showButtons && (
            <div className="flex gap-4 justify-end mt-10">
              <Button variant="modalCancel" onClick={onClose} className="py-3">
                {cancelButtonText}
              </Button>
              <Button
                variant="modalConfirm"
                onClick={onConfirm}
                className="py-3">
                {confirmButtonText}
              </Button>
            </div>
          )}
        </div>
        <GreekPatternBorder position="bottom" isVisible={true} />
      </div>
    </div>
  );
};
export default memo(Modal);
