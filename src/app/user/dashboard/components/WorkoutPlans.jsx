"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TrainingPlanModal from "./TrainingPlanModal";

const WorkoutPlans = ({ trainingTypes, onShowMuscleGroups }) => {
  const { t } = useTranslation();
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
    setShowTrainingModal(true);
  };
  
  const handleCloseModal = () => {
    setShowTrainingModal(false);
  };

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
      case "crown":
        return <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      {/* Card 1: Training Type Card */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#333] hover:border-[#FF6B00] transition-all duration-300 shadow-lg transform hover:-translate-y-2">
        <div className="p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#FF6B00] bg-opacity-10 border border-[#FF6B00] border-opacity-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M2 10h20"></path>
              <path d="M8 4v4"></path>
              <path d="M16 4v4"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">{t("training_types")}</h3>
          <p className="text-gray-400 mb-6">
            {t("training_types_description")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {trainingTypes.map((training) => (
              <div
                key={training.id}
                className="p-4 rounded-xl border border-[#333] bg-[#1A1A1A] hover:bg-[#222] transition-colors duration-300 cursor-pointer"
                onClick={() => handleSelectTraining(training)}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `${training.color}20`,
                    border: `1px solid ${training.color}40`
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                <h4 className="font-medium text-white">{training.name}</h4>
                <p className="text-xs text-gray-400">{training.summary}</p>
              </div>
            ))}
          </div>
          <button className="w-full px-6 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl font-medium transition-all duration-300 hover:bg-[#222] hover:border-[#FF6B00]">
            {t("browse_all_training_types")}
          </button>
        </div>
      </div>

      {/* Card 2: Muscle Group Card */}
      <div 
        className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#333] hover:border-[#3498db] transition-all duration-300 shadow-lg transform hover:-translate-y-2 cursor-pointer"
        onClick={onShowMuscleGroups}
      >
        <div className="p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#3498db] bg-opacity-10 border border-[#3498db] border-opacity-30">
            <svg
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3498db"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
              <path d="M2.5 7.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
              <path d="M17.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
              <path d="M13.5 7.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
              <path d="M6.5 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
              <path d="M2.5 18.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
              <path d="M17.5 14a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
              <path d="M13.5 18.5v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">{t("muscle_groups")}</h3>
          <p className="text-gray-400 mb-6">
            {t("muscle_groups_description")}
          </p>
          
          {/* Body Preview Illustration */}
          <div className="flex justify-center mb-6">
            <div className="relative w-56 h-64">
              {/* Body Outline */}
              <svg width="100%" height="100%" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 12C89 12 80 20 80 30C80 40 89 48 100 48C111 48 120 40 120 30C120 20 111 12 100 12Z" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <path d="M85 48C85 48 60 55 55 100C50 145 50 188 55 195C60 202 75 202 75 195C75 188 80 120 80 120" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <path d="M115 48C115 48 140 55 145 100C150 145 150 188 145 195C140 202 125 202 125 195C125 188 120 120 120 120" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <path d="M85 60C85 60 80 95 90 105C100 115 100 125 100 140" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <path d="M115 60C115 60 120 95 110 105C100 115 100 125 100 140" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <path d="M90 140C90 140 85 185 85 195C85 205 90 225 100 225C110 225 115 205 115 195C115 185 110 140 110 140" stroke="white" strokeWidth="1.5" opacity="0.4"/>
              </svg>
              
              {/* Muscle Group Highlights - These are positioned absolutely over the body outline */}
              <div className="absolute top-[15%] left-[50%] transform -translate-x-1/2 w-14 h-14 rounded-full bg-[#3498db] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("shoulders")}
              </div>
              
              <div className="absolute top-[35%] left-[50%] transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#e74c3c] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("chest")}
              </div>
              
              <div className="absolute top-[42%] left-[30%] w-12 h-12 rounded-full bg-[#2ecc71] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("biceps")}
              </div>
              
              <div className="absolute top-[42%] right-[30%] w-12 h-12 rounded-full bg-[#2ecc71] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("triceps")}
              </div>
              
              <div className="absolute top-[55%] left-[50%] transform -translate-x-1/2 w-14 h-14 rounded-full bg-[#f1c40f] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("abs")}
              </div>
              
              <div className="absolute bottom-[25%] left-[50%] transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#9b59b6] bg-opacity-20 cursor-pointer hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-xs font-medium">
                {t("legs")}
              </div>
            </div>
          </div>
          
          <button 
            className="w-full px-6 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl font-medium transition-all duration-300 hover:bg-[#222] hover:border-[#3498db]"
            onClick={onShowMuscleGroups}
          >
            {t("explore_muscle_groups")}
          </button>
        </div>
      </div>

      {/* Training Plan Modal */}
      {showTrainingModal && selectedTraining && (
        <TrainingPlanModal 
          training={selectedTraining} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default WorkoutPlans; 