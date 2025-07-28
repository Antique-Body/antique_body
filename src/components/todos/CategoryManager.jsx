"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export const CategoryManager = ({ categories, onClose, onUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const colorOptions = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];

  const iconOptions = [
    "mdi:star", "mdi:heart", "mdi:briefcase", "mdi:home", "mdi:car",
    "mdi:food", "mdi:gamepad-variant", "mdi:book", "mdi:dumbbell", "mdi:music",
    "mdi:palette", "mdi:camera", "mdi:laptop", "mdi:phone", "mdi:shopping"
  ];

  const resetForm = () => {
    setFormData({ name: "", color: "#3B82F6", icon: "" });
    setEditingCategory(null);
  };

  const handleCreate = () => {
    setIsCreating(true);
    resetForm();
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon || "",
    });
    setEditingCategory(category);
    setIsCreating(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingCategory 
        ? `/api/todo-categories/${editingCategory.id}`
        : "/api/todo-categories";
      
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
          icon: formData.icon || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      onUpdate();
      setIsCreating(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This will remove the category from all associated todos.")) {
      return;
    }

    try {
      const response = await fetch(`/api/todo-categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white">Category Manager</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-semibold rounded-lg transition-colors"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              New Category
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Categories List */}
          <div className="flex-1 p-6 overflow-y-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                  <Icon icon="mdi:folder-multiple" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
                <p className="text-gray-400 mb-4">Create your first category to organize your todos</p>
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-semibold rounded-xl transition-colors"
                >
                  Create Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20`, border: `1px solid ${category.color}40` }}
                          >
                            {category.icon ? (
                              <Icon
                                icon={category.icon}
                                className="w-5 h-5"
                                style={{ color: category.color }}
                              />
                            ) : (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{category.name}</h3>
                            <p className="text-sm text-gray-400">
                              {category._count?.todos || 0} todos
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                          >
                            <Icon icon="mdi:pencil" className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Icon icon="mdi:delete" className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Create/Edit Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="w-80 border-l border-gray-700/50 p-6 bg-[#1a1a1a]/50"
              >
                <h3 className="text-lg font-semibold text-white mb-6">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Category name..."
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            formData.color === color 
                              ? "border-white scale-110" 
                              : "border-transparent hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon (Optional)
                    </label>
                    <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: "" }))}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                          !formData.icon 
                            ? "border-[#FF6B00] bg-[#FF6B00]/20" 
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <Icon icon="mdi:close" className="w-4 h-4 text-gray-400" />
                      </button>
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon }))}
                          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                            formData.icon === icon 
                              ? "border-[#FF6B00] bg-[#FF6B00]/20" 
                              : "border-gray-600 hover:border-gray-400"
                          }`}
                        >
                          <Icon icon={icon} className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preview
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${formData.color}20`, 
                          border: `1px solid ${formData.color}40` 
                        }}
                      >
                        {formData.icon ? (
                          <Icon
                            icon={formData.icon}
                            className="w-4 h-4"
                            style={{ color: formData.color }}
                          />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: formData.color }}
                          />
                        )}
                      </div>
                      <span className="text-white font-medium">
                        {formData.name || "Category Name"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name.trim()}
                      className="flex-1 px-4 py-2 bg-[#FF6B00] hover:bg-[#FF7A1A] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon icon="mdi:loading" className="w-4 h-4" />
                          </motion.div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon icon={editingCategory ? "mdi:check" : "mdi:plus"} className="w-4 h-4" />
                          {editingCategory ? "Update" : "Create"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};