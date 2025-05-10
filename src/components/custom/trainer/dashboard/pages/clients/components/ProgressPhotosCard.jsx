import Image from "next/image";

import { FormField } from "@/components/common/FormField";
import { PlusIcon, ProgressChartIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const ProgressPhotosCard = ({ progressPhotos, onViewPhoto, onPhotoUpload, isUploading }) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
        <h3 className="mb-4 flex items-center text-xl font-semibold">
            <ProgressChartIcon size={20} stroke="#FF6B00" className="mr-2" />
            Progress Photos
        </h3>

        <div className="mb-5">
            <p className="text-sm text-gray-400">
                Track visual progress with photos. Upload new photos to document changes over time.
            </p>
        </div>

        {/* File upload area with drag-and-drop support */}
        <div className="mb-6">
            <div className="relative">
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-[rgba(40,40,40,0.5)] p-6 transition-all hover:border-orange-500 hover:bg-[rgba(50,50,50,0.5)]">
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,107,0,0.2)]">
                            <PlusIcon size={20} stroke="#FF6B00" />
                        </div>
                        <p className="mb-1 text-sm font-medium text-white">
                            {isUploading ? "Uploading..." : "Drag and drop or click to upload"}
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG or HEIF (Max 10MB)</p>
                    </div>
                    <FormField
                        type="file"
                        accept="image/*"
                        onChange={onPhotoUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        disabled={isUploading}
                    />
                </label>
            </div>
        </div>

        {/* Progress photos grid with improved styling */}
        {progressPhotos.length > 0 && (
            <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">Recent Photos</h4>
                    <p className="text-xs text-gray-400">{progressPhotos.length} photos</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {progressPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)] shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                            onClick={() => onViewPhoto(photo)}
                        >
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={photo.imageUrl}
                                    alt={`Progress photo from ${photo.date}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-sm font-medium text-white">{photo.date}</p>
                                    {photo.notes && <p className="mt-1 text-xs text-gray-300">{photo.notes}</p>}
                                </div>
                            </div>
                            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 opacity-0 shadow-[0_0_8px_rgba(255,107,0,0.8)] transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-4 rounded-lg bg-[rgba(40,40,40,0.4)] p-3 text-center">
            <p className="text-xs text-gray-400">
                <span className="font-medium text-orange-500">Pro tip:</span> Take photos in consistent lighting and poses for
                better progress tracking
            </p>
        </div>
    </Card>
);
