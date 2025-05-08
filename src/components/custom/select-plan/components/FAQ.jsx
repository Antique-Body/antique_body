import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export const FAQItem = ({ question, answer, isOpen, onToggle, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`border-b border-[rgba(255,255,255,0.06)] overflow-hidden ${isOpen ? "pb-6" : "pb-1"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={onToggle}
                className="flex justify-between items-center w-full py-6 text-left focus:outline-none group relative overflow-hidden"
            >
                <motion.span
                    className="text-lg font-medium text-white group-hover:text-white transition-colors duration-300 relative z-10"
                    animate={{
                        x: isHovered ? 3 : 0,
                        color: isHovered ? "#fff" : isOpen ? "#fff" : "white",
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {question}
                </motion.span>

                {/* Glowing background for the button on hover */}
                {isHovered && !isOpen && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                <motion.div
                    animate={{
                        rotate: isOpen ? 45 : 0,
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${
                        isOpen
                            ? "bg-[rgba(255,255,255,0.1)]"
                            : isHovered
                              ? "bg-[rgba(255,255,255,0.1)]"
                              : "bg-[rgba(255,255,255,0.05)]"
                    } transition-colors duration-300`}
                >
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isOpen ? "#fff" : isHovered ? "#fff" : "#999"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </motion.svg>
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="pr-12 text-gray-400 mt-2 text-base leading-relaxed"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {answer}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const FAQ = () => {
    const faqData = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support payments through PayPal and cryptocurrencies (Bitcoin, Ethereum, and USDC).",
        },
        {
            question: "Can I switch plans later?",
            answer: "Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, your new rate will start at the beginning of your next billing cycle.",
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes, we offer a 14-day free trial on all our plans. You won't be charged until the trial period is over, and you can cancel anytime during the trial with no obligations.",
        },
        {
            question: "How do refunds work?",
            answer: "If you're unsatisfied with our service, you can request a refund within 30 days of your initial purchase. For monthly subscriptions, we provide prorated refunds for the unused portion. Annual subscriptions are eligible for a full refund within the first 30 days.",
        },
        {
            question: "What's included in the Enterprise plan?",
            answer: "The Enterprise plan includes everything in the Pro plan plus: dedicated account manager, advanced security features, bulk user management, custom reporting and analytics, 24/7 premium support, white-label options, team performance analytics, API access, SSO integration, and custom onboarding.",
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time with no questions asked. Your plan will remain active until the end of your current billing cycle.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="w-full max-w-4xl mx-auto pt-24 pb-16">
            {/* FAQ Header with gradient */}
            <div className="text-center mb-14">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
                >
                    <span className="text-white">Frequently </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] relative">
                        Asked Questions
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
                    Everything you need to know about our plans and pricing
                </motion.p>
            </div>

            {/* Decorative element */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-30 -z-10">
                <div className="w-64 h-64 rounded-full bg-gradient-to-r from-[rgba(255,107,0,0.03)] to-[rgba(255,154,0,0.02)] blur-[100px]"></div>
            </div>

            {/* FAQ items with animated borders */}
            <div className="relative">
                {/* Decorative side accent */}
                <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.3)] to-transparent opacity-30"
                    animate={{
                        height: ["100%", "95%", "100%"],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                />

                <motion.div
                    className="bg-[rgba(10,10,10,0.4)] backdrop-blur-lg rounded-2xl border border-[rgba(255,255,255,0.03)] p-2 shadow-xl relative overflow-hidden"
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(255, 107, 0, 0.15)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Animated background gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[rgba(255,107,0,0.03)] to-[rgba(255,107,0,0.01)] opacity-0"
                        animate={{
                            opacity: [0, 0.5, 0],
                            background: [
                                "linear-gradient(to right, rgba(255,107,0,0.01), rgba(255,154,0,0.005))",
                                "linear-gradient(to right, rgba(255,107,0,0.03), rgba(255,154,0,0.015))",
                                "linear-gradient(to right, rgba(255,107,0,0.01), rgba(255,154,0,0.005))",
                            ],
                        }}
                        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                    />

                    <div className="divide-y divide-[rgba(255,255,255,0.06)] px-6">
                        {faqData.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                                index={index}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom gradient accent */}
            <div className="mt-16 flex justify-center">
                <motion.div
                    className="h-1 w-20 bg-gradient-to-r from-transparent via-[#ccc] to-transparent opacity-50 rounded-full"
                    animate={{
                        width: [80, 120, 80],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                />
            </div>
        </div>
    );
};
