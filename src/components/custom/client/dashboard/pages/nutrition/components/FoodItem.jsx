import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";

export const FoodItem = ({ item, onDelete }) => (
  <div className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-2">
    <div>
      <p className="font-medium">{item.name}</p>
      <p className="text-xs text-gray-400">{item.amount}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-medium">{item.calories} kcal</p>
        <p className="text-xs text-gray-400">
          P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
        </p>
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          onClick={() => onDelete(item.id)}
          className="p-0 text-gray-400 transition-colors hover:text-red-500"
        >
          <CloseXIcon size={16} />
        </Button>
      )}
    </div>
  </div>
);
