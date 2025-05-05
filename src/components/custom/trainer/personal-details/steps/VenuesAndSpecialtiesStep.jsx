"use client";
import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { FormCard } from "@/components/custom/FormCard";

export const VenuesAndSpecialtiesStep = ({
    formData,
    sportsOptions,
    handleSportToggle,
    venueFields,
    handleVenueChange,
    addVenueField,
    removeVenueField,
}) => (
    <div className="space-y-6">
        <FormCard title="Training Venues">
            <p className="mb-3 text-sm text-gray-400">
                Where do you typically train clients? Add locations like gyms, parks, etc.
            </p>

            {venueFields.map((field) => (
                <div key={field.id} className="mb-2 flex gap-2">
                    <FormField
                        type="text"
                        value={field.value}
                        onChange={(e) => handleVenueChange(field.id, e.target.value)}
                        className="flex-1"
                        placeholder="e.g. Gold's Gym Downtown, Central Park, etc."
                    />
                    <Button variant="ghost" onClick={() => removeVenueField(field.id)} size="small">
                        <CloseXIcon size={16} />
                    </Button>
                </div>
            ))}

            <Button variant="outline" onClick={addVenueField} size="default">
                + Add Training Venue
            </Button>
        </FormCard>

        <FormCard title="Sports & Activities">
            <p className="mb-3 text-sm text-gray-400">Select all the sports and activities you specialize in</p>

            <div className="flex flex-wrap gap-2">
                {sportsOptions.map((sport, index) => (
                    <Button
                        key={index}
                        variant={formData.sports.includes(sport) ? "orangeFilled" : "secondary"}
                        onClick={() => handleSportToggle(sport)}
                        size="small"
                    >
                        {sport}
                    </Button>
                ))}
            </div>

            {formData.sports.length === 0 && <p className="mt-2 text-sm text-red-400">Please select at least one specialty</p>}
        </FormCard>
    </div>
);
