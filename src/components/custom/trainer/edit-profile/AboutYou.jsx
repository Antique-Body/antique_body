import { Button } from "@/components/common/Button";
import { EducationIcon, TrashIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

export const AboutYou = ({
  trainerData,
  handleChange,
  newEducation,
  setNewEducation,
  addEducation,
  removeEducation,
}) => (
  <div className="space-y-6 border-t border-[#333] pt-8">
    <h2 className="text-xl font-semibold text-[#FF6B00]">About You</h2>

    <FormField
      label="Description"
      name="description"
      type="textarea"
      value={trainerData.description}
      onChange={handleChange}
      placeholder="Describe your background and experience..."
      rows={5}
    />

    <FormField
      label="Training Philosophy"
      name="philosophy"
      type="textarea"
      value={trainerData.philosophy}
      onChange={handleChange}
      placeholder="Describe your approach to training..."
      rows={4}
    />

    {/* Education Section */}
    <div>
      <h3 className="mb-3 text-lg font-medium">Education & Background</h3>

      <ul className="mb-4 space-y-2">
        {trainerData.education.map((edu, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] p-2 text-[#FF6B00]">
              <EducationIcon size={16} />
            </div>
            <span className="flex-1">{edu}</span>
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="rounded-full p-1 text-gray-400 hover:bg-[#333] hover:text-white"
            >
              <TrashIcon size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <FormField
          name="newEducation"
          value={newEducation}
          onChange={e => setNewEducation(e.target.value)}
          placeholder="Add new education or qualification"
          className="mb-0 flex-1"
        />
        <Button type="button" variant="secondary" onClick={addEducation} disabled={!newEducation.trim()}>
          Add
        </Button>
      </div>
    </div>
  </div>
);
