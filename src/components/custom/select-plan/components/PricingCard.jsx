import { motion } from "framer-motion";
import React, { useState } from "react";

import { FeatureCheck } from "./FeatureCheck";

// Main pricing card component
export const PricingCard = ({
    name,
    price,
    features,
    popular = false,
    onClick,
    duration,
    description,
    btnText,
    storage,
    users,
    support,
}) => {
    // Calculate monthly price if yearly is selected
    const displayPrice = duration === "yearly" ? (price * 0.8).toFixed(2) : price;
    // State for hover effect
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`relative ${popular ? "z-10 lg:-mt-6" : "z-0"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={{
                    y: isHovered ? -10 : 0,
                    boxShadow: isHovered
                        ? popular
                            ? "0 25px 50px -12px rgba(255, 255, 255, 0.15)"
                            : "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        : "0 0 0 0 rgba(0, 0, 0, 0)",
                }}
                transition={{ duration: 0.3 }}
                className={`group min-h-[500px] transition-all duration-500 rounded-[26px] ${
                    popular
                        ? "bg-[rgba(30,30,30,0.9)] border border-[rgba(255,255,255,0.1)] backdrop-blur-xl"
                        : "bg-[rgba(20,20,20,0.8)] border border-[rgba(255,255,255,0.06)] backdrop-blur-lg"
                } relative overflow-hidden`}
            >
                {/* Hover border effect */}
                <motion.div
                    className="absolute inset-0 rounded-[26px] opacity-0 pointer-events-none"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className={`absolute inset-0 ${
                            popular
                                ? "bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)]"
                                : "bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)]"
                        } rounded-[26px] blur-[2px]`}
                    ></div>
                </motion.div>

                {/* Card inner glow effect */}
                <div className="absolute inset-0 overflow-hidden rounded-[26px]">
                    <div className="absolute inset-0 opacity-30">
                        <div
                            className={`absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b ${
                                popular
                                    ? "from-[rgba(255,255,255,0.1)] to-transparent"
                                    : "from-[rgba(255,255,255,0.05)] to-transparent"
                            }`}
                        ></div>
                    </div>
                </div>

                {/* Background geometric pattern */}
                <div className="absolute inset-0 overflow-hidden opacity-10 rounded-[26px]">
                    <svg
                        width="100%"
                        height="100%"
                        className="absolute top-0 left-0 opacity-20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern id={`smallGrid-${name}`} width="30" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#smallGrid-${name})`} />
                    </svg>
                </div>

                {/* Popular badge */}
                {popular && (
                    <div className="absolute right-6 top-6 bg-[rgba(255,255,255,0.1)] backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white border border-[rgba(255,255,255,0.2)] z-10">
                        <motion.span
                            className="relative inline-block"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="relative z-10">Most popular</span>
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.1)] rounded-full blur-[6px]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.span>
                    </div>
                )}

                <div className="p-8 space-y-5 relative z-10 flex flex-col h-full">
                    {/* Plan icon and name */}
                    <div className="flex flex-col items-center justify-center mb-5">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className={`w-16 h-16 rounded-full mb-5 ${popular ? "bg-gradient-to-br from-[#333] to-[#444]" : "bg-gradient-to-br from-[#222] to-[#333]"} flex items-center justify-center relative overflow-hidden`}
                        >
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`text-white transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
                                whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                                {name === "Free" ? (
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                ) : name === "Pro Plan" ? (
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                ) : (
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                )}
                            </motion.svg>
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                                />
                            )}
                        </motion.div>
                        <motion.h3
                            className={`text-2xl font-bold text-white mb-1`}
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {name}
                        </motion.h3>
                        <p className="text-sm text-gray-400 max-w-[250px] text-center mb-2">{description}</p>
                    </div>

                    {/* Price display */}
                    <div className="text-center mb-5 relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-transparent"></div>

                        <div className="flex items-center justify-center">
                            <motion.span
                                className="text-4xl sm:text-5xl font-bold text-white"
                                animate={{
                                    scale: isHovered ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                ${displayPrice}
                            </motion.span>
                            <span className="text-gray-400 ml-2 text-sm">/{duration === "yearly" ? "month" : "month"}</span>
                        </div>
                        {duration === "yearly" && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-2 text-sm text-gray-300 font-medium"
                            >
                                Billed yearly (${(displayPrice * 12).toFixed(2)})
                            </motion.div>
                        )}
                    </div>

                    {/* Plan usage info with animated bars */}
                    <div className="pt-3 pb-3 flex flex-col gap-2.5 border-t border-b border-[#333] mb-4">
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-gray-400 text-sm">Users</span>
                                <span className="text-white text-sm font-medium">{users}</span>
                            </div>
                            <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden group-hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: name === "Free" ? "20%" : name === "Pro Plan" ? "60%" : "100%",
                                        boxShadow: isHovered ? "0 0 8px 0 rgba(255, 107, 0, 0.5)" : "none",
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full ${
                                        popular
                                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                            : name === "Enterprise"
                                              ? "bg-gradient-to-r from-[#9333ea] to-[#d946ef]"
                                              : "bg-blue-500"
                                    } rounded-full relative`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                                    {isHovered && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-gray-400 text-sm">Storage</span>
                                <span className="text-white text-sm font-medium">{storage}</span>
                            </div>
                            <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden group-hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: name === "Free" ? "15%" : name === "Pro Plan" ? "65%" : "100%",
                                        boxShadow: isHovered ? "0 0 8px 0 rgba(255, 107, 0, 0.5)" : "none",
                                    }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className={`h-full ${
                                        popular
                                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                            : name === "Enterprise"
                                              ? "bg-gradient-to-r from-[#9333ea] to-[#d946ef]"
                                              : "bg-blue-500"
                                    } rounded-full relative`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                                    {isHovered && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                ease: "linear",
                                                delay: 0.2,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-gray-400 text-sm">Support</span>
                                <span className="text-white text-sm font-medium">{support}</span>
                            </div>
                            <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden group-hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: name === "Free" ? "10%" : name === "Pro Plan" ? "75%" : "100%",
                                        boxShadow: isHovered ? "0 0 8px 0 rgba(255, 107, 0, 0.5)" : "none",
                                    }}
                                    transition={{ duration: 1, delay: 0.7 }}
                                    className={`h-full ${
                                        popular
                                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                            : name === "Enterprise"
                                              ? "bg-gradient-to-r from-[#9333ea] to-[#d946ef]"
                                              : "bg-blue-500"
                                    } rounded-full relative`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                                    {isHovered && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                ease: "linear",
                                                delay: 0.4,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Feature list */}
                    <div className="flex-grow">
                        <h4 className="text-xs text-gray-300 uppercase tracking-wider mb-4 font-semibold">
                            <span>Features</span>
                        </h4>
                        <div className="grid grid-cols-1 gap-1.5 pr-2">
                            {features.map((feature, index) => (
                                <FeatureCheck key={index} feature={feature} delay={0.1 + index * 0.05} isPopular={popular} />
                            ))}
                        </div>
                    </div>

                    {/* Button with hover effect */}
                    <div className="mt-auto pt-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full cursor-pointer py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                                popular
                                    ? "bg-[rgba(50,50,50,0.9)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(70,70,70,0.9)]"
                                    : "bg-[rgba(40,40,40,0.8)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(60,60,60,0.9)]"
                            } relative overflow-hidden`}
                            onClick={onClick}
                        >
                            <span className="relative z-10">{btnText}</span>

                            {isHovered && (
                                <motion.div
                                    className={`absolute inset-0 ${
                                        popular ? "bg-[rgba(70,70,70,0.9)]" : "bg-[rgba(60,60,60,0.9)]"
                                    } -z-0`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Subtle shine effect on hover */}
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                                />
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
