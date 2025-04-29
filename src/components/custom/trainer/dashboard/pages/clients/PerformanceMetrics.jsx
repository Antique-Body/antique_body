"use client";

import { ProgressBar } from "@/components/common";
import { useMemo } from "react";

// Sport-specific metrics configuration
const sportMetricsConfig = {
    gym: {
        strengthTraining: [
            { id: "benchPress", label: "Bench Press", unit: "kg", color: "bg-blue-500" },
            { id: "squat", label: "Squat", unit: "kg", color: "bg-green-500" },
            { id: "deadlift", label: "Deadlift", unit: "kg", color: "bg-red-500" },
            { id: "overheadPress", label: "Overhead Press", unit: "kg", color: "bg-purple-500" },
            { id: "pullUps", label: "Pull-ups", unit: "reps", color: "bg-yellow-500" },
        ],
        fatLoss: [
            { id: "cardio", label: "Cardio", unit: "min", color: "bg-green-500" },
            { id: "caloriesBurned", label: "Calories Burned", unit: "", color: "bg-red-500" },
            { id: "hiitWorkouts", label: "HIIT Workouts", unit: "sessions", color: "bg-orange-500" },
        ],
        endurance: [
            { id: "runningDistance", label: "Running Distance", unit: "km", color: "bg-blue-500" },
            { id: "runningTime", label: "Running Time", unit: "min", color: "bg-green-500" },
            { id: "cyclingDistance", label: "Cycling Distance", unit: "km", color: "bg-purple-500" },
        ],
    },
    football: [
        { id: "sprint", label: "Sprint", unit: "s", color: "bg-blue-500", lowerIsBetter: true },
        { id: "agility", label: "Agility", unit: "s", color: "bg-green-500", lowerIsBetter: true },
        { id: "kickAccuracy", label: "Kick Accuracy", unit: "%", color: "bg-yellow-500" },
        { id: "passing", label: "Passing", unit: "%", color: "bg-purple-500" },
        { id: "stamina", label: "Stamina", unit: "min", color: "bg-red-500" },
    ],
    basketball: [
        { id: "verticalJump", label: "Vertical Jump", unit: "cm", color: "bg-blue-500" },
        { id: "shootingAccuracy", label: "Shooting", unit: "%", color: "bg-green-500" },
        { id: "sprint", label: "Sprint", unit: "s", color: "bg-red-500", lowerIsBetter: true },
        { id: "agility", label: "Agility", unit: "s", color: "bg-purple-500", lowerIsBetter: true },
        { id: "stamina", label: "Stamina", unit: "min", color: "bg-yellow-500" },
    ],
    athletics: [
        { id: "sprintTime", label: "Sprint Time", unit: "s", color: "bg-blue-500", lowerIsBetter: true },
        { id: "jumpDistance", label: "Jump Distance", unit: "m", color: "bg-green-500" },
        { id: "throwDistance", label: "Throw Distance", unit: "m", color: "bg-red-500" },
        { id: "endurance", label: "Endurance", unit: "min", color: "bg-purple-500" },
    ],
    swimming: [
        { id: "freestyle50m", label: "Freestyle 50m", unit: "s", color: "bg-blue-500", lowerIsBetter: true },
        { id: "breaststroke50m", label: "Breaststroke 50m", unit: "s", color: "bg-green-500", lowerIsBetter: true },
        { id: "backstroke50m", label: "Backstroke 50m", unit: "s", color: "bg-red-500", lowerIsBetter: true },
        { id: "butterfly50m", label: "Butterfly 50m", unit: "s", color: "bg-purple-500", lowerIsBetter: true },
        { id: "endurance", label: "Endurance", unit: "min", color: "bg-yellow-500" },
    ],
    tennis: [
        { id: "serveSpeed", label: "Serve Speed", unit: "km/h", color: "bg-blue-500" },
        { id: "forehandAccuracy", label: "Forehand Accuracy", unit: "%", color: "bg-green-500" },
        { id: "backhandAccuracy", label: "Backhand Accuracy", unit: "%", color: "bg-red-500" },
        { id: "agility", label: "Agility", unit: "s", color: "bg-purple-500", lowerIsBetter: true },
        { id: "stamina", label: "Stamina", unit: "min", color: "bg-yellow-500" },
    ],
    // Add more sports as needed
};

