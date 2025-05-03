import { ProgressBar } from "@/components/common";
import { Card } from "@/components/custom/Card";

export const BodyCompositionCard = ({ progress }) => {
  if (!progress || progress.length <= 1) {
    return (
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h3 className="mb-4 text-xl font-semibold">Body Composition</h3>
        <p className="text-sm text-gray-400">Not enough data to display body composition changes.</p>
      </Card>
    );
  }

  return (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <h3 className="mb-4 text-xl font-semibold">Body Composition</h3>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Current Weight</span>
            <span>{progress[progress.length - 1].weight} kg</span>
          </div>
          <ProgressBar
            value={progress[0].weight}
            maxValue={progress[progress.length - 1].weight}
            color={progress[progress.length - 1].weight <= progress[0].weight ? "bg-green-500" : "bg-red-500"}
            showValues={false}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Initial: {progress[0].weight} kg</span>
            <span
              className={
                progress[progress.length - 1].weight <= progress[0].weight ? "text-green-400" : "text-red-400"
              }
            >
              {progress[progress.length - 1].weight <= progress[0].weight ? "Lost" : "Gained"}{" "}
              {Math.abs(progress[progress.length - 1].weight - progress[0].weight).toFixed(1)} kg
            </span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Current Body Fat</span>
            <span>{progress[progress.length - 1].bodyFat}%</span>
          </div>
          <ProgressBar
            value={progress[0].bodyFat}
            maxValue={progress[progress.length - 1].bodyFat}
            color={
              progress[progress.length - 1].bodyFat <= progress[0].bodyFat ? "bg-green-500" : "bg-red-500"
            }
            showValues={false}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Initial: {progress[0].bodyFat}%</span>
            <span
              className={
                progress[progress.length - 1].bodyFat <= progress[0].bodyFat
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {progress[progress.length - 1].bodyFat <= progress[0].bodyFat ? "Lost" : "Gained"}{" "}
              {Math.abs(progress[progress.length - 1].bodyFat - progress[0].bodyFat).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}; 