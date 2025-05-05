import { motion } from "framer-motion";
import Link from "next/link";

export const CallToAction = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-black to-[#0D0D0D]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[#1A1A1A] to-black border border-gray-800 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Body?</h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of athletes who have discovered the power of ancient wisdom combined with modern science.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-semibold shadow-lg hover:shadow-[#FF6B00]/30 transition-all duration-300"
                    >
                        Start Your Journey Today
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
