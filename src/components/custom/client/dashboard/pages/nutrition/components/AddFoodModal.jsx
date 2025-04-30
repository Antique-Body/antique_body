import { useState } from "react";

import { foodDatabase } from "../data/foodDatabase";

import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

export const AddFoodModal = ({ isOpen, onClose, onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState(1);
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    amount: "100g",
  });
  const [isCustom, setIsCustom] = useState(false);

  // Filter foods based on search term
  const filteredFoods = foodDatabase
    .filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10); // Limit to 10 results

  const handleAddFood = () => {
    if (isCustom) {
      // Add custom food
      const newFood = {
        ...customFood,
        calories: Number(customFood.calories),
        protein: Number(customFood.protein),
        carbs: Number(customFood.carbs),
        fat: Number(customFood.fat),
        id: Date.now(),
      };
      onAddFood(newFood);
    } else if (selectedFood) {
      // Add from database with adjusted amount
      const scaledFood = {
        ...selectedFood,
        amount: `${amount} ${selectedFood.unit}`,
        calories: Math.round(selectedFood.calories * amount),
        protein: Math.round(selectedFood.protein * amount * 10) / 10,
        carbs: Math.round(selectedFood.carbs * amount * 10) / 10,
        fat: Math.round(selectedFood.fat * amount * 10) / 10,
        id: Date.now(),
      };
      onAddFood(scaledFood);
    }

    // Reset form and close
    setSearchTerm("");
    setSelectedFood(null);
    setAmount(1);
    setCustomFood({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      amount: "100g",
    });
    setIsCustom(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Food Item</h2>
          <Button variant="ghost" onClick={onClose} className="p-0 text-gray-400 hover:text-white">
            <CloseXIcon size={20} />
          </Button>
        </div>

        <div className="mb-4">
          <div className="mb-3 flex">
            <Button
              className={`flex-1 rounded-l-lg rounded-r-none px-3 py-2 ${!isCustom ? "bg-[#FF6B00] text-white" : ""}`}
              variant={!isCustom ? "orangeFilled" : "secondary"}
              onClick={() => setIsCustom(false)}
            >
              Search Database
            </Button>
            <Button
              className={`flex-1 rounded-l-none rounded-r-lg px-3 py-2 ${isCustom ? "bg-[#FF6B00] text-white" : ""}`}
              variant={isCustom ? "orangeFilled" : "secondary"}
              onClick={() => setIsCustom(true)}
            >
              Custom Food
            </Button>
          </div>

          {!isCustom ? (
            <>
              <FormField
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search foods..."
                backgroundStyle="semi-transparent"
                className="mb-3"
              />

              {searchTerm && (
                <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-[#333] bg-[rgba(30,30,30,0.5)]">
                  {filteredFoods.length > 0 ? (
                    filteredFoods.map(food => (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`cursor-pointer border-b border-[#333] p-3 hover:bg-[rgba(40,40,40,0.8)] ${
                          selectedFood?.id === food.id ? "bg-[rgba(50,50,50,0.8)]" : ""
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{food.name}</p>
                          <p className="text-gray-400">
                            {food.calories} kcal/{food.unit}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-gray-400">No foods found</p>
                  )}
                </div>
              )}

              {selectedFood && (
                <div className="mb-4 rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
                  <p className="mb-2 font-medium">{selectedFood.name}</p>
                  <div className="mb-2 flex items-center gap-3">
                    <label className="text-gray-400">Amount:</label>
                    <FormField
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={amount}
                      onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                      backgroundStyle="darker"
                      size="small"
                      className="mb-0 w-20"
                    />
                    <span className="text-gray-400">{selectedFood.unit}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Calories</p>
                      <p className="font-medium">{Math.round(selectedFood.calories * amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Protein</p>
                      <p className="font-medium">{(selectedFood.protein * amount).toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Carbs</p>
                      <p className="font-medium">{(selectedFood.carbs * amount).toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Fat</p>
                      <p className="font-medium">{(selectedFood.fat * amount).toFixed(1)}g</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <FormField
                label="Food Name"
                type="text"
                value={customFood.name}
                onChange={e => setCustomFood({ ...customFood, name: e.target.value })}
                placeholder="e.g. Chicken Breast"
                backgroundStyle="semi-transparent"
                size="small"
              />
              <FormField
                label="Amount"
                type="text"
                value={customFood.amount}
                onChange={e => setCustomFood({ ...customFood, amount: e.target.value })}
                placeholder="e.g. 100g, 1 cup"
                backgroundStyle="semi-transparent"
                size="small"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Calories"
                  type="number"
                  value={customFood.calories}
                  onChange={e => setCustomFood({ ...customFood, calories: e.target.value })}
                  placeholder="kcal"
                  backgroundStyle="semi-transparent"
                  size="small"
                />
                <FormField
                  label="Protein (g)"
                  type="number"
                  value={customFood.protein}
                  onChange={e => setCustomFood({ ...customFood, protein: e.target.value })}
                  placeholder="g"
                  backgroundStyle="semi-transparent"
                  size="small"
                />
                <FormField
                  label="Carbs (g)"
                  type="number"
                  value={customFood.carbs}
                  onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
                  placeholder="g"
                  backgroundStyle="semi-transparent"
                  size="small"
                />
                <FormField
                  label="Fat (g)"
                  type="number"
                  value={customFood.fat}
                  onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
                  placeholder="g"
                  backgroundStyle="semi-transparent"
                  size="small"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="modalCancel" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="orangeFilled"
            onClick={handleAddFood}
            disabled={isCustom ? !customFood.name || !customFood.calories : !selectedFood}
          >
            Add Food
          </Button>
        </div>
      </div>
    </div>
  );
};
