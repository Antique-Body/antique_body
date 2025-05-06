"use client";
import { useState } from "react";

const FoodSearch = ({ onAddFood }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Mock food database
  const foodDatabase = [
    {
      name: "Chicken Breast",
      serving: "100g",
      nutrition: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
      },
      category: "Meat",
      icon: "🍗",
    },
    {
      name: "Brown Rice",
      serving: "100g",
      nutrition: {
        calories: 111,
        protein: 2.6,
        carbs: 23,
        fat: 0.9,
        fiber: 1.8,
      },
      category: "Grains",
      icon: "🍚",
    },
    {
      name: "Banana",
      serving: "1 medium (118g)",
      nutrition: {
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        fiber: 3.1,
      },
      category: "Fruits",
      icon: "🍌",
    },
    // Add more foods as needed
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = foodDatabase.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIsAnalyzing(true);
      // Simulate image analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        // Mock result
        const analyzedFood = {
          name: "Mixed Meal",
          serving: "1 plate",
          nutrition: {
            calories: 450,
            protein: 25,
            carbs: 45,
            fat: 15,
            fiber: 6,
          },
          category: "Mixed",
          icon: "🍽️",
          confidence: 0.89,
        };
        setSearchResults([analyzedFood]);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white placeholder-gray-500"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => handleSearch("")}>
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl hover:bg-[#222] transition-colors">
            📸 Scan Food
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchResults.map((food, index) => (
              <div
                key={index}
                className="p-4 hover:bg-[#222] cursor-pointer border-b border-[#333] last:border-0"
                onClick={() => onAddFood(food)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{food.icon}</span>
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      <p className="text-sm text-gray-400">{food.serving}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {food.nutrition.calories} kcal
                    </p>
                    <p className="text-sm text-gray-400">
                      P: {food.nutrition.protein}g • C: {food.nutrition.carbs}g
                      • F: {food.nutrition.fat}g
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl max-w-2xl w-full overflow-hidden animate-scaleIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Scan Food</h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    setShowScanner(false);
                    setSelectedImage(null);
                    setIsAnalyzing(false);
                  }}>
                  ✕
                </button>
              </div>

              {!selectedImage ? (
                <div className="border-2 border-dashed border-[#333] rounded-xl p-8 text-center">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-gray-400 mb-4">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p className="text-gray-400 mb-2">
                      Take a photo or upload an image of your food
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="food-image"
                    />
                    <label
                      htmlFor="food-image"
                      className="inline-block px-4 py-2 bg-[#FF6B00] rounded-lg cursor-pointer hover:bg-[#FF8533] transition-colors">
                      Choose Image
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <img
                    src={selectedImage}
                    alt="Food"
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  {isAnalyzing ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00] mx-auto mb-2"></div>
                      <p className="text-gray-400">Analyzing image...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((food, index) => (
                        <div
                          key={index}
                          className="bg-[#1A1A1A] rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{food.icon}</span>
                              <div>
                                <h4 className="font-medium">{food.name}</h4>
                                <p className="text-sm text-gray-400">
                                  Confidence:{" "}
                                  {(food.confidence * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                            <button
                              className="px-3 py-1 bg-[#FF6B00] rounded-lg text-sm hover:bg-[#FF8533] transition-colors"
                              onClick={() => {
                                onAddFood(food);
                                setShowScanner(false);
                                setSelectedImage(null);
                              }}>
                              Add to Log
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-[#222] rounded-lg p-2">
                              <p className="text-sm text-gray-400">Calories</p>
                              <p className="font-medium">
                                {food.nutrition.calories}
                              </p>
                            </div>
                            <div className="bg-[#222] rounded-lg p-2">
                              <p className="text-sm text-gray-400">Protein</p>
                              <p className="font-medium">
                                {food.nutrition.protein}g
                              </p>
                            </div>
                            <div className="bg-[#222] rounded-lg p-2">
                              <p className="text-sm text-gray-400">Carbs</p>
                              <p className="font-medium">
                                {food.nutrition.carbs}g
                              </p>
                            </div>
                            <div className="bg-[#222] rounded-lg p-2">
                              <p className="text-sm text-gray-400">Fat</p>
                              <p className="font-medium">
                                {food.nutrition.fat}g
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="w-full px-4 py-2 bg-[#333] rounded-lg text-sm hover:bg-[#444] transition-colors"
                        onClick={() => {
                          setSelectedImage(null);
                          setSearchResults([]);
                        }}>
                        Scan Another Image
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
