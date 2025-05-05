"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/common/Button";
import { UserProfileIcon, CertificateIcon, LocationIcon } from "@/components/common/Icons";

export function TrainerCard({ trainer, index = 0 }) {
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

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1,
            },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-800 bg-[#0f0f0f] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/10 hover:-translate-y-1"
        >
            {/* Left orange accent */}
            <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#FF6B00] scale-y-[0.6] transform transition-transform duration-300 ease-in-out group-hover:scale-y-100"></div>

            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Trainer photo */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.02]">
                        {trainer.profileImage ? (
                            <Image
                                src={trainer.profileImage}
                                alt={`${trainer.name} profile photo`}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00]/30 to-[#FF9A00]/30">
                                <UserProfileIcon size={40} className="text-white opacity-70" />
                            </div>
                        )}
                    </div>

                    {/* Trainer info */}
                    <div className="flex flex-1 flex-col">
                        <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                            {trainer.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-gray-400">{trainer.specialty}</p>
                            {/* Preferred badge */}
                            {trainer.preferred && (
                                <span className="inline-flex rounded bg-[rgba(255,107,0,0.2)] px-2 py-0.5 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:bg-[rgba(255,107,0,0.3)]">
                                    Preferred
                                </span>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="mt-2 flex items-center gap-1">
                            <div className="flex gap-0.5 text-base">{renderStars(trainer.rating)}</div>
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

                {/* Available Badge */}
                {trainer.available && (
                    <div className="mt-3">
                        <span className="inline-flex rounded bg-[rgba(40,167,69,0.2)] px-2 py-1 text-xs font-medium text-[#28a745]">
                            Available Now
                        </span>
                    </div>
                )}
            </div>

            {/* CTA button */}
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
    );
}
