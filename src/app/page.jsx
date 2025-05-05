"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";

import Background from "@/components/background";
import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import {
    ClientIcon,
    TrainerIcon,
    CheckIcon,
    ParthenonIcon,
    WorkoutIcon,
    UserProfileIcon,
    ColumnIcon,
} from "@/components/common/Icons";
import { BrandLogo } from "@/components/custom/BrandLogo";
import { TopTrainersSection } from "@/components/custom/home-page/components/TopTrainersSection";

export default function Home() {
    const [activeSection, setActiveSection] = useState("");
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const benefitsRef = useRef(null);
    const ctaRef = useRef(null);
    const trainersRef = useRef(null);
    const appRef = useRef(null);

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollY(position);

            // Set active section based on scroll position
            const scrollPosition = position + window.innerHeight / 3;

            if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
                setActiveSection("hero");
            } else if (
                featuresRef.current &&
                scrollPosition < featuresRef.current.offsetTop + featuresRef.current.offsetHeight
            ) {
                setActiveSection("features");
            } else if (
                benefitsRef.current &&
                scrollPosition < benefitsRef.current.offsetTop + benefitsRef.current.offsetHeight
            ) {
                setActiveSection("benefits");
            } else if (
                trainersRef.current &&
                scrollPosition < trainersRef.current.offsetTop + trainersRef.current.offsetHeight
            ) {
                setActiveSection("trainers");
            } else if (appRef.current && scrollPosition < appRef.current.offsetTop + appRef.current.offsetHeight) {
                setActiveSection("app");
            } else if (ctaRef.current) {
                setActiveSection("cta");
            }
        };

        // Add event listener
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
            <Background />

            {/* Navigation bar with active indicators */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 shadow-lg shadow-black/20"
            >
                <div className="container mx-auto flex items-center justify-between px-6 py-6">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <BrandLogo
                                className="flex items-center"
                                titleStyle={{
                                    fontSize: "2rem",
                                    fontWeight: "800",
                                    letterSpacing: "0.05em",
                                    marginBottom: "0",
                                }}
                                containerStyle={{
                                    marginBottom: "0",
                                }}
                                firstWordColor="#FF6B00"
                                secondWordColor="#ffffff"
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6">
                        {[
                            { id: "hero", label: "Home" },
                            { id: "features", label: "Features" },
                            { id: "benefits", label: "Benefits" },
                            { id: "trainers", label: "Trainers" },
                            { id: "app", label: "App" },
                            { href: "/contact", label: "Contact" },
                        ].map((item) => (
                            <motion.button
                                key={item.id || item.href}
                                onClick={() => (item.id ? scrollToSection(item.id) : null)}
                                className={`relative px-6 py-3 text-base font-semibold tracking-wide uppercase transition-all duration-300 
                                ${activeSection === item.id ? "text-[#FF6B00]" : "text-gray-300 hover:text-white"}`}
                                whileHover={{ y: -3, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-t-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        <div className="flex flex-col space-y-1.5 w-7">
                            <span
                                className={`h-0.5 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-300 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
                            ></span>
                            <span
                                className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
                            ></span>
                            <span
                                className={`h-0.5 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-300 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                            ></span>
                        </div>
                    </button>

                    {/* Login / Register buttons */}
                    <div className="hidden md:flex items-center space-x-5">
                        <Link href="/auth/login">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="orangeOutline" size="medium" className="font-semibold px-6 py-2.5 text-base">
                                    Login
                                </Button>
                            </motion.div>
                        </Link>
                        <Link href="/auth/register">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="orangeFilled" size="medium" className="font-semibold px-7 py-2.5 text-base">
                                    Register
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-t border-gray-800 bg-black/90 backdrop-blur-lg"
                    >
                        <div className="container mx-auto px-6 py-5">
                            <div className="flex flex-col space-y-4">
                                {[
                                    { id: "hero", label: "Home" },
                                    { id: "features", label: "Features" },
                                    { id: "benefits", label: "Benefits" },
                                    { id: "trainers", label: "Trainers" },
                                    { id: "app", label: "App" },
                                    { href: "/contact", label: "Contact" },
                                ].map((item) => (
                                    <button
                                        key={item.id || item.href}
                                        onClick={() => {
                                            if (item.id) {
                                                scrollToSection(item.id);
                                                setMobileMenuOpen(false);
                                            }
                                        }}
                                        className={`py-3 text-left text-base font-semibold uppercase tracking-wide transition-all duration-300
                                        ${activeSection === item.id ? "text-[#FF6B00]" : "text-gray-300"}`}
                                    >
                                        {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                                    </button>
                                ))}
                                <div className="flex flex-col space-y-4 pt-5 border-t border-gray-800">
                                    <Link href="/auth/login">
                                        <Button
                                            variant="orangeOutline"
                                            size="medium"
                                            className="w-full py-3 text-base font-semibold"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button
                                            variant="orangeFilled"
                                            size="medium"
                                            className="w-full py-3 text-base font-semibold"
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section with animated elements */}
            <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center">
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
                                Guided by the principles of ancient Greek athletics, our app delivers personalized training for
                                peak performance and balanced living.
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
                                        <CountUp end={5000} suffix="+" duration={2.5} />
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-400">Active Users</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-bold text-[#FF6B00]">
                                        <CountUp end={200} suffix="+" duration={2.5} />
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-400">Certified Trainers</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-bold text-[#FF6B00]">
                                        <CountUp end={98} suffix="%" duration={2.5} />
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
                                icon: <TrainerIcon size={32} className="text-[#FF6B00]" />,
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
                                    {/* Placeholder for a training image */}
                                    <div className="text-center text-gray-500">
                                        <p className="text-sm">Recommended image: Ancient Greek-inspired training</p>
                                        <p className="text-xs mt-2">
                                            https://images.unsplash.com/photo-1526506118085-60ce8714f8c5
                                        </p>
                                        <p className="text-xs mt-1">
                                            https://images.unsplash.com/photo-1532384748853-8f54a8f476e2
                                        </p>
                                    </div>
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
                                        <TrainerIcon size={24} className="text-white" />
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
                                    <div className="text-center text-gray-500">
                                        <p className="text-sm">Recommended image: Training results/athlete</p>
                                        <p className="text-xs mt-2">
                                            https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b
                                        </p>
                                        <p className="text-xs mt-1">
                                            https://images.unsplash.com/photo-1594381898411-846e7d193883
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trainers Showcase */}
            <section id="trainers" ref={trainersRef} className="relative py-16 md:py-24">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-2xl md:text-3xl font-bold mb-6">Powerful Features in Your Pocket</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "Workout Library",
                                        description:
                                            "Access hundreds of exercises with detailed instructions and video demonstrations.",
                                        icon: <WorkoutIcon size={24} className="text-[#FF6B00]" />,
                                        delay: 0.1,
                                    },
                                    {
                                        title: "Trainer Connection",
                                        description: "Chat with your trainer, share progress, and receive real-time feedback.",
                                        icon: <TrainerIcon size={24} className="text-[#FF6B00]" />,
                                        delay: 0.2,
                                    },
                                    {
                                        title: "Progress Analytics",
                                        description: "Visualize your improvement with detailed charts and performance metrics.",
                                        icon: <CheckIcon size={24} className="text-[#FF6B00]" />,
                                        delay: 0.3,
                                    },
                                    {
                                        title: "Workout Scheduling",
                                        description: "Plan your training sessions and receive smart notifications.",
                                        icon: <ClientIcon size={24} className="text-[#FF6B00]" />,
                                        delay: 0.4,
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: feature.delay }}
                                        className="p-5 rounded-lg border border-gray-800 bg-black/30 transition-all duration-300 hover:border-[#FF6B00] hover:bg-black/50"
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1">{feature.icon}</div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                                                <p className="text-gray-300 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-10 flex flex-col sm:flex-row gap-4"
                            >
                                <Link href="#">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="orangeFilled"
                                            size="large"
                                            className="font-medium px-8 py-3 w-full sm:w-auto text-base"
                                        >
                                            Download App
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link href="#">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="orangeOutline"
                                            size="large"
                                            className="font-medium px-8 py-3 w-full sm:w-auto text-base"
                                        >
                                            Learn More
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                {/* Phone frame */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                    className="relative z-10 mx-auto w-[280px] sm:w-[320px] rounded-[40px] border-8 border-gray-800 bg-black shadow-xl overflow-hidden"
                                    style={{ height: "580px" }}
                                >
                                    {/* App screenshot placeholder */}
                                    <div className="h-full w-full relative flex items-center justify-center bg-[#0A0A0A]">
                                        {/* We'll replace this with an actual app screenshot */}
                                        <div className="absolute inset-0 flex flex-col">
                                            {/* App header */}
                                            <div className="py-4 px-5 border-b border-gray-800 flex items-center justify-between">
                                                <div className="text-[#FF6B00] font-bold">Antique</div>
                                                <UserProfileIcon size={20} className="text-white" />
                                            </div>

                                            {/* App content - workout plan */}
                                            <div className="flex-1 p-4 overflow-y-auto">
                                                <h4 className="text-lg font-bold mb-3">Today's Workout</h4>

                                                {/* Workout cards */}
                                                {[
                                                    {
                                                        name: "Warm-up Circuit",
                                                        duration: "10 min",
                                                        complete: true,
                                                    },
                                                    {
                                                        name: "Strength Training",
                                                        duration: "25 min",
                                                        complete: false,
                                                    },
                                                    {
                                                        name: "Core Workout",
                                                        duration: "15 min",
                                                        complete: false,
                                                    },
                                                    {
                                                        name: "Cooldown",
                                                        duration: "5 min",
                                                        complete: false,
                                                    },
                                                ].map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={`mb-3 p-3 rounded-lg border ${
                                                            item.complete
                                                                ? "border-[#FF6B00]/30 bg-[#FF6B00]/10"
                                                                : "border-gray-800 bg-black/30"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h5 className="font-medium">{item.name}</h5>
                                                                <p className="text-xs text-gray-400">{item.duration}</p>
                                                            </div>
                                                            {item.complete ? (
                                                                <div className="h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center">
                                                                    <CheckIcon size={12} className="text-white" />
                                                                </div>
                                                            ) : (
                                                                <div className="h-5 w-5 rounded-full border border-gray-600"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="mt-5">
                                                    <h4 className="text-lg font-bold mb-3">Progress</h4>
                                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                        <div className="h-full w-[25%] bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs">
                                                        <span className="text-gray-400">Week 1</span>
                                                        <span className="text-[#FF6B00]">25% Complete</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* App navigation */}
                                            <div className="py-3 px-5 border-t border-gray-800 flex items-center justify-around">
                                                <WorkoutIcon size={20} className="text-[#FF6B00]" />
                                                <TrainerIcon size={20} className="text-gray-500" />
                                                <ClientIcon size={20} className="text-gray-500" />
                                                <CheckIcon size={20} className="text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Background effects */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#FF9A00]/5 blur-[60px] -z-10"></div>
                                <div className="absolute top-1/4 left-1/4 w-[150px] h-[150px] rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-transparent blur-[40px] -z-10"></div>
                            </div>
                        </motion.div>
                    </div>
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
                                            <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
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
