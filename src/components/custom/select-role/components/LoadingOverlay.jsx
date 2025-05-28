"use client";

export function LoadingOverlay({ selectedRole, roleTitle, config, t }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 opacity-20 blur-lg"></div>

        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div
            className={`absolute inset-0 rounded-full border-4 border-t-${selectedRole}-500 border-r-transparent border-b-transparent border-l-transparent animate-spin`}
            style={{ animationDuration: "1.5s" }}
          ></div>

          <div
            className={`absolute inset-0 m-auto w-3 h-3 bg-${selectedRole}-500 rounded-full`}
          ></div>
        </div>
      </div>

      {/* Loading text */}
      <h3
        className={`text-2xl font-bold mb-3 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
      >
        {t(roleTitle)}
      </h3>

      <p className="text-gray-400">{t("role.preparing.please_wait")}</p>

      {/* Progress indicator */}
      <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
        <div
          className={`h-full w-1/3 bg-gradient-to-r ${config.gradient} rounded-full`}
        ></div>
      </div>
    </div>
  );
}
