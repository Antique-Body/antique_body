import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";

export const FoodItem = ({ item, onDelete }) => {
    return (
        <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg">
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
                        className="text-gray-400 hover:text-red-500 transition-colors p-0"
                    >
                        <CloseXIcon size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
};
