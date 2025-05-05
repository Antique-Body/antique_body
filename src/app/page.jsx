"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import Background from "@/components/background";
import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { ClientIcon, CheckIcon, ParthenonIcon, WorkoutIcon, ColumnIcon } from "@/components/common/Icons";
import { Counter } from "@/components/custom/Counter";
import { Navigation, HeroSection, TopTrainersSection } from "@/components/custom/home-page/components";

export default function Home() {
    const [activeSection, setActiveSection] = useState("");
    const [scrollY, setScrollY] = useState(0);
    const featuresRef = useRef(null);
    const benefitsRef = useRef(null);
    const ctaRef = useRef(null);
    const appRef = useRef(null);

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollY(position);

            // Set active section based on scroll position
            const scrollPosition = position + window.innerHeight / 3;

            const sections = [
                { ref: featuresRef, id: "features" },
                { ref: benefitsRef, id: "benefits" },
                { ref: appRef, id: "app" },
                { ref: ctaRef, id: "cta" },
            ];

            // Check if user is at the top of the page (hero section)
            if (scrollPosition < (featuresRef?.current?.offsetTop || 0)) {
                setActiveSection("hero");
                return;
            }

            // Check other sections
            for (const section of sections) {
                if (section.ref.current && scrollPosition < section.ref.current.offsetTop + section.ref.current.offsetHeight) {
                    setActiveSection(section.id);
                    return;
                }
            }
        };

        // Add event listener
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
            <Background />

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section with staggered animations */}
            <section id="features" ref={featuresRef} className="relative py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Features
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Our platform offers powerful tools for both trainers and clients to achieve their fitness goals
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Find Certified Trainers",
                                description:
                                    "Connect with professional trainers near you who specialize in your specific goals and sport.",
                                icon: (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="text-[#FF6B00]"
                                        width="32"
                                        height="32"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        fill="none"
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                ),
                                delay: 0.1,
                            },
                            {
                                title: "Client Matching",
                                description:
                                    "Trainers can find clients who match their expertise area and training philosophy.",
                                icon: <ClientIcon size={32} className="text-[#FF6B00]" />,
                                delay: 0.2,
                            },
                            {
                                title: "Greek-Inspired Training",
                                description: "Workouts built on ancient athletic wisdom, adapted for modern fitness goals.",
                                icon: <ParthenonIcon size={32} className="text-[#FF6B00]" />,
                                delay: 0.3,
                            },
                            {
                                title: "Custom Workout Plans",
                                description:
                                    "Personalized training programs tailored to your specific goals, preferences and abilities.",
                                icon: <WorkoutIcon size={32} className="text-[#FF6B00]" />,
                                delay: 0.4,
                            },
                            {
                                title: "Progress Tracking",
                                description:
                                    "Comprehensive analytics to monitor your performance and track your improvements over time.",
                                icon: <CheckIcon size={32} className="text-[#FF6B00]" />,
                                delay: 0.5,
                            },
                            {
                                title: "Achievement System",
                                description:
                                    "Earn badges and rewards as you complete workouts and reach your fitness milestones.",
                                icon: <ColumnIcon size={32} className="text-[#FF6B00]" />,
                                delay: 0.6,
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: feature.delay }}
                                className="feature-card group relative h-full overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6 transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-300 group-hover:w-full"></div>
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-black/30 transition-all duration-300 group-hover:bg-[#FF6B00]/20">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section with enhanced design and images */}
            <section id="benefits" ref={benefitsRef} className="relative py-16 md:py-24 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0f0f0f] to-black pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Transform Your Body & Mind
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Combine ancient athletic wisdom with modern science for optimal physical performance
                        </p>
                    </motion.div>

                    {/* Main benefit cards with image integration */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-7 relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 shadow-xl"
                        >
                            {/* Benefit image */}
                            <div className="aspect-[16/9] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <Image
                                        src="https://images.stockcake.com/public/c/7/7/c77de2a6-0b4f-41f8-900d-372cefc0242e_large/ancient-athlete-training-stockcake.jpg"
                                        alt="Ancient Greek-inspired training"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Content overlay */}
                            <div className="p-8 relative z-20 -mt-16">
                                <div className="p-4 mb-5 w-16 h-16 flex items-center justify-center rounded-full bg-[#FF6B00] shadow-xl">
                                    <ParthenonIcon size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ancient Training Methods</h3>
                                <p className="text-gray-300 mb-6 text-base md:text-lg">
                                    Our program rediscovers the time-tested techniques of ancient Greek athletes, adapted for
                                    modern fitness goals. Develop functional strength, endurance, and mental discipline through
                                    practices that have proven effective for millennia.
                                </p>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    {[
                                        "Natural movement patterns",
                                        "Full-body integration",
                                        "Functional strength",
                                        "Mental resilience",
                                    ].map((tag, i) => (
                                        <span
                                            key={i}
                                            className="inline-block px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-sm text-[#FF6B00]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-5 grid grid-cols-1 gap-8">
                            {/* Secondary benefit card 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-6 hover:border-[#FF6B00]/50 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-[#FF6B00] shadow-lg">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="text-white"
                                            width="24"
                                            height="24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            fill="none"
                                        >
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Expert Coach Guidance</h3>
                                        <p className="text-gray-300">
                                            Connect with certified professionals who specialize in ancient-inspired training
                                            methodologies, providing personalized guidance for your unique journey.
                                        </p>

                                        <ul className="mt-4 space-y-2">
                                            {["Personalized coaching", "Form correction", "Progressive programming"].map(
                                                (item, i) => (
                                                    <li key={i} className="flex items-center text-sm">
                                                        <span className="text-[#FF6B00] mr-2">•</span> {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Secondary benefit card 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-6 hover:border-[#FF6B00]/50 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-[#FF6B00] shadow-lg">
                                        <WorkoutIcon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Modern Performance Tracking</h3>
                                        <p className="text-gray-300">
                                            Leverage cutting-edge technology to monitor your progress, track improvements in
                                            strength, endurance, and mobility through our comprehensive analytics.
                                        </p>

                                        <div className="mt-4 h-5 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[75%] bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>
                                        </div>
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-gray-400">Progress Visualization</span>
                                            <span className="text-[#FF6B00]">Advanced Metrics</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Testimonial section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-[#121212] to-black rounded-2xl overflow-hidden border border-gray-800 p-8 md:p-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="text-[#FF6B00] text-5xl mb-6 opacity-30">"</div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-xl md:text-2xl text-gray-200 italic mb-6"
                                >
                                    The ancient-inspired training methods combined with modern tracking have transformed my
                                    physique and mindset. I've never felt stronger or more capable.
                                </motion.p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-[#FF6B00] rounded-full"></div>
                                    <div>
                                        <div className="font-semibold">Michael K.</div>
                                        <div className="text-sm text-gray-400">4 months with Antique Body</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-square md:aspect-auto md:h-[300px] rounded-xl overflow-hidden border border-gray-800">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                    {/* Placeholder for a testimonial image */}
                                    <Image
                                        src="https://media.istockphoto.com/id/1162483510/photo/doing-squat-exercise-confident-young-personal-trainer-is-showing-slim-athletic-woman-how-to.jpg?s=612x612&w=0&k=20&c=Kk0ZhdUEX9B6ip6wItLFKtuBiTbsZsx0uVmopJMTul4="
                                        alt="Ancient Greek-inspired training"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trainers Showcase */}
            <section id="trainers" className="relative py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <TopTrainersSection />
                </div>
            </section>

            {/* App Showcase with parallax effect */}
            <section id="app" ref={appRef} className="relative py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Our App
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Experience the future of fitness training with our powerful yet intuitive mobile application
                        </p>
                    </motion.div>

                    {/* App content remains the same */}
                    {/* ... */}
                </div>
            </section>

            {/* CTA Section with animated stats */}
            <section id="cta" ref={ctaRef} className="relative py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-black to-gray-900 p-8 md:p-12 lg:p-16"
                    >
                        {/* Background elements */}
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 50,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear",
                                }}
                                className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border-2 border-dashed border-[#FF6B00]/30"
                            ></motion.div>
                            <motion.div
                                animate={{
                                    rotate: [360, 0],
                                }}
                                transition={{
                                    duration: 70,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear",
                                }}
                                className="absolute -left-40 -bottom-40 h-[400px] w-[400px] rounded-full border-2 border-dashed border-[#FF6B00]/20"
                            ></motion.div>
                        </div>

                        <div className="relative z-10">
                            <div className="mx-auto max-w-3xl text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl"
                                >
                                    Ready to <span className="text-[#FF6B00]">Transform</span> Your Fitness Journey?
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mb-10 text-lg md:text-xl text-gray-300"
                                >
                                    Join thousands of satisfied users who have achieved their fitness goals with our platform.
                                    Start your journey today!
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Link href="/auth/register">
                                        <Button variant="orangeFilled" size="large" className="w-full sm:w-auto">
                                            Start Free Trial
                                        </Button>
                                    </Link>
                                    <Link href="/auth/login">
                                        <Button variant="orangeOutline" size="large" className="w-full sm:w-auto">
                                            Login
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Animated Stats */}
                            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        value: 5000,
                                        label: "Active Users",
                                        suffix: "+",
                                        delay: 0.3,
                                    },
                                    {
                                        value: 10000,
                                        label: "Workouts Completed",
                                        suffix: "+",
                                        delay: 0.4,
                                    },
                                    {
                                        value: 98,
                                        label: "Satisfaction Rate",
                                        suffix: "%",
                                        delay: 0.5,
                                    },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: stat.delay }}
                                        className="text-center"
                                    >
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF6B00] mb-2">
                                            <Counter end={stat.value} suffix={stat.suffix} duration={2500} />
                                        </h3>
                                        <p className="text-gray-300">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
