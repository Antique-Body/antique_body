"use client";
import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";

export const PersonalDetailsStep = ({
  formData,
  onChange,
  userType = "client",
  title = "Personal Information",
  locationTitle = "Location Information",
  locationDescription = "",
}) => (
  <div className="space-y-6">
    {/* Personal Information */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>

      <div className="rounded-lg bg-[#171717] p-5 space-y-5">
        <FormField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder={
            userType === "trainer" ? "Your professional name" : "Your full name"
          }
          required
          className="mb-0"
        />

        {userType === "client" && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={onChange}
              placeholder="Your age"
              min="16"
              max="100"
              required
              className="mb-0"
            />

            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={onChange}
              options={["Male", "Female", "Non-binary", "Prefer not to say"]}
              placeholder="Select gender"
              required
              className="mb-0"
            />
          </div>
        )}

        {userType === "trainer" && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Years of Experience"
              name="yearsExperience"
              type="select"
              value={formData.yearsExperience}
              onChange={onChange}
              options={[
                ...Array.from({ length: 41 }, (_, i) =>
                  i === 40 ? "40+" : i.toString()
                ),
              ]}
              placeholder="Years as a trainer"
              required
              className="mb-0"
            />
          </div>
        )}
      </div>
    </Card>

    {/* Location Information */}
    <Card variant="darkStrong" className="p-6 !w-full">
      <h3 className="mb-2 text-lg font-semibold text-white">{locationTitle}</h3>
      {locationDescription && (
        <p className="mb-4 text-sm text-gray-400">{locationDescription}</p>
      )}

      <div className="rounded-lg bg-[#171717] p-5 space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="City"
            name="location.city"
            value={formData.location.city}
            onChange={onChange}
            placeholder="Your city"
            required
            className="mb-0"
          />

          <FormField
            label="State/Province"
            name="location.state"
            value={formData.location.state}
            onChange={onChange}
            placeholder="Your state or province"
            required
            className="mb-0"
          />
        </div>

        <FormField
          label="Country"
          name="location.country"
          value={formData.location.country}
          onChange={onChange}
          placeholder="Your country"
          required
          className="mb-0"
        />

        <p className="text-xs text-gray-500 mt-3">
          Tip: Adding accurate location information helps clients find local
          trainers
        </p>
      </div>
    </Card>
  </div>
);
