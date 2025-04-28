import { useState } from "react";

export const Availability = ({ trainer }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Generate dates for the next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }

    // Mock data for available times
    const availableTimes = [
        { time: "08:00", available: true },
        { time: "09:00", available: false },
        { time: "10:00", available: true },
        { time: "11:00", available: true },
        { time: "12:00", available: false },
        { time: "13:00", available: false },
        { time: "14:00", available: true },
        { time: "15:00", available: true },
        { time: "16:00", available: false },
        { time: "17:00", available: true },
        { time: "18:00", available: true },
        { time: "19:00", available: false },
    ];

    // Format date for display
    const formatDate = (date) => {
        const options = { weekday: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Schedule a Session</h3>
                <p className="text-gray-300 mb-4">
                    Select a date and time to book a session with {trainer?.name}.
                    {trainer?.available
                        ? " They are currently available for new clients."
                        : " They have limited availability at the moment."}
                </p>
            </div>

            {/* Weekly calendar */}
            <div className="mb-5">
                <h4 className="text-lg font-medium text-white mb-3">Select Date</h4>
                <div className="flex overflow-x-auto pb-2 gap-2">
                    {dates.map((date, index) => (
                        <div
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className={`flex-shrink-0 w-[90px] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                                selectedDate && selectedDate.getDate() === date.getDate()
                                    ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                                    : "bg-[rgba(30,30,30,0.8)] text-white border border-[#444] hover:border-[#FF6B00]"
                            }`}
                        >
                            <span className="text-xs font-medium mb-1">
                                {isToday(date) ? "TODAY" : formatDate(date).split(",")[0].toUpperCase()}
                            </span>
                            <span className="text-2xl font-bold">{date.getDate()}</span>
                            <span className="text-xs mt-1">{date.toLocaleString("default", { month: "short" })}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
                <div>
                    <h4 className="text-lg font-medium text-white mb-3">Select Time</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {availableTimes.map((slot, index) => (
                            <div
                                key={index}
                                className={`py-3 px-4 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                                    slot.available
                                        ? "bg-[rgba(30,30,30,0.8)] border border-[#444] hover:border-[#FF6B00] hover:-translate-y-1 text-white"
                                        : "bg-[rgba(20,20,20,0.5)] border border-[#333] text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {slot.time}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Session details */}
            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-4 mt-6">
                <h4 className="text-white font-medium mb-3">Session Information</h4>
                <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                        <span>Session Duration:</span>
                        <span>60 minutes</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Price:</span>
                        <span className="text-[#FF6B00] font-medium">${trainer?.hourlyRate || 75}/session</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Location:</span>
                        <span>In person or virtual</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Cancellation Policy:</span>
                        <span>24 hours notice</span>
                    </li>
                </ul>
            </div>

            <div className="pt-2">
                <button
                    className={`w-full py-3 px-4 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                        selectedDate
                            ? "bg-[#FF6B00] text-white hover:bg-[#E66000] hover:shadow-lg hover:-translate-y-0.5"
                            : "bg-[rgba(255,107,0,0.3)] text-white/50 cursor-not-allowed"
                    }`}
                    disabled={!selectedDate}
                >
                    Book Session
                </button>
            </div>
        </div>
    );
};

