"use client";
import React from "react";
import { FormCard } from "@/components/custom/FormCard";

export const VenuesAndSpecialtiesStep = ({
    formData,
    sportsOptions,
    handleSportToggle,
    venueFields,
    handleVenueChange,
    addVenueField,
    removeVenueField,
}) => {
    return (
        <div className="space-y-6">
            <FormCard title="Training Venues">
                <p className="text-sm text-gray-400 mb-3">
                    Where do you typically train clients? Add locations like gyms, parks, etc.
                </p>

                {venueFields.map((field) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleVenueChange(field.id, e.target.value)}
                            className="flex-1 p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                            placeholder="e.g. Gold's Gym Downtown, Central Park, etc."
                        />
                        <button
                            type="button"
                            onClick={() => removeVenueField(field.id)}
                            className="p-3 rounded-lg bg-[#333] text-gray-300 hover:bg-[#444] transition-colors"
                        >
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
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addVenueField}
                    className="mt-2 py-2 px-4 border border-[#FF6B00] rounded-lg text-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] transition-colors"
                >
                    + Add Training Venue
                </button>
            </FormCard>

            <FormCard title="Sports & Activities">
                <p className="text-sm text-gray-400 mb-3">Select all the sports and activities you specialize in</p>

                <div className="flex flex-wrap gap-2">
                    {sportsOptions.map((sport, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSportToggle(sport)}
                            className={`py-2 px-3 rounded-lg text-sm transition-all ${
                                formData.sports.includes(sport)
                                    ? "bg-[#FF6B00] text-white"
                                    : "bg-[rgba(40,40,40,0.7)] text-gray-300 hover:bg-[rgba(60,60,60,0.7)]"
                            }`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>

                {formData.sports.length === 0 && (
                    <p className="text-sm text-red-400 mt-2">Please select at least one specialty</p>
                )}
            </FormCard>
        </div>
    );
};
