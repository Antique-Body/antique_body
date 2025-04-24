import { GreekLoader } from "./GreekLoader";

export function FullScreenLoader({ text = "Preparing your Ancient Journey" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <GreekLoader size="lg" />
        <p className="text-xl text-white font-medium mt-4">
          {text.split(" ").slice(0, -1).join(" ")}
          <br />
          <span className="text-[#ff7800]">{text.split(" ").slice(-1)}</span>
        </p>
      </div>
    </div>
  );
}