export const PerformanceMetrics = ({ clientType, clientGoal, progress = [], onMetricAdd }) => {
    // Get the appropriate metrics based on client type and goal
    const metrics = useMemo(() => {
        if (clientType === "gym") {
            if (clientGoal === "Build Muscle" || clientGoal === "Strength") {
                return sportMetricsConfig.gym.strengthTraining;
            } else if (clientGoal === "Fat Loss" || clientGoal === "Weight Loss") {
                return sportMetricsConfig.gym.fatLoss;
            } else if (clientGoal === "Endurance") {
                return sportMetricsConfig.gym.endurance;
            }
            // Default to strength if no specific goal matches
            return sportMetricsConfig.gym.strengthTraining;
        } else if (clientType === "athlete") {
            // For athlete, use the sport-specific metrics
            return sportMetricsConfig[clientGoal?.toLowerCase()] || sportMetricsConfig.football;
        } else {
            // Sport-specific (directly use the sport name)
            return sportMetricsConfig[clientType] || sportMetricsConfig.gym.strengthTraining;
        }
    }, [clientType, clientGoal]);

    // Get latest and initial values for progress metrics
    const getMetricProgress = metricId => {
        if (progress.length < 2) return null;

        const latest = progress[progress.length - 1][metricId];
        const initial = progress[0][metricId];

        if (latest === undefined || initial === undefined) return null;

        return {
            latest,
            initial,
            change: latest - initial,
            percentChange: ((latest - initial) / initial) * 100,
        };
    };

    // Sort metrics to show those with data first
    const sortedMetrics = useMemo(() => {
        return [...metrics].sort((a, b) => {
            const aHasData = progress.some(entry => entry[a.id] !== undefined);
            const bHasData = progress.some(entry => entry[b.id] !== undefined);

            if (aHasData && !bHasData) return -1;
            if (!aHasData && bHasData) return 1;
            return 0;
        });
    }, [metrics, progress]);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Performance Metrics</h3>

            {progress.length < 2 ? (
                <p className="text-gray-400 text-sm">Add at least two entries to see progress metrics</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {sortedMetrics.map(metric => {
                        const progressData = getMetricProgress(metric.id);

                        if (!progressData) return null;

                        const isPositive = metric.lowerIsBetter ? progressData.change < 0 : progressData.change > 0;

                        return (
                            <div key={metric.id} className="bg-[rgba(30,30,30,0.8)] p-4 rounded-lg border border-[#333]">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{metric.label}</h4>
                                    <div
                                        className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"} flex items-center`}
                                    >
                                        {isPositive ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-2 5a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H11a1 1 0 01-1-1v-1zm-6-2a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zm0 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 11a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1zm6-4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM5 7a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V7zm0 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                        {Math.abs(progressData.percentChange).toFixed(1)}%
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-1 text-sm">
                                    <span>
                                        Initial: {progressData.initial}
                                        {metric.unit}
                                    </span>
                                    <span>
                                        Current: {progressData.latest}
                                        {metric.unit}
                                    </span>
                                </div>

                                <ProgressBar
                                    value={metric.lowerIsBetter ? progressData.initial : progressData.latest}
                                    maxValue={metric.lowerIsBetter ? progressData.latest : progressData.initial}
                                    color={isPositive ? "bg-green-500" : "bg-red-500"}
                                    showValues={false}
                                />

                                <div className="text-xs text-gray-400 mt-2">
                                    {isPositive
                                        ? `Improved by ${Math.abs(progressData.change).toFixed(1)}${metric.unit}`
                                        : `Decreased by ${Math.abs(progressData.change).toFixed(1)}${metric.unit}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add metrics section */}
            {onMetricAdd && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Track Additional Metrics</h4>
                    <div className="flex flex-wrap gap-2">
                        {sortedMetrics
                            .filter(metric => !progress.some(entry => entry[metric.id] !== undefined))
                            .map(metric => (
                                <button
                                    key={metric.id}
                                    onClick={() => onMetricAdd(metric.id)}
                                    className="px-3 py-1 bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg text-sm hover:border-[#FF6B00] transition-colors"
                                >
                                    + {metric.label}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};
