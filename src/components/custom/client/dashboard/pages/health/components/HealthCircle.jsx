import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";

export const HealthCircle = ({
    value = 0,
    maxValue = 100,
    size = 120,
    strokeWidth = 8,
    icon = null,
    label = "",
    gradientColors = ["#FF9500", "#FF2D55"],
    className = "",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressPercentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
    const offset = circumference - (progressPercentage / 100) * circumference;
    const gradientId = `gradient-${label.replace(/\s+/g, "")}-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate darker background color based on the first gradient color
    const getBgColor = () => {
        // Convert hex to rgba with low opacity
        const hexColor = gradientColors[0].replace("#", "");
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.15)`;
    };

    return (
        <motion.div
            className={`relative ${className}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {/* Background Circle */}
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={getBgColor()} strokeWidth={strokeWidth} />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gradientColors[0]} />
                        <stop offset="100%" stopColor={gradientColors[1]} />
                    </linearGradient>
                </defs>

                {/* Progress Circle with Animation */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.2))" }}
                />
            </svg>

            {/* Content inside circle with animation */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <motion.span
                    className={`${size > 120 ? "text-3xl" : "text-2xl"} font-bold text-white`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                >
                    {value}%
                </motion.span>
                {label && <span className="text-sm text-gray-300 mt-1">{label}</span>}
                {icon && (
                    <div className="mt-1">
                        <Icon icon={icon} className="text-white" width={16} height={16} />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export const MetricCard = ({ title, value, icon, gradientColors, className = "" }) => (
    <div
        className={`bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 ${className}`}
    >
        <div className="mb-2 text-gray-400 text-sm">{title}</div>
        <div className="flex items-center justify-between">
            <motion.span
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {value}
            </motion.span>
            {icon && (
                <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})` }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Icon icon={icon} className="text-white" width={20} height={20} />
                </motion.div>
            )}
        </div>
    </div>
);

export const HealthMetrics = ({ metrics = [], size = 100, className = "" }) => (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
        {metrics.map((metric, index) => (
            <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <HealthCircle
                    value={metric.value}
                    maxValue={100}
                    size={size}
                    strokeWidth={8}
                    gradientColors={metric.colors}
                    label={metric.label}
                />
            </motion.div>
        ))}
    </div>
);

export const MultiRingHealthCircle = ({
    size = 140,
    strokeWidth = 8,
    gapWidth = 3,
    centerValue = "",
    centerLabel = "",
    rings = [],
    className = "",
}) => {
    // Calculate spacing between rings
    const ringSpacing = strokeWidth + gapWidth;

    // Adaptivna veličina teksta na osnovu veličine kruga i dužine vrednosti
    const getValueTextSize = () => {
        if (size < 100) return "text-xl";
        if (size < 130) return "text-2xl";
        if (centerValue.toString().length > 2) return "text-2xl";
        return "text-3xl";
    };

    // Dinamična veličina unutrašnjeg kruga
    const innerCircleSize = Math.min(0.65, 0.6 + (centerValue.toString().length > 2 ? 0 : 0.05)) * size;

    return (
        <motion.div
            className={`relative ${className}`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {rings.map((ring, index) => {
                    const currentRadius = size / 2 - (index + 1) * ringSpacing + ringSpacing / 2;
                    const circumference = currentRadius * 2 * Math.PI;
                    const progressPercentage = Math.min(100, Math.max(0, (ring.value / 100) * 100));
                    const offset = circumference - (progressPercentage / 100) * circumference;
                    const gradientId = `multiRingGradient-${index}-${Math.random().toString(36).substring(2, 9)}`;

                    return (
                        <React.Fragment key={index}>
                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={ring.colors[0]} />
                                    <stop offset="100%" stopColor={ring.colors[1]} />
                                </linearGradient>
                                {/* Add a filter for glow effect */}
                                <filter id={`glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Background Circle */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={currentRadius}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth={strokeWidth}
                            />

                            {/* Progress Circle with Animation */}
                            <motion.circle
                                cx={size / 2}
                                cy={size / 2}
                                r={currentRadius}
                                fill="none"
                                stroke={`url(#${gradientId})`}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                                animate={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                                filter={`url(#glow-${index})`}
                            />
                        </React.Fragment>
                    );
                })}
            </svg>

            {/* Center Content with Animation */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <motion.div
                    className="bg-[#00000070] backdrop-blur-sm rounded-full flex flex-col items-center justify-center p-1"
                    style={{ width: innerCircleSize, height: innerCircleSize }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 1 }}
                >
                    <div className={`font-bold ${getValueTextSize()} text-white truncate max-w-[85%] text-center`}>
                        {centerValue}
                    </div>
                    {centerLabel && (
                        <div
                            className={`${size < 120 ? "text-[10px]" : "text-xs"} text-gray-300 mt-0.5 text-center truncate max-w-[90%]`}
                        >
                            {centerLabel}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Legend with Animation */}
            <motion.div
                className="mt-4 flex flex-wrap justify-around gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                {rings.map((ring, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(50, 50, 50, 0.5)" }}
                    >
                        <div
                            className="w-3 h-3 rounded-full mr-1.5"
                            style={{ background: `linear-gradient(to right, ${ring.colors[0]}, ${ring.colors[1]})` }}
                        />
                        <span className="text-xs text-gray-300">{ring.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};
