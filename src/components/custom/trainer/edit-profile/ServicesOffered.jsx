import { Button } from "@/components/common/Button";
import { TrashIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

export const ServicesOffered = ({ trainerData, newService, setNewService, addService, removeService }) => (
  <div className="space-y-6 border-t border-[#333] pt-8">
    <h2 className="text-xl font-semibold text-[#FF6B00]">Services Offered</h2>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {trainerData.services.map((service, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-4"
        >
          <button
            type="button"
            onClick={() => removeService(index)}
            className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-[rgba(255,107,0,0.3)] hover:text-white"
          >
            <TrashIcon size={14} />
          </button>
          <div className="mb-2">
            <h5 className="font-medium text-white">{service.name}</h5>
          </div>
          <p className="text-sm text-gray-300">{service.description}</p>
        </div>
      ))}
    </div>

    <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
      <h3 className="mb-3 text-lg font-medium">Add New Service</h3>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Service Name"
          name="newServiceName"
          value={newService.name}
          onChange={e => setNewService({ ...newService, name: e.target.value })}
          placeholder="e.g. Personal Training"
        />

        <FormField
          label="Description"
          name="newServiceDescription"
          type="textarea"
          value={newService.description}
          onChange={e => setNewService({ ...newService, description: e.target.value })}
          placeholder="Describe this service..."
          rows={3}
        />

        <Button
          type="button"
          variant="orangeOutline"
          onClick={addService}
          disabled={!newService.name.trim() || !newService.description.trim()}
          className="ml-auto"
        >
          Add Service
        </Button>
      </div>
    </div>
  </div>
);
