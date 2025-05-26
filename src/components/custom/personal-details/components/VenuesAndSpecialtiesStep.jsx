"use client";
import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const VenuesAndSpecialtiesStep = ({
  formData,
  sportsOptions,
  handleSportToggle,
  venueFields,
  handleVenueChange,
  addVenueField,
  removeVenueField,
  languageOptions = [],
  handleLanguageToggle = () => {},
  handleCheckboxChange = () => {},
}) => (
  <div className="space-y-6">
    {/* Training Venues Section */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-2 text-lg font-semibold text-white">Training Venues</h3>
      <p className="mb-4 text-sm text-gray-400">
        Where do you typically train clients? Add locations like gyms, parks,
        studios, etc.
      </p>

      <div className="space-y-4 bg-[#171717] p-4 rounded-lg">
        {venueFields.map((field) => (
          <div key={field.id} className="mb-2 flex gap-2">
            <FormField
              type="text"
              value={field.value}
              onChange={(e) => handleVenueChange(field.id, e.target.value)}
              className="flex-1"
              placeholder="e.g. Gold's Gym Downtown, Central Park, etc."
            />
            <Button
              variant="ghost"
              onClick={() => removeVenueField(field.id)}
              size="small"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <CloseXIcon size={16} />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addVenueField}
          size="default"
          className="w-full bg-[#232323] hover:bg-[#2a2a2a] border-[#333] text-gray-300 hover:text-white transition-colors"
        >
          + Add Training Venue
        </Button>
      </div>
    </Card>

    {/* Training Types Section */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-2 text-lg font-semibold text-white">Training Types</h3>
      <p className="mb-4 text-sm text-gray-400">
        Select the types of training you offer to clients
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-[#171717] rounded-lg">
        <div className="flex items-center p-3 bg-[#1a1a1a] border border-[#333] rounded-md hover:border-[#FF6B00] transition-colors">
          <input
            type="checkbox"
            id="inPersonTraining"
            name="inPersonTraining"
            checked={formData.inPersonTraining}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-700 bg-[#232323] text-[#FF6B00] focus:ring-[#FF6B00]"
          />
          <label
            htmlFor="inPersonTraining"
            className="ml-3 text-white cursor-pointer select-none flex-1"
          >
            In-Person Training
          </label>
        </div>

        <div className="flex items-center p-3 bg-[#1a1a1a] border border-[#333] rounded-md hover:border-[#FF6B00] transition-colors">
          <input
            type="checkbox"
            id="onlineTraining"
            name="onlineTraining"
            checked={formData.onlineTraining}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-700 bg-[#232323] text-[#FF6B00] focus:ring-[#FF6B00]"
          />
          <label
            htmlFor="onlineTraining"
            className="ml-3 text-white cursor-pointer select-none flex-1"
          >
            Online/Remote Training
          </label>
        </div>
      </div>
    </Card>

    {/* Specialties Section */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-2 text-lg font-semibold text-white">Specialties</h3>
      <p className="mb-4 text-sm text-gray-400">
        Select all the sports and activities you specialize in training
      </p>

      <div className="flex flex-wrap gap-2 p-5 bg-[#171717] rounded-lg">
        {sportsOptions.map((sport, index) => (
          <Button
            key={index}
            variant={
              formData.sports.includes(sport) ? "orangeFilled" : "secondary"
            }
            onClick={() => handleSportToggle(sport)}
            size="small"
            className={
              formData.sports.includes(sport)
                ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                : "bg-[#232323] text-gray-300 hover:bg-[#2a2a2a] border-[#333] hover:border-[#FF6B00]"
            }
          >
            {sport}
          </Button>
        ))}
      </div>

      {formData.sports.length === 0 && (
        <p className="mt-2 text-sm text-red-400">
          Please select at least one specialty
        </p>
      )}
    </Card>

    {/* Languages Section */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-2 text-lg font-semibold text-white">Languages</h3>
      <p className="mb-4 text-sm text-gray-400">
        What languages do you speak? This helps clients find trainers they can
        communicate with.
      </p>

      <div className="p-5 bg-[#171717] rounded-lg">
        <div className="flex flex-wrap gap-2 mb-2">
          {languageOptions.map((language, index) => (
            <Button
              key={index}
              variant={
                formData.languages.includes(language)
                  ? "orangeFilled"
                  : "secondary"
              }
              onClick={() => handleLanguageToggle(language)}
              size="small"
              className={
                formData.languages.includes(language)
                  ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                  : "bg-[#232323] text-gray-300 hover:bg-[#2a2a2a] border-[#333] hover:border-[#FF6B00]"
              }
            >
              {language}
            </Button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Tip: Speaking multiple languages can help you connect with more
          clients
        </p>
      </div>
    </Card>
  </div>
);
