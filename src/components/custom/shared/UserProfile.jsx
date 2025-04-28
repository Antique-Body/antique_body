export const UserProfile = ({
    userData,
    profileType = "client",
    avatarContent,
    showProgressBar = false,
    progressData = null,
    profileTitle,
    profileSubtitle,
    certifications = [],
    children,
}) => {
    return (
        <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-3xl overflow-hidden relative transition-transform duration-300 hover:scale-105">
                {avatarContent}
            </div>

            <div className="flex-1">
                {profileTitle && <h1 className="text-2xl font-bold mb-1">{profileTitle}</h1>}
                {profileSubtitle && <p className="text-[#FF6B00] font-medium mb-4">{profileSubtitle}</p>}

                {profileType === "trainer" && certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {certifications.map((cert, index) => (
                            <span
                                key={index}
                                className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium"
                            >
                                {cert}
                            </span>
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                {showProgressBar && progressData && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Program Progress</span>
                            <span>{Math.round((progressData.completed / progressData.total) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                                style={{ width: `${(progressData.completed / progressData.total) * 100}%` }}
                            ></div>
                        </div>
                        {progressData.nextMilestone && (
                            <p className="text-xs text-gray-400 mt-1">Next milestone: {progressData.nextMilestone}</p>
                        )}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">{children}</div>
            </div>
        </div>
    );
};
