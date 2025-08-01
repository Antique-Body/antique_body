"use client";

import { Button } from "@/components/common/Button";

export function ActionFooter({ selectedRole, config, onContinue, t }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-white/10 bg-gradient-to-t from-black to-black/90">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between gap-5">
          {/* Role indicator */}
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`
                                w-12 h-12 rounded-full flex-shrink-0 
                                flex items-center justify-center 
                                bg-gradient-to-br ${config.gradient}
                                shadow-lg shadow-${selectedRole}-500/30
                            `}
            >
              <i className={`${config.icon} text-xl text-white`}></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {t(`role.${selectedRole}.label`)}
              </h3>
              <p className="text-gray-400 text-sm">
                {t("role.selection.confirm_path_as", {
                  role: t(`role.${selectedRole}.label`).toLowerCase(),
                })}
              </p>
            </div>
          </div>

          {/* Continue button */}
          <Button
            variant="primary"
            onClick={onContinue}
            className={`
                            relative overflow-hidden
                            px-8 py-3 rounded-lg 
                            bg-gradient-to-r ${config.gradient} 
                            text-white font-medium 
                            transition-all duration-300 
                            hover:shadow-lg hover:shadow-${selectedRole}-500/20
                            flex items-center justify-center gap-2 group
                            min-w-[140px]
                            transform hover:translate-y-[-2px] active:translate-y-0
                        `}
          >
            {/* Button hover effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span>{t("common.continue")}</span>
            <span className="mdi mdi-arrow-right group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
