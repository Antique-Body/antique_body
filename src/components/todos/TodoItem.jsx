"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const TodoItem = ({ 
  todo, 
  categories, 
  onToggle, 
  onEdit, 
  onDelete, 
  isCompleted = false 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const category = categories.find(cat => cat.id === todo.categoryId);

  const priorityConfig = {
    low: { 
      color: "text-blue-400", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/20",
      icon: "mdi:arrow-down"
    },
    medium: { 
      color: "text-yellow-400", 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-500/20",
      icon: "mdi:minus"
    },
    high: { 
      color: "text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20",
      icon: "mdi:arrow-up"
    },
    urgent: { 
      color: "text-red-400", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20",
      icon: "mdi:fire"
    },
  };

  const statusConfig = {
    pending: { 
      color: "text-gray-400", 
      bg: "bg-gray-500/10", 
      border: "border-gray-500/20",
      icon: "mdi:pause-circle",
      label: "Pending"
    },
    in_progress: { 
      color: "text-[#FF6B00]", 
      bg: "bg-[#FF6B00]/10", 
      border: "border-[#FF6B00]/20",
      icon: "mdi:clock",
      label: "In Progress"
    },
    completed: { 
      color: "text-green-400", 
      bg: "bg-green-500/10", 
      border: "border-green-500/20",
      icon: "mdi:check-circle",
      label: "Completed"
    },
    cancelled: { 
      color: "text-red-400", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20",
      icon: "mdi:cancel",
      label: "Cancelled"
    },
  };

  const priority = priorityConfig[todo.priority] || priorityConfig.medium;
  const status = statusConfig[todo.status] || statusConfig.pending;

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      onDelete(todo.id);
    }
    setShowMenu(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border rounded-xl p-4 shadow-lg transition-all ${
        isOverdue ? "border-red-500/30" : "border-gray-700/50"
      } ${isCompleted ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-500 hover:border-[#FF6B00]"
          }`}
        >
          {todo.completed && (
            <Icon icon="mdi:check" className="w-4 h-4 text-white" />
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`font-semibold text-lg leading-tight ${
              todo.completed ? "line-through text-gray-400" : "text-white"
            }`}>
              {todo.title}
            </h3>

            {/* Category Badge */}
            {category && (
              <div 
                className="px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  borderColor: `${category.color}40`,
                  color: category.color,
                  border: "1px solid"
                }}
              >
                {category.icon && <Icon icon={category.icon} className="w-3 h-3" />}
                {category.name}
              </div>
            )}
          </div>

          {/* Description */}
          {todo.description && (
            <p className={`text-sm mb-3 leading-relaxed ${
              todo.completed ? "text-gray-500" : "text-gray-300"
            }`}>
              {todo.description}
            </p>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {todo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              {/* Priority */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${priority.bg} ${priority.border} border`}>
                <Icon icon={priority.icon} className={`w-3 h-3 ${priority.color}`} />
                <span className={`text-xs font-medium ${priority.color}`}>
                  {todo.priority}
                </span>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${status.bg} ${status.border} border`}>
                <Icon icon={status.icon} className={`w-3 h-3 ${status.color}`} />
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Due Date */}
              {todo.dueDate && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  isOverdue 
                    ? "bg-red-500/10 border-red-500/20 border text-red-400" 
                    : "bg-gray-700/50 text-gray-400"
                }`}>
                  <Icon icon="mdi:calendar" className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {formatDate(todo.dueDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Icon icon="mdi:dots-vertical" className="w-4 h-4 text-gray-400" />
              </motion.button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-[#2a2a2a] border border-gray-600/50 rounded-xl shadow-xl z-10"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => {
                      onEdit(todo);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 flex items-center gap-2 rounded-t-xl transition-colors"
                  >
                    <Icon icon="mdi:pencil" className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2 rounded-b-xl transition-colors"
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Indicator */}
      {isOverdue && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
    </motion.div>
  );
};