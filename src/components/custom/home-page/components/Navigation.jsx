"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { BrandLogo } from "@/components/custom/BrandLogo";

export function Navigation() {
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Handle scroll animation
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;

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
                        { click: navigateToContact, label: "Contact" },
                    ].map((item) => (
                        <motion.button
                            key={item.id || (item.click ? "contact" : item.href)}
                            onClick={() => {
                                if (item.id) scrollToSection(item.id);
                                else if (item.click) item.click();
                            }}
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
                <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                                { click: navigateToContact, label: "Contact" },
                            ].map((item) => (
                                <button
                                    key={item.id || (item.click ? "contact" : item.href)}
                                    onClick={() => {
                                        if (item.id) {
                                            scrollToSection(item.id);
                                            setMobileMenuOpen(false);
                                        } else if (item.click) {
                                            item.click();
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
    );
}
