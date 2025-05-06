import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const ImprovedTestimonial = ({ testimonialImage }) => {
    const [activeMetric, setActiveMetric] = useState(0);

    // Metrics with enhanced animation states
    const metrics = [
        { label: "Strength", value: "+27%", percent: 78, color: "from-[#FF6B00] to-[#FF9A00]" },
        { label: "Endurance", value: "+42%", percent: 65, color: "from-[#4089FF] to-[#A2C4FF]" },
        { label: "Recovery", value: "+33%", percent: 85, color: "from-[#22c55e] to-[#86efac]" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-40 overflow-hidden"
        >
            {/* Animated background elements - more subtle and layered */}
            <div className="absolute w-full h-full max-w-[1800px] mx-auto inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/5 blur-[120px]"></div>
                <div className="absolute -bottom-20 -right-40 w-[500px] h-[500px] rounded-full bg-[#FF9A00]/5 blur-[100px]"></div>
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                        scale: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] opacity-10"
                >
                    <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#FF6B00]/30 to-transparent"></div>
                    <div className="absolute top-0 left-2/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#FF6B00]/20 to-transparent"></div>
                    <div className="absolute top-0 left-3/4 w-[2px] h-full bg-gradient-to-b from-transparent via-[#FF6B00]/30 to-transparent"></div>
                    <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent"></div>
                    <div className="absolute top-2/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent"></div>
                    <div className="absolute top-3/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent"></div>
                </motion.div>
            </div>

            {/* Section heading - Added for better context */}
            <div className="relative z-10 text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                    <span className="text-sm font-medium text-[#FF6B00]">Success Stories</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                        Transform Your Fitness
                    </span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    See how our platform has helped real clients achieve their fitness goals with the perfect blend of ancient
                    wisdom and modern science.
                </p>
            </div>

            {/* Testimonial content - Enhanced layout with improved animations */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                    <div className="md:col-span-7 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="absolute -left-10 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#FF6B00] to-transparent"
                        ></motion.div>

                        <div className="pl-6">
                            <div className="text-[#FF6B00] text-8xl opacity-20 font-serif leading-none mb-6">"</div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-100 font-light mb-10"
                            >
                                The ancient-inspired training methods combined with modern tracking have
                                <span className="relative inline-block px-2">
                                    <span className="absolute inset-0 bg-[#FF6B00]/10 rounded-md -skew-x-6"></span>
                                    <span className="relative text-white font-normal"> transformed my physique </span>
                                </span>
                                and mindset. I've never felt stronger or more capable.
                            </motion.p>

                            <div className="flex items-center gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] p-0.5"
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src="https://randomuser.me/api/portraits/men/35.jpg"
                                            alt="Michael K."
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-xl font-bold"
                                    >
                                        Michael K.
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="text-gray-400 flex items-center gap-3"
                                    >
                                        <span>Training for 4 months</span>
                                        <span className="h-1 w-1 rounded-full bg-[#FF6B00]"></span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-[#FF6B00] text-sm mdi mdi-star" />
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced visual representation */}
                    <div className="md:col-span-5">
                        <div className="relative">
                            {/* Floating device with interactive stats screens */}
                            <div className="relative mx-auto w-fit">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                    className="relative w-[300px] aspect-[9/16] rounded-[32px] overflow-hidden border border-gray-800 backdrop-blur-sm bg-black/40 shadow-[0_0_40px_rgba(255,107,0,0.15)]"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Image
                                        src={testimonialImage}
                                        alt="Fitness Transformation"
                                        fill
                                        className="object-cover opacity-60"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                                    {/* Interactive stats overlay with hover effects */}
                                    <div className="absolute inset-0 flex flex-col p-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                            className="mb-auto"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center text-white">
                                                    <span className="mdi mdi-chart-line text-lg" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">Progress Report</div>
                                                    <div className="text-gray-400 text-xs">Last 4 months</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <div className="mt-auto">
                                            <div className="mb-5 space-y-3">
                                                {metrics.map((metric, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                                        className="cursor-pointer"
                                                        onMouseEnter={() => setActiveMetric(index)}
                                                    >
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm text-white">{metric.label}</span>
                                                            <span
                                                                className={`text-sm ${index === activeMetric ? "text-white" : "text-[#FF6B00]"}`}
                                                            >
                                                                {metric.value}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`h-1.5 bg-gray-800/80 rounded-full overflow-hidden ${index === activeMetric ? "ring-1 ring-[#FF6B00]/50" : ""}`}
                                                        >
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${metric.percent}%` }}
                                                                viewport={{ once: true }}
                                                                whileHover={{ scale: 1.02, y: -0.5 }}
                                                                transition={{ duration: 1.5, delay: 0.8 + index * 0.2 }}
                                                                className={`h-full bg-gradient-to-r ${metric.color}`}
                                                            ></motion.div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 1.2, duration: 0.5 }}
                                                className="flex items-center justify-between pt-3 border-t border-gray-700/50"
                                            >
                                                <div>
                                                    <div className="text-xs text-gray-400">Weekly Progress</div>
                                                    <div className="text-xl font-semibold text-white">Outstanding</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center">
                                                    <span className="mdi mdi-arrow-up text-lg text-white"></span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Decorative elements */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, duration: 0.7 }}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF6B00]/20 rounded-full blur-[10px]"
                                ></motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7, duration: 0.7 }}
                                    className="absolute -bottom-3 -left-3 w-8 h-8 bg-[#FF9A00]/20 rounded-full blur-[10px]"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
