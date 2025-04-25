export const StepContainer = ({
  currentStep,
  stepNumber,
  title,
  emoji,
  children,
}) => {
  return (
    <div
      className={`${
        currentStep === stepNumber ? "block" : "hidden"
      } w-full animate-[fadeIn_0.5s_ease] cursor-pointer`}>
      <div className="mb-8 w-full">
        <div className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-center">
          <span>{emoji}</span> {title}
        </div>
        {children}
      </div>
    </div>
  );
};
