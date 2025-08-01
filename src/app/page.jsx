"use client";

import { Icon } from "@iconify/react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { EffectBackground } from "@/components/background";
import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import {
  ModernFeaturesSection,
  ModernCta,
  TrainersSection,
  FeaturePreviews,
  ImprovedTestimonial,
} from "@/components/custom/home-page/home/components";
import { Navigation } from "@/components/custom/home-page/shared";

const images = {
  hero: {
    src: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Ancient Greek-inspired training",
    width: 600,
    height: 600,
  },
  benefits: {
    src: "https://images.stockcake.com/public/c/7/7/c77de2a6-0b4f-41f8-900d-372cefc0242e_large/ancient-athlete-training-stockcake.jpg",
    alt: "Ancient Greek-inspired training",
    width: 1000,
    height: 1000,
  },
  testimonial: {
    src: "https://media.istockphoto.com/id/1162483510/photo/doing-squat-exercise-confident-young-personal-trainer-is-showing-slim-athletic-woman-how-to.jpg?s=612x612&w=0&k=20&c=Kk0ZhdUEX9B6ip6wItLFKtuBiTbsZsx0uVmopJMTul4=",
    alt: "Ancient Greek-inspired training",
    width: 1000,
    height: 1000,
  },
};

// Updated features with images and tags
const updatedFeatures = [
  {
    title: "Find Certified Trainers",
    description:
      "Connect with professional trainers near you who specialize in your specific goals and sport.",
    icon: <Icon icon="mdi:account-group" className="text-3xl text-[#FF6B00]" />,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
    tags: [
      "Professional Trainers",
      "Personalized Matching",
      "Verified Experts",
    ],
  },
  {
    title: "Client Matching",
    description:
      "Trainers can find clients who match their expertise area and training philosophy.",
    icon: <Icon icon="mdi:handshake" className="text-3xl text-[#FF6B00]" />,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    tags: ["Smart Matching", "Perfect Fit", "AI-Powered"],
  },
  {
    title: "Greek-Inspired Training",
    description:
      "Workouts built on ancient athletic wisdom, adapted for modern fitness goals.",
    icon: (
      <Icon
        icon="mdi:abacus"
        className="text-3xl text-[#FF6B00] flex items-center justify-center"
      />
    ),
    image:
      "https://images.stockcake.com/public/c/7/7/c77de2a6-0b4f-41f8-900d-372cefc0242e_large/ancient-athlete-training-stockcake.jpg",
    tags: ["Ancient Wisdom", "Modern Application", "Holistic Approach"],
  },
  {
    title: "Custom Workout Plans",
    description:
      "Personalized training programs tailored to your specific goals, preferences and abilities.",
    icon: <Icon icon="mdi:dumbbell" className="text-3xl text-[#FF6B00]" />,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
    tags: ["Personalized", "Adaptive", "Goal-oriented"],
  },
  {
    title: "Progress Tracking",
    description:
      "Comprehensive analytics to monitor your performance and track your improvements over time.",
    icon: <Icon icon="mdi:chart-line" className="text-3xl text-[#FF6B00]" />,
    image:
      "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1200&auto=format&fit=crop",
    tags: ["Data-driven", "Visual Progress", "Achievement Milestones"],
  },
  {
    title: "Achievement System",
    description:
      "Earn badges and rewards as you complete workouts and reach your fitness milestones.",
    icon: <Icon icon="mdi:trophy" className="text-3xl text-[#FF6B00]" />,
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e6349?q=80&w=1200&auto=format&fit=crop",
    tags: ["Gamification", "Rewards", "Motivation"],
  },
];

