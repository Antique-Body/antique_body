import React from "react";

/**
 * Profile image upload component
 */
export const ProfileImageUpload = ({ previewImage, onImageUpload }) => {
    return (
        <div className="mb-6">
            <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 mb-4 bg-[#1a1a1a] rounded-full border-2 border-dashed border-[#444] flex items-center justify-center overflow-hidden relative">
                    {previewImage ? (
                        <img src={previewImage} alt="Profile preview" className="object-cover w-full h-full" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <p className="text-sm text-gray-400">Click to upload a profile picture</p>
            </div>
        </div>
    );
};
