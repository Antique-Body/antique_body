import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

/**
 * A draggable image component with highlight and remove functionality
 * Used in gallery displays where images can be reordered and featured
 */
const DraggableImage = ({
  image,
  index,
  moveImage,
  toggleHighlight,
  removeImage,
  showHighlightButton = true,
  onDescriptionChange,
}) => {
  const ref = useRef(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Handle drop positioning for drag and drop reordering
  const [, drop] = useDrop({
    accept: "image",
    hover(item, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the item's height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Configure dragging
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => ({ 
      id: image.id || image.url, 
      index 
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Initialize drag and drop refs
  drag(drop(ref));

  // Determine image properties
  const opacity = isDragging ? 0.4 : 1;
  const imageUrl = image.file ? URL.createObjectURL(image.file) : image.url;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={ref}
        style={{ opacity }}
        className="relative aspect-square w-full group rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
      >
        {/* Image */}
        <Image
          src={imageUrl}
          alt={`Gallery image ${index + 1}`}
          width={300}
          height={300}
          className="h-full w-full object-cover"
        />
        
        {/* Control buttons */}
        <div className="absolute top-2 right-2 flex gap-1.5 z-10">
          {showHighlightButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleHighlight(index);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                image.isHighlighted 
                  ? "bg-yellow-500 text-black shadow-lg" 
                  : "bg-black/60 text-white backdrop-blur-sm hover:bg-yellow-500/80 hover:text-black"
              }`}
              title={image.isHighlighted ? "Remove from featured" : "Feature this image"}
            >
              <Icon 
                icon={image.isHighlighted ? "mdi:star" : "mdi:star-outline"} 
                width={16} 
              />
            </button>
          )}
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage(index);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white backdrop-blur-sm hover:bg-red-500/80 transition-all duration-300"
            title="Remove image"
          >
            <Icon icon="mdi:trash" width={16} />
          </button>
        </div>
        
        {/* Featured badge */}
        {image.isHighlighted && (
          <div className="absolute left-0 top-0 bg-yellow-500 text-black px-2 py-1 text-xs font-medium flex items-center gap-1">
            <Icon icon="mdi:star" width={14} />
            Featured
          </div>
        )}
        
        {/* Drag indicator on hover */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Icon icon="mdi:drag" width={14} className="text-white" />
            <span className="text-xs text-white">Drag</span>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="w-full">
        {!isEditingDescription ? (
          <div className="flex items-center gap-2 min-h-[40px]">
            <button
              onClick={() => setIsEditingDescription(true)}
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                image.description 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              title={image.description ? "Edit description" : "Add description"}
            >
              <Icon icon="mdi:pencil" width={16} />
            </button>
            <div className="flex-1 min-w-0">
              {image.description ? (
                <p className="text-sm text-gray-400 italic">
                  Description added
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Click to add description
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={image.description || ""}
              onChange={(e) => onDescriptionChange(index, e.target.value)}
              placeholder="Add a description..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              rows={3}
              maxLength={200}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {(image.description || "").length}/200
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingDescription(false)}
                  className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditingDescription(false)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableImage;