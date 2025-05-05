"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Footer } from "@/components/common/Footer";
import { CheckIcon, MessageIcon, LocationIcon, TimerIcon, ParthenonIcon, DiscusIcon } from "@/components/common/Icons";
import { BrandLogo } from "@/components/custom/BrandLogo";

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            // Reset form after submission
            setFormState({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            // Reset submission state after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Navigation */}
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

            {/* Hero Section */}
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

            {/* Contact Section */}
            <section id="contact" className="py-20 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Connect With Us
                            </span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            We're here to help you on your fitness journey. Reach out to us through any of these channels.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Our Location",
                                    content: "123 Fitness Avenue, Athens, Greece",
                                    icon: <LocationIcon size={24} className="text-[#FF6B00]" />,
                                    delay: 0.1,
                                },
                                {
                                    title: "Email Address",
                                    content: "support@antiquebody.com",
                                    icon: <MessageIcon size={24} className="text-[#FF6B00]" />,
                                    delay: 0.2,
                                },
                                {
                                    title: "Phone Number",
                                    content: "+30 123 456 7890",
                                    icon: <TimerIcon size={24} className="text-[#FF6B00]" />,
                                    delay: 0.3,
                                },
                                {
                                    title: "Business Hours",
                                    content: "Mon-Fri: 9:00 AM - 6:00 PM",
                                    subContent: "Sat: 10:00 AM - 4:00 PM, Sun: Closed",
                                    icon: <TimerIcon size={24} className="text-[#FF6B00]" />,
                                    delay: 0.4,
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: item.delay, duration: 0.5 }}
                                    className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6 hover:border-[#FF6B00]/30 transition-all duration-300"
                                >
                                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-[#FF6B00]/5 to-transparent blur-xl"></div>

                                    <div className="mb-4 p-3 w-14 h-14 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center group-hover:bg-[#FF6B00]/20 transition-colors duration-300">
                                        {item.icon}
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#FF6B00] transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-300">{item.content}</p>
                                    {item.subContent && <p className="text-gray-400 text-sm mt-1">{item.subContent}</p>}
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6 md:p-8 shadow-lg"
                        >
                            <h3 className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Send Us a Message
                            </h3>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg p-6 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B00]/20 mb-4">
                                        <CheckIcon size={24} className="text-[#FF6B00]" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                    <p className="text-gray-300">
                                        Thank you for reaching out. We'll get back to you as soon as possible.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B00] transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                                                Your Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B00] transition-colors"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-300">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formState.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B00] transition-colors"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-300">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B00] transition-colors resize-none"
                                            placeholder="Type your message here..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-3 px-6 rounded-lg ${
                                                loading
                                                    ? "bg-gray-700 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:shadow-lg hover:shadow-[#FF6B00]/20"
                                            } transition-all duration-300 flex items-center justify-center`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <MessageIcon size={18} className="mr-2" /> Send Message
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12 relative bg-gradient-to-b from-black to-[#0A0A0A]">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="rounded-xl overflow-hidden border border-gray-800 h-[400px] relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                        <Image
                            src="https://maps.googleapis.com/maps/api/staticmap?center=Athens,Greece&zoom=13&size=1200x400&maptype=roadmap&markers=color:orange%7CAthens,Greece&key=YOUR_API_KEY"
                            alt="Location Map"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-gray-800">
                            <h3 className="text-xl font-bold mb-1 text-[#FF6B00]">Athens Headquarters</h3>
                            <p className="text-white">123 Fitness Avenue, Athens, Greece</p>
                            <a
                                href="https://maps.google.com/?q=Athens,Greece"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-[#FF6B00] hover:text-white transition-colors"
                            >
                                Get Directions
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 relative">
                <div className="absolute right-0 top-20 opacity-5">
                    <DiscusIcon size={300} className="text-white" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </span>
                        </h2>
                        <p className="text-lg text-gray-300">Find answers to the most common questions about Antique Body</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                question: "What is Antique Body?",
                                answer: "Antique Body is a fitness platform that combines ancient Greek training methodologies with modern science to help you achieve optimal physical performance and wellbeing.",
                            },
                            {
                                question: "How do I find a trainer?",
                                answer: "Our platform allows you to browse certified trainers based on your preferences, location, and goals. You can filter by specialty, read reviews, and schedule consultations.",
                            },
                            {
                                question: "Can I train without a coach?",
                                answer: "Yes! We offer AI-generated workout plans tailored to your specific goals, fitness level, and available equipment for those who prefer to train independently.",
                            },
                            {
                                question: "What makes your approach unique?",
                                answer: "We integrate time-tested techniques from ancient Greek athletics with contemporary exercise science. Our holistic approach focuses on functional strength, natural movement, and mental discipline.",
                            },
                            {
                                question: "How do I get started?",
                                answer: "Simply register for an account, complete your profile with your fitness goals and preferences, and you'll be able to access trainers, workout plans, and all our features.",
                            },
                            {
                                question: "Do you offer nutrition guidance?",
                                answer: "Yes, our platform includes nutrition recommendations based on Mediterranean principles, which complement our training methodology for optimal results.",
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-[#FF6B00]/30 transition-all duration-300"
                            >
                                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#FF6B00]">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-300">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
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
                            Join thousands of athletes who have discovered the power of ancient wisdom combined with modern
                            science.
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

            <Footer />
        </div>
    );
}
