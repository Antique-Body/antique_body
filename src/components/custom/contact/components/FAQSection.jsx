import { motion } from "framer-motion";

import { DiscusIcon } from "@/components/common/Icons";

// FAQ data
const faqData = [
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
];

export const FAQSection = () => (
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
                {faqData.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-[#FF6B00]/30 transition-all duration-300"
                    >
                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#FF6B00]">{faq.question}</h3>
                        <p className="text-gray-300">{faq.answer}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
