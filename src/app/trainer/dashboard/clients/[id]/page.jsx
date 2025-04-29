"use client";

import { ProgressBar } from "@/components/common";
import { MacroDistribution } from "@/components/custom/client/dashboard/pages/nutrition/components";
import { BackgroundShapes } from "@/components/custom/shared";
import { ClientHeader, PerformanceMetrics } from "@/components/custom/trainer/dashboard/pages/clients";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
// Mock data for demonstration
const mockClients = [
    {
        id: "1",
        name: "John Doe",
        status: "Active",
        plan: "Pro Athlete",
        goal: "Build Muscle",
        joinDate: "Jan 15, 2025",
        nextSession: "Apr 12, 2025",
        type: "gym",
        progress: [
            { date: "2025-04-01", benchPress: 80, squat: 100, deadlift: 120, weight: 80, bodyFat: 15 },
            { date: "2025-04-08", benchPress: 85, squat: 105, deadlift: 125, weight: 81, bodyFat: 14.8 },
            { date: "2025-04-15", benchPress: 87.5, squat: 110, deadlift: 130, weight: 81.5, bodyFat: 14.5 },
        ],
        nutrition: { protein: 160, carbs: 250, fats: 60, calories: 2200 },
    },
    {
        id: "2",
        name: "Sarah Williams",
        status: "Active",
        plan: "Recovery",
        goal: "football",
        joinDate: "Feb 3, 2025",
        nextSession: "Apr 10, 2025",
        type: "athlete",
        sport: "football",
        progress: [
            { date: "2025-04-01", sprint: 12.5, agility: 8.2, kickAccuracy: 75, weight: 65, bodyFat: 18 },
            { date: "2025-04-08", sprint: 12.2, agility: 8.0, kickAccuracy: 78, weight: 65.5, bodyFat: 17.8 },
            { date: "2025-04-15", sprint: 11.9, agility: 7.8, kickAccuracy: 82, weight: 65, bodyFat: 17.5 },
        ],
        nutrition: { protein: 120, carbs: 300, fats: 50, calories: 2100 },
    },
    {
        id: "3",
        name: "Mike Chen",
        status: "Active",
        plan: "Weight Loss",
        goal: "Fat Loss",
        joinDate: "Mar 10, 2025",
        nextSession: "Apr 15, 2025",
        type: "gym",
        progress: [
            { date: "2025-04-01", cardio: 35, caloriesBurned: 450, weight: 92, bodyFat: 24 },
            { date: "2025-04-08", cardio: 40, caloriesBurned: 520, weight: 90.5, bodyFat: 23.5 },
            { date: "2025-04-15", cardio: 45, caloriesBurned: 580, weight: 89, bodyFat: 23 },
        ],
        nutrition: { protein: 140, carbs: 180, fats: 55, calories: 1800 },
    },
    {
        id: "4",
        name: "Emma Johnson",
        status: "Active",
        plan: "Elite Performance",
        goal: "basketball",
        joinDate: "Jan 5, 2025",
        nextSession: "Apr 14, 2025",
        type: "basketball",
        progress: [
            { date: "2025-04-01", verticalJump: 60, shootingAccuracy: 72, sprint: 8.6, weight: 75, bodyFat: 12 },
            { date: "2025-04-08", verticalJump: 62, shootingAccuracy: 75, sprint: 8.4, weight: 74.5, bodyFat: 11.8 },
            { date: "2025-04-15", verticalJump: 65, shootingAccuracy: 78, sprint: 8.2, weight: 74, bodyFat: 11.5 },
        ],
        nutrition: { protein: 150, carbs: 280, fats: 55, calories: 2200 },
    },
    {
        id: "5",
        name: "Carlos Rodriguez",
        status: "Active",
        plan: "Sports Conditioning",
        goal: "tennis",
        joinDate: "Feb 20, 2025",
        nextSession: "Apr 16, 2025",
        type: "tennis",
        progress: [
            { date: "2025-04-01", serveSpeed: 165, forehandAccuracy: 75, backhandAccuracy: 70, weight: 72, bodyFat: 14 },
            { date: "2025-04-08", serveSpeed: 168, forehandAccuracy: 78, backhandAccuracy: 72, weight: 71.5, bodyFat: 13.8 },
            { date: "2025-04-15", serveSpeed: 172, forehandAccuracy: 80, backhandAccuracy: 75, weight: 71, bodyFat: 13.5 },
        ],
        nutrition: { protein: 145, carbs: 260, fats: 55, calories: 2100 },
    },
];

