"use client";
import { useState } from "react";

const DeviceIntegration = () => {
    const [connectedDevice, setConnectedDevice] = useState(null);
    const healthData = {
        heartRate: {
            current: 72,
            average: 68,
            max: 165,
            min: 52,
            history: [65, 68, 72, 70, 67, 69, 72],
        },
        sleep: {
            lastNight: {
                total: 7.5,
                deep: 2.8,
                light: 3.7,
                rem: 1.0,
            },
            weeklyAverage: 7.2,
            quality: 85,
        },
        steps: {
            today: 8432,
            goal: 10000,
            weeklyAverage: 9150,
            history: [8500, 9200, 7800, 10200, 8900, 9500, 8432],
        },
        calories: {
            active: 420,
            total: 2250,
            goal: 2800,
        },
        activity: {
            activeMinutes: 95,
            goal: 150,
            intensityZones: {
                low: 45,
                moderate: 35,
                high: 15,
            },
        },
        stress: {
            current: "Medium",
            score: 65,
            history: [70, 68, 75, 65, 60, 72, 65],
        },
    };

    const availableDevices = [
        { id: 1, name: "Apple Watch", icon: "⌚", type: "apple" },
        { id: 2, name: "Huawei Watch", icon: "⌚", type: "huawei" },
        { id: 3, name: "Fitbit", icon: "⌚", type: "fitbit" },
        { id: 4, name: "Garmin", icon: "⌚", type: "garmin" },
        { id: 5, name: "Samsung Galaxy Watch", icon: "⌚", type: "samsung" },
    ];

    const connectDevice = (device) => {
        setConnectedDevice(device);
        // Here you would implement actual device connection logic
    };

    return (
        <div className="space-y-8">
            {/* Device Connection Section */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Connected Devices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableDevices.map((device) => (
                        <div
                            key={device.id}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                                connectedDevice?.id === device.id
                                    ? "bg-[#222] border-[#FF6B00]"
                                    : "bg-[#1A1A1A] border-[#333] hover:border-[#444]"
                            }`}
                            onClick={() => connectDevice(device)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{device.icon}</div>
                                <div>
                                    <h4 className="font-medium">{device.name}</h4>
                                    <p className="text-sm text-gray-400">
                                        {connectedDevice?.id === device.id ? "Connected" : "Click to connect"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Health Data Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Heart Rate */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Heart Rate</h3>
                        <div className="w-8 h-8 rounded-full bg-[#e74c3c] bg-opacity-10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#e74c3c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#e74c3c] mb-2">{healthData.heartRate.current} BPM</div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Min: {healthData.heartRate.min}</span>
                        <span>Avg: {healthData.heartRate.average}</span>
                        <span>Max: {healthData.heartRate.max}</span>
                    </div>
                    <div className="mt-4 h-20">
                        <div className="flex h-full items-end gap-1">
                            {healthData.heartRate.history.map((rate, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-[#e74c3c] bg-opacity-20 rounded-t"
                                    style={{
                                        height: `${(rate / healthData.heartRate.max) * 100}%`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sleep */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Sleep</h3>
                        <div className="w-8 h-8 rounded-full bg-[#9b59b6] bg-opacity-10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9b59b6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#9b59b6] mb-2">{healthData.sleep.lastNight.total}h</div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Deep Sleep</span>
                            <span>{healthData.sleep.lastNight.deep}h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Light Sleep</span>
                            <span>{healthData.sleep.lastNight.light}h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">REM</span>
                            <span>{healthData.sleep.lastNight.rem}h</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#333] rounded-full">
                            <div
                                className="h-full bg-[#9b59b6] rounded-full"
                                style={{ width: `${healthData.sleep.quality}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-400">{healthData.sleep.quality}% quality</span>
                    </div>
                </div>

                {/* Steps & Activity */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Daily Activity</h3>
                        <div className="w-8 h-8 rounded-full bg-[#2ecc71] bg-opacity-10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2ecc71"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 15l-7-7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#2ecc71] mb-2">
                        {healthData.steps.today.toLocaleString()} steps
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                        <span>{Math.round((healthData.steps.today / healthData.steps.goal) * 100)}% of daily goal</span>
                        <span>{healthData.steps.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Active Calories</span>
                                <span>{healthData.calories.active} kcal</span>
                            </div>
                            <div className="h-1 bg-[#333] rounded-full">
                                <div
                                    className="h-full bg-[#2ecc71] rounded-full"
                                    style={{
                                        width: `${(healthData.calories.active / healthData.calories.goal) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Active Minutes</span>
                                <span>{healthData.activity.activeMinutes} min</span>
                            </div>
                            <div className="h-1 bg-[#333] rounded-full">
                                <div
                                    className="h-full bg-[#2ecc71] rounded-full"
                                    style={{
                                        width: `${(healthData.activity.activeMinutes / healthData.activity.goal) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stress Level & Recovery */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Stress & Recovery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Current Stress Level</h4>
                            <span className="text-[#FF6B00]">{healthData.stress.current}</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full mb-4">
                            <div
                                className="h-full bg-gradient-to-r from-[#2ecc71] via-[#f1c40f] to-[#e74c3c] rounded-full"
                                style={{ width: `${healthData.stress.score}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-4">Weekly Stress Trend</h4>
                        <div className="flex items-end h-20 gap-2">
                            {healthData.stress.history.map((level, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-t"
                                    style={{ height: `${level}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Settings */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Device Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Auto-sync Data</h4>
                                <p className="text-sm text-gray-400">Sync health data automatically</p>
                            </div>
                            <button className="w-12 h-6 bg-[#2ecc71] rounded-full relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Workout Detection</h4>
                                <p className="text-sm text-gray-400">Auto-detect workout sessions</p>
                            </div>
                            <button className="w-12 h-6 bg-[#2ecc71] rounded-full relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Heart Rate Alerts</h4>
                                <p className="text-sm text-gray-400">Notify on abnormal heart rate</p>
                            </div>
                            <button className="w-12 h-6 bg-[#333] rounded-full relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Share with Health App</h4>
                                <p className="text-sm text-gray-400">Sync data with Apple Health/Google Fit</p>
                            </div>
                            <button className="w-12 h-6 bg-[#2ecc71] rounded-full relative">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceIntegration;
