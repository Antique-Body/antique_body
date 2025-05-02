export const StepContainer = ({ currentStep, stepNumber, title, emoji, children }) => (
  <div
    className={`${currentStep === stepNumber ? "block" : "hidden"} w-full animate-[fadeIn_0.5s_ease] cursor-pointer`}
  >
    <div className="mb-8 w-full">
      <div className="mb-4 flex items-center justify-center gap-2 text-center text-xl font-semibold">
        <span>{emoji}</span> {title}
      </div>
      {children}
    </div>
  </div>
);
