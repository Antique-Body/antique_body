import { motion } from "framer-motion";

import { ParthenonIcon } from "@/components/common/Icons";

export const HeroSection = () => (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 via-black to-black pointer-events-none"></div>
            <div className="absolute top-20 right-10 opacity-10">
                <ParthenonIcon size={400} className="text-[#FF6B00]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                            Get in Touch
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10">
                        We're here to answer your questions about Antique Body and help you start your fitness journey.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <a
                            href="#contact"
                            className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-semibold shadow-lg hover:shadow-[#FF6B00]/30 transition-all duration-300"
                        >
                            Contact Us Now
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
