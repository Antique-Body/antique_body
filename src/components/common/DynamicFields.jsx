import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

/**
 * Dynamic fields component for adding/removing multiple text fields
 */
export const DynamicFields = ({
  label,
  description,
  fields,
  onFieldChange,
  onAddField,
  onRemoveField,
  placeholder,
}) => (
  <div className="mb-6">
    {label && <label className="mb-2 block text-gray-300">{label}</label>}
    {description && <p className="mb-2 text-sm text-gray-400">{description}</p>}

    {fields.map((field) => (
      <div key={field.id} className="mb-2 flex gap-2">
        <input
          type="text"
          value={field.value}
          onChange={(e) => onFieldChange(field.id, e.target.value)}
          className="flex-1 rounded-lg border border-[#333] bg-[#1a1a1a] p-3 text-white transition focus:border-[#FF6B00] focus:outline-none"
          placeholder={placeholder}
        />
        <Button
          variant="ghost"
          onClick={() => onRemoveField(field.id)}
          size="small"
          disabled={fields.length <= 1}
        >
          <Icon icon="mdi:close" width={16} height={16} />
        </Button>
      </div>
    ))}

    <Button
      variant="secondary"
      onClick={onAddField}
      size="small"
      leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
    >
      Add Another
    </Button>
  </div>
);
