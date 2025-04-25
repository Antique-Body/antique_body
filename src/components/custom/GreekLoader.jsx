import { GreekLoaderIcon } from "../common/Icons";

export function GreekLoader({ size = "lg", text = "" }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <GreekLoaderIcon size={size} className="mb-2" />
      {text && <p className="text-white text-sm font-medium">{text}</p>}
    </div>
  );
}
