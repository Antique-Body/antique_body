import { Modal } from "@/components/common";

export const ProgressPhotoModal = ({ isOpen, onClose, photo }) => {
  if (!photo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Progress Photo - ${photo?.date}`}
      size="large"
      footerButtons={false}
    >
      <div>
        <div className="mb-4">
          <img 
            src={photo.imageUrl} 
            alt={`Progress photo from ${photo.date}`}
            className="w-full rounded-lg object-cover"
          />
        </div>
        <div className="text-sm text-gray-400">
          <p>Date: {photo.date}</p>
          {photo.notes && <p className="mt-2">Notes: {photo.notes}</p>}
        </div>
      </div>
    </Modal>
  );
}; 