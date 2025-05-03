"use client";
import { useTranslation } from "react-i18next";

const TrainingPlanModal = ({ training, onClose }) => {
  const { t } = useTranslation();

  const getIconPath = (iconName) => {
    switch (iconName) {
      case "lightning":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "zap":
        return <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
      case "dumbbell":
        return <path d="M6 5H4a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5H4v8h2v-8zm12-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8zm-6-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8z" />;
      case "activity":
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case "flame":
        return <path d="M12 2c1 3 2 5 2 7 0 2.236-1.765 4-4 4s-4-1.764-4-4c0-2 1-4 2-7 1 3 2 5 2 7 0 1.105.893 2 2 2s2-.895 2-2c0-2-1-4-2-7zm0 18c3.314 0 6-2 6-6 0-3.355-2.984-6.584-6-12-3.016 5.418-6 8.646-6 12 0 4 2.686 6 6 6z" />;
      case "award":
        return <path d="M12 15c5 0 9-4 9-9h-4.5L15 3.5 12 1 9 3.5 7.5 6H3c0 5 4 9 9 9zm0 0v8m-4-4h8" />;
      default:
        return null;
    }
  };

  const handleStartTraining = () => {
    alert(`${t("starting")} ${training.name} ${t("training_program")}! 💪`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#111] border rounded-3xl max-w-3xl w-full overflow-hidden animate-scaleIn"
        style={{ borderColor: `${training.color}40` }}
      >
        {/* Modal header */}
        <div 
          className="h-2 w-full" 
          style={{ backgroundColor: training.color }}
        ></div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `${training.color}20`,
                  border: `1px solid ${training.color}40`
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={training.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {getIconPath(training.icon)}
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{training.name}</h2>
                <p className="text-gray-300">{training.summary}</p>
              </div>
            </div>
            
            <button 
              className="bg-[#222] hover:bg-[#333] rounded-full p-2 transition-colors duration-300"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{t("program_details")}</h3>
                <p className="text-gray-400 mb-4">
                  {training.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#1A1A1A]">
                    <p className="text-xs text-gray-400">{t("location").toUpperCase()}</p>
                    <p className="font-medium">{training.preferences.location}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1A1A1A]">
                    <p className="text-xs text-gray-400">{t("equipment").toUpperCase()}</p>
                    <p className="font-medium">{training.preferences.equipment}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1A1A1A]">
                    <p className="text-xs text-gray-400">{t("duration").toUpperCase()}</p>
                    <p className="font-medium">{training.preferences.duration}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1A1A1A]">
                    <p className="text-xs text-gray-400">{t("frequency").toUpperCase()}</p>
                    <p className="font-medium">{training.preferences.frequency}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t("fitness_benefits")}</h3>
                <div className="space-y-3">
                  {[
                    { 
                      title: t("performance_enhancement"), 
                      description: t("performance_enhancement_desc"),
                      icon: "trending-up"
                    },
                    { 
                      title: t("hormonal_optimization"), 
                      description: t("hormonal_optimization_desc"),
                      icon: "activity"
                    },
                    { 
                      title: t("recovery_focus"), 
                      description: t("recovery_focus_desc"),
                      icon: "refresh-cw"
                    }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className="mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${training.color}20`,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={training.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {benefit.icon === "trending-up" && <path d="M23 6l-9.5 9.5-5-5L1 18"></path>}
                          {benefit.icon === "activity" && <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>}
                          {benefit.icon === "refresh-cw" && (
                            <>
                              <path d="M23 4v6h-6"></path>
                              <path d="M1 20v-6h6"></path>
                              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
                              <path d="M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">{benefit.title}</h4>
                        <p className="text-sm text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t("featured_exercises")}</h3>
              <div className="space-y-4">
                {training.exercises.map((exercise, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border border-[#333] bg-[#1A1A1A] hover:bg-[#222] transition-colors duration-300"
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <span className="text-gray-400 text-sm">{exercise.sets} sets</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{exercise.reps} reps</span>
                      <span>{exercise.restTime} rest</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              className="px-4 py-2 bg-transparent border border-[#333] hover:border-white rounded-xl transition-all duration-300"
              onClick={onClose}
            >
              {t("go_back")}
            </button>
            
            <button
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${training.color}, ${training.color}BB)`,
                boxShadow: `0 8px 16px -8px ${training.color}80`,
              }}
              onClick={handleStartTraining}
            >
              {t("start_this_program")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanModal; 