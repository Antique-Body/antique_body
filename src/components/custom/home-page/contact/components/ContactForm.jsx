import { motion } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/common/Button";

export function ContactForm() {
    const formRef = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
        >
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-transparent blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF9A00]/30 to-transparent blur-xl"></div>

            <div className="backdrop-blur-sm bg-black/40 border border-gray-800 p-8 rounded-xl relative z-10">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-6" ref={formRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">First Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Last Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                            placeholder="How can we help?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors h-32 resize-none"
                            placeholder="Your message here..."
                        ></textarea>
                    </div>
                    <Button variant="orangeFilled" size="large" className="w-full group relative overflow-hidden">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                        <span className="relative z-10">Send Message</span>
                    </Button>
                </form>
            </div>
        </motion.div>
    );
}
