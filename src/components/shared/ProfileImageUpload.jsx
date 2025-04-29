import { UserProfileIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

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
                        <UserProfileIcon size={40} className="text-gray-400" />
                    )}
                    <FormField
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden-file-input"
                        id="profile-upload"
                        name="profile-upload"
                    />
                </div>
                <p className="text-sm text-gray-400">Click to upload a profile picture</p>
            </div>
        </div>
    );
};
