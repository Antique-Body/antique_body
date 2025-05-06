"use client";
import { useState } from "react";

export default function HealthPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [showMeasurementModal, setShowMeasurementModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [newMeasurement, setNewMeasurement] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        notes: ''
    });
    const [newPhoto, setNewPhoto] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'front', // front, side, back
        notes: ''
    });

    // Sample health data (ideally would come from your database)
    const healthData = {
        overview: {
            current: {
                weight: 75, // kg
                bodyFat: 18, // percentage
                bmi: 23.5,
                muscleMass: 35, // kg
                hydration: 65, // percentage
                restingHeartRate: 65, // bpm
                vo2Max: 42, // ml/kg/min
                sleepScore: 85, // percentage
                stressLevel: 35, // percentage
                recoveryStatus: "Good", // Good, Moderate, Poor
                dailySteps: 8450,
                caloriesBurned: 1850,
                activeMinutes: 45,
            },
            trends: {
                weight: { change: -2, period: "month" },
                bodyFat: { change: -1.5, period: "month" },
                muscleMass: { change: 0.8, period: "month" },
                restingHeartRate: { change: -3, period: "month" },
                vo2Max: { change: 2, period: "month" },
                sleepScore: { change: 5, period: "week" },
                stressLevel: { change: -10, period: "week" },
            },
            goals: {
                weight: 72,
                bodyFat: 15,
                muscleMass: 38,
                dailySteps: 10000,
                sleepHours: 8,
                stressLevel: 30,
            }
        },
        history: [
            { date: "Apr 1, 2023", weight: 76, bodyFat: 18.5, bmi: 24, restingHeartRate: 67, muscleMass: 34.2 },
            { date: "Mar 15, 2023", weight: 77, bodyFat: 19, bmi: 24.2, restingHeartRate: 68, muscleMass: 33.8 },
            { date: "Mar 1, 2023", weight: 78, bodyFat: 19.5, bmi: 24.5, restingHeartRate: 70, muscleMass: 33.5 },
            { date: "Feb 15, 2023", weight: 79, bodyFat: 20, bmi: 24.8, restingHeartRate: 72, muscleMass: 33.2 },
            { date: "Feb 1, 2023", weight: 80, bodyFat: 20.5, bmi: 25, restingHeartRate: 73, muscleMass: 33.0 },
        ],
        sleep: {
            averageDuration: 7.5, // hours
            sleepQuality: 85, // percentage
            deepSleepPercent: 20,
            remSleepPercent: 25,
            lightSleepPercent: 50,
            awakeSleepPercent: 5,
            recentSleep: [
                { date: "Apr 8, 2023", duration: 7.8, quality: 90, deepSleep: 1.6, remSleep: 2.0 },
                { date: "Apr 7, 2023", duration: 6.5, quality: 75, deepSleep: 1.2, remSleep: 1.5 },
                { date: "Apr 6, 2023", duration: 8.0, quality: 88, deepSleep: 1.7, remSleep: 2.1 },
                { date: "Apr 5, 2023", duration: 7.2, quality: 82, deepSleep: 1.4, remSleep: 1.8 },
                { date: "Apr 4, 2023", duration: 7.5, quality: 85, deepSleep: 1.5, remSleep: 1.9 },
            ],
        },
        activity: {
            daily: {
                steps: 8450,
                distance: 6.2, // km
                caloriesBurned: 1850,
                activeMinutes: 45,
                exerciseMinutes: 30,
                standHours: 12,
            },
            weekly: {
                totalSteps: 58900,
                totalDistance: 43.4, // km
                totalCalories: 12950,
                totalActiveMinutes: 315,
                totalExerciseMinutes: 210,
                averageStandHours: 11.5,
            },
            recentWorkouts: [
                { date: "Apr 8, 2023", type: "Strength Training", duration: 45, calories: 320, intensity: "High" },
                { date: "Apr 7, 2023", type: "Cardio", duration: 30, calories: 280, intensity: "Medium" },
                { date: "Apr 6, 2023", type: "Yoga", duration: 60, calories: 180, intensity: "Low" },
            ]
        },
        devices: {
            connected: [
                {
                    id: 1,
                    name: "Apple Watch Series 8",
                    type: "Smartwatch",
                    lastSync: "2 minutes ago",
                    status: "connected",
                    metrics: ["Heart Rate", "Sleep", "Activity", "ECG"],
                    battery: 85
                },
                {
                    id: 2,
                    name: "Oura Ring Gen 3",
                    type: "Smart Ring",
                    lastSync: "5 minutes ago",
                    status: "connected",
                    metrics: ["Sleep", "Activity", "Temperature", "HRV"],
                    battery: 65
                },
                {
                    id: 3,
                    name: "Withings Body+",
                    type: "Smart Scale",
                    lastSync: "1 hour ago",
                    status: "connected",
                    metrics: ["Weight", "Body Fat", "Muscle Mass", "BMI"],
                    battery: 90
                }
            ],
            available: [
                {
                    id: 4,
                    name: "Fitbit Charge 5",
                    type: "Fitness Tracker",
                    metrics: ["Heart Rate", "Sleep", "Activity", "Stress"]
                },
                {
                    id: 5,
                    name: "Garmin Forerunner 255",
                    type: "Sports Watch",
                    metrics: ["Heart Rate", "GPS", "VO2 Max", "Training Load"]
                }
            ]
        },
        progressPhotos: [
            {
                id: 1,
                date: "2024-03-01",
                type: "front",
                url: "/progress/front-1.jpg",
                notes: "Starting point"
            },
            {
                id: 2,
                date: "2024-03-15",
                type: "front",
                url: "/progress/front-2.jpg",
                notes: "2 weeks in"
            },
            {
                id: 3,
                date: "2024-04-01",
                type: "front",
                url: "/progress/front-3.jpg",
                notes: "1 month progress"
            }
        ]
    };

    const handleMeasurementSubmit = (e) => {
        e.preventDefault();
        // Here you would typically save the measurement to your database
        console.log('New measurement:', newMeasurement);
        setShowMeasurementModal(false);
        setNewMeasurement({
            date: new Date().toISOString().split('T')[0],
            weight: '',
            bodyFat: '',
            notes: ''
        });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically upload the photo to your storage
            console.log('New photo:', { ...newPhoto, file });
            setShowPhotoModal(false);
            setNewPhoto({
                date: new Date().toISOString().split('T')[0],
                type: 'front',
                notes: ''
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Health metrics and tracking nav */}
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                <div className="flex border-b border-[#333]">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-6 py-4 text-sm font-medium ${
                            activeTab === "overview"
                                ? "bg-[#333] text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                        }`}>
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`px-6 py-4 text-sm font-medium ${
                            activeTab === "activity"
                                ? "bg-[#333] text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                        }`}>
                        Activity
                    </button>
                    <button
                        onClick={() => setActiveTab("sleep")}
                        className={`px-6 py-4 text-sm font-medium ${
                            activeTab === "sleep"
                                ? "bg-[#333] text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                        }`}>
                        Sleep
                    </button>
                    <button
                        onClick={() => setActiveTab("progress")}
                        className={`px-6 py-4 text-sm font-medium ${
                            activeTab === "progress"
                                ? "bg-[#333] text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                        }`}>
                        Progress
                    </button>
                    <button
                        onClick={() => setActiveTab("devices")}
                        className={`px-6 py-4 text-sm font-medium ${
                            activeTab === "devices"
                                ? "bg-[#333] text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#222]"
                        }`}>
                        Devices
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === "overview" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Health Overview</h2>
                            
                            {/* Current Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">Weight</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.weight} kg</div>
                                    <div className={`text-sm mt-1 ${
                                        healthData.overview.trends.weight.change < 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {healthData.overview.trends.weight.change > 0 ? '+' : ''}
                                        {healthData.overview.trends.weight.change} kg this {healthData.overview.trends.weight.period}
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">Body Fat</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.bodyFat}%</div>
                                    <div className={`text-sm mt-1 ${
                                        healthData.overview.trends.bodyFat.change < 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {healthData.overview.trends.bodyFat.change > 0 ? '+' : ''}
                                        {healthData.overview.trends.bodyFat.change}% this {healthData.overview.trends.bodyFat.period}
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">Muscle Mass</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.muscleMass} kg</div>
                                    <div className={`text-sm mt-1 ${
                                        healthData.overview.trends.muscleMass.change > 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {healthData.overview.trends.muscleMass.change > 0 ? '+' : ''}
                                        {healthData.overview.trends.muscleMass.change} kg this {healthData.overview.trends.muscleMass.period}
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">BMI</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.bmi}</div>
                                    <div className="text-gray-400 text-sm mt-1">Normal Range</div>
                                </div>
                            </div>

                            {/* Health Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">Resting Heart Rate</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.restingHeartRate} bpm</div>
                                    <div className={`text-sm mt-1 ${
                                        healthData.overview.trends.restingHeartRate.change < 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {healthData.overview.trends.restingHeartRate.change > 0 ? '+' : ''}
                                        {healthData.overview.trends.restingHeartRate.change} bpm this {healthData.overview.trends.restingHeartRate.period}
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">VO2 Max</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.vo2Max} ml/kg/min</div>
                                    <div className={`text-sm mt-1 ${
                                        healthData.overview.trends.vo2Max.change > 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {healthData.overview.trends.vo2Max.change > 0 ? '+' : ''}
                                        {healthData.overview.trends.vo2Max.change} this {healthData.overview.trends.vo2Max.period}
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-4 rounded-lg">
                                    <div className="text-gray-400 text-sm mb-1">Hydration</div>
                                    <div className="text-2xl font-bold">{healthData.overview.current.hydration}%</div>
                                    <div className="text-gray-400 text-sm mt-1">Daily Target: 75%</div>
                                </div>
                            </div>

                            {/* Daily Activity Summary */}
                            <div className="bg-[#222] p-6 rounded-xl mb-8">
                                <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Steps</div>
                                        <div className="text-2xl font-bold">{healthData.overview.current.dailySteps.toLocaleString()}</div>
                                        <div className="text-sm text-gray-400 mt-1">Goal: {healthData.overview.goals.dailySteps.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Calories</div>
                                        <div className="text-2xl font-bold">{healthData.overview.current.caloriesBurned}</div>
                                        <div className="text-sm text-gray-400 mt-1">Burned today</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Active Minutes</div>
                                        <div className="text-2xl font-bold">{healthData.overview.current.activeMinutes}</div>
                                        <div className="text-sm text-gray-400 mt-1">Goal: 60 minutes</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm mb-1">Recovery Status</div>
                                        <div className="text-2xl font-bold">{healthData.overview.current.recoveryStatus}</div>
                                        <div className="text-sm text-gray-400 mt-1">Based on sleep & activity</div>
                                    </div>
                                </div>
                            </div>

                            {/* Health History */}
                            <h3 className="text-lg font-medium mb-4">Health History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-[#333] text-left">
                                        <tr>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Weight (kg)</th>
                                            <th className="py-3 px-4">Body Fat (%)</th>
                                            <th className="py-3 px-4">BMI</th>
                                            <th className="py-3 px-4">Heart Rate (bpm)</th>
                                            <th className="py-3 px-4">Muscle Mass (kg)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {healthData.history.map((record, index) => (
                                            <tr key={index} className="border-b border-[#333]">
                                                <td className="py-3 px-4 text-gray-400">{record.date}</td>
                                                <td className="py-3 px-4">{record.weight}</td>
                                                <td className="py-3 px-4">{record.bodyFat}</td>
                                                <td className="py-3 px-4">{record.bmi}</td>
                                                <td className="py-3 px-4">{record.restingHeartRate}</td>
                                                <td className="py-3 px-4">{record.muscleMass}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-6 flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e56200] text-white rounded-lg transition">
                                    Update Measurements
                                </button>
                                <button className="px-6 py-3 bg-[#333] hover:bg-[#444] text-white rounded-lg transition">
                                    View Detailed Report
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Activity Tracking</h2>
                            
                            {/* Daily Activity Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-[#222] p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Steps</span>
                                                <span>{healthData.activity.daily.steps.toLocaleString()} / {healthData.overview.goals.dailySteps.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.daily.steps / healthData.overview.goals.dailySteps) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Distance</span>
                                                <span>{healthData.activity.daily.distance} km</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.daily.distance / 10) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Calories Burned</span>
                                                <span>{healthData.activity.daily.caloriesBurned}</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.daily.caloriesBurned / 2500) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Active Minutes</span>
                                                <span>{healthData.activity.daily.activeMinutes} / 60</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.daily.activeMinutes / 60) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Total Steps</span>
                                                <span>{healthData.activity.weekly.totalSteps.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.weekly.totalSteps / 70000) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Total Distance</span>
                                                <span>{healthData.activity.weekly.totalDistance} km</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.weekly.totalDistance / 50) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Total Calories</span>
                                                <span>{healthData.activity.weekly.totalCalories}</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.weekly.totalCalories / 15000) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Average Stand Hours</span>
                                                <span>{healthData.activity.weekly.averageStandHours} / 12</span>
                                            </div>
                                            <div className="h-2 bg-[#333] rounded-full">
                                                <div 
                                                    className="h-full bg-[#FF6B00] rounded-full"
                                                    style={{width: `${(healthData.activity.weekly.averageStandHours / 12) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Recent Workouts */}
                            <h3 className="text-lg font-medium mb-4">Recent Workouts</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-[#333] text-left">
                                        <tr>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Type</th>
                                            <th className="py-3 px-4">Duration</th>
                                            <th className="py-3 px-4">Calories</th>
                                            <th className="py-3 px-4">Intensity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {healthData.activity.recentWorkouts.map((workout, index) => (
                                            <tr key={index} className="border-b border-[#333]">
                                                <td className="py-3 px-4 text-gray-400">{workout.date}</td>
                                                <td className="py-3 px-4">{workout.type}</td>
                                                <td className="py-3 px-4">{workout.duration} min</td>
                                                <td className="py-3 px-4">{workout.calories}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        workout.intensity === "High" ? "bg-red-500/20 text-red-500" :
                                                        workout.intensity === "Medium" ? "bg-yellow-500/20 text-yellow-500" :
                                                        "bg-green-500/20 text-green-500"
                                                    }`}>
                                                        {workout.intensity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "sleep" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Sleep Tracking</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-[#1a2339] to-[#0f1930] p-6 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Sleep Overview</h3>
                                            <p className="text-gray-400 text-sm">Last 7 days average</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-[#101828] flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-xl font-bold">{healthData.sleep.averageDuration}</div>
                                                <div className="text-xs text-gray-400">hours</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <div className="h-6 flex rounded-full overflow-hidden">
                                            <div 
                                                style={{width: `${healthData.sleep.deepSleepPercent}%`}} 
                                                className="bg-blue-600"
                                                title={`Deep: ${healthData.sleep.deepSleepPercent}%`}
                                            ></div>
                                            <div 
                                                style={{width: `${healthData.sleep.remSleepPercent}%`}} 
                                                className="bg-blue-400"
                                                title={`REM: ${healthData.sleep.remSleepPercent}%`}
                                            ></div>
                                            <div 
                                                style={{width: `${healthData.sleep.lightSleepPercent}%`}} 
                                                className="bg-blue-300"
                                                title={`Light: ${healthData.sleep.lightSleepPercent}%`}
                                            ></div>
                                            <div 
                                                style={{width: `${healthData.sleep.awakeSleepPercent}%`}} 
                                                className="bg-gray-600"
                                                title={`Awake: ${healthData.sleep.awakeSleepPercent}%`}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex text-xs text-gray-400 mt-2 justify-between">
                                            <div>Deep: {healthData.sleep.deepSleepPercent}%</div>
                                            <div>REM: {healthData.sleep.remSleepPercent}%</div>
                                            <div>Light: {healthData.sleep.lightSleepPercent}%</div>
                                            <div>Awake: {healthData.sleep.awakeSleepPercent}%</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-[#222] p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold mb-4">Sleep Quality</h3>
                                    <div className="flex items-center justify-center my-4">
                                        <div className="relative w-36 h-36">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">{healthData.sleep.sleepQuality}%</div>
                                                    <div className="text-sm text-gray-400">Quality</div>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 border-8 border-[#FF6B00] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-300">Your sleep quality is above average</p>
                                        <p className="text-xs text-gray-400 mt-1">Consider going to bed 30 minutes earlier</p>
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4">Recent Sleep Data</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-[#333] text-left">
                                        <tr>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Duration (h)</th>
                                            <th className="py-3 px-4">Quality (%)</th>
                                            <th className="py-3 px-4">Deep Sleep (h)</th>
                                            <th className="py-3 px-4">REM Sleep (h)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {healthData.sleep.recentSleep.map((record, index) => (
                                            <tr key={index} className="border-b border-[#333]">
                                                <td className="py-3 px-4 text-gray-400">{record.date}</td>
                                                <td className="py-3 px-4">{record.duration}</td>
                                                <td className="py-3 px-4">{record.quality}</td>
                                                <td className="py-3 px-4">{record.deepSleep}</td>
                                                <td className="py-3 px-4">{record.remSleep}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "progress" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Progress Tracking</h2>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowMeasurementModal(true)}
                                        className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e56200] text-white rounded-lg transition text-sm">
                                        Add Measurement
                                    </button>
                                    <button 
                                        onClick={() => setShowPhotoModal(true)}
                                        className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition text-sm">
                                        Add Progress Photo
                                    </button>
                                </div>
                            </div>

                            {/* Measurements History */}
                            <div className="bg-[#222] p-6 rounded-xl mb-8">
                                <h3 className="text-lg font-semibold mb-4">Measurement History</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-[#333] text-left">
                                            <tr>
                                                <th className="py-3 px-4">Date</th>
                                                <th className="py-3 px-4">Weight (kg)</th>
                                                <th className="py-3 px-4">Body Fat (%)</th>
                                                <th className="py-3 px-4">BMI</th>
                                                <th className="py-3 px-4">Muscle Mass (kg)</th>
                                                <th className="py-3 px-4">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {healthData.history.map((record, index) => (
                                                <tr key={index} className="border-b border-[#333]">
                                                    <td className="py-3 px-4 text-gray-400">{record.date}</td>
                                                    <td className="py-3 px-4">{record.weight}</td>
                                                    <td className="py-3 px-4">{record.bodyFat}</td>
                                                    <td className="py-3 px-4">{record.bmi}</td>
                                                    <td className="py-3 px-4">{record.muscleMass}</td>
                                                    <td className="py-3 px-4 text-gray-400">-</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Progress Photos */}
                            <div className="bg-[#222] p-6 rounded-xl">
                                <h3 className="text-lg font-semibold mb-4">Progress Photos</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {healthData.progressPhotos.map((photo) => (
                                        <div key={photo.id} className="bg-[#333] rounded-xl overflow-hidden">
                                            <div className="aspect-square bg-[#444] relative">
                                                <img 
                                                    src={photo.url} 
                                                    alt={`Progress photo from ${photo.date}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">{photo.date}</p>
                                                        <p className="text-sm text-gray-400 capitalize">{photo.type} view</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400">{photo.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "devices" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Connected Devices</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {healthData.devices.connected.map((device) => (
                                    <div key={device.id} className="bg-[#222] p-6 rounded-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">{device.name}</h3>
                                                <p className="text-gray-400 text-sm">{device.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    device.status === "connected" ? "bg-green-500" : "bg-red-500"
                                                }`}></div>
                                                <span className="text-sm text-gray-400">{device.status}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Battery</span>
                                                    <span>{device.battery}%</span>
                                                </div>
                                                <div className="h-2 bg-[#333] rounded-full">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            device.battery > 70 ? "bg-green-500" : 
                                                            device.battery > 30 ? "bg-yellow-500" : 
                                                            "bg-red-500"
                                                        }`}
                                                        style={{width: `${device.battery}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm text-gray-400 mb-2">Metrics Tracked:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {device.metrics.map((metric, index) => (
                                                        <span 
                                                            key={index}
                                                            className="px-2 py-1 bg-[#333] rounded-full text-xs"
                                                        >
                                                            {metric}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-[#333]">
                                                <p className="text-sm text-gray-400">Last sync: {device.lastSync}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4">Available Devices</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {healthData.devices.available.map((device) => (
                                    <div key={device.id} className="bg-[#222] p-6 rounded-xl">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{device.name}</h3>
                                                <p className="text-gray-400 text-sm">{device.type}</p>
                                            </div>
                                            <button className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e56200] text-white rounded-lg transition text-sm">
                                                Connect
                                            </button>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-400 mb-2">Available Metrics:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {device.metrics.map((metric, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-2 py-1 bg-[#333] rounded-full text-xs"
                                                    >
                                                        {metric}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Measurement Modal */}
                    {showMeasurementModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#222] rounded-xl p-6 w-full max-w-md">
                                <h3 className="text-xl font-semibold mb-4">Add New Measurement</h3>
                                <form onSubmit={handleMeasurementSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={newMeasurement.date}
                                            onChange={(e) => setNewMeasurement({...newMeasurement, date: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newMeasurement.weight}
                                            onChange={(e) => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                            placeholder="Enter weight"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Body Fat (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newMeasurement.bodyFat}
                                            onChange={(e) => setNewMeasurement({...newMeasurement, bodyFat: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                            placeholder="Enter body fat percentage"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Notes</label>
                                        <textarea
                                            value={newMeasurement.notes}
                                            onChange={(e) => setNewMeasurement({...newMeasurement, notes: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                            placeholder="Add any notes about this measurement"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowMeasurementModal(false)}
                                            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e56200] text-white rounded-lg transition">
                                            Save Measurement
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Photo Upload Modal */}
                    {showPhotoModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#222] rounded-xl p-6 w-full max-w-md">
                                <h3 className="text-xl font-semibold mb-4">Add Progress Photo</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={newPhoto.date}
                                            onChange={(e) => setNewPhoto({...newPhoto, date: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Photo Type</label>
                                        <select
                                            value={newPhoto.type}
                                            onChange={(e) => setNewPhoto({...newPhoto, type: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="front">Front View</option>
                                            <option value="side">Side View</option>
                                            <option value="back">Back View</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Upload Photo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Notes</label>
                                        <textarea
                                            value={newPhoto.notes}
                                            onChange={(e) => setNewPhoto({...newPhoto, notes: e.target.value})}
                                            className="w-full bg-[#333] border border-[#444] rounded-lg px-4 py-2 text-white"
                                            placeholder="Add any notes about this photo"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowPhotoModal(false)}
                                            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e56200] text-white rounded-lg transition">
                                            Upload Photo
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 