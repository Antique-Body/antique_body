import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Label } from "recharts";

export const ExerciseCard = ({ exercise, exerciseImage, onAddRecord }) => {
    // Calculate the percentage increase from last record to personal best
    const percentIncrease =
        exercise.personalBest.weight > 0
            ? Math.round(((exercise.personalBest.weight - exercise.lastRecord.weight) / exercise.lastRecord.weight) * 100)
            : 0;

    return (
        <motion.div className="relative overflow-hidden rounded-xl" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            {/* Card interior with gradient overlay */}
            <div className="relative bg-gradient-to-br from-[#222]/90 to-[#1a1a1a]/95 backdrop-blur-sm p-5 border border-[#333] rounded-xl overflow-hidden shadow-lg h-full">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 -z-10 opacity-20">
                    {exerciseImage && (
                        <Image
                            src={exerciseImage}
                            alt={exercise.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#111]/80 via-black/70 to-[#111]/80"></div>
                </div>

                {/* Exercise Name Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="p-2.5 rounded-lg bg-[rgba(255,107,0,0.15)] flex items-center justify-center"
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(255,107,0,0.25)",
                            }}
                        >
                            <Icon icon="mdi:weight-lifter" className="w-5 h-5 text-[#FF6B00]" />
                        </motion.div>
                        <h3 className="font-bold text-lg text-white">{exercise.name}</h3>
                    </div>

                    <motion.button
                        onClick={() => onAddRecord(exercise)}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(255,107,0,0.25)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-[rgba(255,107,0,0.15)] hover:bg-[rgba(255,107,0,0.2)] rounded-lg transition-colors"
                    >
                        <Icon icon="mdi:pencil" className="w-5 h-5 text-[#FF6B00]" />
                    </motion.button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Last Record */}
                    <motion.div
                        className="bg-[#191919]/60 backdrop-blur-sm rounded-xl border border-[#333]/50 p-3"
                        whileHover={{
                            y: -3,
                            borderColor: "rgba(255,107,0,0.3)",
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></div>
                            <span className="text-xs font-medium text-gray-400">Last Record</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-[#FF6B00] tabular-nums tracking-tight">
                                {exercise.lastRecord.weight}
                            </span>
                            <span className="text-sm text-gray-400">kg</span>
                            <span className="ml-1.5 text-sm text-gray-400 border-l border-gray-700 pl-1.5">
                                {exercise.lastRecord.reps} reps
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{exercise.lastRecord.date}</div>
                    </motion.div>

                    {/* Personal Best */}
                    <motion.div
                        className="bg-[#191919]/60 backdrop-blur-sm rounded-xl border border-[#333]/50 p-3"
                        whileHover={{
                            y: -3,
                            borderColor: "rgba(255,107,0,0.3)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></div>
                                <span className="text-xs font-medium text-gray-400">Personal Best</span>
                            </div>
                            {percentIncrease > 0 && (
                                <div className="flex items-center text-xs text-green-500 font-medium">
                                    <Icon icon="mdi:arrow-up" className="w-3 h-3 mr-1" />
                                    {percentIncrease}%
                                </div>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-[#FF6B00] tabular-nums tracking-tight">
                                {exercise.personalBest.weight}
                            </span>
                            <span className="text-sm text-gray-400">kg</span>
                            <span className="ml-1.5 text-sm text-gray-400 border-l border-gray-700 pl-1.5">
                                {exercise.personalBest.reps} reps
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{exercise.personalBest.date}</div>
                    </motion.div>
                </div>

                {/* Progress Chart */}
                <motion.div
                    className="bg-[#191919]/80 backdrop-blur-sm rounded-xl border border-[#333]/50 p-3"
                    whileHover={{ borderColor: "rgba(255,107,0,0.3)" }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:chart-line" className="w-4 h-4 text-[#FF6B00]" />
                            <span className="text-xs font-medium text-gray-400">Progress</span>
                        </div>
                        <span className="text-xs text-gray-500">Last {exercise.history.length} records</span>
                    </div>

                    <div className="h-[150px] -mx-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={exercise.history.slice().reverse()}
                                margin={{ left: 0, right: 5, top: 8, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id={`${exercise.name}Gradient`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.05} />
                                    </linearGradient>
                                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
                                    </filter>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#333"
                                    vertical={false}
                                    opacity={0.2}
                                    strokeWidth={0.5}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#666", fontSize: 10 }}
                                    tickLine={{ stroke: "#333", strokeWidth: 0.5 }}
                                    axisLine={{ stroke: "#333", strokeWidth: 0.5 }}
                                    dy={2}
                                    tickMargin={6}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 10 }}
                                    tickLine={{ stroke: "#333", strokeWidth: 0.5 }}
                                    axisLine={{ stroke: "#333", strokeWidth: 0.5 }}
                                    dx={-2}
                                    width={35}
                                    tickCount={5}
                                    domain={["dataMin - 5", "dataMax + 5"]}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ stroke: "#555", strokeWidth: 1, strokeDasharray: "3 3" }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#0D0D0D] p-3 rounded-lg border border-[#393939] shadow-lg">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></div>
                                                        <p className="text-xs font-medium text-gray-400">{label}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-base font-semibold text-[#FF6B00]">
                                                            {payload[0].value} kg
                                                        </p>
                                                        {payload[0].payload.reps && (
                                                            <p className="text-xs px-1.5 py-0.5 bg-[#222] rounded-md text-gray-400">
                                                                {payload[0].payload.reps} reps
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    wrapperStyle={{ outline: "none" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#FF6B00"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#${exercise.name}Gradient)`}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                    dot={{
                                        fill: "#FF6B00",
                                        r: 0,
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: "#FF6B00",
                                        stroke: "#FFF",
                                        strokeWidth: 2,
                                        filter: "url(#glow)",
                                    }}
                                />
                                {/* Reference line for personal best */}
                                <ReferenceLine
                                    y={exercise.personalBest.weight}
                                    stroke="#FFC107"
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    isFront={true}
                                    opacity={0.7}
                                >
                                    <Label value="PB" position="insideTopRight" fill="#FFC107" fontSize={10} offset={10} />
                                </ReferenceLine>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
