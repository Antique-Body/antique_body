import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/custom/BrandLogo";

export const Navigation = () => {
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle navigation highlighting based on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Logic to determine active section based on scroll position
            if (scrollPosition < 300) {
                setActiveSection("");
            } else if (scrollPosition < 800) {
                setActiveSection("contact");
            } else {
                setActiveSection("faq");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800"
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <BrandLogo size="medium" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/"
                        className="relative px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                        <span className="text-lg font-medium">Home</span>
                        <motion.div
                            className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#FF6B00] group-hover:w-full transition-all duration-300"
                            whileHover={{ width: "100%" }}
                        />
                    </Link>
                    <Link
                        href="#contact"
                        className={`relative px-3 py-2 transition-colors duration-200 group ${
                            activeSection === "contact" ? "text-[#FF6B00]" : "text-gray-300 hover:text-white"
                        }`}
                    >
                        <span className="text-lg font-medium">Contact</span>
                        {activeSection === "contact" ? (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute bottom-0 left-0 h-0.5 w-full bg-[#FF6B00]"
                            />
                        ) : (
                            <motion.div
                                className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#FF6B00] group-hover:w-full transition-all duration-300"
                                whileHover={{ width: "100%" }}
                            />
                        )}
                    </Link>
                    <Link
                        href="#faq"
                        className={`relative px-3 py-2 transition-colors duration-200 group ${
                            activeSection === "faq" ? "text-[#FF6B00]" : "text-gray-300 hover:text-white"
                        }`}
                    >
                        <span className="text-lg font-medium">FAQ</span>
                        {activeSection === "faq" ? (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute bottom-0 left-0 h-0.5 w-full bg-[#FF6B00]"
                            />
                        ) : (
                            <motion.div
                                className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#FF6B00] group-hover:w-full transition-all duration-300"
                                whileHover={{ width: "100%" }}
                            />
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button className="text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <div className="flex flex-col space-y-1.5 w-6">
                            <span
                                className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
                            ></span>
                            <span
                                className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
                            ></span>
                            <span
                                className={`h-0.5 w-full bg-white transition-all duration-300 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                            ></span>
                        </div>
                    </button>
                </div>

                {/* Login Button with Animation */}
                <div className="hidden md:block">
                    <Link
                        href="/auth/login"
                        className="relative inline-flex items-center justify-center overflow-hidden rounded-md bg-transparent border border-[#FF6B00] px-5 py-3 text-[#FF6B00] transition-all duration-300 hover:bg-[#FF6B00] hover:text-white group"
                    >
                        <span className="relative z-10 text-lg font-medium">Login</span>
                        <motion.div
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            className="absolute left-0 top-0 h-full w-0 bg-[#FF6B00] opacity-20 transition-all duration-300 group-hover:opacity-100"
                        />
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
                    <div className="container mx-auto px-4 py-5">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="py-2 text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="#contact"
                                className={`py-2 transition-colors duration-200 text-lg font-medium ${activeSection === "contact" ? "text-[#FF6B00]" : "text-gray-300"}`}
                            >
                                Contact
                            </Link>
                            <Link
                                href="#faq"
                                className={`py-2 transition-colors duration-200 text-lg font-medium ${activeSection === "faq" ? "text-[#FF6B00]" : "text-gray-300"}`}
                            >
                                FAQ
                            </Link>
                            <div className="pt-4 border-t border-gray-800">
                                <Link
                                    href="/auth/login"
                                    className="block w-full rounded-md bg-transparent border border-[#FF6B00] px-4 py-3 text-center text-[#FF6B00] transition-all duration-300 text-lg font-medium"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};
