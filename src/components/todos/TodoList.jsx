"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { TodoItem } from "./TodoItem";

export const TodoList = ({ todos, categories, onToggle, onEdit, onDelete }) => {
  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#FF6B00]/20 to-[#FF8A00]/20 rounded-3xl flex items-center justify-center border border-[#FF6B00]/20">
            <Icon 
              icon="mdi:clipboard-list-outline" 
              className="w-12 h-12 text-[#FF6B00]" 
            />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3">
            No todos found
          </h3>
          
          <p className="text-gray-400 leading-relaxed">
            Create your first todo to get started with organizing your tasks and boosting your productivity.
          </p>
        </div>
      </motion.div>
    );
  }

  // Group todos by completion status
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[#FF6B00] rounded-full"></div>
            <h2 className="text-xl font-semibold text-white">
              Active Tasks ({activeTodos.length})
            </h2>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {activeTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TodoItem
                    todo={todo}
                    categories={categories}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-white">
              Completed ({completedTodos.length})
            </h2>
          </div>
          
          <div className="space-y-3 opacity-60">
            <AnimatePresence>
              {completedTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TodoItem
                    todo={todo}
                    categories={categories}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isCompleted
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};