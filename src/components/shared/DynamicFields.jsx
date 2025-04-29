import { Button } from "@/components/common/Button";
import { CloseXIcon, PlusIcon } from "@/components/common/Icons";

/**
 * Dynamic fields component for adding/removing multiple text fields
 */
export const DynamicFields = ({ label, description, fields, onFieldChange, onAddField, onRemoveField, placeholder }) => {
    return (
        <div className="mb-6">
            {label && <label className="block text-gray-300 mb-2">{label}</label>}
            {description && <p className="text-sm text-gray-400 mb-2">{description}</p>}

            {fields.map(field => (
                <div key={field.id} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={field.value}
                        onChange={e => onFieldChange(field.id, e.target.value)}
                        className="flex-1 p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                        placeholder={placeholder}
                    />
                    <Button variant="ghost" onClick={() => onRemoveField(field.id)} size="small" disabled={fields.length <= 1}>
                        <CloseXIcon size={16} />
                    </Button>
                </div>
            ))}

            <Button variant="secondary" onClick={onAddField} size="small" leftIcon={<PlusIcon size={16} />}>
                Add Another
            </Button>
        </div>
    );
};
