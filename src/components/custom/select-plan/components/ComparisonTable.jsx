import { motion } from "framer-motion";
import React, { useState } from "react";

export const ComparisonTable = () => {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredCol, setHoveredCol] = useState(null);

    const features = [
        {
            name: "Users",
            free: "2 seats",
            pro: "5 seats",
            enterprise: "Unlimited",
            category: "core",
        },
        {
            name: "Storage",
            free: "250MB",
            pro: "5GB",
            enterprise: "Unlimited",
            category: "core",
        },
        {
            name: "Support",
            free: "Basic",
            pro: "Priority",
            enterprise: "24/7 Dedicated",
            category: "core",
        },
        {
            name: "Transaction tracking",
            free: true,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "Financial goals",
            free: true,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "Secure cloud storage",
            free: true,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "Advanced analytics",
            free: false,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "Custom reporting",
            free: false,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "Team collaboration",
            free: false,
            pro: true,
            enterprise: true,
            category: "features",
        },
        {
            name: "API access",
            free: false,
            pro: false,
            enterprise: true,
            category: "advanced",
        },
        {
            name: "White labeling",
            free: false,
            pro: false,
            enterprise: true,
            category: "advanced",
        },
        {
            name: "SSO integration",
            free: false,
            pro: false,
            enterprise: true,
            category: "advanced",
        },
    ];

    const categorizedFeatures = {
        core: features.filter((f) => f.category === "core"),
        features: features.filter((f) => f.category === "features"),
        advanced: features.filter((f) => f.category === "advanced"),
    };

    const CheckIcon = () => (
        <svg
            className="w-5 h-5 text-[#FF6B00]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
    );

    const CrossIcon = () => (
        <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    );

    const renderCategoryFeatures = (category, title) => (
        <>
            <motion.div
                className="grid grid-cols-4 md:grid-cols-4 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.6)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-4 text-left">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">{title}</h3>
                </div>
                <div className="p-4"></div>
                <div className="p-4"></div>
                <div className="p-4"></div>
            </motion.div>
            {categorizedFeatures[category].map((feature, index) => (
                <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`grid grid-cols-4 md:grid-cols-4 transition-colors duration-200 ${
                        hoveredRow === feature.name ? "bg-[rgba(255,255,255,0.03)]" : ""
                    }`}
                    onMouseEnter={() => setHoveredRow(feature.name)}
                    onMouseLeave={() => setHoveredRow(null)}
                >
                    <div className="p-4 text-left flex items-center border-t border-[rgba(255,255,255,0.04)]">
                        <span className="text-sm text-gray-300">{feature.name}</span>
                    </div>
                    <div
                        className={`p-4 flex justify-center items-center border-t border-[rgba(255,255,255,0.04)] ${hoveredCol === "free" ? "bg-[rgba(255,255,255,0.02)]" : ""}`}
                        onMouseEnter={() => setHoveredCol("free")}
                        onMouseLeave={() => setHoveredCol(null)}
                    >
                        {typeof feature.free === "boolean" ? (
                            feature.free ? (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CheckIcon />
                                </motion.div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CrossIcon />
                                </motion.div>
                            )
                        ) : (
                            <span className="text-sm text-gray-400">{feature.free}</span>
                        )}
                    </div>
                    <div
                        className={`p-4 flex justify-center items-center border-t border-[rgba(255,255,255,0.04)] ${hoveredCol === "pro" ? "bg-[rgba(255,107,0,0.05)]" : ""}`}
                        onMouseEnter={() => setHoveredCol("pro")}
                        onMouseLeave={() => setHoveredCol(null)}
                    >
                        {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CheckIcon />
                                </motion.div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CrossIcon />
                                </motion.div>
                            )
                        ) : (
                            <span className="text-sm text-white font-medium">{feature.pro}</span>
                        )}
                    </div>
                    <div
                        className={`p-4 flex justify-center items-center border-t border-[rgba(255,255,255,0.04)] ${hoveredCol === "enterprise" ? "bg-[rgba(255,255,255,0.02)]" : ""}`}
                        onMouseEnter={() => setHoveredCol("enterprise")}
                        onMouseLeave={() => setHoveredCol(null)}
                    >
                        {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CheckIcon />
                                </motion.div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                                    <CrossIcon />
                                </motion.div>
                            )
                        ) : (
                            <span className="text-sm text-gray-400">{feature.enterprise}</span>
                        )}
                    </div>
                </motion.div>
            ))}
        </>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-6xl mx-auto mt-24 mb-20 px-4 sm:px-6 lg:px-8"
        >
            <div className="text-center mb-14">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
                >
                    <span className="text-white">Compare </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] relative">
                        Plans
                        <motion.div
                            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full opacity-70"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.7 }}
                        />
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto text-lg"
                >
                    See which plan is right for your needs
                </motion.p>
            </div>

            <div className="relative">
                {/* Side accent lines */}
                <motion.div
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[rgba(255,107,0,0.3)] to-transparent opacity-30"
                    animate={{
                        height: ["75%", "70%", "75%"],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                />
                <motion.div
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[rgba(255,107,0,0.3)] to-transparent opacity-30"
                    animate={{
                        height: ["75%", "80%", "75%"],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
                />

                {/* Table container with glass effect */}
                <motion.div
                    className="bg-[rgba(20,20,20,0.6)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-xl overflow-hidden relative"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Animated gradient overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-[rgba(255,107,0,0.03)] to-transparent pointer-events-none"
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            backgroundPosition: ["0% 0%", "2% 2%", "0% 0%"],
                        }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
                    />

                    {/* Table header */}
                    <div className="sticky top-0 z-10 grid grid-cols-4 md:grid-cols-4 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(15,15,15,0.9)] backdrop-blur-md">
                        <div className="p-6 text-left">
                            <h3 className="text-lg font-medium text-gray-300">Features</h3>
                        </div>
                        <div
                            className={`p-6 text-center relative ${hoveredCol === "free" ? "bg-[rgba(255,255,255,0.03)]" : ""}`}
                            onMouseEnter={() => setHoveredCol("free")}
                            onMouseLeave={() => setHoveredCol(null)}
                        >
                            <motion.h3
                                className="text-lg font-medium text-gray-100"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                Free
                            </motion.h3>
                            <p className="text-gray-400 text-sm mt-1">$0/month</p>
                        </div>
                        <div
                            className={`p-6 text-center relative ${hoveredCol === "pro" ? "bg-[rgba(255,107,0,0.05)]" : ""}`}
                            onMouseEnter={() => setHoveredCol("pro")}
                            onMouseLeave={() => setHoveredCol(null)}
                        >
                            <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>
                            <motion.div
                                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white text-xs font-bold px-2 py-1 rounded-b-md"
                                animate={{
                                    y: [0, -1, 0],
                                }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                            >
                                POPULAR
                            </motion.div>
                            <motion.h3
                                className="text-lg font-medium text-white"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                Pro Plan
                            </motion.h3>
                            <p className="text-gray-300 text-sm mt-1">$98/month</p>
                        </div>
                        <div
                            className={`p-6 text-center ${hoveredCol === "enterprise" ? "bg-[rgba(255,255,255,0.03)]" : ""}`}
                            onMouseEnter={() => setHoveredCol("enterprise")}
                            onMouseLeave={() => setHoveredCol(null)}
                        >
                            <motion.h3
                                className="text-lg font-medium text-gray-100"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                Enterprise
                            </motion.h3>
                            <p className="text-gray-400 text-sm mt-1">$160/month</p>
                        </div>
                    </div>

                    {/* Table body */}
                    <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
                        {renderCategoryFeatures("core", "Core Features")}
                        {renderCategoryFeatures("features", "Product Features")}
                        {renderCategoryFeatures("advanced", "Advanced Features")}
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    className="absolute -bottom-10 right-20 w-24 h-24 border border-[rgba(255,107,0,0.1)] rounded-full opacity-20 pointer-events-none"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                />
                <motion.div
                    className="absolute -top-14 left-36 w-20 h-20 border border-[rgba(255,107,0,0.08)] rounded-full opacity-15 pointer-events-none"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 1 }}
                />
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .hide-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .hide-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 107, 0, 0.2);
                    border-radius: 10px;
                }
                .hide-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 107, 0, 0.4);
                }
            `}</style>
        </motion.div>
    );
};
