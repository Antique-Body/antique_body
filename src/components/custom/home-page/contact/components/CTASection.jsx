import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/common/Button";

export function CTASection() {
    const features = ["Professional Trainers", "Ancient Greek Methods", "Personalized Plans", "Holistic Approach"];

    return (
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
                            <Icon icon="mdi:flag-outline" className="text-sm" />
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
                        Join our community of athletes and experience the perfect blend of ancient wisdom and modern training
                        methods.
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
                                <Icon
                                    icon="mdi:arrow-right"
                                    className="text-xl inline-block transform group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]"
                                />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6 text-gray-400">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="text-[#FF6B00]" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
