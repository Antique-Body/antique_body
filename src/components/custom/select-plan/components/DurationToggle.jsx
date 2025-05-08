import { motion } from "framer-motion";
import React from "react";

// Duration toggle component with glass effect
export const DurationToggle = ({ duration, setDuration }) => (
    <div className="inline-flex items-center bg-[rgba(20,20,20,0.6)] backdrop-blur-md rounded-xl p-1 relative mb-8 border border-[rgba(255,255,255,0.06)] shadow-xl shadow-black/10 hover:shadow-[0_0_25px_rgba(255,107,0,0.2)] transition-shadow duration-300">
        <button
            onClick={() => setDuration("monthly")}
            className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                duration === "monthly" ? "text-white" : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
        >
            Monthly
        </button>
        <button
            onClick={() => setDuration("yearly")}
            className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                duration === "yearly" ? "text-white pr-8" : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
        >
            Yearly
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white hover:shadow-[0_0_10px_rgba(255,107,0,0.5)] transition-shadow">
                SAVE 20%
            </div>
        </button>
        <motion.div
            layout
            className={`absolute top-1 ${
                duration === "monthly" ? "left-1" : "left-[calc(50%-0.25rem)]"
            } bottom-1 w-[calc(50%-0.5rem)] ${
                duration === "yearly" ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]" : "bg-[#333]"
            } rounded-lg transition-all duration-500 ease-out`}
        >
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent"></div>

            {/* Subtle animated glow effect */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                    boxShadow: [
                        "inset 0 0 5px rgba(255, 255, 255, 0.2)",
                        "inset 0 0 12px rgba(255, 255, 255, 0.3)",
                        "inset 0 0 5px rgba(255, 255, 255, 0.2)",
                    ],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            />

            {/* Subtle shine effect */}
            <motion.div
                className="absolute inset-0 overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="absolute top-0 -right-full w-24 h-full transform rotate-12 translate-x-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{ translateX: ["0%", "200%"] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                        repeatDelay: 4,
                    }}
                />
            </motion.div>
        </motion.div>
    </div>
);
