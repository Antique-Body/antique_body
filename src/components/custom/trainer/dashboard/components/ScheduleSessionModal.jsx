"use client";

import { useState } from "react";

export const ScheduleSessionModal = ({ client, onClose, onSchedule }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(60);
    const [sessionType, setSessionType] = useState("training");
    const [notes, setNotes] = useState("");

    // Generate next 14 days for selection
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        return dates;
    };

    const dates = generateDates();

    // Generate time slots from 7 AM to 9 PM
    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 7; hour <= 21; hour++) {
            const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
            const period = hour < 12 ? "AM" : "PM";

            timeSlots.push(`${hourFormatted}:00 ${period}`);
            timeSlots.push(`${hourFormatted}:30 ${period}`);
        }
        return timeSlots;
    };

    const timeSlots = generateTimeSlots();

    const handleSubmit = e => {
        e.preventDefault();

        // Format data for API
        const sessionData = {
            clientId: client.id,
            clientName: client.name,
            date,
            time,
            duration,
            sessionType,
            notes,
        };

        onSchedule(sessionData);
        onClose();
    };

    const formatDate = date => {
        const options = { weekday: "short", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    const isToday = date => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#121212] border border-[#333] rounded-xl w-full max-w-2xl overflow-hidden relative animate-fade-in">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7800] to-[#FF9A00]"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-1">Schedule Session with {client?.name}</h2>
                    <p className="text-gray-400 mb-4">Pick a date and time that works for both of you</p>

                    <form onSubmit={handleSubmit}>
                        {/* Date selection */}
                        <div className="mb-5">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Select Date</h3>
                            <div className="flex overflow-x-auto pb-2 gap-2">
                                {dates.map((date, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setDate(date.toISOString().split("T")[0])}
                                        className={`flex-shrink-0 w-[80px] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                                            date.toISOString().split("T")[0] === date
                                                ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                                                : "bg-[rgba(30,30,30,0.8)] text-white border border-[#444] hover:border-[#FF6B00]"
                                        }`}
                                    >
                                        <span className="text-xs font-medium mb-1">
                                            {isToday(date) ? "TODAY" : formatDate(date).split(",")[0].toUpperCase()}
                                        </span>
                                        <span className="text-xl font-bold">{date.getDate()}</span>
                                        <span className="text-xs mt-1">
                                            {date.toLocaleString("default", { month: "short" })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Time selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select Time</label>
                                <select
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    required
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                                >
                                    <option value="">Select time</option>
                                    {timeSlots.map((slot, index) => (
                                        <option key={index} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                                <select
                                    value={duration}
                                    onChange={e => setDuration(parseInt(e.target.value))}
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                    <option value="120">120 minutes</option>
                                </select>
                            </div>
                        </div>

                        {/* Session type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Session Type</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div
                                    onClick={() => setSessionType("training")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        sessionType === "training"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Training
                                </div>
                                <div
                                    onClick={() => setSessionType("assessment")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        sessionType === "assessment"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Assessment
                                </div>
                                <div
                                    onClick={() => setSessionType("consultation")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        sessionType === "consultation"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Consultation
                                </div>
                                <div
                                    onClick={() => setSessionType("analysis")}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                                        sessionType === "analysis"
                                            ? "bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.5)] text-[#FF6B00]"
                                            : "bg-[#1a1a1a] border-[#333] text-gray-300 hover:border-[#555]"
                                    }`}
                                >
                                    Analysis
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Session Notes</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white h-20 resize-none"
                                placeholder="Add any notes about this session..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-[#444] rounded-lg text-gray-300 hover:bg-[#333] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF9A00] transition-colors"
                            >
                                Schedule Session
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
