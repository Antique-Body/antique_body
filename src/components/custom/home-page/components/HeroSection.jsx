"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { TrainerIcon, WorkoutIcon, ParthenonIcon } from "@/components/common/Icons";
import { Counter } from "@/components/custom/Counter";

export function HeroSection() {
    const [scrollY, setScrollY] = useState(0);

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollY(position);
        };

        // Add event listener
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="hero" className="relative min-h-screen flex items-center">
            <div className="container mx-auto px-4 py-24 sm:py-32 md:py-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="block bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent"
                            >
                                Transform Your Body
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="block mt-2"
                            >
                                Ancient Wisdom, Modern Fitness
                            </motion.span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Guided by the principles of ancient Greek athletics, our app delivers personalized training for peak
                            performance and balanced living.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/auth/register">
                                <Button variant="orangeFilled" size="large" className="w-full sm:w-auto">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button variant="secondary" size="large" className="w-full sm:w-auto">
                                    Learn More
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Animated Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 2.1 }}
                            className="mt-12 grid grid-cols-3 gap-6 text-center"
                        >
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-bold text-[#FF6B00]">
                                    <Counter end={5000} suffix="+" duration={3500} />
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400">Active Users</p>
                            </div>
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-bold text-[#FF6B00]">
                                    <Counter end={200} suffix="+" duration={3500} />
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400">Certified Trainers</p>
                            </div>
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-bold text-[#FF6B00]">
                                    <Counter end={98} suffix="%" duration={2500} />
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400">Success Rate</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="relative"
                        style={{ perspective: "1000px" }}
                    >
                        <div className="relative h-[400px] sm:h-[500px] mx-auto max-w-md">
                            {/* Background shape */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 1.3 }}
                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FF9A00]/20 blur-xl"
                                style={{ transform: `rotate(${scrollY * 0.02}deg)` }}
                            />

                            {/* Hero image */}
                            <motion.div
                                className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl shadow-[#FF6B00]/20"
                                initial={{ rotateY: 20, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                style={{ transform: `rotateY(${scrollY * 0.01}deg)` }}
                            >
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <div className="relative h-full w-full">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.02, 1],
                                                    rotate: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 6,
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                }}
                                            >
                                                <Image
                                                    src="/images/body-outline.png"
                                                    alt="Body outline"
                                                    width={300}
                                                    height={400}
                                                    className="h-full w-auto object-contain opacity-70"
                                                />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.8 }}
                            className="absolute -left-4 top-1/4 p-3 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-800"
                            style={{ zIndex: 1 }}
                        >
                            <TrainerIcon size={30} className="text-[#FF6B00]" />
                        </motion.div>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 2 }}
                            className="absolute -right-4 top-1/2 p-3 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-800"
                            style={{ zIndex: 1 }}
                        >
                            <WorkoutIcon size={30} className="text-[#FF6B00]" />
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 2.2 }}
                            className="absolute bottom-8 left-1/3 p-3 rounded-xl bg-black/80 backdrop-blur-sm border border-gray-800"
                            style={{ zIndex: 1 }}
                        >
                            <ParthenonIcon size={30} className="text-[#FF6B00]" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
