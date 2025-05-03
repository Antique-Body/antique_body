import { CheckIcon } from "@/components/common/Icons";
import { useEffect, useState } from "react";

export const CompletionAnimation = ({ isVisible }) => {
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      // Reset animation step when becoming visible
      setAnimationStep(0);
      
      // Sequence the animation steps
      const timer1 = setTimeout(() => setAnimationStep(1), 400);
      const timer2 = setTimeout(() => setAnimationStep(2), 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] opacity-0 animate-pulse-ring"></div>
        
        {/* Middle pulsing ring */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FFC107] opacity-0 animate-pulse-ring animation-delay-150"></div>
        
        {/* Inner circle with success icon */}
        <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-[#111] transform transition-all duration-500 ${animationStep >= 1 ? 'scale-100' : 'scale-0'}`}>
          <div className={`transform transition-all duration-300 ${animationStep >= 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <CheckIcon size={48} className="text-[#FF6B00]" />
          </div>
        </div>
        
        {/* Text that appears after icon */}
        <div className={`absolute top-32 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-center text-xl font-bold text-white whitespace-nowrap">Workout Complete!</p>
        </div>
      </div>
    </div>
  );
}; 