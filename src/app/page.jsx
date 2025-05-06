"use client";

import { motion, LazyMotion, domAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { Navigation, HeroSection, TopTrainersSection } from "@/components/custom/home-page/components";
import HomeBackground from "@/components/custom/home-page/components/HomeBackground";

// Optimize images with next/image
const images = {
    hero: {
        src: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Ancient Greek-inspired training",
        width: 600,
        height: 600,
    },
    benefits: {
        src: "https://images.stockcake.com/public/c/7/7/c77de2a6-0b4f-41f8-900d-372cefc0242e_large/ancient-athlete-training-stockcake.jpg",
        alt: "Ancient Greek-inspired training",
        width: 1000,
        height: 1000,
    },
    testimonial: {
        src: "https://media.istockphoto.com/id/1162483510/photo/doing-squat-exercise-confident-young-personal-trainer-is-showing-slim-athletic-woman-how-to.jpg?s=612x612&w=0&k=20&c=Kk0ZhdUEX9B6ip6wItLFKtuBiTbsZsx0uVmopJMTul4=",
        alt: "Ancient Greek-inspired training",
        width: 1000,
        height: 1000,
    }
};

// Memoize static data
const features = [
    {
        title: "Find Certified Trainers",
        description: "Connect with professional trainers near you who specialize in your specific goals and sport.",
        icon: <span className="mdi mdi-account-group text-3xl text-[#FF6B00]" />,
        delay: 0.1,
    },
    {
        title: "Client Matching",
        description: "Trainers can find clients who match their expertise area and training philosophy.",
        icon: <span className="mdi mdi-handshake text-3xl text-[#FF6B00]" />,
        delay: 0.2,
    },
    {
        title: "Greek-Inspired Training",
        description: "Workouts built on ancient athletic wisdom, adapted for modern fitness goals.",
        icon: <span className="mdi mdi-abacus text-3xl text-[#FF6B00] flex items-center justify-center" />,
        delay: 0.3,
    },
    {
        title: "Custom Workout Plans",
        description: "Personalized training programs tailored to your specific goals, preferences and abilities.",
        icon: <span className="mdi mdi-dumbbell text-3xl text-[#FF6B00]" />,
        delay: 0.4,
    },
    {
        title: "Progress Tracking",
        description: "Comprehensive analytics to monitor your performance and track your improvements over time.",
        icon: <span className="mdi mdi-chart-line text-3xl text-[#FF6B00]" />,
        delay: 0.5,
    },
    {
        title: "Achievement System",
        description: "Earn badges and rewards as you complete workouts and reach your fitness milestones.",
        icon: <span className="mdi mdi-trophy text-3xl text-[#FF6B00]" />,
        delay: 0.6,
    },
];

const appFeatures = [
    {
        title: "Track Your Progress",
        description: "Monitor your workouts, set goals, and track your improvements with detailed analytics.",
        icon: <span className="mdi mdi-chart-line text-2xl text-[#FF6B00]" />
    },
    {
        title: "Connect with Trainers",
        description: "Find and message certified trainers who specialize in Greek-inspired training methods.",
        icon: <span className="mdi mdi-message text-2xl text-[#FF6B00]" />
    },
    {
        title: "Custom Workout Plans",
        description: "Get personalized training programs tailored to your goals and fitness level.",
        icon: <span className="mdi mdi-dumbbell text-2xl text-[#FF6B00]" />
    }
];

const stats = [
    {
        value: 5000,
        label: "Active Users",
        suffix: "+",
        delay: 0.3,
        icon: <span className="mdi mdi-account-group text-2xl text-[#FF6B00]" />
    },
    {
        value: 10000,
        label: "Workouts Completed",
        suffix: "+",
        delay: 0.4,
        icon: <span className="mdi mdi-dumbbell text-2xl text-[#FF6B00]" />
    },
    {
        value: 98,
        label: "Satisfaction Rate",
        suffix: "%",
        delay: 0.5,
        icon: <span className="mdi mdi-thumb-up text-2xl text-[#FF6B00]" />
    }
];

export default function Home() {
    const featuresRef = useRef(null);
    const benefitsRef = useRef(null);
    const ctaRef = useRef(null);
    const appRef = useRef(null);

    return (
        <LazyMotion features={domAnimation}>
            <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
                {/* Main background with light effects */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
                    <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#FF6B00]/10 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                </div>

                <HomeBackground />

                <Navigation />

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                    <div className="container mx-auto px-4 z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className="order-2 lg:order-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="inline-flex items-center justify-center text-sm font-medium mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00]">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                                            <span className="mdi mdi-arrow-up text-sm" />
                                        </span>
                                        The ultimate trainer-client connection platform
                                    </div>
                                
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                                        <span className="text-white block mb-2">Discover Your</span>
                                        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block relative">
                                            Ancient Strength
                                            <svg width="100%" height="8" className="absolute -bottom-2 left-0" viewBox="0 0 400 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 5.5C96.5 1 148 1.5 399 5.5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
                                                <defs>
                                                    <linearGradient id="paint0_linear" x1="1" y1="5.5" x2="399" y2="5.5" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#FF6B00" stopOpacity="0"/>
                                                        <stop offset="0.5" stopColor="#FF6B00"/>
                                                        <stop offset="1" stopColor="#FF9A00" stopOpacity="0"/>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </span>
                                    </h1>
                                    
                                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg drop-shadow-sm">
                                        Connect trainers with clients through our platform inspired by ancient Greek athletic traditions.
                                        Transform your body and mind with time-tested methods and modern science.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-5">
                                        <Link href="/auth/register">
                                            <Button variant="orangeFilled" size="large" className="group relative overflow-hidden">
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                                                <span className="relative z-10">Start Your Journey</span>
                                            </Button>
                                        </Link>
                                        
                                        <Link href="/explore">
                                            <Button variant="outline" size="large" className="group">
                                                <span className="mr-2 group-hover:text-[#FF6B00] transition-colors">Explore</span>
                                                <span className="mdi mdi-arrow-right text-xl inline-block transform group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="order-1 lg:order-2 relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative aspect-square max-w-md mx-auto"
                                >
                                    <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_25px_rgba(255,107,0,0.1)]">
                                        <Image
                                            {...images.hero}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                    </div>
                                    
                                    <div className="absolute -top-5 -left-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>
                                    <div className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="absolute top-5 -right-10 lg:-right-16 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-xl max-w-[180px] z-20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-[#FF6B00]/20 flex-shrink-0">
                                                <span className="mdi mdi-alphabet-greek text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Ancient Wisdom</div>
                                                <div className="text-xs text-gray-400">Time-tested methods</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="absolute bottom-5 -left-10 lg:-left-16 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-xl max-w-[180px] z-20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-[#FF6B00]/20 flex-shrink-0">
                                                <span className="mdi mdi-dumbbell text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Modern Science</div>
                                                <div className="text-xs text-gray-400">Proven results</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" ref={featuresRef} className="relative py-24 md:py-32">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-20"
                        >
                            <div className="inline-block mb-3">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="h-[1px] w-10 bg-[#FF6B00]"></div>
                                    <div className="px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-sm font-medium">Discover</div>
                                    <div className="h-[1px] w-10 bg-[#FF6B00]"></div>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                    Revolutionary Features
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                                Our platform merges ancient athletic wisdom with cutting-edge technology
                                to deliver an unparalleled fitness experience
                            </p>
                        </motion.div>

                        <div className="flex justify-center mb-12">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center shadow-lg">
                                <span className="mdi mdi-temple-greek text-4xl text-white"></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: feature.delay }}
                                    className="feature-card group relative h-full overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 hover:-translate-y-2"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] w-24 h-24 -translate-y-12 translate-x-12 rotate-45 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                    </div>
                                    
                                    <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-500 group-hover:w-full"></div>
                                    
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#FF6B00]/10 transition-all duration-300 group-hover:bg-[#FF6B00]/20">
                                        <div className="flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300">{feature.description}</p>
                                    
                                    <div className="mt-6 flex items-center text-[#FF6B00] opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                        <span className="text-sm font-medium mr-2">Learn more</span>
                                        <span className="mdi mdi-arrow-right text-xl" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" ref={benefitsRef} className="relative py-24 md:py-32 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-block mb-4">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-[1px] w-10 bg-[#FF6B00]"></div>
                                    <div className="px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-sm font-medium">Benefits</div>
                                    <div className="h-[1px] w-10 bg-[#FF6B00]"></div>
                                </div>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                    Transform Your Body & Mind
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                                Combine ancient athletic wisdom with modern science for optimal physical performance
                                and reach your full athletic potential
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-7 relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 shadow-xl group hover:border-[#FF6B00]/30 transition-all duration-500"
                            >
                                <div className="aspect-[16/9] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
                                    <motion.div 
                                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 1.5 }}
                                    >
                                        <Image
                                            {...images.benefits}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                </div>

                                <div className="p-10 relative z-20 -mt-20">
                                    <div className="p-5 mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-xl">
                                        <span className="mdi mdi-temple-greek text-3xl text-white" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ancient Training Methods</h3>
                                    <p className="text-gray-300 mb-8 text-base md:text-lg">
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
                                                className="inline-block px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-sm font-medium text-[#FF6B00]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>

                            <div className="lg:col-span-5 grid grid-cols-1 gap-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-8 hover:border-[#FF6B00]/30 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-lg">
                                            <span className="mdi mdi-account-group text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FF6B00] transition-colors duration-300">Expert Coach Guidance</h3>
                                            <p className="text-gray-300 mb-6">
                                                Connect with certified professionals who specialize in ancient-inspired training
                                                methodologies, providing personalized guidance for your unique journey.
                                            </p>

                                            <ul className="space-y-3">
                                                {["Personalized coaching", "Form correction", "Progressive programming"].map(
                                                    (item, i) => (
                                                        <li key={i} className="flex items-center text-sm">
                                                            <span className="w-5 h-5 mr-3 flex-shrink-0 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                                                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                                                            </span>
                                                            <span className="text-gray-200">{item}</span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-8 hover:border-[#FF6B00]/30 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-lg">
                                            <span className="mdi mdi-dumbbell text-2xl text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FF6B00] transition-colors duration-300">Modern Performance Tracking</h3>
                                            <p className="text-gray-300 mb-6">
                                                Leverage cutting-edge technology to monitor your progress, track improvements in
                                                strength, endurance, and mobility through our comprehensive analytics.
                                            </p>

                                            <div className="space-y-4">
                                                {[
                                                    { label: "Strength Progress", value: "78%" },
                                                    { label: "Endurance", value: "65%" },
                                                    { label: "Mobility", value: "85%" }
                                                ].map((item, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-400">{item.label}</span>
                                                            <span className="text-[#FF6B00]">{item.value}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: item.value }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.4 + (i * 0.2) }}
                                                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                                            ></motion.div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
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
                                        <Image
                                            {...images.testimonial}
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

                {/* App Showcase */}
                <section id="app" ref={appRef} className="relative py-24 md:py-32 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                    Download Our App
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                                Experience the future of fitness training with our powerful mobile application.
                                Available for both iOS and Android devices.
                            </p>
                        </motion.div>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                {appFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800/50 hover:border-[#FF6B00]/30 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <div className="p-4 rounded-lg bg-[#FF6B00]/20 mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                        <p className="text-gray-300">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            >
                                <Link href="/auth/register">
                                    <Button variant="orangeFilled" size="large" className="w-full sm:w-auto text-lg px-8 py-4">
                                        Download for iOS
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button variant="orangeOutline" size="large" className="w-full sm:w-auto text-lg px-8 py-4">
                                        Download for Android
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="cta" ref={ctaRef} className="relative py-24 md:py-32">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-black via-gray-900 to-black p-10 md:p-16 lg:p-20"
                        >
                            <div className="relative z-10">
                                <div className="mx-auto max-w-3xl text-center">
                                    <div className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                                        <span className="text-[#FF6B00] text-sm font-medium">Transform Your Fitness Journey</span>
                                    </div>
                                    
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
                                    >
                                        Start Your <span className="text-[#FF6B00]">Greek-Inspired</span> 
                                        <br className="hidden md:block" /> Fitness Journey Today
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="mb-10 text-lg md:text-xl text-gray-300"
                                    >
                                        Join thousands of satisfied users who have achieved their fitness goals with our platform.
                                        Experience the perfect blend of ancient wisdom and modern science.
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="flex flex-col sm:flex-row gap-6 justify-center"
                                    >
                                        <Link href="/auth/register">
                                            <Button variant="orangeFilled" size="large" className="w-full sm:w-auto text-lg px-8 py-4 relative overflow-hidden group">
                                                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                                                <span className="relative">Start Free Trial</span>
                                            </Button>
                                        </Link>
                                        <Link href="/auth/login">
                                            <Button variant="orangeOutline" size="large" className="w-full sm:w-auto text-lg px-8 py-4">
                                                Login
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>

                                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {stats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: stat.delay }}
                                            className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 overflow-hidden group hover:border-[#FF6B00]/30 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 rounded-lg bg-[#FF6B00]/10">
                                                    {stat.icon}
                                                </div>
                                                <div className="text-gray-400 text-sm">{stat.label}</div>
                                            </div>
                                            
                                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                                {stat.value}{stat.suffix}
                                            </h3>
                                            
                                            <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "100%" }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, delay: stat.delay + 0.5 }}
                                                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                                ></motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </LazyMotion>
    );
}
