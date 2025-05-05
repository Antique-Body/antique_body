"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { TrainerCard } from "./TrainerCard";

import { Button } from "@/components/common/Button";

const trainers = [
    {
        id: 1,
        name: "Alex Miller",
        specialty: "Football Conditioning",
        certifications: ["UEFA A License", "NSCA CSCS"],
        rating: 4.8,
        proximity: "1.2 km away",
        profileImage: "https://ai-previews.123rf.com/ai-txt2img/600nwm/74143221-4fc9-47bd-a919-0c6d55da9cc5.jpg",
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
        profileImage:
            "https://media.istockphoto.com/id/1497018234/photo/strong-and-healthy-people-working-out.jpg?s=1024x1024&w=is&k=20&c=5Hxmof3LgI6gyBUr1aI1bvopFn6krQhSxDVPxtobImY=",

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
        profileImage:
            "https://media.istockphoto.com/id/1359149467/photo/shot-of-a-handsome-young-man-standing-alone-and-stretching-during-his-outdoor-workout.jpg?s=1024x1024&w=is&k=20&c=-HVl9xVbCUrtb_2R1oKdbaxcR79QQ-QjHMvr5EYrM4c=",
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
                {trainers.map((trainer, index) => (
                    <TrainerCard key={trainer.id} trainer={trainer} index={index} />
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
