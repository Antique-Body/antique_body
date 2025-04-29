import { Button } from "@/components/common/Button";
import { CloseXIcon, MonitorIcon, ProgressChartIcon, UserProfileIcon } from "@/components/common/Icons";
import { useState } from "react";

export const BookingSessionModal = ({ trainer, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [sessionType, setSessionType] = useState("in-person");
    const [sessionLength, setSessionLength] = useState(60);
    const [notes, setNotes] = useState("");
    const [step, setStep] = useState(1);

    // Generate dates for the next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }

    // Mock available times
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

    // Calculate total price based on trainer hourly rate and session length
    const calculatePrice = () => {
        const basePrice = trainer?.hourlyRate || 75;
        return basePrice * (sessionLength / 60);
    };

    // Format date for display
    const formatDate = date => {
        if (!date) return "";
        const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    // Handle date selection
    const handleDateSelect = date => {
        setSelectedDate(date);
    };

    // Handle time selection
    const handleTimeSelect = time => {
        setSelectedTime(time);
    };

    // Check if date is today
    const isToday = date => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Handle next step
    const handleNext = () => {
        if (step === 1 && selectedDate && selectedTime) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    // Handle previous step
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Handle booking submission
    const handleBookSession = () => {
        // Here you would typically make an API call to book the session
        console.log({
            trainer: trainer?.id,
            date: selectedDate,
            time: selectedTime,
            sessionType,
            sessionLength,
            notes,
        });

        // Close the modal after booking
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
                className="bg-[#121212] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-modalFadeIn"
                style={{
                    animation: "modalFadeIn 0.3s ease-out",
                    boxShadow: "0 15px 40px -10px rgba(255,107,0,0.3)",
                }}
            >
                {/* Orange accent line at top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>

                {/* Close button */}
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10 p-0"
                >
                    <CloseXIcon size={24} />
                </Button>

                {/* Modal header */}
                <div className="p-6 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white">Book a Session with {trainer?.name}</h2>
                    <p className="text-gray-400 mt-1">{trainer?.specialty}</p>
                </div>

                {/* Progress indicator */}
                <div className="px-6 pt-4 flex items-center">
                    <div className="flex items-center w-full max-w-md mx-auto">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 1 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
                        >
                            1
                        </div>
                        <div
                            className={`flex-1 h-1 mx-2 
              ${step >= 2 ? "bg-[#FF6B00]" : "bg-[#333]"}`}
                        ></div>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 2 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
                        >
                            2
                        </div>
                        <div
                            className={`flex-1 h-1 mx-2 
              ${step >= 3 ? "bg-[#FF6B00]" : "bg-[#333]"}`}
                        ></div>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${step >= 3 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
                        >
                            3
                        </div>
                    </div>
                </div>

                {/* Step 1: Select Date and Time */}
                {step === 1 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Select Date & Time</h3>

                        {/* Date selection */}
                        <div className="mb-5">
                            <label className="block text-gray-300 text-sm mb-2">Date</label>
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
                                            {isToday(date)
                                                ? "TODAY"
                                                : date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                                        </span>
                                        <span className="text-2xl font-bold">{date.getDate()}</span>
                                        <span className="text-xs mt-1">
                                            {date.toLocaleString("default", { month: "short" })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time selection */}
                        {selectedDate && (
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Time</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {availableTimes.map((slot, index) => (
                                        <div
                                            key={index}
                                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                                            className={`py-3 px-4 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                                                selectedTime === slot.time
                                                    ? "bg-[#FF6B00] text-white"
                                                    : slot.available
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
                    </div>
                )}

                {/* Step 2: Session Details */}
                {step === 2 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Session Details</h3>

                        {/* Session type */}
                        <div className="mb-5">
                            <label className="block text-gray-300 text-sm mb-2">Session Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    onClick={() => setSessionType("in-person")}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                        sessionType === "in-person"
                                            ? "bg-[rgba(255,107,0,0.2)] border border-[#FF6B00]"
                                            : "bg-[rgba(30,30,30,0.8)] border border-[#444] hover:border-[#FF6B00]"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <ProgressChartIcon
                                            size={16}
                                            stroke={sessionType === "in-person" ? "#FF6B00" : "currentColor"}
                                            className="text-gray-300"
                                        />
                                        <h4
                                            className={`font-medium ${
                                                sessionType === "in-person" ? "text-[#FF6B00]" : "text-white"
                                            }`}
                                        >
                                            In Person
                                        </h4>
                                    </div>
                                    <p className="text-gray-400 text-sm">Face-to-face training at gym or designated location</p>
                                </div>

                                <div
                                    onClick={() => setSessionType("virtual")}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                        sessionType === "virtual"
                                            ? "bg-[rgba(255,107,0,0.2)] border border-[#FF6B00]"
                                            : "bg-[rgba(30,30,30,0.8)] border border-[#444] hover:border-[#FF6B00]"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <MonitorIcon
                                            size={16}
                                            stroke={sessionType === "virtual" ? "#FF6B00" : "currentColor"}
                                            className="text-gray-300"
                                        />
                                        <h4
                                            className={`font-medium ${
                                                sessionType === "virtual" ? "text-[#FF6B00]" : "text-white"
                                            }`}
                                        >
                                            Virtual
                                        </h4>
                                    </div>
                                    <p className="text-gray-400 text-sm">Remote training via video call from your location</p>
                                </div>
                            </div>
                        </div>

                        {/* Session length */}
                        <div className="mb-5">
                            <label className="block text-gray-300 text-sm mb-2">Session Length</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[30, 60, 90].map(minutes => (
                                    <div
                                        key={minutes}
                                        onClick={() => setSessionLength(minutes)}
                                        className={`py-3 px-4 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                                            sessionLength === minutes
                                                ? "bg-[rgba(255,107,0,0.2)] border border-[#FF6B00] text-[#FF6B00]"
                                                : "bg-[rgba(30,30,30,0.8)] border border-[#444] text-white hover:border-[#FF6B00]"
                                        }`}
                                    >
                                        {minutes} min
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-5">
                            <label className="block text-gray-300 text-sm mb-2">Notes for Trainer (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full py-3 px-4 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#FF6B00] min-h-[100px]"
                                placeholder="Mention any specific goals, concerns, or questions..."
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Confirm Booking</h3>

                        <div className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-xl p-5 mb-5">
                            <div className="flex items-start gap-4 mb-4">
                                {/* Trainer avatar */}
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white overflow-hidden">
                                    <UserProfileIcon size={40} />
                                </div>

                                <div>
                                    <h4 className="font-medium text-white">{trainer?.name}</h4>
                                    <p className="text-gray-400 text-sm">{trainer?.specialty}</p>
                                    <p className="text-[#FF6B00] font-medium mt-1">${calculatePrice().toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-3 border-t border-[#333] pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-white">{formatDate(selectedDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-white">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Session Type:</span>
                                    <span className="text-white capitalize">{sessionType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white">{sessionLength} minutes</span>
                                </div>
                                {notes && (
                                    <div className="pt-2">
                                        <span className="text-gray-400 block mb-1">Notes:</span>
                                        <p className="text-white text-sm bg-[rgba(20,20,20,0.5)] p-3 rounded">{notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-4 mb-5">
                            <h4 className="text-white font-medium mb-2">Payment Information</h4>
                            <p className="text-gray-300 text-sm mb-4">
                                You will not be charged until after the session is completed.
                            </p>
                            <div className="flex justify-between font-medium">
                                <span className="text-white">Total:</span>
                                <span className="text-[#FF6B00]">${calculatePrice().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-center text-gray-400 text-sm mb-4">
                            By confirming, you agree to our{" "}
                            <a href="#" className="text-[#FF6B00] hover:underline">
                                Terms of Service
                            </a>{" "}
                            and
                            <a href="#" className="text-[#FF6B00] hover:underline">
                                {" "}
                                Cancellation Policy
                            </a>
                        </div>
                    </div>
                )}

                {/* Modal footer */}
                <div className="border-t border-[#333] p-5 flex justify-between">
                    {step > 1 ? (
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            className="py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300"
                        >
                            Back
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300"
                        >
                            Cancel
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button
                            variant="orangeFilled"
                            onClick={handleNext}
                            disabled={step === 1 && (!selectedDate || !selectedTime)}
                            className={`py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                                step === 1 && (!selectedDate || !selectedTime)
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:-translate-y-0.5"
                            }`}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="orangeFilled"
                            onClick={handleBookSession}
                            className="py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Confirm Booking
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
