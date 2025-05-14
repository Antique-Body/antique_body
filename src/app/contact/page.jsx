"use client";

import { motion, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { Navigation } from "@/components/custom/home-page/shared";

export default function ContactPage() {
    const formRef = useRef(null);

    return (
        <LazyMotion features={domAnimation}>
            <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
                {/* Main background with light effects */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
                    <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
                    <div
                        className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#FF6B00]/10 blur-[150px] animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                </div>

                <Navigation />

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4 z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-7">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="inline-flex items-center justify-center text-sm font-medium mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                                            <span className="mdi mdi-email-outline text-sm" />
                                        </span>
                                        We're here to assist you
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                                        <span className="text-white block mb-2">Get in</span>
                                        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block relative">
                                            Touch
                                            <svg
                                                width="100%"
                                                height="8"
                                                className="absolute -bottom-2 left-0"
                                                viewBox="0 0 400 8"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1 5.5C96.5 1 148 1.5 399 5.5"
                                                    stroke="url(#paint0_linear)"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="paint0_linear"
                                                        x1="1"
                                                        y1="5.5"
                                                        x2="399"
                                                        y2="5.5"
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop stopColor="#FF6B00" stopOpacity="0" />
                                                        <stop offset="0.5" stopColor="#FF6B00" />
                                                        <stop offset="1" stopColor="#FF9A00" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </span>
                                    </h1>

                                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg drop-shadow-sm">
                                        Have questions about our Greek-inspired training methods? We're here to help you achieve
                                        your fitness goals.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="mdi mdi-map-marker text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Visit Us</h3>
                                                <p className="text-gray-400 text-sm">123 Fitness Street, Athens, Greece</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="mdi mdi-email-outline text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Email Us</h3>
                                                <p className="text-gray-400 text-sm">contact@antiquebody.com</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="mdi mdi-phone text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Call Us</h3>
                                                <p className="text-gray-400 text-sm">+30 123 456 7890</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold mb-3">Connect With Us</h3>
                                        <div className="flex space-x-4">
                                            {[
                                                { icon: "mdi-instagram", label: "Instagram" },
                                                { icon: "mdi-facebook", label: "Facebook" },
                                                { icon: "mdi-twitter", label: "Twitter" },
                                                { icon: "mdi-youtube", label: "YouTube" },
                                            ].map((social, index) => (
                                                <motion.a
                                                    key={index}
                                                    href="#"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                                    className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]/30 transition-all group"
                                                    aria-label={social.label}
                                                >
                                                    <span
                                                        className={`${social.icon} text-xl text-gray-400 group-hover:text-[#FF6B00] transition-colors`}
                                                    ></span>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="lg:col-span-5 relative">
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
                                            <Button
                                                variant="orangeFilled"
                                                size="large"
                                                className="w-full group relative overflow-hidden"
                                            >
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                                                <span className="relative z-10">Send Message</span>
                                            </Button>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
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
                            className="max-w-4xl mx-auto"
                        >
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center text-sm font-medium mb-4 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                                        <span className="mdi mdi-help-circle-outline text-sm" />
                                    </span>
                                    Common Questions
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    Frequently Asked{" "}
                                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                        Questions
                                    </span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {[
                                    {
                                        question: "What makes your training methods unique?",
                                        answer: "Our training methods combine ancient Greek athletic wisdom with modern scientific principles, creating a holistic approach to fitness that focuses on both physical and mental development.",
                                    },
                                    {
                                        question: "How do I get started with a trainer?",
                                        answer: "Simply fill out our contact form or call us directly. We'll schedule a consultation to understand your goals and match you with the perfect trainer for your needs.",
                                    },
                                    {
                                        question: "Do you offer online training sessions?",
                                        answer: "Yes, we offer both in-person and online training sessions. Our digital platform allows you to connect with trainers from anywhere in the world.",
                                    },
                                    {
                                        question: "What are your operating hours?",
                                        answer: "Our facility is open Monday through Saturday, from 6 AM to 10 PM. Online training sessions can be scheduled 24/7 based on trainer availability.",
                                    },
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                                                <span className="mdi mdi-help-circle-outline text-xl text-[#FF6B00]" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                                                <p className="text-gray-400">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="relative py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative rounded-xl overflow-hidden h-96 border border-gray-800">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9A00]/5 mix-blend-overlay pointer-events-none z-10"></div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.2681149157487!2d23.724059575847786!3d37.97118677193367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1f067043f1%3A0x18baa02380f7fa2f!2sAcropolis%20of%20Athens!5e0!3m2!1sen!2suk!4v1684931212357!5m2!1sen!2suk"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="container mx-auto px-4 z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/5 blur-[150px] opacity-50"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto text-center relative z-10"
                        >
                            <div className="inline-flex items-center justify-center text-sm font-medium mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                                    <span className="mdi mdi-flag-outline text-sm" />
                                </span>
                                Begin Your Transformation
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Ready to Start Your{" "}
                                <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                    Journey
                                </span>
                                ?
                            </h2>
                            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                                Join our community of athletes and experience the perfect blend of ancient wisdom and modern
                                training methods.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href="/auth/register">
                                    <Button variant="orangeFilled" size="large" className="group relative overflow-hidden px-8">
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                                        <span className="relative z-10">Get Started</span>
                                    </Button>
                                </Link>

                                <Link href="/explore">
                                    <Button variant="outline" size="large" className="group px-8">
                                        <span className="mr-2 group-hover:text-[#FF6B00] transition-colors">Learn More</span>
                                        <span className="mdi mdi-arrow-right text-xl inline-block transform group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="mdi mdi-check-circle text-[#FF6B00]"></span>
                                    <span>Professional Trainers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mdi mdi-check-circle text-[#FF6B00]"></span>
                                    <span>Ancient Greek Methods</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mdi mdi-check-circle text-[#FF6B00]"></span>
                                    <span>Personalized Plans</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mdi mdi-check-circle text-[#FF6B00]"></span>
                                    <span>Holistic Approach</span>
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
