"use client";
import { Button } from "@/components/common/Button";
import { CloseIcon, GreekPatternBorder, IconButton, VaseIcon } from "@/components/common/Icons";

export const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  showButtons = true,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur backdrop-filter">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl">
        <GreekPatternBorder isVisible={true} />
        {/* Glow effect behind modal */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-orange-500 opacity-5 blur-xl"></div>
        {/* Icon */}
        <div className="absolute right-8 top-8">
          <VaseIcon className="opacitqy-20 h-16 w-16 text-orange-500" />
        </div>
        {/* Close button */}
        <IconButton icon={CloseIcon} onClick={onClose} className="absolute right-4 top-4 z-20" aria-label="Close" />
        {/* Modal content */}
        <div className="p-8 pt-10">
          <h3 className="spartacus-font mb-6 text-3xl font-bold tracking-wide text-orange-500">{title}</h3>
          <div className="mb-8 border-l-2 border-orange-500/30 pl-6">
            <p className="text-lg text-zinc-300">{message}</p>
          </div>
          {/* Action buttons - only show if showButtons is true */}
          {showButtons && (
            <div className="mt-10 flex justify-end gap-4">
              <Button variant="modalCancel" onClick={onClose} className="py-3">
                {cancelButtonText}
              </Button>
              <Button variant="modalConfirm" onClick={onConfirm} className="py-3">
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
