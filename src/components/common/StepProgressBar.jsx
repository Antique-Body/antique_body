"use client";
import React from "react";

export const StepProgressBar = ({ currentStep, totalSteps, className = "", label = "Profile Setup" }) => {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-medium">
                    {currentStep}/{totalSteps}
                </span>
            </div>
            <div className="w-full bg-[#333] rounded-full h-2.5">
                <div
                    className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
