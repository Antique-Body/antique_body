import { useState } from "react";
import { foodDatabase } from "../data/foodDatabase";

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
        .filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 w-full max-w-md border border-[#222] shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Food Item</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex mb-3">
                        <button
                            className={`flex-1 py-2 px-3 ${
                                !isCustom ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-300"
                            } rounded-l-lg`}
                            onClick={() => setIsCustom(false)}
                        >
                            Search Database
                        </button>
                        <button
                            className={`flex-1 py-2 px-3 ${
                                isCustom ? "bg-[#FF6B00] text-white" : "bg-[#333] text-gray-300"
                            } rounded-r-lg`}
                            onClick={() => setIsCustom(true)}
                        >
                            Custom Food
                        </button>
                    </div>

                    {!isCustom ? (
                        <>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search foods..."
                                className="w-full p-3 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg text-white mb-3"
                            />

                            {searchTerm && (
                                <div className="mb-4 max-h-60 overflow-y-auto bg-[rgba(30,30,30,0.5)] rounded-lg border border-[#333]">
                                    {filteredFoods.length > 0 ? (
                                        filteredFoods.map((food) => (
                                            <div
                                                key={food.id}
                                                onClick={() => setSelectedFood(food)}
                                                className={`p-3 border-b border-[#333] cursor-pointer hover:bg-[rgba(40,40,40,0.8)] ${
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
                                <div className="mb-4 p-4 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-lg">
                                    <p className="font-medium mb-2">{selectedFood.name}</p>
                                    <div className="flex items-center gap-3 mb-2">
                                        <label className="text-gray-400">Amount:</label>
                                        <input
                                            type="number"
                                            min="0.25"
                                            step="0.25"
                                            value={amount}
                                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                            className="w-20 p-2 bg-[rgba(20,20,20,0.8)] border border-[#444] rounded text-white"
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
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Food Name</label>
                                <input
                                    type="text"
                                    value={customFood.name}
                                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                                    className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                    placeholder="e.g. Chicken Breast"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Amount</label>
                                <input
                                    type="text"
                                    value={customFood.amount}
                                    onChange={(e) => setCustomFood({ ...customFood, amount: e.target.value })}
                                    className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                    placeholder="e.g. 100g, 1 cup"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Calories</label>
                                    <input
                                        type="number"
                                        value={customFood.calories}
                                        onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                                        className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                        placeholder="kcal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Protein (g)</label>
                                    <input
                                        type="number"
                                        value={customFood.protein}
                                        onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                                        className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                        placeholder="g"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={customFood.carbs}
                                        onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                                        className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                        placeholder="g"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Fat (g)</label>
                                    <input
                                        type="number"
                                        value={customFood.fat}
                                        onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                                        className="w-full p-2 bg-[rgba(30,30,30,0.8)] border border-[#444] rounded text-white"
                                        placeholder="g"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444]">
                        Cancel
                    </button>
                    <button
                        onClick={handleAddFood}
                        disabled={isCustom ? !customFood.name || !customFood.calories : !selectedFood}
                        className={`px-4 py-2 ${
                            isCustom
                                ? !customFood.name || !customFood.calories
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-[#FF6B00] hover:bg-[#FF9A00]"
                                : !selectedFood
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-[#FF6B00] hover:bg-[#FF9A00]"
                        } text-white rounded`}
                    >
                        Add Food
                    </button>
                </div>
            </div>
        </div>
    );
};

