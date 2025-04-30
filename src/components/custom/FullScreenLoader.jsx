import { GreekLoader } from "./GreekLoader";

export function FullScreenLoader({ text = "Preparing your Ancient Journey" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="text-center">
        <GreekLoader size="lg" />
        <p className="mt-4 text-xl font-medium text-white">
          {text.split(" ").slice(0, -1).join(" ")}
          <br />
          <span className="text-[#ff7800]">{text.split(" ").slice(-1)}</span>
        </p>
      </div>
    </div>
  );
}
