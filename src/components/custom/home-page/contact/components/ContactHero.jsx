import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { ContactForm } from "./ContactForm";

export function ContactHero() {
    return (
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
                                    <Icon icon="mdi:email-outline" className="text-sm" />
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
                                Have questions about our Greek-inspired training methods? We're here to help you achieve your
                                fitness goals.
                            </p>

                            <ContactInfo />
                            <SocialLinks />
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactInfo() {
    const contactItems = [
        {
            icon: "mdi:map-marker",
            title: "Visit Us",
            info: "123 Fitness Street, Athens, Greece",
        },
        {
            icon: "mdi:email-outline",
            title: "Email Us",
            info: "contact@antiquebody.com",
        },
        {
            icon: "mdi:phone",
            title: "Call Us",
            info: "+30 123 456 7890",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactItems.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon icon={item.icon} className="text-xl text-[#FF6B00]" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.info}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function SocialLinks() {
    const socialLinks = [
        { icon: "mdi:instagram", label: "Instagram" },
        { icon: "mdi:facebook", label: "Facebook" },
        { icon: "mdi:twitter", label: "Twitter" },
        { icon: "mdi:youtube", label: "YouTube" },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Connect With Us</h3>
            <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                    <motion.a
                        key={index}
                        href="#"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]/30 transition-all group"
                        aria-label={social.label}
                    >
                        <Icon
                            icon={social.icon}
                            className="text-xl text-gray-400 group-hover:text-[#FF6B00] transition-colors"
                        />
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
