import { motion } from "framer-motion";
import React from "react";

// Background elements for visual effects with enhanced animations
export const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#111]"></div>

        {/* Animated background gradients with motion */}
        <motion.div
            className="absolute top-0 right-0 w-full h-full"
            animate={{
                opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        >
            <motion.div
                className="absolute top-[-10%] right-[-10%] w-[70%] h-[60%] rounded-full bg-gradient-to-r from-[rgba(255,107,0,0.03)] to-[rgba(255,154,0,0.03)] blur-[150px]"
                animate={{
                    scale: [1, 1.05, 1],
                    x: [0, 10, 0],
                    y: [0, -10, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
            />
        </motion.div>
        <motion.div
            className="absolute bottom-0 left-0 w-full h-full"
            animate={{
                opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1 }}
        >
            <motion.div
                className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[60%] rounded-full bg-gradient-to-r from-[rgba(255,107,0,0.04)] to-[rgba(255,154,0,0.02)] blur-[150px]"
                animate={{
                    scale: [1, 1.08, 1],
                    x: [0, -10, 0],
                    y: [0, 10, 0],
                }}
                transition={{ duration: 9, repeat: Infinity, repeatType: "mirror" }}
            />
        </motion.div>

        {/* Subtle grid pattern with parallax effect */}
        <motion.div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"
            animate={{
                backgroundPosition: ["0% 0%", "1% 1%", "0% 0%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated particles with enhanced motion */}
        <div className="absolute inset-0">
            <motion.div
                className="absolute top-[10%] left-[20%] w-2 h-2 bg-[#FF6B00] rounded-full opacity-60 blur-[1px]"
                animate={{
                    opacity: [0.6, 0.8, 0.6],
                    scale: [1, 1.2, 1],
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 0 5px 0 rgba(255,107,0,0.3)",
                        "0 0 10px 0 rgba(255,107,0,0.5)",
                        "0 0 5px 0 rgba(255,107,0,0.3)",
                    ],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
                className="absolute top-[25%] left-[40%] w-1.5 h-1.5 bg-[#FF9A00] rounded-full opacity-40 blur-[1px]"
                animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1, 1.3, 1],
                    y: [0, -8, 0],
                    boxShadow: [
                        "0 0 3px 0 rgba(255,154,0,0.2)",
                        "0 0 8px 0 rgba(255,154,0,0.4)",
                        "0 0 3px 0 rgba(255,154,0,0.2)",
                    ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, repeatType: "mirror", delay: 0.7 }}
            />
            <motion.div
                className="absolute top-[15%] right-[30%] w-2 h-2 bg-white rounded-full opacity-30 blur-[1px]"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.2, 1],
                    y: [0, -12, 0],
                    boxShadow: [
                        "0 0 3px 0 rgba(255,255,255,0.2)",
                        "0 0 8px 0 rgba(255,255,255,0.4)",
                        "0 0 3px 0 rgba(255,255,255,0.2)",
                    ],
                }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1.3 }}
            />
            <motion.div
                className="absolute top-[70%] left-[25%] w-2 h-2 bg-[#FF6B00] rounded-full opacity-40 blur-[1px]"
                animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.3, 1],
                    y: [0, -15, 0],
                    boxShadow: [
                        "0 0 4px 0 rgba(255,107,0,0.3)",
                        "0 0 9px 0 rgba(255,107,0,0.5)",
                        "0 0 4px 0 rgba(255,107,0,0.3)",
                    ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, repeatType: "mirror", delay: 0.9 }}
            />
            <motion.div
                className="absolute top-[60%] right-[20%] w-1.5 h-1.5 bg-white rounded-full opacity-30 blur-[1px]"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.2, 1],
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 0 3px 0 rgba(255,255,255,0.2)",
                        "0 0 7px 0 rgba(255,255,255,0.3)",
                        "0 0 3px 0 rgba(255,255,255,0.2)",
                    ],
                }}
                transition={{ duration: 3.8, repeat: Infinity, repeatType: "mirror", delay: 1.7 }}
            />
            <motion.div
                className="absolute top-[80%] right-[35%] w-2 h-2 bg-[#FF9A00] rounded-full opacity-40 blur-[1px]"
                animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1, 1.3, 1],
                    y: [0, -12, 0],
                    boxShadow: [
                        "0 0 4px 0 rgba(255,154,0,0.2)",
                        "0 0 8px 0 rgba(255,154,0,0.4)",
                        "0 0 4px 0 rgba(255,154,0,0.2)",
                    ],
                }}
                transition={{ duration: 4.2, repeat: Infinity, repeatType: "mirror", delay: 2.1 }}
            />
        </div>

        {/* Enhanced cosmic dust */}
        <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[1px] h-[1px] bg-white rounded-full"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5,
                    }}
                    animate={{
                        opacity: [Math.random() * 0.3, Math.random() * 0.7, Math.random() * 0.3],
                        boxShadow: [
                            "0 0 2px rgba(255, 255, 255, 0.3)",
                            "0 0 3px rgba(255, 255, 255, 0.7)",
                            "0 0 2px rgba(255, 255, 255, 0.3)",
                        ],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 4,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>

        {/* Animated border accents */}
        <motion.div
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.15)] to-transparent"
            animate={{
                backgroundPosition: ["200% 0", "-200% 0", "200% 0"],
                opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
            className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.15)] to-transparent"
            animate={{
                backgroundPosition: ["-200% 0", "200% 0", "-200% 0"],
                opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Enhanced geometric accent shapes */}
        <motion.div
            className="absolute top-20 left-10 w-40 h-40 border-[1px] border-[rgba(255,107,0,0.1)] rounded-full transform rotate-45"
            animate={{
                rotate: [45, 55, 45],
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.2, 0.1],
                boxShadow: [
                    "0 0 30px rgba(255, 107, 0, 0.03) inset",
                    "0 0 40px rgba(255, 107, 0, 0.06) inset",
                    "0 0 30px rgba(255, 107, 0, 0.03) inset",
                ],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
            className="absolute bottom-20 right-10 w-60 h-60 border-[1px] border-[rgba(255,107,0,0.07)] rounded-full transform -rotate-12"
            animate={{
                rotate: [-12, -20, -12],
                scale: [1, 1.03, 1],
                opacity: [0.07, 0.12, 0.07],
                boxShadow: [
                    "0 0 40px rgba(255, 107, 0, 0.02) inset",
                    "0 0 50px rgba(255, 107, 0, 0.04) inset",
                    "0 0 40px rgba(255, 107, 0, 0.02) inset",
                ],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
        />
    </div>
);
