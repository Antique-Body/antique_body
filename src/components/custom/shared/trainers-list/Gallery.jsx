import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

export const Gallery = ({ trainer }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const highlightedImages = trainer?.galleryImages
    ?.filter((img) => img.isHighlighted)
    .sort((a, b) => a.order - b.order);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };
  const navigateImage = useCallback(
    (direction) => {
      if (!selectedImage || !highlightedImages || isAnimating) return;

      setIsAnimating(true);
      const currentIndex = highlightedImages.findIndex(
        (img) => img.id === selectedImage.id
      );
      let newIndex;

      if (direction === "next") {
        newIndex = (currentIndex + 1) % highlightedImages.length;
      } else {
        newIndex =
          currentIndex === 0 ? highlightedImages.length - 1 : currentIndex - 1;
      }

      setTimeout(() => {
        setSelectedImage(highlightedImages[newIndex]);
        setIsAnimating(false);
      }, 150);
    },
    [selectedImage, highlightedImages, isAnimating]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          navigateImage("next");
          break;
        case "ArrowLeft":
          navigateImage("prev");
          break;
        default:
          break;
      }
    },
    [isLightboxOpen, navigateImage]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleImageLoad = (imageId) => {
    setImageLoaded((prev) => ({ ...prev, [imageId]: true }));
  };

  // Enhanced empty state component with better animation
  const EmptyState = () => (
    <div className="min-h-96 flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-inner animate-pulse">
          <Icon
            icon="heroicons:photo"
            className="w-12 h-12 text-gray-400 animate-bounce"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Nema izdvojenih slika
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          Ovaj trener još uvek nije označio slike kao istaknute.
          <br />
          <span className="text-sm text-gray-500 dark:text-gray-500 mt-2 block">
            Kada se slike dodaju, pojaviće se ovde.
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {highlightedImages && highlightedImages.length > 0 ? (
          <>
            {/* Gallery grid with stagger animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {highlightedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                    {/* Loading placeholder with shimmer effect */}
                    {!imageLoaded[image.id] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]" />
                    )}

                    {/* Image with better transitions */}
                    <Image
                      src={image.url}
                      alt={image.description || `Gallery image ${image.order}`}
                      fill
                      className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                        imageLoaded[image.id] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(image.id)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Enhanced overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Hover overlay with improved icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                      <div className="bg-white/95 dark:bg-gray-900/95 rounded-full p-4 backdrop-blur-md shadow-2xl border border-white/20">
                        <Icon
                          icon="heroicons:magnifying-glass-plus"
                          className="w-7 h-7 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Enhanced description overlay */}
                    {image.description && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-5 px-5">
                        <div className="transform translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                          <p className="text-white text-sm font-semibold leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500 drop-shadow-lg">
                            {image.description}
                          </p>
                          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                            <span className="text-white/80 text-xs flex items-center gap-2 font-medium">
                              <Icon
                                icon="heroicons:cursor-arrow-rays"
                                className="w-3.5 h-3.5"
                              />
                              Klik za prikaz
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-shine" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced footer info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-full px-6 py-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <Icon
                  icon="heroicons:photo"
                  className="w-4 h-4 text-gray-500"
                />
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {highlightedImages.length}{" "}
                  {highlightedImages.length === 1 ? "slika" : "slika"} u
                  galeriji
                </p>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Enhanced Lightbox */}
      {isLightboxOpen && selectedImage && (
        <div
          className={`fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
            isLightboxOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeLightbox}
        >
          {/* Enhanced close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 backdrop-blur-md border border-white/10"
          >
            <Icon icon="heroicons:x-mark" className="w-6 h-6" />
          </button>

          {/* Enhanced navigation buttons */}
          {highlightedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-200 hover:scale-110 disabled:opacity-50 backdrop-blur-md border border-white/10"
                disabled={isAnimating}
              >
                <Icon icon="heroicons:chevron-left" className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-200 hover:scale-110 disabled:opacity-50 backdrop-blur-md border border-white/10"
                disabled={isAnimating}
              >
                <Icon icon="heroicons:chevron-right" className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Enhanced image container */}
          <div
            className={`relative max-w-7xl max-h-[90vh] mx-auto transition-all duration-300 ${
              isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={
                selectedImage.description ||
                `Gallery image ${selectedImage.order}`
              }
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Enhanced image info */}
            {selectedImage.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-8 rounded-b-xl backdrop-blur-sm">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <p className="text-white text-xl font-semibold leading-relaxed max-w-4xl drop-shadow-lg">
                      {selectedImage.description}
                    </p>
                  </div>
                  <div className="text-white/70 text-base ml-6 flex-shrink-0 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md font-medium">
                    {highlightedImages.findIndex(
                      (img) => img.id === selectedImage.id
                    ) + 1}{" "}
                    / {highlightedImages.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced keyboard shortcuts hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white/80 text-sm px-6 py-3 rounded-full backdrop-blur-md border border-white/10 font-medium">
            <span className="hidden sm:inline flex items-center gap-2">
              <Icon icon="heroicons:computer-desktop" className="w-4 h-4" />
              ESC za zatvaranje • ← → za navigaciju
            </span>
            <span className="sm:hidden flex items-center gap-2">
              <Icon icon="heroicons:device-phone-mobile" className="w-4 h-4" />
              Tapni za zatvaranje
            </span>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(12deg);
          }
          100% {
            transform: translateX(300%) rotate(12deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-shine {
          animation: shine 2s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </>
  );
};
