import { Icon } from "@iconify/react";
import React from "react";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/custom/Card";

export const ActivityBreakdown = ({ activities, weekStats }) => {
    if (!activities || !activities.length) return null;

    const totalMinutes = activities.reduce((sum, activity) => sum + activity.minutes, 0);

    // Calculate percentage for each activity
    const activitiesWithPercentage = activities.map((activity) => ({
        ...activity,
        percentage: Math.round((activity.minutes / totalMinutes) * 100),
    }));

    const getActivityIcon = (activity) => {
        switch (activity) {
            case "Walking":
                return "heroicons:arrow-right";
            case "Running":
                return "heroicons:bolt";
            case "Cycling":
                return "heroicons:arrow-path";
            case "Workout":
                return "heroicons:fire";
            default:
                return "heroicons:star";
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            {/* Daily Activity Breakdown */}
            <Card variant="darkStrong" hover maxWidth="none" width="100%" className="p-6 shadow-lg border border-gray-800/50">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-medium">Activity Breakdown</h3>
                    <div className="text-sm text-white font-semibold bg-[#1a1a1a] px-4 py-2 rounded-lg shadow-md">
                        {totalMinutes} total minutes
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-full sm:w-1/2">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={activitiesWithPercentage}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="minutes"
                                >
                                    {activitiesWithPercentage.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value} minutes`, "Duration"]}
                                    contentStyle={{
                                        backgroundColor: "rgba(30, 30, 30, 0.9)",
                                        borderColor: "#333",
                                        borderRadius: "8px",
                                        padding: "8px",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                    labelStyle={{ color: "#aaa", marginBottom: "4px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full sm:w-1/2">
                        <div className="space-y-3.5">
                            {activitiesWithPercentage.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full mr-3"
                                        style={{ backgroundColor: activity.color }}
                                    ></div>
                                    <div className="flex-1 text-sm font-medium">{activity.activity}</div>
                                    <div className="text-sm font-medium">{activity.minutes} min</div>
                                    <div className="text-xs text-gray-400 ml-3 w-10 text-right">{activity.percentage}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-medium">Top activity</div>
                        <div className="text-xs text-gray-400 bg-[#222] px-2 py-1 rounded-md">
                            {activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].percentage}% of total
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md"
                            style={{
                                backgroundColor: `${activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].color}20`,
                            }}
                        >
                            <Icon
                                icon={getActivityIcon(
                                    activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].activity
                                )}
                                className="text-2xl"
                                style={{ color: activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].color }}
                            />
                        </div>
                        <div>
                            <div className="font-medium text-lg">
                                {activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].activity}
                            </div>
                            <div className="text-sm text-gray-400">
                                {activitiesWithPercentage.sort((a, b) => b.minutes - a.minutes)[0].minutes} minutes
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Weekly Activity Chart */}
            <Card variant="darkStrong" hover maxWidth="none" width="100%" className="p-6 shadow-lg border border-gray-800/50">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-medium">Weekly Activity</h3>
                    <div className="text-sm text-gray-400 bg-[#1a1a1a] px-4 py-2 rounded-lg shadow-md">Last 7 days</div>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weekStats} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#aaa", fontSize: 12 }} />
                        <YAxis hide={true} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(30, 30, 30, 0.9)",
                                borderColor: "#333",
                                borderRadius: "8px",
                                padding: "10px",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                            }}
                            itemStyle={{ color: "#fff" }}
                            labelStyle={{ color: "#aaa", marginBottom: "4px", fontWeight: "bold" }}
                            formatter={(value) => [`${value.toLocaleString()}`, ""]}
                            labelFormatter={(label) => `${label}'s Activity`}
                        />
                        <Bar dataKey="steps" radius={[6, 6, 0, 0]} barSize={32}>
                            {weekStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
                            ))}
                        </Bar>

                        {/* Gradients for bars */}
                        <defs>
                            {weekStats.map((entry, index) => (
                                <linearGradient
                                    key={`gradient-${index}`}
                                    id={`colorGradient${index}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={index === 3 ? "#5D5FEF" : index === 0 || index === 6 ? "#FF9F0A" : "#30D158"}
                                        stopOpacity={0.9}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={index === 3 ? "#5D5FEF" : index === 0 || index === 6 ? "#FF9F0A" : "#30D158"}
                                        stopOpacity={0.4}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                    </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-inner">
                        <div className="text-xs text-gray-400 mb-1">Avg. Steps</div>
                        <div className="font-semibold text-white text-lg">
                            {Math.round(weekStats.reduce((sum, day) => sum + day.steps, 0) / weekStats.length).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-inner">
                        <div className="text-xs text-gray-400 mb-1">Avg. Calories</div>
                        <div className="font-semibold text-white text-lg">
                            {Math.round(
                                weekStats.reduce((sum, day) => sum + day.calories, 0) / weekStats.length
                            ).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-inner">
                        <div className="text-xs text-gray-400 mb-1">Active days</div>
                        <div className="font-semibold text-white text-lg">
                            {weekStats.filter((day) => day.steps > 5000).length} / 7
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
