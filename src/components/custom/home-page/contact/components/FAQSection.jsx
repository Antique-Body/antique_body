import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export function FAQSection() {
    const faqs = [
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
    ];

    return (
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
                                <Icon icon="mdi:help-circle-outline" className="text-sm" />
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
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} faq={faq} index={index} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function FAQItem({ faq, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:help-circle-outline" className="text-xl text-[#FF6B00]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                </div>
            </div>
        </motion.div>
    );
}
