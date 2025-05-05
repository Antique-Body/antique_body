"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/common/Button";
import { UserProfileIcon, CertificateIcon, LocationIcon } from "@/components/common/Icons";

const trainers = [
    {
        id: 1,
        name: "Alex Miller",
        specialty: "Football Conditioning",
        certifications: ["UEFA A License", "NSCA CSCS"],
        rating: 4.8,
        proximity: "1.2 km away",
        profileImage: "/images/trainers/trainer-1.jpg",
        available: true,
        preferred: true,
    },
    {
        id: 2,
        name: "Sarah Jordan",
        specialty: "Strength & Nutrition",
        certifications: ["ACE CPT", "Precision Nutrition"],
        rating: 4.9,
        proximity: "2.5 km away",
        profileImage: "/images/trainers/trainer-2.jpg",
        available: false,
        preferred: false,
    },
    {
        id: 3,
        name: "Michael Chen",
        specialty: "Sports Rehabilitation",
        certifications: ["DPT, CSCS"],
        rating: 5.0,
        proximity: "3.7 km away",
        profileImage: "/images/trainers/trainer-3.jpg",
        available: true,
        preferred: true,
    },
];

export function TopTrainersSection() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-[#444]">
                        ★
                    </span>
                );
            }
        }

        return stars;
    };

    return (
        <div className="w-full py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
            >
                <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                    <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                        Connect with Top Trainers
                    </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                    Find certified professionals near you who can help achieve your fitness goals
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {trainers.map((trainer) => (
                    <motion.div
                        key={trainer.id}
                        variants={itemVariants}
                        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-[#0f0f0f] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 hover:-translate-y-1"
                    >
                        <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#FF6B00] scale-y-[0.6] transform transition-transform duration-300 ease-in-out group-hover:scale-y-100"></div>

                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                {/* Trainer photo */}
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.05]">
                                    <div className="relative h-full w-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <div className="flex h-full w-full items-center justify-center bg-[#151515]">
                                            <UserProfileIcon size={36} className="text-white opacity-70" />
                                        </div>
                                    </div>
                                </div>

                                {/* Trainer info */}
                                <div className="flex flex-1 flex-col">
                                    <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                                        {trainer.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">{trainer.specialty}</p>

                                    {/* Rating */}
                                    <div className="mt-2 flex items-center gap-1">
                                        <div className="flex">{renderStars(trainer.rating)}</div>
                                        <span className="ml-1 text-sm text-white">{trainer.rating}</span>
                                    </div>

                                    {/* Proximity info with fading edge */}
                                    <div className="mt-1 flex items-center text-xs text-gray-400">
                                        <LocationIcon size={12} className="mr-1" />
                                        <span>{trainer.proximity}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Certification badges */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {trainer.certifications.map((cert, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[rgba(255,107,0,0.25)]"
                                    >
                                        <CertificateIcon size={12} />
                                        {cert}
                                    </span>
                                ))}
                            </div>

                            {/* Badges */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {trainer.available && (
                                    <span className="inline-flex rounded bg-[rgba(40,167,69,0.2)] px-2 py-1 text-xs font-medium text-[#28a745]">
                                        Available Now
                                    </span>
                                )}
                                {trainer.preferred && (
                                    <span className="inline-flex rounded bg-[rgba(255,107,0,0.2)] px-2 py-0.5 text-xs font-medium text-[#FF6B00]">
                                        Preferred
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA button with overlay effect */}
                        <div className="mt-2 p-4 pt-0">
                            <Link href="/client/dashboard/trainwithcoach">
                                <Button
                                    variant="orangeFilled"
                                    size="small"
                                    className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                                >
                                    View Profile
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 text-center"
            >
                <Link href="/client/dashboard/trainwithcoach">
                    <Button variant="orangeOutline" size="large" className="mx-auto">
                        Find More Trainers
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

export default TopTrainersSection;
