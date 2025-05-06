"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/common/Footer";
import { Navigation } from "@/components/custom/contact/components";

export default function ContactPage() {
    return (
        <div className="bg-black min-h-screen text-white">
            {/* Background effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
                <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/5 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Get in <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">
                            Have questions about our Greek-inspired training methods? We're here to help you achieve your fitness goals.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center">
                                            <span className="mdi mdi-map-marker text-2xl text-white"></span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Location</h3>
                                            <p className="text-gray-300">123 Fitness Street, Athens, Greece</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center">
                                            <span className="mdi mdi-email text-2xl text-white"></span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Email</h3>
                                            <p className="text-gray-300">contact@antiquebody.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center">
                                            <span className="mdi mdi-phone text-2xl text-white"></span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Phone</h3>
                                            <p className="text-gray-300">+30 123 456 7890</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
                                <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center hover:opacity-90 transition-opacity">
                                        <span className="mdi mdi-instagram text-xl text-white"></span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center hover:opacity-90 transition-opacity">
                                        <span className="mdi mdi-facebook text-xl text-white"></span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center hover:opacity-90 transition-opacity">
                                        <span className="mdi mdi-twitter text-xl text-white"></span>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center hover:opacity-90 transition-opacity">
                                        <span className="mdi mdi-youtube text-xl text-white"></span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800"
                        >
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-none transition-colors h-32 resize-none"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium hover:opacity-90 transition-opacity"
                                >
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Frequently Asked <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">Questions</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    question: "What makes your training methods unique?",
                                    answer: "Our training methods combine ancient Greek athletic wisdom with modern scientific principles, creating a holistic approach to fitness that focuses on both physical and mental development."
                                },
                                {
                                    question: "How do I get started with a trainer?",
                                    answer: "Simply fill out our contact form or call us directly. We'll schedule a consultation to understand your goals and match you with the perfect trainer for your needs."
                                },
                                {
                                    question: "Do you offer online training sessions?",
                                    answer: "Yes, we offer both in-person and online training sessions. Our digital platform allows you to connect with trainers from anywhere in the world."
                                },
                                {
                                    question: "What are your operating hours?",
                                    answer: "Our facility is open Monday through Saturday, from 6 AM to 10 PM. Online training sessions can be scheduled 24/7 based on trainer availability."
                                }
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800"
                                >
                                    <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                                    <p className="text-gray-400">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-12 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Start Your <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">Journey</span>?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join our community of athletes and experience the perfect blend of ancient wisdom and modern training methods.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium hover:opacity-90 transition-opacity">
                                Get Started
                            </button>
                            <button className="px-8 py-3 rounded-lg border border-[#FF6B00] text-[#FF6B00] font-medium hover:bg-[#FF6B00]/10 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}