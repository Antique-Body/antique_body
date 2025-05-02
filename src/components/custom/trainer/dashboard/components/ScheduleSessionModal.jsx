"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared/FormField";

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

  const timeOptions = [{ value: "", label: "Select time" }, ...timeSlots.map(slot => ({ value: slot, label: slot }))];

  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "60 minutes" },
    { value: 90, label: "90 minutes" },
    { value: 120, label: "120 minutes" },
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="animate-fade-in relative w-full max-w-2xl overflow-hidden rounded-xl border border-[#333] bg-[#121212]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FF7800] to-[#FF9A00]"></div>

        <Button variant="ghost" onClick={onClose} className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white">
          <CloseXIcon size={24} />
        </Button>

        <div className="p-6">
          <h2 className="mb-1 text-xl font-bold">Schedule Session with {client?.name}</h2>
          <p className="mb-4 text-gray-400">Pick a date and time that works for both of you</p>

          <form onSubmit={handleSubmit}>
            {/* Date selection */}
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-medium text-gray-300">Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    onClick={() => setDate(date.toISOString().split("T")[0])}
                    className={`flex w-[80px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 ${
                      date.toISOString().split("T")[0] === date
                        ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                        : "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:border-[#FF6B00]"
                    }`}
                  >
                    <span className="mb-1 text-xs font-medium">
                      {isToday(date) ? "TODAY" : formatDate(date).split(",")[0].toUpperCase()}
                    </span>
                    <span className="text-xl font-bold">{date.getDate()}</span>
                    <span className="mt-1 text-xs">{date.toLocaleString("default", { month: "short" })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Time selection */}
              <div>
                <FormField
                  type="select"
                  label="Select Time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  options={timeOptions}
                />
              </div>

              {/* Duration selection */}
              <div>
                <FormField
                  type="select"
                  label="Duration"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  options={durationOptions}
                />
              </div>
            </div>

            {/* Session type */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">Session Type</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                  onClick={() => setSessionType("training")}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                    sessionType === "training"
                      ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                      : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                  }`}
                >
                  Training
                </div>
                <div
                  onClick={() => setSessionType("assessment")}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                    sessionType === "assessment"
                      ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                      : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                  }`}
                >
                  Assessment
                </div>
                <div
                  onClick={() => setSessionType("consultation")}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                    sessionType === "consultation"
                      ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                      : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                  }`}
                >
                  Consultation
                </div>
                <div
                  onClick={() => setSessionType("analysis")}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                    sessionType === "analysis"
                      ? "border-[rgba(255,107,0,0.5)] bg-[rgba(255,107,0,0.15)] text-[#FF6B00]"
                      : "border-[#333] bg-[#1a1a1a] text-gray-300 hover:border-[#555]"
                  }`}
                >
                  Analysis
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <FormField
                type="textarea"
                label="Session Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any notes about this session..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="modalCancel" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="orangeFilled">
                Schedule Session
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
