"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

import { TodoStats } from "./TodoStats";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import { TodoForm } from "./TodoForm";
import { CategoryManager } from "./CategoryManager";

export const TodoApp = () => {
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    categoryId: "",
    completed: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/todos?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (err) {
      setError("Failed to load todos");
      console.error("Error fetching todos:", err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/todo-categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      
      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/todos/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      await Promise.all([
        fetchTodos(),
        fetchCategories(),
        fetchStats(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [session]);

  // Refetch todos when filters change
  useEffect(() => {
    if (!loading && session?.user?.id) {
      fetchTodos();
    }
  }, [filters]);

  // Handlers
  const handleCreateTodo = async (todoData) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error("Failed to create todo");
      
      await fetchTodos();
      await fetchStats();
      setShowForm(false);
    } catch (err) {
      setError("Failed to create todo");
      console.error("Error creating todo:", err);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update todo");
      
      await fetchTodos();
      await fetchStats();
      setEditingTodo(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");
      
      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to toggle todo");
      
      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError("Failed to toggle todo");
      console.error("Error toggling todo:", err);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Icon icon="mdi:login" className="w-16 h-16 text-[#FF6B00] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to access your todos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Todo Manager
            </h1>
            <p className="text-xl text-[#FF6B00] mb-2">
              Organize your tasks and boost productivity
            </p>
            <p className="text-gray-400">
              Stay on top of your goals with our powerful task management system
            </p>
          </motion.div>

          {/* Stats */}
          {stats && <TodoStats stats={stats} />}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            New Todo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Icon icon="mdi:folder-multiple" className="w-5 h-5" />
            Categories
          </motion.button>
        </div>

        {/* Filters */}
        <TodoFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300"
            >
              <div className="flex items-center gap-2">
                <Icon icon="mdi:alert-circle" className="w-5 h-5" />
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-300 hover:text-red-100"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Todo List */}
        <TodoList
          todos={todos}
          categories={categories}
          onToggle={handleToggleTodo}
          onEdit={setEditingTodo}
          onDelete={handleDeleteTodo}
        />

        {/* Modals */}
        <AnimatePresence>
          {showForm && (
            <TodoForm
              onClose={() => setShowForm(false)}
              onSubmit={handleCreateTodo}
              categories={categories}
            />
          )}

          {editingTodo && (
            <TodoForm
              todo={editingTodo}
              onClose={() => setEditingTodo(null)}
              onSubmit={(updates) => handleUpdateTodo(editingTodo.id, updates)}
              categories={categories}
              isEditing
            />
          )}

          {showCategoryManager && (
            <CategoryManager
              categories={categories}
              onClose={() => setShowCategoryManager(false)}
              onUpdate={() => {
                fetchCategories();
                fetchTodos();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};