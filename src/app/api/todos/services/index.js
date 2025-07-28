import prisma from "@/lib/prisma";

export const todoService = {
  // Get all todos for a user with filters and pagination
  async getUserTodos(userId, filters = {}) {
    const {
      status,
      priority,
      categoryId,
      completed,
      search,
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const skip = (page - 1) * limit;
    const where = { userId };

    // Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (completed !== undefined) where.completed = completed;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  // Get a single todo by ID
  async getTodoById(id, userId) {
    return prisma.todo.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });
  },

  // Create a new todo
  async createTodo(userId, data) {
    const { title, description, priority, dueDate, categoryId, tags } = data;

    return prisma.todo.create({
      data: {
        userId,
        title,
        description,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId,
        tags,
      },
      include: {
        category: true,
      },
    });
  },

  // Update a todo
  async updateTodo(id, userId, data) {
    const { title, description, status, priority, dueDate, categoryId, tags, completed } = data;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tags !== undefined) updateData.tags = tags;
    
    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
      if (completed) updateData.status = "completed";
    }

    return prisma.todo.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  },

  // Delete a todo
  async deleteTodo(id, userId) {
    return prisma.todo.delete({
      where: { id },
    });
  },

  // Toggle todo completion
  async toggleTodo(id, userId) {
    const todo = await this.getTodoById(id, userId);
    if (!todo) return null;

    const isCompleted = !todo.completed;
    return this.updateTodo(id, userId, {
      completed: isCompleted,
      status: isCompleted ? "completed" : "pending",
    });
  },

  // Get todo statistics for dashboard
  async getTodoStats(userId) {
    const [total, completed, pending, inProgress, overdue] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, completed: true } }),
      prisma.todo.count({ where: { userId, status: "pending" } }),
      prisma.todo.count({ where: { userId, status: "in_progress" } }),
      prisma.todo.count({
        where: {
          userId,
          completed: false,
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },
};

export const todoCategoryService = {
  // Get all categories for a user
  async getUserCategories(userId) {
    return prisma.todoCategory.findMany({
      where: { userId },
      include: {
        _count: {
          select: { todos: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  // Get a single category by ID
  async getCategoryById(id, userId) {
    return prisma.todoCategory.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { todos: true },
        },
      },
    });
  },

  // Create a new category
  async createCategory(userId, data) {
    const { name, color, icon } = data;

    return prisma.todoCategory.create({
      data: {
        userId,
        name,
        color: color || "#3B82F6",
        icon,
      },
    });
  },

  // Update a category
  async updateCategory(id, userId, data) {
    const { name, color, icon } = data;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;

    return prisma.todoCategory.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete a category
  async deleteCategory(id, userId) {
    // First, remove the category association from all todos
    await prisma.todo.updateMany({
      where: { categoryId: id, userId },
      data: { categoryId: null },
    });

    return prisma.todoCategory.delete({
      where: { id },
    });
  },
};