export default function Home() {
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const ctaRef = useRef(null);

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
        </div>

        <EffectBackground />

        <Navigation />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
          <div className="container mx-auto px-4 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center justify-center text-sm font-medium mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                      <Icon icon="mdi:flash" className="text-sm" />
                    </span>
                    The ultimate trainer-client connection platform
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                    <span className="text-white block mb-2">Discover Your</span>
                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block relative">
                      Ancient Strength
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
                            <stop
                              offset="1"
                              stopColor="#FF9A00"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg drop-shadow-sm">
                    Connect with expert trainers through our platform inspired
                    by ancient Greek athletic traditions. Transform your body
                    and mind with time-tested methods and modern science.
                  </p>

                  <div className="flex flex-wrap gap-5 mb-8">
                    <Link href="/auth/register">
                      <Button
                        variant="orangeFilled"
                        size="large"
                        className="group relative overflow-hidden"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                        <span className="relative z-10">
                          Start Your Journey
                        </span>
                      </Button>
                    </Link>

                    <Link href="/explore">
                      <Button variant="outline" size="large" className="group">
                        <span className="mr-2 group-hover:text-[#FF6B00] transition-colors">
                          Explore
                        </span>
                        <Icon
                          icon="mdi:arrow-right"
                          className="text-xl inline-block transform group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]"
                        />
                      </Button>
                    </Link>
                  </div>

                  {/* Key benefits row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "mdi:account-group",
                        text: "Find Certified Trainers",
                      },
                      { icon: "mdi:dumbbell", text: "Custom Workout Plans" },
                      { icon: "mdi:trophy", text: "Track Your Progress" },
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg p-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon={benefit.icon}
                            className="text-[#FF6B00]"
                          />
                        </div>
                        <p className="text-gray-300 text-sm">{benefit.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square max-w-lg mx-auto"
                >
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_25px_rgba(255,107,0,0.1)]">
                    <Image
                      src={images.hero.src}
                      alt={images.hero.alt}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Additional app preview elements overlaid on the image */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="absolute bottom-6 left-6 right-6"
                    >
                      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] flex items-center justify-center text-white">
                              <Icon icon="mdi:dumbbell" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                Today's Workout
                              </p>
                              <p className="text-gray-400 text-xs">
                                Strength Training
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-medium px-2 py-1 rounded-full border border-[#FF6B00]/20">
                            In Progress
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Exercises</span>
                            <span className="text-white">4/6 Completed</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "66%" }}
                              transition={{ duration: 1, delay: 1.2 }}
                              className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute -top-5 -left-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>
                  <div className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/30 -z-10"></div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute top-5 -right-10 lg:-right-16 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md p-4 rounded-lg border border-gray-800 shadow-xl max-w-[180px] z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-[#FF6B00]/20 flex-shrink-0">
                        <Icon
                          icon="mdi:alpha-g-box"
                          className="text-xl text-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Ancient Wisdom
                        </div>
                        <div className="text-xs text-gray-400">
                          Time-tested methods
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - REPLACED with ModernFeaturesSection */}
        <section
          id="features"
          ref={featuresRef}
          className="relative py-24 md:py-32"
        >
          <div className="container mx-auto px-4 relative z-10">
            <ModernFeaturesSection features={updatedFeatures} />
          </div>
        </section>

        {/* Benefits Section - ENHANCED with better component showcase */}
        <section
          id="benefits"
          ref={benefitsRef}
          className="relative py-24 md:py-32 overflow-hidden"
        >
          <div className="container mx-auto px-4 relative z-10">
            {/* Feature Previews component */}
            <FeaturePreviews />

            {/* Improved Testimonial */}
            <ImprovedTestimonial testimonialImage={images.testimonial.src} />
          </div>
        </section>

        {/* Trainers Showcase - ENHANCED with improved scroll functionality */}
        <section
          id="trainers"
          className="relative py-16 md:py-32 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <TrainersSection />
          </div>
        </section>

        {/* CTA Section - REPLACED with ModernCta */}
        <section id="cta" ref={ctaRef} className="relative py-24 md:py-32">
          <div className="container mx-auto px-4">
            <ModernCta />
          </div>
        </section>

        <Footer />
      </div>
    </LazyMotion>
  );
}
