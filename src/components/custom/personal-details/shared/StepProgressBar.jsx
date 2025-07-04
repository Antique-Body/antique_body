"use client";
import { Icon } from "@iconify/react";

/**
 * Reusable Step Progress Bar Component
 * Optimized for mobile screens with responsive design
 */
export const StepProgressBar = ({ steps, currentStep, className = "" }) => (
  <div className={`mb-4 sm:mb-6 ${className}`}>
    {/* Progress Card */}
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-r from-zinc-900/40 to-zinc-900/30 backdrop-blur-sm p-2 sm:p-4 lg:p-6">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/3 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Step Icons - Hidden on Mobile, Visible on Larger Screens */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="flex items-center justify-between w-full px-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle with Icon - Clean Design */}
                <div className="relative flex flex-col items-center flex-1">
                  {/* Main step circle */}
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      index + 1 === currentStep
                        ? "border-[#FF6B00] bg-[#FF6B00]/10"
                        : index + 1 < currentStep
                        ? "border-[#FF6B00] bg-[#FF6B00]"
                        : "border-zinc-600 bg-zinc-800/50"
                    }`}
                  >
                    {/* Icon */}
                    {index + 1 < currentStep ? (
                      <Icon
                        icon="mdi:check"
                        className="w-4 h-4 lg:w-5 lg:h-5 text-white"
                      />
                    ) : (
                      <Icon
                        icon={step.icon}
                        className={`w-4 h-4 lg:w-5 lg:h-5 ${
                          index + 1 === currentStep
                            ? "text-[#FF6B00]"
                            : index + 1 < currentStep
                            ? "text-white"
                            : "text-zinc-400"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Number Badge */}
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-4 h-4 lg:w-5 lg:h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      index + 1 === currentStep
                        ? "bg-[#FF6B00] text-white"
                        : index + 1 < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-zinc-600 text-zinc-300"
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center w-full">
                    <p
                      className={`text-sm font-medium leading-tight ${
                        index + 1 === currentStep
                          ? "text-white"
                          : index + 1 < currentStep
                          ? "text-zinc-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {/* Improved Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 relative mx-2 lg:mx-4 flex items-center">
                    {/* Main connection line */}
                    <div
                      className={`h-0.5 w-6 lg:w-8 rounded-full transition-all duration-500 ${
                        index + 1 < currentStep
                          ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00]"
                          : "bg-zinc-700"
                      }`}
                    />

                    {/* Simple animated progress for active connection */}
                    {index + 1 === currentStep && (
                      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden rounded-full">
                        <div className="h-full w-4 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Info - Ultra Compact */}
        <div className="mt-2 sm:mt-4 text-center flex flex-col sm:hidden">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1">
            {steps[currentStep - 1]?.title}
          </h2>
          {steps[currentStep - 1]?.subtitle && (
            <p className="text-xs sm:text-sm lg:text-base text-zinc-400">
              {steps[currentStep - 1].subtitle}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-2 sm:mt-4 flex flex-col sm:hidden p-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1 sm:mb-2">
            <span>
              Step {currentStep} of {steps.length}
            </span>
            <span>
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1 sm:h-1.5 lg:h-2">
            <div
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom accent border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent" />
    </div>
  </div>
);
