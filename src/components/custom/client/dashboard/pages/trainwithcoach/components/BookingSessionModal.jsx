import { useState } from "react";

import { MonitorIcon, ProgressChartIcon, UserProfileIcon } from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

export const BookingSessionModal = ({ trainer, onClose, isOpen }) => {
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
    // Close the modal after booking
    onClose();
  };

  // Determine button text and action based on step
  const getPrimaryButtonText = () => step < 3 ? "Next" : "Confirm Booking";

  const getSecondaryButtonText = () => step > 1 ? "Back" : "Cancel";

  const getPrimaryButtonAction = () => step < 3 ? handleNext : handleBookSession;

  const getSecondaryButtonAction = () => step > 1 ? handleBack : onClose;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book a Session with ${trainer?.name}`}
      message={trainer?.specialty}
      primaryButtonText={getPrimaryButtonText()}
      secondaryButtonText={getSecondaryButtonText()}
      primaryButtonAction={getPrimaryButtonAction()}
      secondaryButtonAction={getSecondaryButtonAction()}
      primaryButtonDisabled={step === 1 && (!selectedDate || !selectedTime)}
    >
      {/* Progress indicator */}
      <div className="flex items-center mb-6">
        <div className="mx-auto flex w-full max-w-md items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full 
            ${step >= 1 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
          >
            1
          </div>
          <div
            className={`mx-2 h-1 flex-1 
            ${step >= 2 ? "bg-[#FF6B00]" : "bg-[#333]"}`}
          ></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full 
            ${step >= 2 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
          >
            2
          </div>
          <div
            className={`mx-2 h-1 flex-1 
            ${step >= 3 ? "bg-[#FF6B00]" : "bg-[#333]"}`}
          ></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full 
            ${step >= 3 ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-400"}`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Select Date and Time */}
      {step === 1 && (
        <div>
          <h3 className="mb-4 text-lg font-medium text-white">Select Date & Time</h3>

          {/* Date selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Date</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((date, index) => (
                <div
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 ${
                    selectedDate && selectedDate.getDate() === date.getDate()
                      ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                      : "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:border-[#FF6B00]"
                  }`}
                >
                  <span className="mb-1 text-xs font-medium">
                    {isToday(date) ? "TODAY" : date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </span>
                  <span className="text-2xl font-bold">{date.getDate()}</span>
                  <span className="mt-1 text-xs">{date.toLocaleString("default", { month: "short" })}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time selection */}
          {selectedDate && (
            <div>
              <label className="mb-2 block text-sm text-gray-300">Time</label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {availableTimes.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    className={`cursor-pointer rounded-lg px-4 py-3 text-center transition-all duration-300 ${
                      selectedTime === slot.time
                        ? "bg-[#FF6B00] text-white"
                        : slot.available
                          ? "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:-translate-y-1 hover:border-[#FF6B00]"
                          : "cursor-not-allowed border border-[#333] bg-[rgba(20,20,20,0.5)] text-gray-500"
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
        <div>
          <h3 className="mb-4 text-lg font-medium text-white">Session Details</h3>

          {/* Session type */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Session Type</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSessionType("in-person")}
                className={`cursor-pointer rounded-lg p-4 transition-all duration-300 ${
                  sessionType === "in-person"
                    ? "border border-[#FF6B00] bg-[rgba(255,107,0,0.2)]"
                    : "border border-[#444] bg-[rgba(30,30,30,0.8)] hover:border-[#FF6B00]"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <ProgressChartIcon
                    size={16}
                    stroke={sessionType === "in-person" ? "#FF6B00" : "currentColor"}
                    className="text-gray-300"
                  />
                  <h4 className={`font-medium ${sessionType === "in-person" ? "text-[#FF6B00]" : "text-white"}`}>
                    In Person
                  </h4>
                </div>
                <p className="text-sm text-gray-400">Face-to-face training at gym or designated location</p>
              </div>

              <div
                onClick={() => setSessionType("virtual")}
                className={`cursor-pointer rounded-lg p-4 transition-all duration-300 ${
                  sessionType === "virtual"
                    ? "border border-[#FF6B00] bg-[rgba(255,107,0,0.2)]"
                    : "border border-[#444] bg-[rgba(30,30,30,0.8)] hover:border-[#FF6B00]"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <MonitorIcon
                    size={16}
                    stroke={sessionType === "virtual" ? "#FF6B00" : "currentColor"}
                    className="text-gray-300"
                  />
                  <h4 className={`font-medium ${sessionType === "virtual" ? "text-[#FF6B00]" : "text-white"}`}>
                    Virtual
                  </h4>
                </div>
                <p className="text-sm text-gray-400">Remote training via video call from your location</p>
              </div>
            </div>
          </div>

          {/* Session length */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Session Length</label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 60, 90].map(minutes => (
                <div
                  key={minutes}
                  onClick={() => setSessionLength(minutes)}
                  className={`cursor-pointer rounded-lg px-4 py-3 text-center transition-all duration-300 ${
                    sessionLength === minutes
                      ? "border border-[#FF6B00] bg-[rgba(255,107,0,0.2)] text-[#FF6B00]"
                      : "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:border-[#FF6B00]"
                  }`}
                >
                  {minutes} min
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Notes for Trainer (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-[100px] w-full rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-4 py-3 text-sm text-white transition-all duration-300 focus:border-[#FF6B00] focus:outline-none"
              placeholder="Mention any specific goals, concerns, or questions..."
            ></textarea>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div>
          <h3 className="mb-4 text-lg font-medium text-white">Confirm Booking</h3>

          <div className="mb-5 rounded-xl border border-[#444] bg-[rgba(30,30,30,0.8)] p-5">
            <div className="mb-4 flex items-start gap-4">
              {/* Trainer avatar */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-white">
                <UserProfileIcon size={40} />
              </div>

              <div>
                <h4 className="font-medium text-white">{trainer?.name}</h4>
                <p className="text-sm text-gray-400">{trainer?.specialty}</p>
                <p className="mt-1 font-medium text-[#FF6B00]">${calculatePrice().toFixed(2)}</p>
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
                <span className="capitalize text-white">{sessionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{sessionLength} minutes</span>
              </div>
              {notes && (
                <div className="pt-2">
                  <span className="mb-1 block text-gray-400">Notes:</span>
                  <p className="rounded bg-[rgba(20,20,20,0.5)] p-3 text-sm text-white">{notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5 rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-4">
            <h4 className="mb-2 font-medium text-white">Payment Information</h4>
            <p className="mb-4 text-sm text-gray-300">
              You will not be charged until after the session is completed.
            </p>
            <div className="flex justify-between font-medium">
              <span className="text-white">Total:</span>
              <span className="text-[#FF6B00]">${calculatePrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-4 text-center text-sm text-gray-400">
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
    </Modal>
  );
};
