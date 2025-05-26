"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "./Icons";

export const BackButton = ({ onClick, className = "", iconSize = 24 }) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            className={`group flex items-center justify-center rounded-full bg-[rgba(40,40,40,0.5)] p-2.5 text-gray-400 transition-all duration-200 hover:bg-[rgba(60,60,60,0.7)] hover:text-white ${className}`}
            onClick={handleClick}
            aria-label="Go back"
        >
            <div className="flex items-center justify-center transition-transform duration-200 group-hover:-translate-x-0.5">
                <ArrowLeft size={iconSize} />
            </div>
        </button>
    );
};
