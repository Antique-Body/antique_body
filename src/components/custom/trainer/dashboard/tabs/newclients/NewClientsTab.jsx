import React from "react";

export const NewClientsTab = () => {
    return (
    <div>
      <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-4 mb-5 z-30 backdrop-blur-lg border border-[#222] shadow-lg flex justify-between items-center">
        <h2 className="text-xl font-bold">New Client Requests</h2>
        <button className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00] flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Client
        </button>
      </div>

      <div className="space-y-5">
        {/* Sample new unassigned clients */}
        <div className="bg-[rgba(30,30,30,0.8)] p-6 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-[0_10px_20px_-10px_rgba(255,107,0,0.2)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                ER
              </div>
              <div>
                <h3 className="text-lg font-bold">Emma Rodriguez</h3>
                <p className="text-gray-400 text-sm">Inquiry Date: Apr 3, 2025</p>
              </div>
            </div>

            <button
              className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-300"
              title="Delete client"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>

          <div className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg mb-4">
            <p className="text-[#FF6B00] font-medium mb-2">
              Goal: Weight loss and strength building
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Age</span>
                <span className="font-medium">28</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Height</span>
                <span className="font-medium">168 cm</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Weight</span>
                <span className="font-medium">72 kg</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Experience</span>
                <span className="font-medium">Beginner</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-[rgba(40,40,40,0.7)] rounded-lg">
              <span className="text-gray-400 text-sm block mb-1">Medical Notes</span>
              <span className="text-sm">No injuries or health concerns</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-300 mb-2">Assign Training Plan:</p>
            <div className="flex flex-wrap gap-2">
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Fat Loss
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Strength Building
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Recovery
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Pro Athlete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(30,30,30,0.8)] p-6 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-[0_10px_20px_-10px_rgba(255,107,0,0.2)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                CV
              </div>
              <div>
                <h3 className="text-lg font-bold">Carlos Vega</h3>
                <p className="text-gray-400 text-sm">Inquiry Date: Apr 5, 2025</p>
              </div>
            </div>

            <button
              className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-300"
              title="Delete client"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>

          <div className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg mb-4">
            <p className="text-[#FF6B00] font-medium mb-2">Goal: Marathon preparation</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Age</span>
                <span className="font-medium">35</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Height</span>
                <span className="font-medium">182 cm</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Weight</span>
                <span className="font-medium">75 kg</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Experience</span>
                <span className="font-medium">Intermediate</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-[rgba(40,40,40,0.7)] rounded-lg">
              <span className="text-gray-400 text-sm block mb-1">Medical Notes</span>
              <span className="text-sm">Previous knee injury (2023)</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-300 mb-2">Assign Training Plan:</p>
            <div className="flex flex-wrap gap-2">
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Fat Loss
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Strength Building
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Recovery
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Pro Athlete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(30,30,30,0.8)] p-6 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-[0_10px_20px_-10px_rgba(255,107,0,0.2)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                AJ
              </div>
              <div>
                <h3 className="text-lg font-bold">Aisha Johnson</h3>
                <p className="text-gray-400 text-sm">Inquiry Date: Apr 7, 2025</p>
              </div>
            </div>

            <button
              className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-300"
              title="Delete client"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>

          <div className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg mb-4">
            <p className="text-[#FF6B00] font-medium mb-2">Goal: Sports performance (basketball)</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Age</span>
                <span className="font-medium">22</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Height</span>
                <span className="font-medium">175 cm</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Weight</span>
                <span className="font-medium">68 kg</span>
              </div>
              <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                <span className="text-gray-400 block mb-1">Experience</span>
                <span className="font-medium">Advanced</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-[rgba(40,40,40,0.7)] rounded-lg">
              <span className="text-gray-400 text-sm block mb-1">Medical Notes</span>
              <span className="text-sm">No injuries</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-300 mb-2">Assign Training Plan:</p>
            <div className="flex flex-wrap gap-2">
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Fat Loss
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Strength Building
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Recovery
              </button>
              <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                Pro Athlete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
