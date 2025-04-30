export const SelectionCard = ({
  selected,
  onClick,
  emoji,
  title,
  description,
  bgImage,
  className = "",
  aspect = "aspect-[4/3]",
  icon,
}) => (
  <div
    className={`relative border-2 bg-[rgba(20,20,20,0.8)] ${
      selected ? "border-[#FF7800]" : "border-[#222]"
    } flex cursor-pointer flex-col items-center rounded-2xl p-6 text-center transition-all duration-300 ${aspect} overflow-hidden hover:translate-y-[-3px] hover:border-[#FF7800] hover:shadow-[0_5px_15px_rgba(255,120,0,0.15)] ${className}`}
    onClick={onClick}
    style={{
      boxShadow: selected ? "0 0 20px rgba(255, 120, 0, 0.2)" : "none",
      backgroundImage: bgImage ? `url(${bgImage})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {bgImage && <div className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>}
    <div className="relative z-10 flex h-full flex-col items-center justify-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-[#aaa]">{description}</p>
    </div>
  </div>
);
