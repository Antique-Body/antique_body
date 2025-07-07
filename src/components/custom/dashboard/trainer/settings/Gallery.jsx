import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button, Card, InfoBanner } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { DraggableImage } from "@/components/custom/shared";
import { UPLOAD_CONFIG } from "@/config/upload";

const galleryConfig = UPLOAD_CONFIG.gallery;

// Accepted image file types and maximum size
const ACCEPTED_FILE_TYPES = galleryConfig.allowedTypes;
const MAX_FILE_SIZE = galleryConfig.maxSize * 1024 * 1024; // in bytes
const MAX_HIGHLIGHT_COUNT = 6;
const MAX_GALLERY_IMAGES = 50;

const Gallery = ({ trainerData, setTrainerData }) => {
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "featured"
  const { galleryImages = [] } = trainerData.trainerProfile;

  const highlightedImages = galleryImages.filter((img) => img.isHighlighted);
  const highlightedCount = highlightedImages.length;

  const onGalleryChange = useCallback(
    (newGalleryImages) => {
      setTrainerData((prev) => ({
        ...prev,
        trainerProfile: {
          ...prev.trainerProfile,
          galleryImages: newGalleryImages,
        },
      }));
    },
    [setTrainerData]
  );

  const handleDescriptionChange = (index, description) => {
    const newImages = [...galleryImages];
    newImages[index] = { ...newImages[index], description: description };
    onGalleryChange(newImages);
  };

  const moveImage = useCallback(
    (dragIndex, hoverIndex) => {
      const newImages = [...galleryImages];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      onGalleryChange(newImages);
    },
    [galleryImages, onGalleryChange]
  );

  const validateFile = (file) => {
    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} is not supported. Please upload JPG, PNG, or GIF images.`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} is too large. Maximum size is ${galleryConfig.maxSize}MB.`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const validationErrors = [];
    const validFiles = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    let errorsToShow = [];
    if (validationErrors.length > 0) {
      errorsToShow = [...validationErrors];
    }

    if (validFiles.length > 0) {
      const availableSlots = MAX_GALLERY_IMAGES - galleryImages.length;

      if (availableSlots > 0) {
        const filesToUpload = validFiles.slice(0, availableSlots);

        const newImages = filesToUpload.map((file) => ({
          id: `new-${crypto.randomUUID()}`,
          file: file,
          isHighlighted: false,
        }));

        onGalleryChange([...galleryImages, ...newImages]);

        if (filesToUpload.length < validFiles.length) {
          errorsToShow.push(
            `You can upload a maximum of ${MAX_GALLERY_IMAGES} images. ${filesToUpload.length} images were added.`
          );
        }
      } else {
        errorsToShow.push(
          `Your gallery is full. No more images could be added.`
        );
      }
    }

    if (errorsToShow.length > 0) {
      setError(errorsToShow.join(". "));
    }
  };

  const toggleHighlight = (index) => {
    setError("");
    const newImages = [...galleryImages];
    const image = newImages[index];

    if (!image.isHighlighted && highlightedCount >= MAX_HIGHLIGHT_COUNT) {
      setError(`You can highlight a maximum of ${MAX_HIGHLIGHT_COUNT} images.`);
      return;
    }

    newImages[index] = { ...image, isHighlighted: !image.isHighlighted };
    onGalleryChange(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...galleryImages];
    const removedImage = newImages.splice(index, 1)[0];

    // Clean up object URL if it's a file
    if (removedImage.file) {
      URL.revokeObjectURL(removedImage.file);
    }

    onGalleryChange(newImages);
  };

  // Display images based on active tab
  const displayedImages =
    activeTab === "featured" ? highlightedImages : galleryImages;

  return (
    <div className="space-y-6 p-4 mx-6">
      <SectionTitle
        title="Showcase Your Training Gallery"
        subtitle="Upload images that showcase your training style, facilities, and client results. Feature your best images to highlight them on your public profile."
      />

      {/* Featured images explanation */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg p-4 border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 rounded-full p-2 flex-shrink-0">
            <Icon icon="mdi:star" width={24} className="text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-500">
              Featured Images
            </h3>
            <p className="text-sm text-gray-300">
              Featured images appear prominently at the top of your public
              profile. They're the first images potential clients see, so choose
              your best work!
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <InfoBanner
          title="Error"
          subtitle={error}
          variant="warning"
          onButtonClick={() => setError("")}
        />
      )}

      {/* Tab navigation */}
      <div className="flex border-b border-gray-700">
        <Button
          variant="ghost"
          className={`relative px-4 py-2 rounded-none ${
            activeTab === "all"
              ? "text-primary font-medium"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Images
          <span className="ml-2 bg-gray-700 text-gray-300 text-xs rounded-full px-2 py-0.5">
            {galleryImages.length}
          </span>
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
          )}
        </Button>

        <Button
          variant="ghost"
          className={`relative px-4 py-2 rounded-none ${
            activeTab === "featured"
              ? "text-yellow-500 font-medium"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("featured")}
        >
          Featured Images
          <span
            className={`ml-2 ${
              highlightedCount === MAX_HIGHLIGHT_COUNT
                ? "bg-yellow-500 text-black"
                : "bg-gray-700 text-gray-300"
            } text-xs rounded-full px-2 py-0.5`}
          >
            {highlightedCount}/{MAX_HIGHLIGHT_COUNT}
          </span>
          {activeTab === "featured" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500" />
          )}
        </Button>
      </div>

      {/* Gallery display */}
      <Card variant="dark" className="p-6 !w-full">
        <DndProvider backend={HTML5Backend}>
          {displayedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ">
              {displayedImages.map((image) => (
                <DraggableImage
                  key={image.id || image.url}
                  index={galleryImages.indexOf(image)}
                  image={image}
                  moveImage={moveImage}
                  toggleHighlight={toggleHighlight}
                  removeImage={removeImage}
                  onDescriptionChange={handleDescriptionChange}
                />
              ))}

              {/* Only show upload in "all" tab */}
              {activeTab === "all" && (
                <div
                  className={`relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed ${
                    isHovering
                      ? "border-primary bg-primary/10"
                      : "border-gray-600"
                  } transition-all duration-300 shadow-lg hover:shadow-xl hover:border-primary/70`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div
                      className={`rounded-full p-3 ${
                        isHovering ? "bg-primary/20" : "bg-gray-800"
                      } transition-colors duration-300`}
                    >
                      <Icon
                        icon="mdi:upload"
                        width={30}
                        className={`${
                          isHovering ? "text-primary animate-bounce" : ""
                        } transition-all duration-300`}
                      />
                    </div>
                    <span className="text-center text-sm font-medium">
                      Upload Images
                    </span>
                    <span className="text-center text-xs text-gray-500">
                      JPG, PNG, GIF
                    </span>
                    <span className="text-center text-xs text-gray-500">
                      Max {galleryConfig.maxSize}MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "featured" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-800 rounded-full p-4 mb-4">
                <Icon
                  icon="mdi:star-outline"
                  width={40}
                  className="text-yellow-500"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">No Featured Images</h3>
              <p className="text-gray-400 max-w-md mb-4">
                Feature your best images to showcase them prominently on your
                public profile.
              </p>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
                onClick={() => setActiveTab("all")}
              >
                <Icon icon="mdi:image-multiple" className="mr-2" />
                Go to All Images
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-800 rounded-full p-4 mb-4">
                <Icon
                  icon="mdi:image-outline"
                  width={40}
                  className="text-gray-400"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
              <p className="text-gray-400 max-w-md mb-4">
                Upload images to showcase your training style and results. A
                complete gallery helps potential clients understand your work.
              </p>
              <div className="relative cursor-pointer bg-primary/10 hover:bg-primary/20 rounded-lg px-4 py-2 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:upload" width={20} className="text-primary" />
                  <span className="text-primary font-medium">
                    Upload Images
                  </span>
                </div>
              </div>
            </div>
          )}
        </DndProvider>
      </Card>

      {/* Help text */}
      {galleryImages.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Icon icon="mdi:lightbulb-outline" className="text-primary" />
            Tips for a Great Gallery
          </h3>
          <ul className="text-sm text-gray-300 space-y-2 ml-6 list-disc">
            <li>Showcase a variety of training sessions and environments</li>
            <li>
              Include before/after transformations (with client permission)
            </li>
            <li>Feature your training space and equipment</li>
            <li>Add images that demonstrate your training style</li>
            <li>Use high-quality, well-lit photos that represent your brand</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Gallery;
