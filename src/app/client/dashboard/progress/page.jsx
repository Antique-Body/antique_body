"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { ChartBarIcon, LineChartIcon, PlusIcon, StrengthIcon, TrendingDownIcon, TrendingUpIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export default function ProgressPage() {
    
    // Sample user data with progress photos
    const [progressData, setProgressData] = useState([
        {
            date: "Apr 1, 2025",
            weight: 74,
            bodyFat: 19,
            photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Feeling great, more energy",
            measurements: {
                chest: 102,
                waist: 84,
                hips: 95,
                thighs: 58,
                arms: 34
            },
            performance: {
                squat: 85,
                bench: 67.5,
                deadlift: 120
            },
            mood: "Great",
            energy: 8,
            sleep: 7.5,
            nutrition: 9
        },
        {
            date: "Mar 15, 2025",
            weight: 75,
            bodyFat: 19.5,
            photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Slight plateau",
            measurements: {
                chest: 101,
                waist: 85,
                hips: 96,
                thighs: 57,
                arms: 33.5
            },
            performance: {
                squat: 82.5,
                bench: 65,
                deadlift: 115
            },
            mood: "Good",
            energy: 7,
            sleep: 7,
            nutrition: 8
        },
        {
            date: "Mar 1, 2025",
            weight: 76,
            bodyFat: 20,
            photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Starting to see changes",
            measurements: {
                chest: 100,
                waist: 86,
                hips: 97,
                thighs: 56.5,
                arms: 33
            },
            performance: {
                squat: 80,
                bench: 62.5,
                deadlift: 110
            },
            mood: "Good",
            energy: 7.5,
            sleep: 8,
            nutrition: 8.5
        },
        {
            date: "Feb 15, 2025",
            weight: 77,
            bodyFat: 20.5,
            photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "First week of program",
            measurements: {
                chest: 99,
                waist: 87,
                hips: 98,
                thighs: 56,
                arms: 32.5
            },
            performance: {
                squat: 77.5,
                bench: 60,
                deadlift: 105
            },
            mood: "Okay",
            energy: 6,
            sleep: 6.5,
            nutrition: 7
        },
        {
            date: "Feb 1, 2025",
            weight: 78,
            bodyFat: 21,
            photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Initial measurement",
            measurements: {
                chest: 98,
                waist: 88,
                hips: 99,
                thighs: 55,
                arms: 32
            },
            performance: {
                squat: 75,
                bench: 60,
                deadlift: 105
            },
            mood: "Okay",
            energy: 6,
            sleep: 6,
            nutrition: 7
        },
    ]);

    // State for new progress entry
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: "",
        bodyFat: "",
        notes: "",
        photo: null,
        measurements: {
            chest: "",
            waist: "",
            hips: "",
            thighs: "",
            arms: ""
        },
        performance: {
            squat: "",
            bench: "",
            deadlift: ""
        },
        mood: "Good"
    });

    // Calculate progress metrics
    const progress = useMemo(() => {
        if (progressData.length < 2) return null;
        
        const latest = progressData[0];
        const initial = progressData[progressData.length - 1];
        
        return {
            weight: {
                change: latest.weight - initial.weight,
                percentChange: ((latest.weight - initial.weight) / initial.weight * 100).toFixed(1)
            },
            bodyFat: {
                change: latest.bodyFat - initial.bodyFat,
                percentChange: ((latest.bodyFat - initial.bodyFat) / initial.bodyFat * 100).toFixed(1)
            },
            measurements: {
                chest: latest.measurements.chest - initial.measurements.chest,
                waist: latest.measurements.waist - initial.measurements.waist,
                hips: latest.measurements.hips - initial.measurements.hips,
                thighs: latest.measurements.thighs - initial.measurements.thighs,
                arms: latest.measurements.arms - initial.measurements.arms
            },
            performance: {
                squat: latest.performance.squat - initial.performance.squat,
                bench: latest.performance.bench - initial.performance.bench,
                deadlift: latest.performance.deadlift - initial.performance.deadlift
            }
        };
    }, [progressData]);

    // Handle new entry input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setNewEntry(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setNewEntry(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEntry(prev => ({
                ...prev,
                photo: {
                    file,
                    preview: URL.createObjectURL(file)
                }
            }));
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        const formattedDate = new Date(newEntry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const newProgressEntry = {
            date: formattedDate,
            weight: parseFloat(newEntry.weight),
            bodyFat: parseFloat(newEntry.bodyFat),
            photo: newEntry.photo?.preview || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: newEntry.notes,
            measurements: {
                chest: parseFloat(newEntry.measurements.chest),
                waist: parseFloat(newEntry.measurements.waist),
                hips: parseFloat(newEntry.measurements.hips),
                thighs: parseFloat(newEntry.measurements.thighs),
                arms: parseFloat(newEntry.measurements.arms)
            },
            performance: {
                squat: parseFloat(newEntry.performance.squat),
                bench: parseFloat(newEntry.performance.bench),
                deadlift: parseFloat(newEntry.performance.deadlift)
            },
            mood: newEntry.mood,
            energy: parseFloat(newEntry.energy),
            sleep: parseFloat(newEntry.sleep),
            nutrition: parseFloat(newEntry.nutrition)
        };

        setProgressData([newProgressEntry, ...progressData]);
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            weight: "",
            bodyFat: "",
            notes: "",
            photo: null,
            measurements: {
                chest: "",
                waist: "",
                hips: "",
                thighs: "",
                arms: ""
            },
            performance: {
                squat: "",
                bench: "",
                deadlift: ""
            },
            mood: "Good"
        });
        setIsModalOpen(false);
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = progressData.find(entry => entry.date === label);
            const previousData = progressData[progressData.indexOf(data) + 1];
            
            return (
                <div className="bg-[#222] p-4 rounded-lg border border-[#333] shadow-lg max-w-[450px] backdrop-blur-sm bg-opacity-95">
                    <div className="flex gap-4">
                        <div className="relative w-28 h-28 bg-[#1a1a1a] rounded-lg overflow-hidden">
                            <Image
                                src={data.photo}
                                alt={`Progress photo from ${data.date}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-[#FF6B00]">{label}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#333]">{data.mood}</span>
                            </div>

                            <div className="space-y-3">
                                {/* Main Metrics */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-400 mb-1">Weight</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-base font-medium">{data.weight}</span>
                                            <span className="text-xs text-gray-400">kg</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.weight < previousData.weight ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.weight < previousData.weight ? '-' : '+'}{Math.abs(data.weight - previousData.weight).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-400 mb-1">Body Fat</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-base font-medium">{data.bodyFat}</span>
                                            <span className="text-xs text-gray-400">%</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.bodyFat < previousData.bodyFat ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.bodyFat < previousData.bodyFat ? '-' : '+'}{Math.abs(data.bodyFat - previousData.bodyFat).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Body Measurements */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Chest</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium">{data.measurements.chest}</span>
                                            <span className="text-xs text-gray-400">cm</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.measurements.chest > previousData.measurements.chest ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.measurements.chest > previousData.measurements.chest ? '+' : '-'}{Math.abs(data.measurements.chest - previousData.measurements.chest).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Waist</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium">{data.measurements.waist}</span>
                                            <span className="text-xs text-gray-400">cm</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.measurements.waist < previousData.measurements.waist ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.measurements.waist < previousData.measurements.waist ? '-' : '+'}{Math.abs(data.measurements.waist - previousData.measurements.waist).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Arms</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium">{data.measurements.arms}</span>
                                            <span className="text-xs text-gray-400">cm</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.measurements.arms > previousData.measurements.arms ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.measurements.arms > previousData.measurements.arms ? '+' : '-'}{Math.abs(data.measurements.arms - previousData.measurements.arms).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Thighs</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium">{data.measurements.thighs}</span>
                                            <span className="text-xs text-gray-400">cm</span>
                                            {previousData && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${data.measurements.thighs > previousData.measurements.thighs ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    {data.measurements.thighs > previousData.measurements.thighs ? '+' : '-'}{Math.abs(data.measurements.thighs - previousData.measurements.thighs).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Wellness Metrics */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                                        <div>
                                            <div className="text-xs text-gray-400">Energy</div>
                                            <div className="text-sm font-medium">{data.energy}/10</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                        <div>
                                            <div className="text-xs text-gray-400">Sleep</div>
                                            <div className="text-sm font-medium">{data.sleep}/10</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                                        <div>
                                            <div className="text-xs text-gray-400">Nutrition</div>
                                            <div className="text-sm font-medium">{data.nutrition}/10</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Squat</div>
                                        <div className="text-sm font-medium">{data.performance.squat} kg</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Bench</div>
                                        <div className="text-sm font-medium">{data.performance.bench} kg</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Deadlift</div>
                                        <div className="text-sm font-medium">{data.performance.deadlift} kg</div>
                                    </div>
                                </div>

                                {data.notes && (
                                    <div className="pt-1">
                                        <p className="text-xs text-gray-400 italic line-clamp-2">"{data.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Weight Progress</h3>
                        {progress && (
                            <span className={`text-sm font-medium ${progress.weight.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {progress.weight.change < 0 ? '-' : '+'}{Math.abs(progress.weight.change).toFixed(1)} kg
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold mb-1">{progressData[0].weight} kg</p>
                    <p className="text-sm text-gray-400">Starting: {progressData[progressData.length - 1].weight} kg</p>
                </Card>

                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Body Fat Progress</h3>
                        {progress && (
                            <span className={`text-sm font-medium ${progress.bodyFat.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {progress.bodyFat.change < 0 ? '-' : '+'}{Math.abs(progress.bodyFat.change).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold mb-1">{progressData[0].bodyFat}%</p>
                    <p className="text-sm text-gray-400">Starting: {progressData[progressData.length - 1].bodyFat}%</p>
                </Card>

                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Time Progress</h3>
                    </div>
                    <p className="text-2xl font-bold mb-1">
                        {Math.floor((new Date(progressData[0].date) - new Date(progressData[progressData.length - 1].date)) / (1000 * 60 * 60 * 24))} days
                    </p>
                    <p className="text-sm text-gray-400">Since starting the program</p>
                </Card>

                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Overall Progress</h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {progress && progress.weight.change < 0 && progress.bodyFat.change < 0 ? (
                                <TrendingUpIcon size={24} className="text-green-500 mr-2" />
                            ) : (
                                <TrendingDownIcon size={24} className="text-red-500 mr-2" />
                            )}
                            <span className="text-2xl font-bold">
                                {progress && progress.weight.change < 0 && progress.bodyFat.change < 0 ? 'On Track' : 'Needs Work'}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Based on weight and body fat changes</p>
                </Card>
            </div>

            {/* Progress Graph */}
            <Card variant="dark" width="100%" maxWidth="none">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold flex items-center">
                            <LineChartIcon size={20} className="mr-2 text-[#FF6B00]" />
                            Progress Tracking
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Track your weight and body fat percentage over time
                        </p>
                    </div>
                    <Button 
                        variant="orangeFilled" 
                        onClick={() => setIsModalOpen(true)}
                        leftIcon={<PlusIcon size={16} />}
                    >
                        Add Progress
                    </Button>
                </div>
                
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={progressData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#FF9A00" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickLine={{ stroke: '#333' }}
                                axisLine={{ stroke: '#333' }}
                            />
                            <YAxis 
                                yAxisId="left"
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickLine={{ stroke: '#333' }}
                                axisLine={{ stroke: '#333' }}
                                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#666' }}
                            />
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickLine={{ stroke: '#333' }}
                                axisLine={{ stroke: '#333' }}
                                label={{ value: 'Body Fat (%)', angle: 90, position: 'insideRight', fill: '#666' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="top" 
                                height={36}
                                formatter={(value) => (
                                    <span className="text-sm text-gray-400">{value}</span>
                                )}
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="weight"
                                name="Weight"
                                stroke="#FF6B00"
                                strokeWidth={2}
                                fill="url(#weightGradient)"
                                activeDot={{ r: 4, fill: "#FF6B00" }}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="bodyFat"
                                name="Body Fat"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fill="url(#bodyFatGradient)"
                                activeDot={{ r: 4, fill: "#3B82F6" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Measurements and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Body Measurements */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-[rgba(255,107,0,0.1)]">
                                <ChartBarIcon size={20} className="text-[#FF6B00]" />
                            </div>
                            <h2 className="text-xl font-bold">Body Measurements</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Progress:</span>
                            <span className="text-sm font-medium text-[#FF6B00]">
                                {progress && Object.values(progress.measurements).filter(v => v < 0).length} / {Object.keys(progress.measurements).length} Goals
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {progress && Object.entries(progress.measurements).map(([key, value]) => {
                            const isPositive = key === 'waist' ? value < 0 : value > 0;
                            const currentValue = progressData[0].measurements[key];
                            const startValue = progressData[progressData.length - 1].measurements[key];
                            const percentage = Math.abs((currentValue - startValue) / startValue * 100);

                            return (
                                <div key={key} className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-4 border border-[#333] hover:border-[#444] transition-all duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm font-medium capitalize">{key}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                {isPositive ? '+' : '-'}{Math.abs(value).toFixed(1)} cm
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Start: {startValue} cm</span>
                                        <span>Current: {currentValue} cm</span>
                                    </div>

                                    <div className="relative h-2 bg-[#333] rounded-full overflow-hidden">
                                        <div 
                                            className={`absolute h-full rounded-full transition-all duration-500 ${
                                                isPositive ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                            style={{ 
                                                width: `${percentage}%`,
                                                left: isPositive ? '0' : 'auto',
                                                right: isPositive ? 'auto' : '0'
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span>Goal: {isPositive ? 'Increase' : 'Decrease'}</span>
                                        <span>Progress: {percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Performance Metrics */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-[rgba(255,107,0,0.1)]">
                                <StrengthIcon size={20} className="text-[#FF6B00]" />
                            </div>
                            <h2 className="text-xl font-bold">Performance Metrics</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Total Progress:</span>
                            <span className="text-sm font-medium text-[#FF6B00]">
                                {progress && Object.values(progress.performance).reduce((acc, val) => acc + val, 0).toFixed(1)} kg
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {progress && Object.entries(progress.performance).map(([key, value]) => {
                            const currentValue = progressData[0].performance[key];
                            const startValue = progressData[progressData.length - 1].performance[key];
                            const percentage = ((currentValue - startValue) / startValue * 100);

                            return (
                                <div key={key} className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl p-4 border border-[#333] hover:border-[#444] transition-all duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                                            <span className="text-sm font-medium capitalize">{key}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-[#FF6B00]">
                                                +{value.toFixed(1)} kg
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Start: {startValue} kg</span>
                                        <span>Current: {currentValue} kg</span>
                                    </div>

                                    <div className="relative h-2 bg-[#333] rounded-full overflow-hidden">
                                        <div 
                                            className="absolute h-full rounded-full bg-[#FF6B00] transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span>Goal: Increase Strength</span>
                                        <span>Progress: {percentage.toFixed(1)}%</span>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-[#333]">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Weekly Target</span>
                                            <span className="text-[#FF6B00] font-medium">+2.5 kg</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Add Progress Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Progress Entry"
                size="large"
                primaryButtonText="Save Entry"
                primaryButtonAction={handleSubmit}
                secondaryButtonText="Cancel"
                secondaryButtonAction={() => setIsModalOpen(false)}
            >
                <div className="space-y-6">
                    <FormField
                        label="Date"
                        type="date"
                        name="date"
                        value={newEntry.date}
                        onChange={handleInputChange}
                        required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Weight (kg)"
                            type="number"
                            name="weight"
                            value={newEntry.weight}
                            onChange={handleInputChange}
                            step="0.1"
                            min="40"
                            max="200"
                            required
                        />
                        
                        <FormField
                            label="Body Fat (%)"
                            type="number"
                            name="bodyFat"
                            value={newEntry.bodyFat}
                            onChange={handleInputChange}
                            step="0.1"
                            min="3"
                            max="50"
                            required
                        />
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                        <p className="text-sm text-gray-400 mb-3">
                            Upload a progress photo to track your visual progress
                        </p>
                        
                        {newEntry.photo ? (
                            <div className="relative aspect-square w-full mb-3 bg-[#111] rounded-lg overflow-hidden">
                                <Image
                                    src={newEntry.photo.preview}
                                    alt="Progress photo preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-[#000] bg-opacity-70 rounded-full p-1"
                                    onClick={() => setNewEntry(prev => ({ ...prev, photo: null }))}
                                >
                                    <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                                        <path d="M10 8.586l4.293-4.293 1.414 1.414L11.414 10l4.293 4.293-1.414 1.414L10 11.414l-4.293 4.293-1.414-1.414L8.586 10 4.293 5.707l1.414-1.414L10 8.586z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label className="block text-center p-6 border-2 border-dashed border-[#333] rounded-lg cursor-pointer mb-3 hover:border-[#555] transition-colors">
                                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <span className="mt-2 block text-sm font-medium text-gray-400">Upload Progress Photo</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-3">Body Measurements (cm)</h3>
                            <div className="space-y-3">
                                <FormField
                                    label="Chest"
                                    type="number"
                                    name="measurements.chest"
                                    value={newEntry.measurements.chest}
                                    onChange={handleInputChange}
                                    step="0.5"
                                />
                                <FormField
                                    label="Waist"
                                    type="number"
                                    name="measurements.waist"
                                    value={newEntry.measurements.waist}
                                    onChange={handleInputChange}
                                    step="0.5"
                                />
                                <FormField
                                    label="Hips"
                                    type="number"
                                    name="measurements.hips"
                                    value={newEntry.measurements.hips}
                                    onChange={handleInputChange}
                                    step="0.5"
                                />
                                <FormField
                                    label="Thighs"
                                    type="number"
                                    name="measurements.thighs"
                                    value={newEntry.measurements.thighs}
                                    onChange={handleInputChange}
                                    step="0.5"
                                />
                                <FormField
                                    label="Arms"
                                    type="number"
                                    name="measurements.arms"
                                    value={newEntry.measurements.arms}
                                    onChange={handleInputChange}
                                    step="0.5"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium mb-3">Performance (kg)</h3>
                            <div className="space-y-3">
                                <FormField
                                    label="Squat"
                                    type="number"
                                    name="performance.squat"
                                    value={newEntry.performance.squat}
                                    onChange={handleInputChange}
                                    step="2.5"
                                />
                                <FormField
                                    label="Bench Press"
                                    type="number"
                                    name="performance.bench"
                                    value={newEntry.performance.bench}
                                    onChange={handleInputChange}
                                    step="2.5"
                                />
                                <FormField
                                    label="Deadlift"
                                    type="number"
                                    name="performance.deadlift"
                                    value={newEntry.performance.deadlift}
                                    onChange={handleInputChange}
                                    step="2.5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <FormField
                        label="Notes"
                        type="textarea"
                        name="notes"
                        value={newEntry.notes}
                        onChange={handleInputChange}
                        placeholder="How are you feeling? Any changes you've noticed?"
                        rows={4}
                    />
                </div>
            </Modal>
        </div>
    );
}
