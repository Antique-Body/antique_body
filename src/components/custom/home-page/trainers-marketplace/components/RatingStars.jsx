import { Icon } from "@iconify/react";

export const RatingStars = ({ rating, size = 16, className = "" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`flex ${className}`}>
            {/* Full stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Icon key={`full-${i}`} icon="mdi:star" className="text-[#FF6B00]" width={size} height={size} />
            ))}

            {/* Half star */}
            {hasHalfStar && <Icon icon="mdi:star-half" className="text-[#FF6B00]" width={size} height={size} />}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Icon key={`empty-${i}`} icon="mdi:star-outline" className="text-zinc-600" width={size} height={size} />
            ))}
        </div>
    );
};