// Dynamically generate performance fields based on client type
const getPerformanceFields = (clientType, sport) => {
    if (clientType === "gym") {
        return [
            { id: "benchPress", label: "Bench Press (kg)" },
            { id: "squat", label: "Squat (kg)" },
            { id: "deadlift", label: "Deadlift (kg)" },
            { id: "cardio", label: "Cardio (min)" },
            { id: "caloriesBurned", label: "Calories Burned" },
        ];
    } else if (clientType === "athlete" && sport === "football") {
        return [
            { id: "sprint", label: "Sprint (s)" },
            { id: "agility", label: "Agility (s)" },
            { id: "kickAccuracy", label: "Kick Accuracy (%)" },
            { id: "endurance", label: "Endurance (min)" },
        ];
    } else if (clientType === "athlete" && sport === "basketball") {
        return [
            { id: "verticalJump", label: "Vertical Jump (cm)" },
            { id: "shootingAccuracy", label: "Shooting (%)" },
            { id: "sprint", label: "Sprint (s)" },
        ];
    } else if (clientType === "basketball") {
        return [
            { id: "verticalJump", label: "Vertical Jump (cm)" },
            { id: "shootingAccuracy", label: "Shooting (%)" },
            { id: "sprint", label: "Sprint (s)" },
            { id: "agility", label: "Agility (s)" },
        ];
    } else if (clientType === "tennis") {
        return [
            { id: "serveSpeed", label: "Serve Speed (km/h)" },
            { id: "forehandAccuracy", label: "Forehand (%)" },
            { id: "backhandAccuracy", label: "Backhand (%)" },
            { id: "agility", label: "Agility (s)" },
        ];
    }

    // Default fields
    return [
        { id: "performance", label: "Performance (1-10)" },
        { id: "endurance", label: "Endurance (min)" },
    ];
};

const ClientId = () => {
    const { id } = useParams();
    const client = useMemo(() => mockClients.find(c => c.id === id), [id]);

    // State for progress tracking
    const [weight, setWeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [newMeasurements, setNewMeasurements] = useState({});
    const [progress, setProgress] = useState(client?.progress || []);

    // State for nutrition tracking
    const [nutrition, setNutrition] = useState(client?.nutrition || {});

    // State for notes
    const [notes, setNotes] = useState("");

    // State for tracking additional metrics
    const [activeMetric, setActiveMetric] = useState("");

    // Get performance fields based on client type
    const performanceFields = useMemo(() => getPerformanceFields(client?.type, client?.sport), [client?.type, client?.sport]);

    if (!client) {
        return <div className="p-8 text-center text-gray-400">Client not found.</div>;
    }

    // Handle progress update
    const handleProgressUpdate = e => {
        e.preventDefault();
        if (!weight && !bodyFat && Object.keys(newMeasurements).length === 0) return;

        const newEntry = {
            date: new Date().toISOString().slice(0, 10),
            weight: weight ? parseFloat(weight) : undefined,
            bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
            ...newMeasurements,
        };

        setProgress([...progress, newEntry]);
        setWeight("");
        setBodyFat("");
        setNewMeasurements({});
    };

    // Handle measurement input change
    const handleMeasurementChange = (field, value) => {
        setNewMeasurements({
            ...newMeasurements,
            [field]: parseFloat(value),
        });
    };

    // Handle nutrition update
    const handleNutritionUpdate = e => {
        e.preventDefault();
        // In a real app, update backend here
    };

    // Handle notes save
    const handleSaveNotes = () => {
        // In a real app, save notes to backend
        console.log("Saving notes:", notes);
        // Show a success message
        alert("Notes saved successfully!");
    };

    // Handle adding a metric to track
    const handleAddMetric = metricId => {
        setActiveMetric(metricId);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative">
            {/* Background shapes */}
            <BackgroundShapes />

            <div className="w-full px-4 py-6 relative z-10">
                {/* Client header */}
                <ClientHeader client={client} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Column - Progress Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Training Program Section */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Training Program
                            </h3>
                            <p className="text-gray-400 mb-4">Create or modify the client's training program</p>
                            <button className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#FF8800] transition-all duration-300 flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Create Program
                            </button>
                        </div>

                        {/* Progress Tracking Section */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                                Progress Tracking
                            </h3>

                            <form
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5"
                                onSubmit={handleProgressUpdate}
                            >
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Weight (kg)"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Body Fat (%)"
                                    value={bodyFat}
                                    onChange={e => setBodyFat(e.target.value)}
                                    className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                />

                                {/* Dynamic performance metrics based on client type */}
                                {activeMetric ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder={performanceFields.find(f => f.id === activeMetric)?.label || activeMetric}
                                        value={newMeasurements[activeMetric] || ""}
                                        onChange={e => handleMeasurementChange(activeMetric, e.target.value)}
                                        className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                    />
                                ) : (
                                    <select
                                        value=""
                                        onChange={e => setActiveMetric(e.target.value)}
                                        className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                    >
                                        <option value="">Select Metric</option>
                                        {performanceFields.map(field => (
                                            <option key={field.id} value={field.id}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <button
                                    type="submit"
                                    className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#FF8800] transition-all duration-300 md:col-span-2 lg:col-span-3"
                                >
                                    Add Progress Entry
                                </button>
                            </form>

                            {/* Client performance metrics visualization */}
                            <PerformanceMetrics
                                clientType={client.type}
                                clientGoal={client.goal}
                                progress={progress}
                                onMetricAdd={handleAddMetric}
                            />

                            {/* Progress history table */}
                            <div className="mt-6">
                                <h4 className="font-medium mb-3">Progress History</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[#333] text-gray-400">
                                                <th className="px-2 py-2 text-left">Date</th>
                                                <th className="px-2 py-2 text-left">Weight (kg)</th>
                                                <th className="px-2 py-2 text-left">Body Fat (%)</th>

                                                {/* Dynamic headers based on client type */}
                                                {performanceFields
                                                    .filter(field => progress.some(entry => entry[field.id] !== undefined))
                                                    .map(field => (
                                                        <th key={field.id} className="px-2 py-2 text-left">
                                                            {field.label}
                                                        </th>
                                                    ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...progress].reverse().map((entry, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? "bg-[rgba(30,30,30,0.3)]" : ""}>
                                                    <td className="px-2 py-2">{entry.date}</td>
                                                    <td className="px-2 py-2">{entry.weight ?? "-"}</td>
                                                    <td className="px-2 py-2">{entry.bodyFat ?? "-"}</td>

                                                    {/* Dynamic cells based on client type */}
                                                    {performanceFields
                                                        .filter(field => progress.some(entry => entry[field.id] !== undefined))
                                                        .map(field => (
                                                            <td key={field.id} className="px-2 py-2">
                                                                {entry[field.id] !== undefined ? entry[field.id] : "-"}
                                                            </td>
                                                        ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Session notes & feedback */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Notes & Feedback
                            </h3>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full h-32 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-4 py-3 text-white mb-3 resize-none"
                                placeholder="Add notes about this client's progress, challenges, or feedback..."
                            ></textarea>
                            <button
                                onClick={handleSaveNotes}
                                className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#FF8800] transition-all duration-300"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Nutrition & Sessions */}
                    <div className="space-y-6">
                        {/* Body Composition Summary */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4">Body Composition</h3>

                            {progress.length > 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Current Weight</span>
                                            <span>{progress[progress.length - 1].weight} kg</span>
                                        </div>
                                        <ProgressBar
                                            value={progress[0].weight}
                                            maxValue={progress[progress.length - 1].weight}
                                            color={
                                                progress[progress.length - 1].weight <= progress[0].weight
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }
                                            showValues={false}
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Initial: {progress[0].weight} kg</span>
                                            <span
                                                className={
                                                    progress[progress.length - 1].weight <= progress[0].weight
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }
                                            >
                                                {progress[progress.length - 1].weight <= progress[0].weight ? "Lost" : "Gained"}{" "}
                                                {Math.abs(progress[progress.length - 1].weight - progress[0].weight).toFixed(1)}{" "}
                                                kg
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Current Body Fat</span>
                                            <span>{progress[progress.length - 1].bodyFat}%</span>
                                        </div>
                                        <ProgressBar
                                            value={progress[0].bodyFat}
                                            maxValue={progress[progress.length - 1].bodyFat}
                                            color={
                                                progress[progress.length - 1].bodyFat <= progress[0].bodyFat
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }
                                            showValues={false}
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Initial: {progress[0].bodyFat}%</span>
                                            <span
                                                className={
                                                    progress[progress.length - 1].bodyFat <= progress[0].bodyFat
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }
                                            >
                                                {progress[progress.length - 1].bodyFat <= progress[0].bodyFat
                                                    ? "Lost"
                                                    : "Gained"}{" "}
                                                {Math.abs(progress[progress.length - 1].bodyFat - progress[0].bodyFat).toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Nutrition Goals Section */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                    <line x1="6" y1="1" x2="6" y2="4"></line>
                                    <line x1="10" y1="1" x2="10" y2="4"></line>
                                    <line x1="14" y1="1" x2="14" y2="4"></line>
                                </svg>
                                Nutrition Goals
                            </h3>

                            <form className="grid grid-cols-1 gap-3 mb-4" onSubmit={handleNutritionUpdate}>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Protein (g)</label>
                                        <input
                                            type="number"
                                            value={nutrition.protein || ""}
                                            onChange={e => setNutrition({ ...nutrition, protein: parseInt(e.target.value) })}
                                            className="w-full bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Carbs (g)</label>
                                        <input
                                            type="number"
                                            value={nutrition.carbs || ""}
                                            onChange={e => setNutrition({ ...nutrition, carbs: parseInt(e.target.value) })}
                                            className="w-full bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Fats (g)</label>
                                        <input
                                            type="number"
                                            value={nutrition.fats || ""}
                                            onChange={e => setNutrition({ ...nutrition, fats: parseInt(e.target.value) })}
                                            className="w-full bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Calories</label>
                                        <input
                                            type="number"
                                            value={nutrition.calories || ""}
                                            onChange={e => setNutrition({ ...nutrition, calories: parseInt(e.target.value) })}
                                            className="w-full bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#FF6B00] text-white px-3 py-2 rounded-lg hover:bg-[#FF8800] transition-all duration-300 mt-2"
                                >
                                    Update Nutrition Goals
                                </button>
                            </form>

                            {/* Macro distribution visualization */}
                            <div className="mb-5">
                                <h4 className="text-sm font-medium mb-2">Macronutrient Distribution</h4>
                                <MacroDistribution
                                    protein={nutrition.protein || 0}
                                    carbs={nutrition.carbs || 0}
                                    fat={nutrition.fats || 0}
                                />
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Nutrition Recommendations</h4>
                                <div className="text-sm text-gray-300">
                                    <ul className="list-disc ml-5 space-y-1 text-gray-400">
                                        <li>Maintain high protein intake for recovery</li>
                                        <li>Consider {client.goal === "Fat Loss" ? "reducing" : "increasing"} carb intake</li>
                                        <li>Stay hydrated (3-4 liters per day)</li>
                                        <li>Track food intake daily</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-6 border border-[#333] backdrop-blur-sm">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Upcoming Sessions
                            </h3>

                            <div className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">{client.nextSession}</div>
                                        <div className="text-sm text-gray-400">Regular Training</div>
                                    </div>
                                    <div className="bg-[rgba(255,107,0,0.2)] text-[#FF6B00] px-2 py-1 rounded text-xs">
                                        Upcoming
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#FF8800] transition-all duration-300 flex items-center justify-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Schedule New Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientId;
