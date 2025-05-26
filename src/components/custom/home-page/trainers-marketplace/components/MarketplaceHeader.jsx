import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";

export const MarketplaceHeader = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled ? "py-3 bg-black/80 backdrop-blur-md shadow-md" : "py-5 bg-transparent"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="mr-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-2xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent"
                            >
                                ANTIQUE
                            </motion.div>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/trainers-marketplace" className="text-white font-medium relative">
                                Trainers
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                                />
                            </Link>
                            <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex relative">
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="bg-zinc-900/70 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] w-48 lg:w-64 transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon icon="mdi:magnify" className="h-5 w-5 text-zinc-400" />
                            </div>
                        </div>

                        <Link href="/auth/login">
                            <Button variant="outline" size="small">
                                Log in
                            </Button>
                        </Link>

                        <Link href="/auth/register">
                            <Button variant="orangeFilled" size="small">
                                Sign up
                            </Button>
                        </Link>

                        <button className="md:hidden text-white hover:text-[#FF6B00] transition-colors">
                            <Icon icon="mdi:menu" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
