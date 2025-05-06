"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { BrandLogo } from "@/components/custom/BrandLogo";

export function Navigation() {
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            
            // Check if page is scrolled to apply different styles
            if (position > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Set active section based on scroll position
            const scrollPosition = position + window.innerHeight / 3;

            const sections = ["hero", "features", "benefits", "trainers", "app", "cta"];

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && scrollPosition < element.offsetTop + element.offsetHeight) {
                    setActiveSection(section);
                    break;
                }
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

    // Function to navigate to contact page
    const navigateToContact = () => {
        router.push("/contact");
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`fixed top-0 z-50 w-full transition-all duration-500 
                ${scrolled 
                    ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/30 py-3" 
                    : "bg-transparent py-6"
                }
            `}
        >
            {/* Glass effect border */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent transition-opacity duration-300
                ${scrolled ? 'opacity-100' : 'opacity-0'}
            `}></div>
            
            {/* Glow effect on scroll */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent transition-opacity duration-300
                ${scrolled ? 'opacity-100' : 'opacity-0'}
            `}></div>
            
            <div className="container mx-auto flex items-center justify-between px-6">
                <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <Link href="/" className="flex items-center space-x-2 relative group">
                        {/* Logo glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <BrandLogo
                            className="flex items-center relative z-10"
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
                        { click: navigateToContact, label: "Contact" },
                    ].map((item) => (
                        <motion.button
                            key={item.id || (item.click ? "contact" : item.href)}
                            onClick={() => {
                                if (item.id) scrollToSection(item.id);
                                else if (item.click) item.click();
                            }}
                            className={`relative px-4 py-2 text-base font-semibold tracking-wide text-gray-300 transition-all duration-300 
                                ${activeSection === item.id 
                                    ? "text-[#FF6B00]" 
                                    : "hover:text-white"
                                }
                                group overflow-hidden
                            `}
                            whileHover={{ y: -3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            {/* Text glow effect */}
                            <span className="relative z-10">
                                {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                            </span>
                            
                            {/* Hover highlight effect */}
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-300 group-hover:w-full"></span>
                            
                            {/* Active indicator */}
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="activeSection"
                                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
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
                    className="md:hidden text-white focus:outline-none relative z-50 transition-transform duration-300 ease-in-out" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="sr-only">Open menu</span>
                    <div className="flex flex-col space-y-1.5 w-7">
                        <span
                            className={`h-0.5 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full transition-all duration-300 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
                        ></span>
                        <span
                            className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
                        ></span>
                        <span
                            className={`h-0.5 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full transition-all duration-300 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                        ></span>
                    </div>
                </button>

                {/* Login / Register buttons */}
                <div className="hidden md:flex items-center space-x-5">
                    <Link href="/auth/login">
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            {/* Button glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00]/0 to-[#FF9A00]/0 group-hover:from-[#FF6B00]/20 group-hover:to-[#FF9A00]/20 rounded-md blur-md transition-all duration-500"></div>
                            
                            <Button 
                                variant="orangeOutline" 
                                size="medium" 
                                className="font-semibold px-6 py-2.5 text-base relative z-10"
                            >
                                Login
                            </Button>
                        </motion.div>
                    </Link>
                    <Link href="/auth/register">
                        <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            {/* Button glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00]/0 to-[#FF9A00]/0 group-hover:from-[#FF6B00]/30 group-hover:to-[#FF9A00]/30 rounded-md blur-md transition-all duration-500"></div>
                            
                            <Button 
                                variant="orangeFilled" 
                                size="medium" 
                                className="font-semibold px-7 py-2.5 text-base relative z-10 overflow-hidden group"
                            >
                                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                                <span className="relative z-10">Register</span>
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
                    className="md:hidden fixed inset-0 top-[57px] z-40 bg-gradient-to-b from-black to-[#121212]/95 backdrop-blur-xl"
                >
                    <div className="container mx-auto px-6 py-10">
                        <div className="flex flex-col space-y-5">
                            {[
                                { id: "hero", label: "Home" },
                                { id: "features", label: "Features" },
                                { id: "benefits", label: "Benefits" },
                                { id: "trainers", label: "Trainers" },
                                { id: "app", label: "App" },
                                { click: navigateToContact, label: "Contact" },
                            ].map((item, index) => (
                                <motion.button
                                    key={item.id || (item.click ? "contact" : item.href)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    onClick={() => {
                                        if (item.id) {
                                            scrollToSection(item.id);
                                            setMobileMenuOpen(false);
                                        } else if (item.click) {
                                            item.click();
                                            setMobileMenuOpen(false);
                                        }
                                    }}
                                    className={`py-4 text-left text-xl font-semibold uppercase tracking-wide transition-all duration-300 border-b border-gray-800 flex items-center
                                    ${activeSection === item.id ? "text-[#FF6B00]" : "text-gray-300"}`}
                                >
                                    <span className="mr-3 text-[#FF6B00] opacity-60">0{index + 1}</span>
                                    {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                                    {activeSection === item.id && (
                                        <span className="ml-3 h-1 w-3 rounded-full bg-[#FF6B00]"></span>
                                    )}
                                </motion.button>
                            ))}
                            <div className="flex flex-col space-y-4 pt-8 mt-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 }}
                                >
                                    <Link href="/auth/login">
                                        <Button
                                            variant="orangeOutline"
                                            size="medium"
                                            className="w-full py-4 text-base font-semibold"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.7 }}
                                >
                                    <Link href="/auth/register">
                                        <Button
                                            variant="orangeFilled"
                                            size="medium"
                                            className="w-full py-4 text-base font-semibold"
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
