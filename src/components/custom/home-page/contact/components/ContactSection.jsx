import { motion } from "framer-motion";
import { useRef } from "react";

import { ContactForm } from "./ContactForm";
import { ContactInfoCard } from "./ContactInfoCard";

import { LocationIcon, MessageIcon, TimerIcon } from "@/components/common/Icons";

const contactInfoData = [
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
];

export const ContactSection = () => {
    // Add refs to ensure components are rendered properly
    const sectionRef = useRef(null);

    // Force layout recalculation to fix the issue where content doesn't appear until refresh

    return (
        <section id="contact" className="py-20 relative" ref={sectionRef}>
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
                        {contactInfoData.map((item, index) => (
                            <ContactInfoCard
                                key={index}
                                title={item.title}
                                content={item.content}
                                subContent={item.subContent}
                                icon={item.icon}
                                delay={item.delay}
                            />
                        ))}
                    </div>

                    {/* Contact Form */}
                    <ContactForm />
                </div>
            </div>
        </section>
    );
};
