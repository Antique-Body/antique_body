export const SelectionCard = ({
  selected,
  onClick,
  emoji,
  title,
  description,
  bgImage,
  className = "",
  aspect = "aspect-[4/3]",
}) => {
  return (
    <div
      className={`relative bg-[rgba(20,20,20,0.8)] border-2 ${
        selected ? "border-[#FF7800]" : "border-[#222]"
      } rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${aspect} overflow-hidden hover:translate-y-[-3px] hover:border-[#FF7800] hover:shadow-[0_5px_15px_rgba(255,120,0,0.15)] ${className}`}
      onClick={onClick}
      style={{
        boxShadow: selected ? "0 0 20px rgba(255, 120, 0, 0.2)" : "none",
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {bgImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="text-4xl mb-3">{emoji}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-[#aaa]">{description}</p>
      </div>
    </div>
  );
};
