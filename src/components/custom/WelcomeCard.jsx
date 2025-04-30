export const WelcomeCard = ({ title, subtitle, icon }) => (
  <div
    className="relative mb-8 min-h-max w-full cursor-pointer overflow-hidden rounded-2xl border border-[#222] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-6 text-center shadow-lg"
    style={{
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    }}
  >
    <div
      className="absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#FF7800] via-[#FFD700] to-[#FF7800] bg-[length:200%_100%]"
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    ></div>
    <div className="mb-2 text-2xl font-bold sm:text-3xl">{title}</div>
    <div className="mb-4 text-base text-[#aaa]">{subtitle}</div>
    <div
      className="relative mb-1 mt-2 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-[#FF7800] to-[#FF9A00]"
      style={{
        boxShadow: "0 5px 15px rgba(255, 120, 0, 0.3)",
      }}
    >
      {icon}
    </div>
  </div>
);
