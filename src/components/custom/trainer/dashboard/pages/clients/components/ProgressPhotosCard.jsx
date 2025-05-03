import { Button } from "@/components/common/Button";
import { PlusIcon, ProgressChartIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FormField } from "@/components/shared/FormField";

export const ProgressPhotosCard = ({ 
  progressPhotos, 
  onViewPhoto, 
  onPhotoUpload, 
  isUploading 
}) => {
  return (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <ProgressChartIcon size={20} stroke="#FF6B00" className="mr-2" />
        Progress Photos
      </h3>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Track visual progress with photos. Upload new photos to document changes over time.
          </p>
          <label className="relative cursor-pointer">
            <FormField
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden-file-input"
            />
            <Button
              variant="orangeFilled"
              leftIcon={<PlusIcon size={16} />}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {progressPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)]"
            onClick={() => onViewPhoto(photo)}
          >
            <img
              src={photo.imageUrl}
              alt={`Progress photo from ${photo.date}`}
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium text-white">{photo.date}</p>
                {photo.notes && (
                  <p className="mt-1 text-xs text-gray-300">{photo.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Tip: Take photos in consistent lighting and poses for better progress tracking</p>
      </div>
    </Card>
  );
}; 