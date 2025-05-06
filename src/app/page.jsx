"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";


import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { ClientIcon, CheckIcon, ParthenonIcon, WorkoutIcon, ColumnIcon, MessageIcon } from "@/components/common/Icons";
import { Counter } from "@/components/custom/Counter";
import { Navigation, HeroSection, TopTrainersSection } from "@/components/custom/home-page/components";
import HomeBackground from "@/components/custom/home-page/components/HomeBackground";

export default function Home() {
    const featuresRef = useRef(null);
    const benefitsRef = useRef(null);
    const ctaRef = useRef(null);
    const appRef = useRef(null);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
            {/* Main background with light effects */}
            <div className="fixed inset-0 z-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
                
                {/* Subtle light effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Main glow */}
                    <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/5 blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    
                    {/* Accent glows */}
                    <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FF6B00]/3 blur-[80px]"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF9A00]/3 blur-[80px]"></div>
                </div>
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B00]/5 to-transparent"></div>
            </div>

            <HomeBackground />

            {/* Navigation */}
            <Navigation />

            {/* Hero Section - Enhanced with new design */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Enhanced decorative elements */}
                <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-transparent blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-gradient-to-tl from-[#FF9A00]/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="absolute top-2/3 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-[#FF6B00]/10 to-transparent blur-2xl animate-pulse" style={{ animationDelay: "3s" }}></div>
                
                {/* Greek pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2740%27%20height%3D%2740%27%20viewBox%3D%270%200%2040%2040%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M0%2C20%20L10%2C10%20L20%2C20%20L30%2C10%20L40%2C20%27%20stroke%3D%27%23FF6B00%27%20stroke-opacity%3D%270.03%27%20fill%3D%27none%27%20stroke-width%3D%271%27%2F%3E%3C%2Fsvg%3E')] opacity-30"></div>
                
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
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L4 10 12 18 20 10z"></path>
                                        </svg>
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
                                            <svg className="w-5 h-5 inline-block transform group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Button>
                                    </Link>
                                </div>
                                
                                <div className="mt-10 flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FF6B00]/30 bg-gray-800 relative z-[${4-i}]"></div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="font-medium text-[#FF6B00]">5,000+ Users</div>
                                        <div className="text-sm text-gray-400">Join our community</div>
                                    </div>
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
                                        src="https://images.unsplash.com/photo-1577221084712-45b0445d2b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Ancient Greek-inspired training"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Image overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute -top-5 -left-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>
                                <div className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>
                                
                                {/* Feature badges - Fixed positioning to prevent them from being hidden */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="absolute top-5 -right-10 lg:-right-16 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-xl max-w-[180px] z-20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-[#FF6B00]/20 flex-shrink-0">
                                            <ParthenonIcon size={20} className="text-[#FF6B00]" />
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
                                            <WorkoutIcon size={20} className="text-[#FF6B00]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Modern Science</div>
                                            <div className="text-xs text-gray-400">Proven results</div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Floating stat badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.6 }}
                                    className="absolute -bottom-16 right-8 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md p-4 rounded-full border border-gray-800 shadow-xl z-20"
                                >
                                    <div className="flex flex-col items-center justify-center w-24 h-24">
                                        <div className="text-3xl font-bold text-[#FF6B00]">98%</div>
                                        <div className="text-xs text-center text-gray-300">Success Rate</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll indicator */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                >
                    <div className="text-sm text-gray-400 mb-2">Scroll to discover</div>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-6 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center p-1"
                    >
                        <motion.div 
                            animate={{ height: ["30%", "60%", "30%"] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1 bg-[#FF6B00] rounded-full"
                        ></motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section with staggered animations */}
            <section id="features" ref={featuresRef} className="relative py-24 md:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#FF6B00]/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-[#FF6B00]/10 to-transparent rounded-full blur-3xl"></div>
                </div>
                
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
                                className="feature-card group relative h-full overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 hover:-translate-y-2"
                            >
                                {/* Corner decorative element */}
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] w-24 h-24 -translate-y-12 translate-x-12 rotate-45 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                </div>
                                
                                {/* Top bar indicator */}
                                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-500 group-hover:w-full"></div>
                                
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[#FF6B00]/10 transition-all duration-300 group-hover:bg-[#FF6B00]/20">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300">{feature.description}</p>
                                
                                {/* Hidden arrow that appears on hover */}
                                <div className="mt-6 flex items-center text-[#FF6B00] opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    <span className="text-sm font-medium mr-2">Learn more</span>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section with enhanced design and images */}
            <section id="benefits" ref={benefitsRef} className="relative py-24 md:py-32 overflow-hidden">
                {/* Enhanced background elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black via-[#0f0f0f]/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-black via-[#0f0f0f]/80 to-transparent"></div>
                    
                    <svg className="absolute inset-0 w-full h-full opacity-5" width="100%" height="100%">
                        <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="40" stroke="#FF6B00" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#diagonalLines)" />
                    </svg>
                </div>

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

                    {/* Main benefit cards with image integration */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-7 relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 shadow-xl group hover:border-[#FF6B00]/30 transition-all duration-500"
                        >
                            {/* Subtle animation on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/0 via-[#FF6B00]/5 to-[#FF6B00]/0 -translate-x-full group-hover:translate-x-full transition-all duration-1500 ease-in-out"></div>
                            
                            {/* Benefit image */}
                            <div className="aspect-[16/9] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 1.5 }}
                                >
                                    <Image
                                        src="https://images.stockcake.com/public/c/7/7/c77de2a6-0b4f-41f8-900d-372cefc0242e_large/ancient-athlete-training-stockcake.jpg"
                                        alt="Ancient Greek-inspired training"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            {/* Content overlay */}
                            <div className="p-10 relative z-20 -mt-20">
                                <div className="p-5 mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-xl">
                                    <ParthenonIcon size={32} className="text-white" />
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
                            {/* Secondary benefit card 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-8 hover:border-[#FF6B00]/30 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-lg">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="text-white"
                                            width="28"
                                            height="28"
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
                                        
                                        <div className="mt-6 flex items-center text-[#FF6B00] opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            <span className="text-sm font-medium mr-2">Learn more</span>
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Secondary benefit card 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg p-8 hover:border-[#FF6B00]/30 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] shadow-lg">
                                        <WorkoutIcon size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FF6B00] transition-colors duration-300">Modern Performance Tracking</h3>
                                        <p className="text-gray-300 mb-6">
                                            Leverage cutting-edge technology to monitor your progress, track improvements in
                                            strength, endurance, and mobility through our comprehensive analytics.
                                        </p>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Strength Progress</span>
                                                    <span className="text-[#FF6B00]">78%</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "78%" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: 0.4 }}
                                                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Endurance</span>
                                                    <span className="text-[#FF6B00]">65%</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "65%" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: 0.6 }}
                                                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Mobility</span>
                                                    <span className="text-[#FF6B00]">85%</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "85%" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: 0.8 }}
                                                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Testimonial section - Enhanced design */}
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

            {/* App Showcase - Enhanced */}
            <section id="app" ref={appRef} className="relative py-24 md:py-32 overflow-hidden">
                {/* App section specific background */}
                <div className="absolute inset-0">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B00]/5 to-transparent"></div>
                    
                    {/* Decorative glows */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF6B00]/10 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FF6B00]/10 to-transparent"></div>
                    
                    {/* Floating light orbs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/5 blur-[100px] animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#FF9A00]/5 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

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
                        {/* App Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    title: "Track Your Progress",
                                    description: "Monitor your workouts, set goals, and track your improvements with detailed analytics.",
                                    icon: <WorkoutIcon size={24} className="text-[#FF6B00]" />
                                },
                                {
                                    title: "Connect with Trainers",
                                    description: "Find and message certified trainers who specialize in Greek-inspired training methods.",
                                    icon: <MessageIcon size={24} className="text-[#FF6B00]" />
                                },
                                {
                                    title: "Custom Workout Plans",
                                    description: "Get personalized training programs tailored to your goals and fitness level.",
                                    icon: <CheckIcon size={24} className="text-[#FF6B00]" />
                                }
                            ].map((feature, index) => (
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

                        {/* Download Buttons */}
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

            {/* CTA Section with animated stats */}
            <section id="cta" ref={ctaRef} className="relative py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-black via-gray-900 to-black p-10 md:p-16 lg:p-20"
                    >
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <svg 
                                width="100%" 
                                height="100%" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute inset-0"
                            >
                                <defs>
                                    <pattern id="greek-key" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M0,20 L10,10 L20,20 L30,10 L40,20" stroke="#FF6B00" fill="none" strokeWidth="1"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#greek-key)" />
                            </svg>
                            
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
                                className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border-2 border-dashed border-[#FF6B00]/20"
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
                                className="absolute -left-40 -bottom-40 h-[500px] w-[500px] rounded-full border-2 border-dashed border-[#FF6B00]/20"
                            ></motion.div>
                        </div>
                        
                        {/* Glowing orbs */}
                        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#FF6B00]/10 blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-[#FF9A00]/10 blur-3xl"></div>

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

                            {/* Animated Stats with visual improvements */}
                            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        value: 5000,
                                        label: "Active Users",
                                        suffix: "+",
                                        delay: 0.3,
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF6B00]">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )
                                    },
                                    {
                                        value: 10000,
                                        label: "Workouts Completed",
                                        suffix: "+",
                                        delay: 0.4,
                                        icon: <WorkoutIcon size={24} className="text-[#FF6B00]" />
                                    },
                                    {
                                        value: 98,
                                        label: "Satisfaction Rate",
                                        suffix: "%",
                                        delay: 0.5,
                                        icon: <CheckIcon size={24} className="text-[#FF6B00]" />
                                    },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: stat.delay }}
                                        className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 overflow-hidden group hover:border-[#FF6B00]/30 transition-all duration-300"
                                    >
                                        {/* Animated highlight on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/0 via-[#FF6B00]/5 to-[#FF6B00]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>
                                        
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-lg bg-[#FF6B00]/10">
                                                {stat.icon}
                                            </div>
                                            <div className="text-gray-400 text-sm">{stat.label}</div>
                                        </div>
                                        
                                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                            <Counter end={stat.value} suffix={stat.suffix} duration={2500} />
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

            {/* Footer */}
            <Footer />
        </div>
    );
}
