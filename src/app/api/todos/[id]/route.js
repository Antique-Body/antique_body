import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoService } from "../services";

// GET /api/todos/[id] - Get a specific todo
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const todo = await todoService.getTodoById(id, session.user.id);

    if (!todo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update a specific todo
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if todo exists and belongs to user
    const existingTodo = await todoService.getTodoById(id, session.user.id);
    if (!existingTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, categoryId, tags, completed } = body;

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (title && title.length > 255) {
      return NextResponse.json(
        { error: "Title must be less than 255 characters" },
        { status: 400 }
      );
    }

    if (description && description.length > 2000) {
      return NextResponse.json(
        { error: "Description must be less than 2000 characters" },
        { status: 400 }
      );
    }

    if (status && !["pending", "in_progress", "completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    if (priority && !["low", "medium", "high", "urgent"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tags !== undefined) updateData.tags = tags;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await todoService.updateTodo(id, session.user.id, updateData);

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a specific todo
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if todo exists and belongs to user
    const existingTodo = await todoService.getTodoById(id, session.user.id);
    if (!existingTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    await todoService.deleteTodo(id, session.user.id);

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}