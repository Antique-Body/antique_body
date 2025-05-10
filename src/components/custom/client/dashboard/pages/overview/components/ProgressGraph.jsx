import { useRouter } from "next/navigation";
import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/common/Button";
import { ProgressChartIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const ProgressGraph = ({ progressData }) => {
    const router = useRouter();

    return (
        <Card variant="dark" className="mt-6" width="100%" maxWidth="none">
            <h2 className="mb-4 flex items-center text-xl font-bold">
                <ProgressChartIcon className="mr-2" stroke="#FF6B00" />
                Body Composition Progress
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card variant="dark" width="100%" maxWidth="none">
                    <h3 className="mb-3 font-medium">Weight Progression</h3>
                    <div className="relative h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData.slice().reverse()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF9A00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickLine={{ stroke: "#333" }}
                                    axisLine={{ stroke: "#333" }}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickLine={{ stroke: "#333" }}
                                    axisLine={{ stroke: "#333" }}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#222] p-3 rounded-lg border border-[#333] shadow-lg">
                                                    <p className="text-sm text-gray-400">{label}</p>
                                                    <p className="text-sm font-medium">{payload[0].value} kg</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#FF6B00"
                                    strokeWidth={2}
                                    fill="url(#weightGradient)"
                                    activeDot={{ r: 4, fill: "#FF6B00" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card variant="dark" width="100%" maxWidth="none">
                    <h3 className="mb-3 font-medium">Body Fat Progression</h3>
                    <div className="relative h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData.slice().reverse()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickLine={{ stroke: "#333" }}
                                    axisLine={{ stroke: "#333" }}
                                />
                                <YAxis
                                    tick={{ fill: "#666", fontSize: 12 }}
                                    tickLine={{ stroke: "#333" }}
                                    axisLine={{ stroke: "#333" }}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#222] p-3 rounded-lg border border-[#333] shadow-lg">
                                                    <p className="text-sm text-gray-400">{label}</p>
                                                    <p className="text-sm font-medium">{payload[0].value}%</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bodyFat"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fill="url(#bodyFatGradient)"
                                    activeDot={{ r: 4, fill: "#3B82F6" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Button
                variant="orangeOutline"
                fullWidth
                className="mt-4"
                onClick={() => router.push("/client/dashboard/progress")}
            >
                View Detailed Progress
            </Button>
        </Card>
    );
};
