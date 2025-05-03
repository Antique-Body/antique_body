import { CheckIcon } from "@/components/common/Icons";

export const CompletionAnimation = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative">
        <div className="animate-ping-slow absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] opacity-75"></div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#111]">
          <CheckIcon size={40} className="text-[#FF6B00]" />
        </div>
      </div>
    </div>
  );
}; 