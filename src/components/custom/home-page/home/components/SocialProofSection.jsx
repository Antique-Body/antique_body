import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";

export const SocialProofSection = () => {
  const testimonialRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Testimonial data
  const testimonials = [
    {
      quote:
        "The ancient-inspired training methods combined with modern tracking have transformed my physique and mindset. I've never felt stronger or more capable.",
      author: "Michael K.",
      role: "Training for 4 months",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      metrics: [
        {
          label: "Strength",
          value: "+27%",
          color: "from-[#FF6B00] to-[#FF9A00]",
        },
        {
          label: "Endurance",
          value: "+42%",
          color: "from-[#4089FF] to-[#A2C4FF]",
        },
        {
          label: "Recovery",
          value: "+33%",
          color: "from-[#22c55e] to-[#86efac]",
        },
      ],
    },
    {
      quote:
        "As a professional trainer, I've found this platform incredibly valuable. The client matching system has connected me with ideal clients who align with my training philosophy.",
      author: "Sarah J.",
      role: "Certified Trainer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      metrics: [
        { label: "Clients", value: "+8", color: "from-[#FF6B00] to-[#FF9A00]" },
        {
          label: "Retention",
          value: "95%",
          color: "from-[#4089FF] to-[#A2C4FF]",
        },
        {
          label: "Revenue",
          value: "+40%",
          color: "from-[#22c55e] to-[#86efac]",
        },
      ],
    },
    {
      quote:
        "The combination of ancient techniques with modern analytics has taken my training to another level. The progress tracking features keep me motivated and accountable.",
      author: "David L.",
      role: "Training for 6 months",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      metrics: [
        {
          label: "Weight",
          value: "-15kg",
          color: "from-[#FF6B00] to-[#FF9A00]",
        },
        {
          label: "Muscle",
          value: "+6kg",
          color: "from-[#4089FF] to-[#A2C4FF]",
        },
        { label: "PRs Set", value: "12", color: "from-[#22c55e] to-[#86efac]" },
      ],
    },
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden">
      {/* Background elements */}
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
            scale: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
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

      {/* Section Header */}
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
            <span className="text-sm font-medium text-[#FF6B00]">
              Success Stories
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real results from real people. See how our platform has transformed
            lives and helped users achieve their fitness goals.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div ref={testimonialRef} className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left column: Testimonial */}
            <div className="lg:col-span-7 relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="absolute -left-10 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#FF6B00] to-transparent"
              ></motion.div>

              <div className="pl-6">
                <div className="relative h-[300px]">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: activeTestimonial === index ? 1 : 0,
                        x: activeTestimonial === index ? 0 : 20,
                        display: activeTestimonial === index ? "block" : "none",
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="text-[#FF6B00] text-8xl opacity-20 font-serif leading-none mb-6">
                        "
                      </div>

                      <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-100 font-light mb-10">
                        <span className="relative">
                          {testimonial.quote.split(" ").map((word, i) => (
                            <span
                              key={i}
                              className={
                                i % 8 === 0
                                  ? "relative inline-block px-2 mx-1"
                                  : ""
                              }
                            >
                              {i % 8 === 0 && (
                                <span className="absolute inset-0 bg-[#FF6B00]/10 rounded-md -skew-x-6"></span>
                              )}
                              <span
                                className={
                                  i % 8 === 0
                                    ? "relative text-white font-normal"
                                    : ""
                                }
                              >
                                {word}{" "}
                              </span>
                            </span>
                          ))}
                        </span>
                      </p>

                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.author}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-xl font-bold">
                            {testimonial.author}
                          </div>
                          <div className="text-gray-400 flex items-center gap-3">
                            <span>{testimonial.role}</span>
                            <span className="h-1 w-1 rounded-full bg-[#FF6B00]"></span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className="text-[#FF6B00] text-sm mdi mdi-star"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation dots */}
                <div className="flex items-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        activeTestimonial === index
                          ? "orangeFilled"
                          : "secondary"
                      }
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full min-w-0 min-h-0 p-0 transition-all ${
                        activeTestimonial === index
                          ? "w-10"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Stats visualization */}
            <div className="lg:col-span-5">
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: activeTestimonial === index ? 1 : 0,
                      scale: activeTestimonial === index ? 1 : 0.95,
                      display: activeTestimonial === index ? "block" : "none",
                    }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-[3/4] bg-gradient-to-b from-gray-900/70 to-black/70 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 overflow-hidden"
                  >
                    {/* Stats header */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                          <span className="mdi mdi-trending-up text-xl text-[#FF6B00]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Progress Stats
                          </h3>
                          <p className="text-xs text-gray-400">Last 4 months</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs text-gray-300">
                        Personal Best
                      </div>
                    </div>

                    {/* Stats visualization */}
                    <div className="space-y-6">
                      {testimonial.metrics.map((metric, i) => (
                        <div key={i} className="relative">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white">
                              {metric.label}
                            </span>
                            <span className="text-sm bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent font-medium">
                              {metric.value}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: 1.5,
                                delay: 0.2 + i * 0.2,
                              }}
                              className={`h-full bg-gradient-to-r ${metric.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional stats presentation */}
                    <div className="absolute bottom-6 right-6 w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#1f1f1f"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="url(#statsGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray="339.29"
                          initial={{ strokeDashoffset: 339.29 }}
                          animate={{ strokeDashoffset: 339.29 * (1 - 0.85) }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                        <defs>
                          <linearGradient
                            id="statsGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#FF6B00" />
                            <stop offset="100%" stopColor="#FF9A00" />
                          </linearGradient>
                        </defs>
                        <text
                          x="60"
                          y="55"
                          textAnchor="middle"
                          fill="white"
                          fontSize="18"
                          fontWeight="bold"
                        >
                          85%
                        </text>
                        <text
                          x="60"
                          y="75"
                          textAnchor="middle"
                          fill="#9ca3af"
                          fontSize="10"
                        >
                          Goal Progress
                        </text>
                      </svg>
                    </div>

                    {/* Background decorative elements */}
                    <div className="absolute -z-10 -top-20 -right-20 w-40 h-40 bg-[#FF6B00]/10 rounded-full blur-[50px]"></div>
                    <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#FF9A00]/10 rounded-full blur-[50px]"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
