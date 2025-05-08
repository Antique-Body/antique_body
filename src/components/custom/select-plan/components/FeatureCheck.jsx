import { motion } from "framer-motion";
import React, { useState } from "react";

// Feature check component with enhanced effects
export const FeatureCheck = ({ feature, delay = 0, isPopular = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex items-start gap-3 py-1.5 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ x: 3 }}
        >
            <motion.div
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    backgroundColor: isHovered
                        ? isPopular
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.15)"
                        : isPopular
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                }}
                className={`flex-shrink-0 w-5 h-5 rounded-full border transition-all duration-300 ${
                    isPopular ? "border-[rgba(255,255,255,0.2)]" : "border-[rgba(255,255,255,0.2)]"
                } flex items-center justify-center mt-0.5 overflow-hidden relative`}
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isPopular ? (isHovered ? "#fff" : "#ccc") : isHovered ? "#fff" : "#999"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: 1,
                        opacity: 1,
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{
                        pathLength: { duration: 0.5, delay: delay + 0.2 },
                        opacity: { duration: 0.5, delay: delay + 0.2 },
                        scale: { duration: 0.2 },
                    }}
                >
                    <motion.polyline
                        points="20 6 9 17 4 12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: delay + 0.2 }}
                    />
                </motion.svg>

                {/* Radial glow effect on hover */}
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.8, scale: 1.5 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 rounded-full ${
                            isPopular ? "bg-[rgba(255,255,255,0.15)]" : "bg-[rgba(255,255,255,0.1)]"
                        } blur-[2px]`}
                    />
                )}
            </motion.div>
            <div className="flex-1">
                <motion.span
                    className={`text-sm transition-colors duration-300 ${
                        isHovered ? (isPopular ? "text-white" : "text-white") : isPopular ? "text-gray-200" : "text-gray-400"
                    }`}
                    animate={{
                        x: isHovered ? 2 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {feature}
                </motion.span>
            </div>
        </motion.div>
    );
};
